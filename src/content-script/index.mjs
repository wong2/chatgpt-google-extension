import './styles.css'
import './katex.less'
import 'github-markdown-css'

import Browser from 'webextension-polyfill'
import { getMarkdownRenderer } from './markdown.mjs'
import { config } from './search-engine-configs.mjs'
import { getPossibleElementByQuerySelector } from './utils.mjs'

/**
 * @typedef {import('./search-engine-configs.mjs').SiteConfig} SiteConfig
 */

/**
 * @param {HTMLDivElement} container
 * @param {(question: string) => void} onSubmit
 * @returns {HTMLDivElement}
 */
function createAnswer(answers) {
  const answer = document.createElement('div')
  answer.classList.add(...['markdown-body', 'answer'])
  answer.dir = 'auto'
  answers.appendChild(answer)
  return answer
}

function createQuestion(answers) {
  const question = document.createElement('div')
  question.classList.add(...['markdown-body', 'question'])
  question.dir = 'auto'
  answers.appendChild(question)
  return question
}

/**
 * @param {HTMLDivElement} container
 * @param {(event: SubmitEvent) => void} onSubmit
 * @returns {HTMLFormElement}
 */
function creteInteract(container, onSubmit) {
  const interact = document.createElement('form')
  interact.className = 'interact-container';
  interact.id = 'interact'
  interact.type = 'text';
  const input = document.createElement('input')
  input.className = 'interact-input'
  input.type = 'text'
  input.placeholder = 'Type your question here...'
  interact.appendChild(input)
  interact.addEventListener('submit', (e) => {
    e.preventDefault()
    const question = input.value
    input.value = ''
    if (question) {
      onSubmit(question)
    }
  })
  container.appendChild(interact)
  return interact
}


/**
 * @param {string} question 
 * @param {SiteConfig} siteConfig 
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

  const answers = []
  port.onMessage.addListener(function (msg) {
    if (answers.length == 0) {
      container.innerHTML = ''
      const answersContainer = document.createElement('div')
      container.appendChild(answersContainer)
      answers.push(createAnswer(answersContainer))
      creteInteract(container, (question) => {
        port.postMessage({ question })
        createQuestion(answersContainer).innerHTML = markdown.render('**Me:**\n' + question) + '<hr>'
        answers.push(createAnswer(answersContainer))
      })
    }
    if (msg.answer) {
      answers[answers.length - 1].innerHTML = markdown.render(
        '**ChatGPT:**\n' + msg.answer,
      )
      return
    } else if (msg.answer == null) {
      answers[answers.length - 1].appendChild(document.createElement('hr'))

    } else if (msg.error === 'UNAUTHORIZED') {
      answers.innerHTML =
        '<p>Please login at <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> first</p>'
    } else {
      answers.innerHTML = '<p>Failed to load response from ChatGPT</p>'
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


