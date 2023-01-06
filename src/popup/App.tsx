import { GearIcon, GlobeIcon } from '@primer/octicons-react'
import { useCallback } from 'react'
import useSWR from 'swr'
import Browser from 'webextension-polyfill'
import '../base.css'
import logo from '../logo.png'

const isChrome = /chrome/i.test(navigator.userAgent)

function App() {
  const accessTokenQuery = useSWR(
    'accessToken',
    () => Browser.runtime.sendMessage({ type: 'GET_ACCESS_TOKEN' }),
    { shouldRetryOnError: false },
  )
  const hideShortcutsTipQuery = useSWR('hideShortcutsTip', async () => {
    const { hideShortcutsTip } = await Browser.storage.local.get('hideShortcutsTip')
    return !!hideShortcutsTip
  })

  const openOptionsPage = useCallback(() => {
    Browser.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' })
  }, [])

  const openShortcutsPage = useCallback(() => {
    Browser.storage.local.set({ hideShortcutsTip: true })
    Browser.tabs.create({ url: 'chrome://extensions/shortcuts' })
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex flex-row items-center px-1">
        <img src={logo} className="w-5 h-5 rounded-sm" />
        <p className="text-sm font-semibold m-0 ml-1">ChatGPT for Google</p>
        <div className="grow"></div>
        <span className="cursor-pointer leading-[0]" onClick={openOptionsPage}>
          <GearIcon size={16} />
        </span>
      </div>
      {isChrome && !hideShortcutsTipQuery.isLoading && !hideShortcutsTipQuery.data && (
        <p className="m-0 mb-2">
          Tip:{' '}
          <a onClick={openShortcutsPage} className="underline cursor-pointer">
            setup shortcuts
          </a>{' '}
          for faster access.
        </p>
      )}
      {(() => {
        if (accessTokenQuery.isLoading) {
          return (
            <div className="grow justify-center items-center flex animate-bounce">
              <GlobeIcon size={24} />
            </div>
          )
        }
        if (accessTokenQuery.data) {
          return <iframe src="https://chat.openai.com" className="grow border-none" />
        }
        return (
          <div className="grow flex flex-col justify-center">
            <p className="text-base px-2 text-center">
              Please login and pass Cloudflare check at{' '}
              <a href="https://chat.openai.com" target="_blank" rel="noreferrer">
                chat.openai.com
              </a>
            </p>
          </div>
        )
      })()}
    </div>
  )
}

export default App
