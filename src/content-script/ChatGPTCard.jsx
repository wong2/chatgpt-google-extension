import { useEffect, useMemo, useState } from 'preact/hooks'
import PropTypes from 'prop-types'
import Browser from 'webextension-polyfill'
import { getMarkdownRenderer } from './markdown.mjs'

function ChatGPTCard(props) {
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const markdown = useMemo(() => getMarkdownRenderer(), [])

  useEffect(() => {
    const port = Browser.runtime.connect()
    const listener = (msg) => {
      if (msg.answer) {
        setAnswer(markdown.render('**ChatGPT:**\n\n' + msg.answer))
      } else if (msg.error === 'UNAUTHORIZED') {
        setError('UNAUTHORIZED')
      } else {
        setError('EXCEPTION')
      }
    }
    port.onMessage.addListener(listener)
    port.postMessage({ question: props.question })
    return () => {
      port.onMessage.removeListener(listener)
    }
  }, [])

  if (answer) {
    return (
      <div
        id="answer"
        className="markdown-body gpt-inner"
        dir="auto"
        dangerouslySetInnerHTML={{ __html: answer }}
      ></div>
    )
  }

  if (error === 'UNAUTHORIZED') {
    return (
      <p className="gpt-inner">
        Please login at{' '}
        <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
          chat.openai.com
        </a>{' '}
        first
      </p>
    )
  }
  if (error) {
    return <p className="gpt-inner">Failed to load response from ChatGPT</p>
  }

  return <p className="gpt-loading gpt-inner">Waiting for ChatGPT response...</p>
}

ChatGPTCard.propTypes = {
  question: PropTypes.string.isRequired,
}

export default ChatGPTCard
