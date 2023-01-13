import { JSDOM } from 'jsdom'
import fetch, { Headers } from 'node-fetch'
import { config, SearchEngine } from '../../../src/content-script/search-engine-configs'

type SiteUrls = { [siteName: string]: string[] }
type QueryNames = (keyof Omit<SearchEngine, 'watchRouteChange'>)[]

const urls: SiteUrls = {
  google: ['https://www.google.com/search?q=hello'],
  bing: ['https://www.bing.com/search?q=hello', 'https://cn.bing.com/search?q=hello'],
  yahoo: ['https://search.yahoo.com/search?p=hello', 'https://search.yahoo.co.jp/search?p=hello'],
  duckduckgo: ['https://duckduckgo.com/s?q=hello'],
  baidu: ['https://www.baidu.com/s?wd=hello'],
  kagi: [], // need login https://kagi.com/search?q=hello
  yandex: [], // need cookie https://yandex.com/search/?text=hello
  naver: ['https://search.naver.com/search.naver?query=hello'],
  brave: ['https://search.brave.com/search?q=hello'],
  searx: ['https://searx.tiekoetter.com/search?q=hello'],
}

const headers = new Headers({
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/108.0.1462.76',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  Connection: 'keep-alive',
  'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7', // for baidu
})

const queryNames: QueryNames = ['inputQuery', 'sidebarContainerQuery', 'appendContainerQuery']

let errors = ''

async function verify(errorTag: string, urls: SiteUrls, headers: Headers, queryNames: QueryNames) {
  await Promise.all(
    Object.entries(urls).map(([siteName, urlArray]) =>
      Promise.all(
        urlArray.map((url) =>
          fetch(url, {
            method: 'GET',
            headers: headers,
          })
            .then((response) => response.text())
            .then((text) => {
              const dom = new JSDOM(text)
              for (const queryName of queryNames) {
                const queryArray = config[siteName][queryName]
                if (queryArray.length === 0) continue

                let foundQuery
                for (const query of queryArray) {
                  const element = dom.window.document.querySelector(query)
                  if (element) {
                    foundQuery = query
                    break
                  }
                }
                if (foundQuery) {
                  console.log(`${siteName} ${url} ${queryName}: ${foundQuery} passed`)
                } else {
                  const error = `${siteName} ${url} ${queryName} failed`
                  errors += errorTag + error + '\n'
                }
              }
            })
            .catch((error) => {
              errors += errorTag + error + '\n'
            }),
        ),
      ),
    ),
  )
}

async function main() {
  console.log('Verify desktop search engine configs:')
  await verify('desktop: ', urls, headers, queryNames)

  if (errors.length > 0) throw new Error('\n' + errors)
  else console.log('\nAll passed')
}

main()
