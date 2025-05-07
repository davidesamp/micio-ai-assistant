import { Modal, Slider, SliderSingleProps } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'
import styles from './SettingsModal.module.scss'
import { AISettings } from '@/model/user'
import { useMicioStore } from '@/store'

export const SettingsModal = () => {
  const {
    ui: {
      settingsModalOpen,
      actions: { closeSettingsModal },
    },
    user: {
      aiSettings,
      actions: { setAISettings },
    }
  } = useMicioStore()

  const {
    prompt,
    temperature,
   } = aiSettings

  const [currentTemperature, setCurrentTemperature] = React.useState(temperature)
  const [currentPrompt, setCurrentPrompt] = React.useState(prompt)

  const handleClose = () => {
    closeSettingsModal()
  }

  const handleSaveSettings = () => {
    const newSettings : AISettings = {
      temperature: currentTemperature,
      prompt: currentPrompt,
    }
    setAISettings(newSettings)
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentPrompt(e.target.value)
  }

  const handleTemperatureChange = (value: number) => {
    setCurrentTemperature(value)
  }

  const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `${value}`
  
  return (
    <Modal
      open={settingsModalOpen}
      onOk={handleSaveSettings}
      onCancel={handleClose}
    >
      <div className={styles.Container}>
        <div>
          <label htmlFor='prompt'>Prompt</label>
          <TextArea
            name='prompt'
            value={currentPrompt}
            onChange={handlePromptChange}
            autoSize={{ minRows: 2, maxRows: 2 }}
          />
        </div>
        <div>
          <label>Temperature</label>
          <Slider
            min={0.1}
            step={0.1}
            defaultValue={currentTemperature}
            max={2.0} 
            onChange={handleTemperatureChange}
            tooltip={{ formatter }} 
          />
        </div>
      </div>
    </Modal>
  )
}
