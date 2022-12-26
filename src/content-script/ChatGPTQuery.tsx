import { useEffect, useState } from 'preact/hooks'
import { GearIcon } from '@primer/octicons-react'
import { memo, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import Browser from 'webextension-polyfill'
import { Answer } from '../messaging'
import ChatGPTFeedback from './ChatGPTFeedback'
import { isBraveBrowser, shouldShowTriggerModeTip } from './utils.js'

interface Props {
  question: string
}

function ChatGPTQuery(props: Props) {
  const [answer, setAnswer] = useState<Answer | null>(null)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)
  const [done, setDone] = useState(false)
  const [showTip, setShowTip] = useState(false)

  useEffect(() => {
    const port = Browser.runtime.connect()
    const listener = (msg: any) => {
      if (msg.text) {
        setAnswer(msg)
      } else if (msg.error) {
        setError(msg.error)
      } else if (msg.event === 'DONE') {
        setDone(true)
      }
    }
    port.onMessage.addListener(listener)
    port.postMessage({ question: props.question })
    return () => {
      port.onMessage.removeListener(listener)
      port.disconnect()
    }
  }, [props.question, retry])

  // retry error on focus
  useEffect(() => {
    const onFocus = () => {
      if (error && (error == 'UNAUTHORIZED' || error === 'CLOUDFLARE')) {
        setError('')
        setRetry((r) => r + 1)
      }
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [error])

  useEffect(() => {
    shouldShowTriggerModeTip().then((show) => setShowTip(show))
  }, [])

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  if (answer) {
    return (
      <div id="answer" className="markdown-body gpt-inner" dir="auto">
        <div className="gpt-header">
          <span className="font-bold">ChatGPT</span>
          <span className="cursor-pointer leading-[0]" onClick={openOptionsPage}>
            <GearIcon size={14} />
          </span>
          <ChatGPTFeedback messageId={answer.messageId} conversationId={answer.conversationId} />
        </div>
        <ReactMarkdown rehypePlugins={[[rehypeHighlight, { detect: true }]]}>
          {answer.text}
        </ReactMarkdown>
        {done && showTip && (
          <p className="italic mt-2">
            Tip: you can switch to manual trigger mode in{' '}
            <span className="underline cursor-pointer" onClick={openOptionsPage}>
              extension settings
            </span>
          </p>
        )}
      </div>
    )
  }

  if (error === 'UNAUTHORIZED' || error === 'CLOUDFLARE') {
    return (
      <p className="gpt-inner">
        Please login and pass Cloudflare check at{' '}
        <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
          chat.openai.com
        </a>
        {isBraveBrowser() && retry > 0 && (
          <span>
            <br />
            Still not working? Follow{' '}
            <a href="https://github.com/wong2/chat-gpt-google-extension#troubleshooting">
              Brave Troubleshooting
            </a>
          </span>
        )}
      </p>
    )
  }
  if (error) {
    return (
      <p className="gpt-inner">
        Failed to load response from ChatGPT:
        <br /> {error}
      </p>
    )
  }

  return <p className="gpt-loading gpt-inner">Waiting for ChatGPT response...</p>
}

export default memo(ChatGPTQuery)
