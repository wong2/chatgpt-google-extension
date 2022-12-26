import Browser from 'webextension-polyfill'
import { getUserConfig, Theme, TriggerMode } from '../config'

export function getPossibleElementByQuerySelector<T extends Element>(
  queryArray: string[],
): T | undefined {
  for (const query of queryArray) {
    const element = document.querySelector(query)
    if (element) {
      return element as T
    }
  }
}

export function endsWithQuestionMark(question: string) {
  return (
    question.endsWith('?') || // ASCII
    question.endsWith('？') || // Chinese/Japanese
    question.endsWith('؟') || // Arabic
    question.endsWith('⸮') // Arabic
  )
}

export function isBraveBrowser() {
  return (navigator as any).brave?.isBrave()
}

export async function shouldShowTriggerModeTip() {
  const { triggerModeTipShowTimes = 0 } = await Browser.storage.local.get('triggerModeTipShowTimes')
  if (triggerModeTipShowTimes >= 3) {
    return false
  }
  const { triggerMode } = await getUserConfig()
  const show = triggerMode === TriggerMode.Always
  if (show) {
    await Browser.storage.local.set({ triggerModeTipShowCount: triggerModeTipShowTimes + 1 })
  }
  return show
}
