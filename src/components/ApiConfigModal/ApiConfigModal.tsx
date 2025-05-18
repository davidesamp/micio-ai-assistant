import { Modal, Typography } from 'antd'
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

  const { Title, Paragraph } = Typography

  const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
    [AIProvider.GEMINI]: apisConfig?.[AIProvider.GEMINI] || '',
    [AIProvider.MISTRAL]: apisConfig?.[AIProvider.MISTRAL] || '',
    [AIProvider.DEEPSEEK]: apisConfig?.[AIProvider.DEEPSEEK] || '',
    [AIProvider.OPENAI]: apisConfig?.[AIProvider.OPENAI] || '',    
    [AIProvider.PERPLEXITY]: apisConfig?.[AIProvider.PERPLEXITY] || '',    
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
      <Title level={4} className={styles.Title}>API Configuration</Title>
      <Paragraph className={styles.Description}>
        Please enter your API keys for the selected providers. You can find your API keys in your account settings on the respective provider's website.
      </Paragraph>
      
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
