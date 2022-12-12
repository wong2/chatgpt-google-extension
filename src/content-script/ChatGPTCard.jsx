import { LightBulbIcon, SearchIcon } from '@primer/octicons-react'
import { useState } from 'preact/hooks'
import PropTypes from 'prop-types'
import ChatGPTQuery from './ChatGPTQuery'
import { endsWithQuestionMark } from './utils.mjs'

function ChatGPTCard(props) {
  const [triggered, setTriggered] = useState(false)
  if (props.triggerMode === 'always') {
    return <ChatGPTQuery question={props.question} />
  }
  if (props.triggerMode === 'questionMark') {
    if (endsWithQuestionMark(props.question.trim())) {
      return <ChatGPTQuery question={props.question} />
    }
    return (
      <p className="gpt-inner icon-and-text">
        <LightBulbIcon size="small" /> Trigger ChatGPT by append a question mark after your query
      </p>
    )
  }
  if (triggered) {
    return <ChatGPTQuery question={props.question} />
  }
  return (
    <p className="gpt-inner manual-btn icon-and-text" onClick={() => setTriggered(true)}>
      <SearchIcon size="small" /> Ask ChatGPT for this query
    </p>
  )
}

ChatGPTCard.propTypes = {
  question: PropTypes.string.isRequired,
  triggerMode: PropTypes.string.isRequired,
}

export default ChatGPTCard
