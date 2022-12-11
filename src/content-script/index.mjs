import './styles.css'
import './katex.less' 
import 'github-markdown-css'

import Browser from 'webextension-polyfill'
import { getMarkdownRenderer } from './markdown.mjs'
import { config } from './search-engine-configs.mjs'
import { getPossibleElementByQuerySelector } from './utils.mjs'
/**
 * @param {string} question 
 * @param {*} siteConfig 
 */
async function run(question, siteConfig) {
  const markdown = getMarkdownRenderer()

  const container = document.createElement('div')
  container.className = 'chat-gpt-container'
  container.innerHTML = '<p class="gpt-loading">Waiting for ChatGPT response...</p>'

  const siderbarContainer = getPossibleElementByQuerySelector(siteConfig.sidebarContainerQuery)
  if (siderbarContainer) {
    siderbarContainer.prepend(container)
  } else {
    container.classList.add('sidebar-free')
    const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
    if (appendContainer) {
      appendContainer.appendChild(container)
    }
  }
  const port = Browser.runtime.connect()
  /**
   * @returns {HTMLDivElement}
   */
  function createContent() {
    container.innerHTML = ''
    const answer = document.createElement('div')
    answer.id = 'answer'
    answer.className = 'markdown-body'
    answer.dir = 'auto'
    container.appendChild(answer)
    const interact = document.createElement('label')
    interact.className = 'interact-container';
    interact.id = 'interact'
    interact.type = 'text';
    interact.innerHTML = '<input type="text" class="interact-input" >'
    container.appendChild(interact)
    return answer
  }
  port.onMessage.addListener(function (msg) {
    const answer = document.querySelector('#answer') || createContent()
    if (msg.answer) {
      answer.innerHTML = markdown.render(
        '**ChatGPT:**\n\n' + msg.answer,
      )
    } else if (msg.answer == null) {
      answer.appendChild(document.createTextNode('Completed'))
    } else if (msg.error === 'UNAUTHORIZED') {
      answer.innerHTML =
        '<p>Please login at <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> first</p>'
    } else {
      answer.innerHTML = '<p>Failed to load response from ChatGPT</p>'
    }
  })
  port.postMessage({ question })
}

const siteRegex = new RegExp(Object.keys(config).join('|'))
const siteName = location.hostname.match(siteRegex)[0]

const searchInput = getPossibleElementByQuerySelector(config[siteName].inputQuery)
if (searchInput && searchInput.value) {
  // only run on first page
  const startParam = new URL(location.href).searchParams.get('start') || '0'
  if (startParam === '0') {
    run(searchInput.value, config[siteName])
  }
}

