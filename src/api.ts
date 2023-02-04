import { getExtensionVersion } from './utils'

const API_HOST = 'https://chatgpt4google.com'
// const API_HOST = 'http://localhost:3000'

export interface PromotionResponse {
  url: string
  title?: string
  text?: string
  image?: { url: string; size?: number }
  footer?: { text: string; url: string }
  label?: { text: string; url: string }
}

export async function fetchPromotion(): Promise<PromotionResponse | null> {
  return fetch(`${API_HOST}/api/p`, {
    headers: {
      'x-version': getExtensionVersion(),
    },
  }).then((r) => r.json())
}

export async function fetchExtensionConfigs(): Promise<{
  chatgpt_webapp_model_name: string
  openai_model_names: string[]
}> {
  return fetch(`${API_HOST}/api/config`, {
    headers: {
      'x-version': getExtensionVersion(),
    },
  }).then((r) => r.json())
}
