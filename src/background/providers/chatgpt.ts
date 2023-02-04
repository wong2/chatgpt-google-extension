import ExpiryMap from 'expiry-map'
import { v4 as uuidv4 } from 'uuid'
import { fetchExtensionConfigs } from '../../api'
import { fetchSSE } from '../fetch-sse'
import { GenerateAnswerParams, Provider } from '../types'

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

const KEY_ACCESS_TOKEN = 'accessToken'

const cache = new ExpiryMap(10 * 1000)

export async function getChatGPTAccessToken(): Promise<string> {
  if (cache.get(KEY_ACCESS_TOKEN)) {
    return cache.get(KEY_ACCESS_TOKEN)
  }
  const resp = await fetch('https://chat.openai.com/api/auth/session')
  if (resp.status === 403) {
    throw new Error('CLOUDFLARE')
  }
  const data = await resp.json().catch(() => ({}))
  if (!data.accessToken) {
    throw new Error('UNAUTHORIZED')
  }
  cache.set(KEY_ACCESS_TOKEN, data.accessToken)
  return data.accessToken
}

async function fetchModelName() {
  try {
    const configs = await fetchExtensionConfigs()
    return configs.chatgpt_webapp_model_name
  } catch (err) {
    console.error(err)
    return null
  }
}

export class ChatGPTProvider implements Provider {
  constructor(private token: string) {
    this.token = token
  }
  async generateAnswer(params: GenerateAnswerParams) {
    let conversationId: string | undefined

    const cleanup = () => {
      if (conversationId) {
        setConversationProperty(this.token, conversationId, { is_visible: false })
      }
    }

    await fetchSSE('https://chat.openai.com/backend-api/conversation', {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
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
        model: (await fetchModelName()) || 'text-davinci-002-render',
        parent_message_id: uuidv4(),
      }),
      onMessage(message: string) {
        console.debug('sse message', message)
        if (message === '[DONE]') {
          params.onEvent({ type: 'done' })
          cleanup()
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
          conversationId = data.conversation_id
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
    return { cleanup }
  }
}
