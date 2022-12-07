import MarkdownIt from "markdown-it";
import Browser from "webextension-polyfill";

const marginAndPadding = 100;

async function run(question) {
  const markdown = new MarkdownIt();

  const container = document.createElement("div");
  container.className = "chat-gpt-container resizable";
  container.innerHTML = '<p class="loading">Waiting for ChatGPT response...</p>';
  container.id = "resize-me";

  const siderbarContainer = document.getElementById("rhs");
  if (siderbarContainer) {
    siderbarContainer.prepend(container);
  } else {
    const element = document.getElementById("rcnt");

    const offsetWidth = element.offsetWidth;
    const { left, width: leftContainerWidth } = element.firstChild.getBoundingClientRect()

    const defaultWidth = offsetWidth - left - leftContainerWidth - marginAndPadding;
    container.style.width = `${defaultWidth}px`;
    
    container.classList.add("sidebar-free");
    const beforeName = element.classList.value;
    element.classList.replace(beforeName, 'g-flex');
    element.appendChild(container);
  }

  const ele = document.getElementById('resize-me');

   // The current position of mouse
   let x = 0;

   // The dimension of the element
   let w = 0;

   const mouseDownHandler = function (e) {
       // Get the current mouse position
       x = e.clientX;

       // Calculate the dimension of element
       const styles = window.getComputedStyle(ele);
       w = parseInt(styles.width, 10);

       // Attach the listeners to `document`
       document.addEventListener('mousemove', mouseMoveHandler);
       document.addEventListener('mouseup', mouseUpHandler);
   };

   const mouseMoveHandler = function (e) {
       // How far the mouse has been moved
       const dx = e.clientX - x;
       ele.style.width = `${w + dx}px`;
   };

   const mouseUpHandler = function () {
       // Remove the handlers of `mousemove` and `mouseup`
       document.removeEventListener('mousemove', mouseMoveHandler);
       document.removeEventListener('mouseup', mouseUpHandler);
   };

   const receiveDone = () => {
    const ele = document.getElementById('resize-me');

      // Query all resizerList (bottom | right)
      const resizerList = ele.querySelectorAll('.resizer');

      // Loop over them
      [].forEach.call(resizerList, function (resizer) {
        resizer.addEventListener('mousedown', mouseDownHandler);
      });
   };

  const port = Browser.runtime.connect();
  port.onMessage.addListener(function (msg) {
    if (msg.answer) {
      container.innerHTML = `
        <p class="prefix">ChatGPT:</p>
        <div id="answer" class="markdown-body" dir="auto"></div>
        <div class="resizer resizer-r" />
      `;
      container.querySelector("#answer").innerHTML = markdown.render(msg.answer);

      const { stat } = msg;
      if(stat) {
        receiveDone();
      }
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
