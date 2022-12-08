import Browser from "webextension-polyfill";
import {getPossibleElementByClassArray, getPossibleElementByIdArray, getPossibleElementByNameArray} from "./utils.mjs"
import {config} from "./engine-match-config.mjs"

async function run(question) {
  const container = document.createElement("div");
  container.className = "chat-gpt-container";
  container.innerHTML = '<p class="loading">Waiting for ChatGPT response...</p>';

  const siderbarContainer =
    getPossibleElementByIdArray(config[siteName].sidebarContainerId)
    || getPossibleElementByClassArray(config[siteName].sidebarContainerClass);
  if (siderbarContainer) {
    siderbarContainer.prepend(container);
  } else {
    container.classList.add("sidebar-free");
    const appendContainer =
      getPossibleElementByIdArray(config[siteName].appendContainerId)
      || getPossibleElementByClassArray(config[siteName].appendContainerClass);
    if (appendContainer)
      appendContainer.appendChild(container);
  }

  const port = Browser.runtime.connect();
  port.onMessage.addListener(function (msg) {
    if (msg.answer) {
      container.innerHTML = '<p><span class="prefix">ChatGPT:</span><pre></pre></p>';
      container.querySelector("pre").textContent = msg.answer;
    } else if (msg.error === "UNAUTHORIZED") {
      container.innerHTML =
        '<p>Please login at <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> first</p>';
    } else {
      container.innerHTML = "<p>Failed to load response from ChatGPT</p>";
    }
  });
  port.postMessage({ question });
}

const siteNameReplaceList = [document.location.hostname, "www.", "search.", "cn."]
const siteName = siteNameReplaceList.reduce((pre, cur) => {
  return pre.replace(cur, "")
}).match(/(.+?)\./)[1]

const searchInput = getPossibleElementByNameArray(config[siteName].inputName);
if (searchInput && searchInput.value) {
  // only run on first page
  const startParam = new URL(location.href).searchParams.get("start") || "0";
  if (startParam === "0") {
    run(searchInput.value);
  }
}