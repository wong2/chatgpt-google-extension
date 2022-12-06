import Browser from "webextension-polyfill";
import MarkdownIt from 'markdown-it';
import  prism  from 'markdown-it-prism';
import "prismjs/components/prism-clike"
import "prismjs/components/prism-java"
import CodeCopy from "markdown-it-code-copy";

async function run(question) {
  const container = document.createElement("div");
  container.className = "chat-gpt-container";
  container.innerHTML = '<p class="loading">Waiting for ChatGPT response...</p>';

  const siderbarContainer = document.getElementById("rhs");
  if (siderbarContainer) {
    siderbarContainer.prepend(container);
  } else {
    container.classList.add("sidebar-free");
    document.getElementById("rcnt").appendChild(container);
  }

  const port = Browser.runtime.connect();
  port.onMessage.addListener(function (msg) {
    if (msg.answer) {
      const markdownIt = new MarkdownIt();

      // code hightlight
      markdownIt.use(prism, {
				highlightInlineCode: true,
				defaultLanguage: 'java'
			});

      // add copy button
			markdownIt.use(CodeCopy, {
				buttonClass: 'chat-gpt-copy-button',
			});

      container.innerHTML =  '<div><span class="prefix">ChatGPT:</span><div id="answer" class="markdown-body"></div></div>';
      container.querySelector("#answer").innerHTML = markdownIt.render(msg.answer);
    } else if (msg.error === "UNAUTHORIZED") {
      container.innerHTML =
        '<p>Please login at <a href="https://chat.openai.com" target="_blank">chat.openai.com</a> first</p>';
    } else {
      container.innerHTML = "<p>Failed to load response from ChatGPT</p>";
    }
  });
  port.postMessage({ question });
}

const searchInput = document.getElementsByName("q")[0];
if (searchInput && searchInput.value) {
  // only run on first page
  const startParam = new URL(location.href).searchParams.get("start") || "0";
  if (startParam === "0") {
    run(searchInput.value);
  }
}
