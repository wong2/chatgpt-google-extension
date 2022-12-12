import { useEffect, useMemo, useState } from 'preact/hooks'
import { createContext } from 'preact'
import PropTypes from 'prop-types'
import Browser from 'webextension-polyfill'
import { getMarkdownRenderer } from './markdown.mjs'

const Markdown = createContext()

function TalkItem({ type, content }) {
  return (
    <Markdown.Consumer>
      {(markdown) => {
        return (
          <div
            className={`${type}`}
            dir="auto"
            dangerouslySetInnerHTML={{ __html: markdown.render(content) }}
          />
        )
      }}
    </Markdown.Consumer>
  )
}
TalkItem.propTypes = {
  type: PropTypes.oneOf(['question', 'answer', 'error']).isRequired,
  content: PropTypes.string.isRequired,
}

function Interact({ onSubmit, enabled }) {
  const [value, setValue] = useState('')

  return (
    <form
      className="interact-container"
      id="interact"
      onSubmit={(e) => {
        e.preventDefault()
        if (!value) return
        onSubmit(value)
        setValue('')
      }}
    >
      <input
        disabled={!enabled}
        className="interact-input"
        type="text"
        placeholder="Type your question here"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  )
}
Interact.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  enabled: PropTypes.bool,
}

class Talk extends Object {
  /**
   * @param {'question'|'answer'|'error'} type
   * @param {string} content
   */
  constructor(type, content) {
    super()
    this.type = type
    this.content = content
  }
}

function ChatGPTQuery(props) {
  /**
   * @type {[Talk[], (talk: Talk[]) => void]}
   */
  const [talk, setTalk] = useState([
    new Talk('answer', '<p class="gpt-loading">Waiting for ChatGPT response...</p>'),
  ])
  const [isReady, setIsReady] = useState(false)
  /**
   * @param {string} value
   * @param {boolean} appended
   */
  function UpdateAnswer(value, appended) {
    setTalk((old) => {
      const copy = [...old]
      const revCopy = [...copy].reverse() // reverse to get the last answer
      let index = revCopy.findIndex((value) => {
        return value.type == 'answer'
      })
      index = old.length - index - 1 // reverse back
      if (index < old.length) {
        const newValue = old[index].content + value
        copy[index] = new Talk('answer', appended ? newValue : value)
        return copy
      } else {
        return old
      }
    })
  }

  const port = useMemo(() => Browser.runtime.connect(), [])
  useEffect(() => {
    const listener = (msg) => {
      if (msg.answer) {
        UpdateAnswer('**ChatGPT:**\n' + msg.answer, false)
        setIsReady(false)
      } else if (msg.answer == null) {
        UpdateAnswer('<hr>', true)
        setIsReady(true)
      } else if (msg.error === 'UNAUTHORIZED') {
        setTalk([...talk, new Talk('error', 'UNAUTHORIZED')])
      } else {
        setTalk([...talk, new Talk('error', 'EXCEPTION')])
      }
    }
    port.onMessage.addListener(listener)
    port.postMessage({
      question: props.question,
    })
    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [props.question])

  return (
    <>
      <div className="markdown-body gpt-inner">
        <Markdown.Provider value={getMarkdownRenderer()}>
          {talk.map((talk, idx) => (
            <TalkItem content={talk.content} key={idx} type={talk.type} />
          ))}
        </Markdown.Provider>
      </div>
      <Interact
        enabled={isReady}
        onSubmit={(question) => {
          const newQuestion = new Talk('question', '**You:**\n' + question)
          const newAnswer = new Talk(
            'answer',
            '<p class="gpt-loading">Waiting for ChatGPT response...</p>',
          )
          setTalk([...talk, newQuestion, newAnswer])
          setIsReady(false)
          port.postMessage({ question })
        }}
      />
    </>
  )
}

ChatGPTQuery.propTypes = {
  question: PropTypes.string.isRequired,
}

export default ChatGPTQuery
