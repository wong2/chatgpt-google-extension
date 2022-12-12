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
