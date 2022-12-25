import { CssBaseline, GeistProvider, Radio, Text } from '@geist-ui/core'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { getUserConfig, TriggerMode, TRIGGER_MODE_TEXT, updateUserConfig } from '../config'
import logo from '../logo.png'
import '../base.css'

function OptionsPage() {
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(TriggerMode.Always)

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.triggerMode)
    })
  }, [])

  const onTriggerModeChange = useCallback((mode: TriggerMode) => {
    setTriggerMode(mode)
    updateUserConfig({ triggerMode: mode })
  }, [])

  return (
    <div className="container mx-auto">
      <nav className="flex flex-row justify-between items-center mt-5 px-2">
        <div className="flex flex-row items-center gap-2">
          <img src={logo} className="w-10 h-10 rounded-lg" />
          <span className="font-semibold">ChatGPT for Google</span>
        </div>
        <div className="flex flex-row gap-3">
          <a
            href="https://chatgpt-for-google.canny.io/feature-requests"
            target="_blank"
            rel="noreferrer"
          >
            Feedback
          </a>
          <a href="https://chatgpt-for-google.canny.io/changelog" target="_blank" rel="noreferrer">
            Changelog
          </a>
          <a
            href="https://github.com/wong2/chat-gpt-google-extension"
            target="_blank"
            rel="noreferrer"
          >
            Source code
          </a>
        </div>
      </nav>
      <main className="w-[500px] mx-auto mt-14">
        <Text h2>Options</Text>
        <Text h3 className="mt-10">
          Trigger Mode
        </Text>
        <Radio.Group
          value={triggerMode}
          onChange={(val) => onTriggerModeChange(val as TriggerMode)}
        >
          {Object.entries(TRIGGER_MODE_TEXT).map(([value, label]) => {
            return (
              <Radio key={value} value={value} type="success">
                {label}
              </Radio>
            )
          })}
        </Radio.Group>
      </main>
    </div>
  )
}

function App() {
  return (
    <GeistProvider>
      <CssBaseline />
      <OptionsPage />
    </GeistProvider>
  )
}

export default App
