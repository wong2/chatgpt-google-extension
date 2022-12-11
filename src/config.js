import Browser from 'webextension-polyfill'

export const TRIGGER_MODES = {
  always: 'Always',
  questionMark: 'When query ends with question mark (?)',
  manually: 'Manually',
}

export async function getUserConfig() {
  return Browser.storage.local.get(['triggerMode'])
}

export async function updateUserConfig(updates) {
  return Browser.storage.local.set(updates)
}
