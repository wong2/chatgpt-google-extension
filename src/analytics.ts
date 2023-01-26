export function captureEvent(event: string, properties?: object) {
  fetch('https://api.axiom.co/v1/datasets/extension/ingest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-ndjson',
      Authorization: `Bearer ${process.env.AXIOM_TOKEN}`,
    },
    body: JSON.stringify({ event, ...(properties || {}) }),
  }).catch((err) => console.error('captureEvent error', err))
}
