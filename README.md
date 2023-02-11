# ChatGPT for Google

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/wong2/chatgpt-google-extension/pre-release-build.yml)
![Visitors](https://visitor-badge.glitch.me/badge?page_id=wong2.chat-gpt-google-extension&left_color=green&right_color=red)
[![Twitter Follow](https://img.shields.io/twitter/follow/chatgpt4google?style=social)](https://twitter.com/chatgpt4google)
![License](https://img.shields.io/github/license/wong2/chatgpt-google-extension)

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
