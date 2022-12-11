import '@picocss/pico'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { getUserConfig, updateUserConfig, TRIGGER_MODES } from '../config'
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
    </div>
  )
}

export default Popup
