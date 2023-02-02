import { API_HOST, getExtensionVersion } from '../utils'

export interface PromotionResponse {
  url: string
  title?: string
  text?: string
  image?: { url: string; size?: number }
  footer?: { text: string; url: string }
  label?: { text: string; url: string }
}

export async function getPromotion(): Promise<PromotionResponse | null> {
  return fetch(`${API_HOST}/api/p`, {
    headers: {
      'x-version': getExtensionVersion(),
    },
  }).then((r) => r.json())
}
