import '@picocss/pico'
import { MarkGithubIcon } from '@primer/octicons-react'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { getUserConfig, TRIGGER_MODES, updateUserConfig } from '../config'
import './styles.css'

function Popup() {
  const [triggerMode, setTriggerMode] = useState()

  useEffect(() => {
    getUserConfig().then((config) => {
      setTriggerMode(config.triggerMode || 'always')
    })
  }, [])

  const onTriggerModeChange = useCallback((e) => {
    const mode = e.target.value
    setTriggerMode(mode)
    updateUserConfig({ triggerMode: mode })
  }, [])

  return (
    <div className="container">
      <form>
        <fieldset onChange={onTriggerModeChange}>
          <legend>Trigger Mode</legend>
          {Object.entries(TRIGGER_MODES).map(([value, label]) => {
            return (
              <label htmlFor={value} key={value}>
                <input
                  type="radio"
                  id={value}
                  name="triggerMode"
                  value={value}
                  checked={triggerMode === value}
                />
                {label}
              </label>
            )
          })}
        </fieldset>
      </form>
      <a
        href="https://github.com/wong2/chat-gpt-google-extension"
        target="_blank"
        rel="noreferrer"
        className="github-link"
      >
        <MarkGithubIcon />
      </a>
    </div>
  )
}

export default Popup
