import { Typography } from 'antd'
import cx from 'classnames'
import React from 'react'
import styles from './ModelsPopover.module.scss'
import { iconsProviderMapping } from '@/containers/Sidebar/iconsProviderMapping'
import useGenerateContent from '@/hooks/useGenerateContent'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'
import { ModelsList } from '@/utils/constants'

export const ModelsPopover = () => {

    const {
      chat: {
        selectedModel,
      },
    } = useMicioStore()

  const { changeModel } = useGenerateContent()

  const { Title } = Typography

  const getModelsListByProvider = (provider: AIProvider) => {
    const models = ModelsList.filter((model) => model.provider === provider)
    return models.map((model) => (
      <p
        onClick={() => changeModel(model)}
        className={cx(styles.PopoverItem, { [styles.Selected]: selectedModel?.name === model.name })}
        key={model.name}>
        {model.displayName}
      </p>
    ))
  }
  return (
    <div className={styles.PopoverContent}>
      <div className={styles.ProviderGroup}>
        <div className={styles.ProviderHeader}>
          <Title level={3}>Gemini</Title> 
          {iconsProviderMapping[AIProvider.GEMINI].icon}
        </div>
        {getModelsListByProvider(AIProvider.GEMINI)}
      </div>
      <div className={styles.ProviderGroup}>
        <div className={styles.ProviderHeader}>
          <Title level={3}>Open AI</Title>
          {iconsProviderMapping[AIProvider.OPENAI].icon}
        </div>
        {getModelsListByProvider(AIProvider.OPENAI)}
      </div>
      <div className={styles.ProviderGroup}>
        <div className={styles.ProviderHeader}>
          <Title level={3}>DeepSeek</Title>
          {iconsProviderMapping[AIProvider.DEEPSEEK].icon}
        </div>
        {getModelsListByProvider(AIProvider.DEEPSEEK)}
      </div>
      <div className={styles.ProviderGroup}>
        <div className={styles.ProviderHeader}>
          <Title level={3}>Mistral</Title>
          {iconsProviderMapping[AIProvider.MISTRAL].icon}
        </div>
        {getModelsListByProvider(AIProvider.MISTRAL)}
      </div>
    </div>
  )
}
