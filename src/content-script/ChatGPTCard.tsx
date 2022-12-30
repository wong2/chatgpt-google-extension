import { LightBulbIcon, SearchIcon } from '@primer/octicons-react'
import { useState } from 'preact/hooks'
import { TriggerMode } from '../config'
import ChatGPTQuery from './ChatGPTQuery'
import { endsWithQuestionMark } from './utils.js'

interface Props {
  question: string
  triggerMode: TriggerMode
}

function ChatGPTCard(props: Props) {
  const [triggered, setTriggered] = useState(false)
  if (props.triggerMode === TriggerMode.Always) {
    return <ChatGPTQuery question={props.question} />
  }
  if (props.triggerMode === TriggerMode.QuestionMark) {
    if (endsWithQuestionMark(props.question.trim())) {
      return <ChatGPTQuery question={props.question} />
    }
    return (
      <p className="gpt-inner icon-and-text">
        <LightBulbIcon size="small" /> Trigger ChatGPT by appending a question mark after your query
      </p>
    )
  }
  if (triggered) {
    return <ChatGPTQuery question={props.question} />
  }
  return (
    <p className="gpt-inner icon-and-text cursor-pointer" onClick={() => setTriggered(true)}>
      <SearchIcon size="small" /> Ask ChatGPT for this query
    </p>
  )
}

export default ChatGPTCard
