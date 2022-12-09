export function getPossibleElementByQuerySelector(queryArray) {
  for (const query of queryArray) {
    const element = document.querySelector(query);
    if (element) {
      return element;
    }
  }
}
