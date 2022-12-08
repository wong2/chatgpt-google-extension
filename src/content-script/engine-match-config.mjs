/**
 * @typedef {object} SiteConfig
 * @property {string[]} inputQuery - for search box
 * @property {string[]} sidebarContainerQuery - prepend child to
 * @property {string[]} appendContainerQuery - if sidebarContainer not exists, append child to
 */
/**
 * @type {Object.<string,SiteConfig>}
 */
export const config = {
  google: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ["#rhs"],
    appendContainerQuery: ["#rcnt"]
  },
  bing: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ["#b_context"],
    appendContainerQuery: []
  },
  yahoo: {
    inputQuery: ["input[name='p']"],
    sidebarContainerQuery: ["#right", ".Contents__inner.Contents__inner--sub"],
    appendContainerQuery: ["#cols", "#contents__wrap"]
  },
  duckduckgo: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: [".results--sidebar.js-results-sidebar"],
    appendContainerQuery: ["#links_wrapper"]
  },
  startpage: {
    inputQuery: ["input[name='query']"],
    sidebarContainerQuery: [".layout-web__sidebar.layout-web__sidebar--web"],
    appendContainerQuery: [".layout-web__body.layout-web__body--desktop"]
  },
  baidu: {
    inputQuery: ["input[name='wd']"],
    sidebarContainerQuery: ["#content_right"],
    appendContainerQuery: ["#container"]
  },
  kagi: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: [".right-content-box._0_right_sidebar"],
    appendContainerQuery: ["#_0_app_content"],
  },
  yandex: {
    inputQuery: ["input[name='text']"],
    sidebarContainerQuery: ["#search-result-aside"],
    appendContainerQuery: []
  },
  naver: {
    inputQuery: ["input[name='query']"],
    sidebarContainerQuery: ["#sub_pack"],
    appendContainerQuery: ["#content"]
  },
  brave: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ["#side-right"],
    appendContainerQuery: []
  },
  searx: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: ["#sidebar_results"],
    appendContainerQuery: []
  },
  ecosia: {
    inputQuery: ["input[name='q']"],
    sidebarContainerQuery: [".sidebar web__sidebar"],
    appendContainerQuery: ["#main"]
  }
}
