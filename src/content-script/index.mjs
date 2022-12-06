import Browser from 'webextension-polyfill'
import {getPossibleElementByClassArray, getPossibleElementByIdArray, getPossibleElementByNameArray} from './utils.mjs'

const config = {
  // input element name of search box
  inputName: ['q', 'wd', 'text', 'query', 'p'],
  // prepend child to
  sidebarContainerId: [
    'rhs', 'content_right', 'b_rrsr', 'search-result-aside', 'b_context', 'right', 'sub_pack'
  ],
  // if above ids not exist, prepend child to
  sidebarContainerClass: [
    'right-content-box _0_right_sidebar', 'results--sidebar js-results-sidebar', 'layout-web__sidebar layout-web__sidebar--web',
    'Contents__inner Contents__inner--sub'
  ],
  // if above all not exist, append child to
  appendContainerId: [
    'rcnt', '_0_app_content', 'content__left', 'container', 'content', 'main', 'contents__wrap', 'cols', 'links_wrapper', 'wrapper'
  ],
  // if above all not exist, append child to
  appendContainerClass: [
    'content__left', 'layout-web__body layout-web__body--desktop'
  ]
}

async function run(question) {
  const container = document.createElement('div')
  container.className = 'chat-gpt-container'
  container.innerHTML = '<p class="loading">Waiting for ChatGPT response...</p>'

  const siderbarContainer =
    getPossibleElementByIdArray(config.sidebarContainerId)
    || getPossibleElementByClassArray(config.sidebarContainerClass)
  if (siderbarContainer) {
    siderbarContainer.prepend(container)
  } else {
    container.classList.add('sidebar-free')
    const appendContainer =
      getPossibleElementByIdArray(config.appendContainerId)
      || getPossibleElementByClassArray(config.appendContainerClass)
    if (appendContainer)
      appendContainer.appendChild(container)
  }
  const port = Browser.runtime.connect()
  port.onMessage.addListener(function (msg) {
    if (msg.answer) {
      container.innerHTML = '<p><span class="prefix">ChatGPT:</span><pre></pre></p>'
      container.querySelector('pre').textContent = msg.answer
    } else if (msg.error === 'UNAUTHORIZED') {
      container.innerHTML =
        '<p>Please login at <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> first</p>'
    } else {
      container.innerHTML = '<p>Failed to load response from ChatGPT</p>'
    }
  })
  port.postMessage({question})
}

const searchInput = getPossibleElementByNameArray(config.inputName)
if (searchInput && searchInput.value) {
  // only run on first page
  const startParam = new URL(location.href).searchParams.get('start') || '0'
  if (startParam === '0') {
    run(searchInput.value)
  }
}
