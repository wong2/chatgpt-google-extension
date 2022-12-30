import posthog from 'posthog-js'

posthog.init('phc_9ddG4YT65Cq2yuJPt8GQH4rDiYDuEw9MgdkAeKG1adA', {
  api_host: 'https://app.posthog.com',
  persistence: 'localStorage',
  autocapture: false,
  capture_pageview: false,
  disable_session_recording: true,
  property_blacklist: ['$current_url', '$pathname'],
})

export function captureEvent(event: string, properties?: object) {
  posthog.capture(event, properties)
}
