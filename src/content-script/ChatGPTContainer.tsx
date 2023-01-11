import { TriggerMode } from '../config'
import useSWRImmutable from 'swr/immutable'
import ChatGPTCard from './ChatGPTCard'
import Promotion from './Promotion'
import { getPromotion } from './api'
import { useState } from 'react'
import { QueryStatus } from './ChatGPTQuery'

interface Props {
  question: string
  triggerMode: TriggerMode
}

function ChatGPTContainer(props: Props) {
  const [queryStatus, setQueryStatus] = useState<QueryStatus>()
  const query = useSWRImmutable(queryStatus === 'success' ? 'promotion' : undefined, getPromotion, {
    shouldRetryOnError: false,
  })
  return (
    <>
      <div className="chat-gpt-card">
        <ChatGPTCard
          question={props.question}
          triggerMode={props.triggerMode}
          onStatusChange={setQueryStatus}
        />
      </div>
      {query.data && <Promotion data={query.data} />}
    </>
  )
}

export default ChatGPTContainer
