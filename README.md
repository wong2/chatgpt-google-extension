# ChatGPT for Google

A browser extension to display ChatGPT response alongside Google (and other search engines) results, supports Chrome/Edge/Firefox

## Supported Search Engines

Google, Baidu, Bing, DuckDuckGo, Brave, Yahoo, Naver, Yandex, Kagi, Searx

## Screenshot

![Screenshot](screenshots/extension.png?raw=true)

## Installation

### Install to Chrome/Edge/Brave/Opera

_Notice: Brave/Opera users please follow [Troubleshooting](#troubleshooting) section after install_

#### Install from Chrome Web Store (Preferred)

<https://chrome.google.com/webstore/detail/chatgpt-for-google/jgjaeacdkonaoafenlfkkkmbaopkbilf>

#### Local Install

1. Download `chromium.zip` from [Releases](https://github.com/wong2/chat-gpt-google-extension/releases).
2. Unzip the file.
3. In Chrome/Edge go to the extensions page (`chrome://extensions` or `edge://extensions`).
4. Enable Developer Mode.
5. Drag the unzipped folder anywhere on the page to import it (do not delete the folder afterwards).

### Install to Firefox

#### Install from Mozilla Add-on Store (Preferred)

<https://addons.mozilla.org/addon/chatgpt-for-google/>

#### Local Install

1. Download `firefox.zip` from [Releases](https://github.com/wong2/chat-gpt-google-extension/releases).
2. Unzip the file.
3. Go to `about:debugging`, click "This Firefox" on the sidebar.
4. Click "Load Temporary Add-on" button, then select any file in the unzipped folder.

## Build from source

1. Clone the repo
2. Install dependencies with `npm`
3. `npm run build`
4. Load `build/chromium/` or `build/firefox/` directory to your browser

## Troubleshooting

### How to make it work in Brave

Brave has security features which breaks this extension, please follow solution in this [comment](https://github.com/wong2/chat-gpt-google-extension/issues/120#issuecomment-1356264089)

### How to make it work in Opera

![Screenshot](screenshots/opera.png?raw=true)

Enable "Allow access to search page results" in the extension management page

## Credit

This project is inspired by [ZohaibAhmed/ChatGPT-Google](https://github.com/ZohaibAhmed/ChatGPT-Google)
