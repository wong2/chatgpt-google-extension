import { ThumbsdownIcon, ThumbsupIcon, CopyIcon } from '@primer/octicons-react'
import { memo, useCallback, useState } from 'react'
import { useEffect } from 'preact/hooks'
import Browser from 'webextension-polyfill'

interface Props {
  messageId: string
  conversationId: string
  answerText: string
}

function ChatGPTFeedback(props: Props) {
  const [copyToClipboard, setCopyToClipboard] = useState(false)
  const [action, setAction] = useState<'thumbsUp' | 'thumbsDown' | null>(null)

  const clickThumbsUp = useCallback(async () => {
    if (action) {
      return
    }
    setAction('thumbsUp')
    await Browser.runtime.sendMessage({
      type: 'FEEDBACK',
      data: {
        conversation_id: props.conversationId,
        message_id: props.messageId,
        rating: 'thumbsUp',
      },
    })
  }, [props, action])

  const clickThumbsDown = useCallback(async () => {
    if (action) {
      return
    }
    setAction('thumbsDown')
    await Browser.runtime.sendMessage({
      type: 'FEEDBACK',
      data: {
        conversation_id: props.conversationId,
        message_id: props.messageId,
        rating: 'thumbsDown',
        text: '',
        tags: [],
      },
    })
  }, [props, action])

  const clickCopyToClipboard = useCallback(async () => {
    setCopyToClipboard(true)
    await navigator.clipboard.writeText(props.answerText)
  }, [props])

  useEffect(() => {
    if (copyToClipboard) {
      const timer = setTimeout(() => {
        setCopyToClipboard(false)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [copyToClipboard])

  return (
    <div className="gpt-feedback">
      <span
        onClick={clickCopyToClipboard}
        className={copyToClipboard ? 'gpt-feedback-selected' : undefined}
      >
        <CopyIcon size={14} />
      </span>
      <span
        onClick={clickThumbsUp}
        className={action === 'thumbsUp' ? 'gpt-feedback-selected' : undefined}
      >
        <ThumbsupIcon size={14} />
      </span>
      <span
        onClick={clickThumbsDown}
        className={action === 'thumbsDown' ? 'gpt-feedback-selected' : undefined}
      >
        <ThumbsdownIcon size={14} />
      </span>
    </div>
  )
}

export default memo(ChatGPTFeedback)
