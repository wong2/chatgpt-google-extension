import { Button, Input, Select, Spinner, Tabs, useInput, useToasts } from '@geist-ui/core'
import { FC, useCallback, useState } from 'react'
import useSWR from 'swr'
import { fetchExtensionConfigs } from '../api'
import { getProviderConfigs, ProviderConfigs, ProviderType, saveProviderConfigs } from '../config'

interface ConfigProps {
  config: ProviderConfigs
  chatgpt_models: string[]
  openai_models: string[]
}

async function loadModels(): Promise<[string[], string[]]> {
  const configs = await fetchExtensionConfigs()
  return [configs.chatgpt_webapp_model_names, configs.openai_model_names]
}

const ConfigPanel: FC<ConfigProps> = ({ config, chatgpt_models, openai_models }) => {
  const [tab, setTab] = useState<ProviderType>(config.provider)
  const { bindings: apiKeyBindings } = useInput(config.configs[ProviderType.GPT3]?.apiKey ?? '')
  const [openai_model, setOpenAIModel] = useState(
    config.configs[ProviderType.GPT3]?.model ?? openai_models[0],
  )
  const [chatgpt_model, setChatGPTModel] = useState(
    config.configs[ProviderType.ChatGPT]?.model ?? chatgpt_models[0],
  )
  const { setToast } = useToasts()

  const save = useCallback(async () => {
    if (tab === ProviderType.GPT3) {
      if (!apiKeyBindings.value) {
        alert('Please enter your OpenAI API key')
        return
      }
      if (!openai_model || !openai_models.includes(openai_model)) {
        alert('Please select a valid openai_model')
        return
      }
    }
    if (tab === ProviderType.ChatGPT) {
      if (!chatgpt_model || !chatgpt_models.includes(chatgpt_model)) {
        alert('Please select a valid chatgpt_model')
        return
      }
    }
    await saveProviderConfigs(tab, {
      [ProviderType.GPT3]: {
        model: openai_model,
        apiKey: apiKeyBindings.value,
      },
      [ProviderType.ChatGPT]: {
        model: chatgpt_model,
      },
    })
    setToast({ text: 'Changes saved', type: 'success' })
  }, [
    apiKeyBindings.value,
    openai_model,
    openai_models,
    setToast,
    tab,
    chatgpt_model,
    chatgpt_models,
  ])

  return (
    <div className="flex flex-col gap-3">
      <Tabs value={tab} onChange={(v) => setTab(v as ProviderType)}>
        <Tabs.Item label="ChatGPT webapp" value={ProviderType.ChatGPT}>
          The API that powers ChatGPT webapp, free, but sometimes unstable
          <div className="flex flex-row gap-2">
            <Select
              scale={2 / 3}
              value={chatgpt_model}
              onChange={(v) => setChatGPTModel(v as string)}
              placeholder="model"
            >
              {chatgpt_models.map((m) => (
                <Select.Option key={m} value={m}>
                  {m}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Tabs.Item>
        <Tabs.Item label="OpenAI API" value={ProviderType.GPT3}>
          <div className="flex flex-col gap-2">
            <span>
              OpenAI official API, more stable,{' '}
              <span className="font-semibold">charge by usage</span>
            </span>
            <div className="flex flex-row gap-2">
              <Select
                scale={2 / 3}
                value={openai_model}
                onChange={(v) => setOpenAIModel(v as string)}
                placeholder="model"
              >
                {openai_models.map((m) => (
                  <Select.Option key={m} value={m}>
                    {m}
                  </Select.Option>
                ))}
              </Select>
              <Input htmlType="password" label="API key" scale={2 / 3} {...apiKeyBindings} />
            </div>
            <span className="italic text-xs">
              You can find or create your API key{' '}
              <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </span>
          </div>
        </Tabs.Item>
      </Tabs>
      <Button scale={2 / 3} ghost style={{ width: 20 }} type="success" onClick={save}>
        Save
      </Button>
    </div>
  )
}

function ProviderSelect() {
  const query = useSWR('provider-configs', async () => {
    const [config, models] = await Promise.all([getProviderConfigs(), loadModels()])
    return { config, models }
  })
  if (query.isLoading) {
    return <Spinner />
  }
  return (
    <ConfigPanel
      config={query.data!.config}
      chatgpt_models={query.data!.models[0]}
      openai_models={query.data!.models[1]}
    />
  )
}

export default ProviderSelect
