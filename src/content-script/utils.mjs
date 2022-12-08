export function getPossibleElementByNameArray(elementNameArray) {
  for (const elementName of elementNameArray) {
    const element = document.getElementsByName(elementName)[0];
    if (element) {
      return element;
    }
  }
}

export function getPossibleElementByIdArray(elementIdArray) {
  for (const elementId of elementIdArray) {
    const element = document.getElementById(elementId);
    if (element) {
      return element;
    }
  }
}

export function getPossibleElementByClassArray(elementClassArray) {
  for (const elementClass of elementClassArray) {
    const element = document.getElementsByClassName(elementClass)[0];
    if (element) {
      return element;
    }
  }
}