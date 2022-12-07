export function getPossibleElementByNameArray(elementNameArray) {
  let element;
  elementNameArray.some(
    (e) => {
      element = document.getElementsByName(e)[0];
      if (element)
        return true;
    }
  );
  return element;
}

export function getPossibleElementByIdArray(elementIdArray) {
  let element;
  elementIdArray.some(
    (e) => {
      element = document.getElementById(e);
      if (element)
        return true;
    }
  );
  return element;
}

export function getPossibleElementByClassArray(elementClassArray) {
  let element;
  elementClassArray.some(
    (e) => {
      element = document.getElementsByClassName(e)[0];
      if (element)
        return true;
    }
  );
  return element;
}