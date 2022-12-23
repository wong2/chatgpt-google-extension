import Browser from 'webextension-polyfill'
import { getUserConfig } from '../config'

export function getPossibleElementByQuerySelector(queryArray) {
  for (const query of queryArray) {
    const element = document.querySelector(query)
    if (element) {
      return element
    }
  }
}

export function endsWithQuestionMark(question) {
  return (
    question.endsWith('?') || // ASCII
    question.endsWith('？') || // Chinese/Japanese
    question.endsWith('؟') || // Arabic
    question.endsWith('⸮') // Arabic
  )
}

export function isBraveBrowser() {
  return navigator.brave?.isBrave()
}

export async function shouldShowTriggerModeTip() {
  const { triggerModeTipShowTimes = 0 } = await Browser.storage.local.get('triggerModeTipShowTimes')
  if (triggerModeTipShowTimes >= 3) {
    return false
  }
  const { triggerMode = 'always' } = await getUserConfig('triggerMode')
  const show = triggerMode === 'always'
  if (show) {
    await Browser.storage.local.set({ triggerModeTipShowCount: triggerModeTipShowTimes + 1 })
  }
  return show
}
