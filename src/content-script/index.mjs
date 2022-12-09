import MarkdownIt from "markdown-it";
import Browser from "webextension-polyfill";

async function run(question) {
  const markdown = new MarkdownIt();

  const container = document.createElement("div");
  container.className = "chat-gpt-container";
  container.innerHTML = '<p class="loading">Waiting for ChatGPT response...</p>';

  // google, baidu
  const siderbarContainer = document.querySelector("#rhs, #content_right")
  if (siderbarContainer) {
    siderbarContainer.prepend(container);
  } else {
    container.classList.add("sidebar-free");
    // google
    document.getElementById("rcnt") && document.getElementById("rcnt").appendChild(container);
    // baidu
    document.getElementById("content_right") && document.getElementById("content_right").prepend(container);
  }

  const port = Browser.runtime.connect();
  port.onMessage.addListener(function (msg) {
    if (msg.answer) {
      container.innerHTML =
        '<p class="prefix">ChatGPT:</p><div id="answer" class="markdown-body" dir="auto"></div>';
      container.querySelector("#answer").innerHTML = markdown.render(msg.answer);
    } else if (msg.error === "UNAUTHORIZED") {
      container.innerHTML =
        '<p>Please login at <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> first</p>';
    } else {
      container.innerHTML = "<p>Failed to load response from ChatGPT</p>";
    }
  });
  port.postMessage({ question });
}

// get the input el
const inputElSelectors = {
  google: 'input[name=q]',
  baidu: 'input[name=wd]',
}

// baidu（special process）
if (location.host == 'www.baidu.com') {
  // when baidu search req is over, then call the chatAI req
  const el = document.querySelector('input[name=rsv_t]')
  const ob = new MutationObserver(search)
  ob.observe(el, {attributes: true})
}
// call chatAI req
function search() {
  const searchInput = document.querySelector(Object.values(inputElSelectors).join(', '))
  if (searchInput && searchInput.value) {
    // only run on first page
    const startParam = new URL(location.href).searchParams.get("start") || "0";
    if (startParam === "0") {
      run(searchInput.value);
    }
  }
}
search()
