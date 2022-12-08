/**
 * @typedef {object} SiteConfig
 * @property {string[]} inputName - input element name of search box
 * @property {string[]} sidebarContainerId - prepend child to
 * @property {string[]} sidebarContainerClass - if above ids not exist, prepend child to
 * @property {string[]} appendContainerId - if above all not exist, append child to
 * @property {string[]} appendContainerClass - if above all not exist, append child to
 */
/**
 * @type {Object.<string,SiteConfig>}
 */
export const config = {
  google: {
    inputName: ["q"],
    sidebarContainerId: ["rhs"],
    sidebarContainerClass: [],
    appendContainerId: ["rcnt"],
    appendContainerClass: []
  },
  bing: {
    inputName: ["q"],
    sidebarContainerId: ["b_context"],
    sidebarContainerClass: [],
    appendContainerId: [],
    appendContainerClass: []
  },
  yahoo: {
    inputName: ["p"],
    sidebarContainerId: ["right"],
    sidebarContainerClass: ["Contents__inner Contents__inner--sub"],
    appendContainerId: ["cols", "contents__wrap"], // and yahoo jp
    appendContainerClass: []
  },
  duckduckgo: {
    inputName: ["q"],
    sidebarContainerId: [],
    sidebarContainerClass: ["results--sidebar js-results-sidebar"],
    appendContainerId: ["links_wrapper"],
    appendContainerClass: []
  },
  startpage: {
    inputName: ["query"],
    sidebarContainerId: [],
    sidebarContainerClass: ["layout-web__sidebar layout-web__sidebar--web"],
    appendContainerId: [],
    appendContainerClass: ["layout-web__body layout-web__body--desktop"]
  },
  baidu: {
    inputName: ["wd"],
    sidebarContainerId: ["content_right"],
    sidebarContainerClass: [],
    appendContainerId: ["container"],
    appendContainerClass: []
  },
  kagi: {
    inputName: ["q"],
    sidebarContainerId: [],
    sidebarContainerClass: ["right-content-box _0_right_sidebar"],
    appendContainerId: ["_0_app_content"],
    appendContainerClass: []
  },
  yandex: {
    inputName: ["text"],
    sidebarContainerId: ["search-result-aside"],
    sidebarContainerClass: [],
    appendContainerId: [],
    appendContainerClass: []
  },
  naver: {
    inputName: ["query"],
    sidebarContainerId: ["sub_pack"],
    sidebarContainerClass: [],
    appendContainerId: ["content"],
    appendContainerClass: []
  },
  brave: {
    inputName: ["q"],
    sidebarContainerId: ["side-right"],
    sidebarContainerClass: [],
    appendContainerId: [],
    appendContainerClass: []
  },
  searx: {
    inputName: ["q"],
    sidebarContainerId: ["sidebar_results"],
    sidebarContainerClass: [],
    appendContainerId: [],
    appendContainerClass: []
  },
  ecosia: {
    inputName: ["q"],
    sidebarContainerId: [],
    sidebarContainerClass: ["sidebar web__sidebar"],
    appendContainerId: ["main"],
    appendContainerClass: []
  }
}