import TurndownService from 'turndown'
import Browser from 'webextension-polyfill'

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

export async function shouldShowRatingTip() {
  const { ratingTipShowTimes = 0 } = await Browser.storage.local.get('ratingTipShowTimes')
  if (ratingTipShowTimes >= 5) {
    return false
  }
  await Browser.storage.local.set({ ratingTipShowTimes: ratingTipShowTimes + 1 })
  return ratingTipShowTimes >= 2
}

export async function getGoogleSearchResult(question: string) {
  let searchWithGoogle = ''
  const googleUrl = `https://www.google.com/search?q=${question}`

  try {
    const response = await fetch(googleUrl)
    const html = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const resultDivs = doc.querySelectorAll('div.kvH3mc.BToiNc.UK95Uc')
    const turndownService = new TurndownService()
    const results = Array.from(resultDivs).map((resultDiv) =>
      turndownService.turndown(resultDiv.innerHTML),
    )
    console.log(results)
    searchWithGoogle = `
      Use your knowledge and Web search to answer the question.

      Web search results:
      ${results.join('\n')}
    `
  } catch (error) {
    console.log(error)
  }

  return searchWithGoogle
}
