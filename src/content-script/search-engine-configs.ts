export interface SearchEngine {
  inputQuery: string[]
  sidebarContainerQuery: string[]
  appendContainerQuery: string[]
  watchRouteChange?: (callback: () => void) => void
  getPrompt?: () => Promise<{ value: string }>
}

export const config: Record<string, SearchEngine> = {
  google: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#rhs'],
    appendContainerQuery: ['#rcnt'],
  },
  bing: {
    inputQuery: ["[name='q']"],
    sidebarContainerQuery: ['#b_context'],
    appendContainerQuery: [],
  },
  yahoo: {
    inputQuery: ["input[name='p']"],
    sidebarContainerQuery: ['#right', '.Contents__inner.Contents__inner--sub'],
    appendContainerQuery: ['#cols', '#contents__wrap'],
  },
  duckduckgo: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.results--sidebar.js-results-sidebar'],
    appendContainerQuery: ['#links_wrapper'],
  },
  baidu: {
    inputQuery: ["input[name='wd']"],
    sidebarContainerQuery: ['#content_right'],
    appendContainerQuery: ['#container'],
    watchRouteChange(callback) {
      const targetNode = document.getElementById('wrapper_wrapper')!
      const observer = new MutationObserver(function (records) {
        for (const record of records) {
          if (record.type === 'childList') {
            for (const node of record.addedNodes) {
              if ('id' in node && node.id === 'container') {
                callback()
                return
              }
            }
          }
        }
      })
      observer.observe(targetNode, { childList: true })
    },
  },
  kagi: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['.right-content-box._0_right_sidebar'],
    appendContainerQuery: ['#_0_app_content'],
  },
  yandex: {
    inputQuery: ["input[name='text']"],
    sidebarContainerQuery: ['#search-result-aside'],
    appendContainerQuery: [],
  },
  naver: {
    inputQuery: ["input[name='query']"],
    sidebarContainerQuery: ['#sub_pack'],
    appendContainerQuery: ['#content'],
  },
  brave: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#side-right'],
    appendContainerQuery: [],
  },
  searx: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ['#sidebar_results'],
    appendContainerQuery: [],
  },
  youtube: {
    inputQuery: ['input#search'],
    sidebarContainerQuery: ['#secondary-inner>#related'],
    appendContainerQuery: ['#secondary-inner>#related'],
    async watchRouteChange(callback) {
      await (async () => new Promise((resolve) => setTimeout(resolve, 5000)))()
      const selector = '#secondary-inner>#related'
      if (document.querySelector(selector)) return callback()
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          observer.disconnect()
          return callback()
        }
      })
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    },
    async getPrompt() {
      async function getSubs(langCode = 'en') {
        async function fetchYtInitialPlayerResponse(): Promise<any> {
          const pageHtml = await (await fetch(window.location.href)).text()
          try {
            return JSON.parse(pageHtml.split(`var ytInitialPlayerResponse = `)[1].split(`;var`)[0])
          } catch (err) {
            return ytInitialPlayerResponse
          }
        }
        const ytInitialPlayerResponse = await fetchYtInitialPlayerResponse()
        const getBaseUrl = (langCode: string) =>
          ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks.find(
            (x) => x.vssId.indexOf('.' + langCode) === 0,
          )?.baseUrl

        const subsUrl =
          (getBaseUrl(langCode) ||
            ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer.captionTracks[0]
              .baseUrl) +
          '&tlang=' +
          langCode
        const subs = await (await fetch(subsUrl)).text()
        const xml = new DOMParser().parseFromString(subs, 'text/xml')
        const textNodes = [...xml.getElementsByTagName('text')]
        const subsText = textNodes
          .map((x) => x.textContent)
          .join('\n')
          .replaceAll('&#39;', "'")
        return subsText
      }
      const subs = await getSubs('en')
      return { value: 'Make a summary of the following text:\n' + subs.slice(0, 3000) }
    },
  },
}
