async function sendMessageFeedback(token, data) {
  await fetch('https://chat.openai.com/backend-api/conversation/message_feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
}

export { sendMessageFeedback }
