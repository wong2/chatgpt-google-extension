import { v4 as uuidv4 } from 'uuid'
import { Event } from './event'
import { fetchSSE } from './fetch-sse'

async function request(token: string, method: string, path: string, data: unknown) {
  return fetch(`https://chat.openai.com/backend-api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
}

export async function sendMessageFeedback(token: string, data: unknown) {
  await request(token, 'POST', '/conversation/message_feedback', data)
}

export async function setConversationProperty(
  token: string,
  conversationId: string,
  propertyObject: object,
) {
  await request(token, 'PATCH', `/conversation/${conversationId}`, propertyObject)
}

export async function sendMessage(params: {
  token: string
  prompt: string
  onEvent: (event: Event) => void
  signal?: AbortSignal
}) {
  await fetchSSE('https://chat.openai.com/backend-api/conversation', {
    method: 'POST',
    signal: params.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${params.token}`,
    },
    body: JSON.stringify({
      action: 'next',
      messages: [
        {
          id: uuidv4(),
          role: 'user',
          content: {
            content_type: 'text',
            parts: [params.prompt],
          },
        },
      ],
      model: 'text-davinci-002-render-next',
      parent_message_id: uuidv4(),
    }),
    onMessage(message: string) {
      console.debug('sse message', message)
      if (message === '[DONE]') {
        params.onEvent({ type: 'done' })
        return
      }
      let data
      try {
        data = JSON.parse(message)
      } catch (err) {
        console.error(err)
        return
      }
      const text = data.message?.content?.parts?.[0]
      if (text) {
        params.onEvent({
          type: 'answer',
          data: {
            text,
            messageId: data.message.id,
            conversationId: data.conversation_id,
          },
        })
      }
    },
  })
}
