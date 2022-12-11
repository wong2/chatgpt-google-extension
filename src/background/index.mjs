import ExpiryMap from 'expiry-map'
import { v4 as uuidv4 } from 'uuid'
import Browser from 'webextension-polyfill'
import { fetchSSE } from './fetch-sse.mjs'

const KEY_ACCESS_TOKEN = 'accessToken'

const cache = new ExpiryMap(10 * 1000)

/**
 * @returns {Promise<string>}
 */
async function getAccessToken() {
  if (cache.get(KEY_ACCESS_TOKEN)) {
    return cache.get(KEY_ACCESS_TOKEN)
  }
  const resp = await fetch('https://chat.openai.com/api/auth/session')
    .then((r) => r.json())
    .catch(() => ({}))
  if (!resp.accessToken) {
    throw new Error('UNAUTHORIZED')
  }
  cache.set(KEY_ACCESS_TOKEN, resp.accessToken)
  return resp.accessToken
}

/**
 * @typedef {object} Message
 * @property {string} [answer]
 * @property {string} [error]
 * @property {boolean} isReady
 */

/**
 * @param {Browser.Runtime.Port} port
 * @param {string} question
 */
async function generateAnswers(port, question, session) {
  const accessToken = await getAccessToken()
  const controller = new AbortController()
  port.onDisconnect.addListener(() => {
    console.debug('port disconnected')
    controller.abort()
    session.conversationId = null;
  })

  await fetchSSE('https://chat.openai.com/backend-api/conversation', {
    method: 'POST',
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      action: 'next',
      conversation_id: session.conversationId,
      messages: [
        {
          id: session.messageId,
          role: 'user',
          content: {
            content_type: 'text',
            parts: [question],
          },
        },
      ],
      model: 'text-davinci-002-render',
      parent_message_id: session.parentMessageId,
    }),
    onMessage(message) {
      console.debug('sse message', message)
      if (message === '[DONE]') {
        port.postMessage({ answer: null })
        return
      }
      const data = JSON.parse(message)
      const text = data.message?.content?.parts?.[0]
      if (text) {
        port.postMessage({ answer: text })
      }

      session.conversationId = data.conversation_id;
      session.parentMessageId = data.message.id;
    },
  })
}
(function () {
  let session = new Object({
    conversationId: null,
    messageId: null,
    parentMessageId: null
  });

  Browser.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(
      /**
       * @typedef ClientMessage
       * @property {string} question
       * @param {ClientMessage} msg 
       */
      async (msg) => {
        console.debug('received msg', msg)
        session.messageId = uuidv4();
        if (session.parentMessageId == null) {
          session.parentMessageId = uuidv4();
        }
        try {
          await generateAnswers(port, msg.question, session)
        } catch (err) {
          console.error(err)
          port.postMessage({ error: err.message })
          cache.delete(KEY_ACCESS_TOKEN)
        }
      })
  })

})()
