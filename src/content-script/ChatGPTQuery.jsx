import { useEffect, useState } from 'preact/hooks'
import PropTypes from 'prop-types'
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'
import ChatGPTFeedback from './ChatGPTFeedback'
import './highlight.scss'

function ChatGPTQuery(props) {
  const [answer, setAnswer] = useState(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const port = Browser.runtime.connect()
    const listener = (msg) => {
      if (msg.text) {
        setAnswer(msg)
      } else if (msg.error === 'UNAUTHORIZED' || msg.error === 'CLOUDFLARE') {
        setError(msg.error)
      } else {
        setError('EXCEPTION')
      }
    }
    port.onMessage.addListener(listener)
    port.postMessage({ question: props.question })
    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [props.question, retry])

  if (answer) {
    return (
      <div id="answer" className="markdown-body gpt-inner" dir="auto">
        <div className="gpt-header">
          <p>ChatGPT</p>
          <ChatGPTFeedback messageId={answer.messageId} conversationId={answer.conversationId} />
        </div>
        <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
          {answer.text}
        </ReactMarkdown>
      </div>
    )
  }

  // retry error on focus
  useEffect(() => {
    const onFocus = () => {
      if (error && error !== 'EXCEPTION') {
        setError('')
        setRetry((r) => r + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [error])

  if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') {
    return (
      <p className="gpt-inner">
        Please login and pass Cloudflare check at{' '}
        <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
          chat.openai.com
        </a>
      </p>
    )
  }
  if (error) {
    return <p className="gpt-inner">Failed to load response from ChatGPT</p>
  }

  return <p className="gpt-loading gpt-inner">Waiting for ChatGPT response...</p>
}

ChatGPTQuery.propTypes = {
  question: PropTypes.string.isRequired,
}

export default memo(ChatGPTQuery)
