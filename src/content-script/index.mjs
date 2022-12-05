import Browser from "webextension-polyfill";

const container = document.createElement("div");

async function run(question) {
  container.className = "chat-gpt-container";
  container.innerHTML = '<p class="loading">Waiting for ChatGPT response...</p>';

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

if(location.hostname.match("startpage")){
  // startpage
  document.querySelector(".layout-web__sidebar.layout-web__sidebar--web").appendChild(container);
  const searchInput = document.getElementById("q");
  if (searchInput && searchInput.value) {
    run(searchInput.value);
  }
}else if(location.hostname.match("duckduckgo")){
  // duckduckgo
  document.getElementById("web_content_wrapper").prepend(container);
  const searchInput = document.getElementsByName("q")[0];
  if (searchInput && searchInput.value) {
    // only run on first page
    const startParam = new URL(location.href).searchParams.get("start") || "0";
    if (startParam === "0") {
      run(searchInput.value);
    }
  }
} else if (location.hostname.match("kagi.com")) {
  // Kagi
  const sidebarContainer = document.querySelector('.right-content-box._0_right_sidebar')
  if (sidebarContainer) {
    sidebarContainer.prepend(container);
  } else {
    container.classList.add("sidebar-free");
    document.getElementById("main").appendChild(container);
  }
  const searchInput = document.getElementsByName("q")[0];
  if (searchInput && searchInput.value) {
    // note: Kagi results aren't paginated, no need to check the page number
    run(searchInput.value);
  }
}else if(location.hostname.match("google")){
  // google
  const siderbarContainer = document.getElementById("rhs");
  if (siderbarContainer) {
    siderbarContainer.prepend(container);
  } else {
    container.classList.add("sidebar-free");
    document.getElementById("rcnt").appendChild(container);
  }
  const searchInput = document.getElementsByName("q")[0];
  if (searchInput && searchInput.value) {
    // only run on first page
    const startParam = new URL(location.href).searchParams.get("start") || "0";
    if (startParam === "0") {
      run(searchInput.value);
    }
  }
}

