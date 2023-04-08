# ChatGPT for Google No Ads

As the author has sold this plugin and subsequent versions have not followed the GPL3 agreement to open source the code, it is unclear what changes have been made to the subsequent versions by outsiders. Therefore, it has been decided to fork this version, continue distributing it under the GPL3 license, and remove the ads.

由于作者已将此插件出售，而后续版本并没有遵循 GPL3 约定开放源代码，对于后续版本做了什么外人并不明确。故决定 fork 此版本，继续以 GPL3 协议发行，并删除了广告。

下载地址 

Chrome: pending...

Firefox: pending...

------------------------
# ChatGPT for Google

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/wong2/chatgpt-google-extension/pre-release-build.yml)
![Visitors](https://visitor-badge.glitch.me/badge?page_id=wong2.chat-gpt-google-extension&left_color=green&right_color=red)
[![Twitter Follow](https://img.shields.io/twitter/follow/chatgpt4google?style=social)](https://twitter.com/chatgpt4google)
![License](https://img.shields.io/github/license/wong2/chatgpt-google-extension)

### Notice (2023-02-20)

As this extension has been acquired, this code repository will no longer be updated from now on.

**My new project:**
[ChatHub: All-in-one chatbot client](https://github.com/chathub-dev/chathub)

---

A browser extension to display ChatGPT response alongside Google (and other search engines) results

[Install from Chrome Web Store](https://chatgpt4google.com/chrome?utm_source=github)

[Install from Mozilla Add-on Store](https://chatgpt4google.com/firefox?utm_source=github)

[Changelog](https://chatgpt-for-google.canny.io/changelog)

## Supported Search Engines

Google, Baidu, Bing, DuckDuckGo, Brave, Yahoo, Naver, Yandex, Kagi, Searx

## Screenshot

![Screenshot](screenshots/extension.png?raw=true)

## Features

- Supports all popular search engines
- Supports the official OpenAI API
- Supports ChatGPT Plus
- Markdown rendering
- Code highlights
- Dark mode
- Provide feedback to improve ChatGPT
- Copy to clipboard
- Custom trigger mode
- Switch languages

## Troubleshooting

### How to make it work in Brave

![Screenshot](screenshots/brave.png?raw=true)

Disable "Prevent sites from fingerprinting me based on my language preferences" in `brave://settings/shields`

### How to make it work in Opera

![Screenshot](screenshots/opera.png?raw=true)

Enable "Allow access to search page results" in the extension management page

## Build from source

1. Clone the repo
2. Install dependencies with `npm`
3. `npm run build`
4. Load `build/chromium/` or `build/firefox/` directory to your browser
