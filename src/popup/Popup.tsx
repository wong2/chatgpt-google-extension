import '@picocss/pico'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { getUserConfig, TriggerMode, TRIGGER_MODE_TEXT, updateUserConfig } from '../config'
import '../base.css'

function Popup() {
  const [triggerMode, setTriggerMode] = useState<TriggerMode>(TriggerMode.Always)

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.triggerMode)
    })
  }, [])

  const onTriggerModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const mode = e.target.value as TriggerMode
    setTriggerMode(mode)
    updateUserConfig({ triggerMode: mode })
  }, [])

  return (
    <div className="p-5 w-[400px]">
      <form className="mt-0">
        <fieldset className="mb-0">
          <legend className="font-bold">Trigger Mode</legend>
          {Object.entries(TRIGGER_MODE_TEXT).map(([value, label]) => {
            return (
              <label htmlFor={value} key={value}>
                <input
                  type="radio"
                  id={value}
                  name="triggerMode"
                  value={value}
                  checked={triggerMode === value}
                  onChange={onTriggerModeChange}
                />
                {label}
              </label>
            )
          })}
        </fieldset>
      </form>
      <footer className="flex flex-row justify-end gap-[10px] mt-[10px]">
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
      </footer>
    </div>
  )
}

export default Popup
