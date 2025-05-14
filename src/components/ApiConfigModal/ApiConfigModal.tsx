import { Modal } from 'antd'
import Input from 'antd/es/input/Input'
import React, { useState } from 'react'
import styles from './ApiConfigModal.module.scss'
import { AIProvider } from '@/model/ui'
import { saveApisConfig } from '@/services/dataMiddleware'
import { useMicioStore } from '@/store'

export const ApiConfigModal = () => {
  const {
    ui: {
      configModalOpen,
      actions: { closeConfigModal },
    },
    chat: {
      apisConfig,
      actions: { setApisConfig },
    },
  } = useMicioStore()

  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    [AIProvider.GEMINI]: apisConfig?.[AIProvider.GEMINI] || '',
    [AIProvider.MISTRAL]: apisConfig?.[AIProvider.MISTRAL] || '',
    [AIProvider.DEEPSEEK]: apisConfig?.[AIProvider.DEEPSEEK] || '',
    [AIProvider.OPENAI]: apisConfig?.[AIProvider.OPENAI] || '',    
  })

  const handleSaveApis = async () => {
    await saveApisConfig(apiKeys)
    setApisConfig(apiKeys, true)
    closeConfigModal()
  }

  const handleClose = () => {
    closeConfigModal()
  }

  return (
    <Modal 
      className={styles.Container} 
      open={configModalOpen} 
      onOk={handleSaveApis}
      okText='Save'
      cancelText='Cancel'
      onCancel={handleClose}
      >
      {Object.values(AIProvider).map((provider) => (
        <div className={styles.ItemGroup} key={provider}>
            <label htmlFor={provider}>{provider}</label>
            <Input
            type='password'
            placeholder='Enter API key'
            value={apiKeys[provider]}
            onChange={(e) => setApiKeys((prev) => ({ ...prev, [provider]: e.target.value }))}
            />
        </div>
      ))}
    </Modal>
  )
}
