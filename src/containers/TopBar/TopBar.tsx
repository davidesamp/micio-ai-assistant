import {
  SettingOutlined,
} from '@ant-design/icons'
import { Popover } from 'antd'
import { Typography } from 'antd'
import cx from 'classnames'
import React from 'react'
import styles from './TopBar.module.scss'
import useGenerateContent from '@/hooks/useGenerateContent'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'
import {  ModelsList } from '@/utils/constants'


const TopBar = () => {

  const {
    chat: {
      selectedModel
    },
    ui: { currentAiProvider },
  } = useMicioStore()

  const { changeModel } = useGenerateContent()

  const { Title } = Typography

  const getModelsListByProvider = (provider: AIProvider) => {
    const models = ModelsList.filter((model) => model.provider === provider)
    return models.map((model) => (
      <p 
        onClick={() => changeModel(model)} 
        className={cx(styles.PopoverItem, {[styles.Selected]: selectedModel?.name === model.name})} 
        key={model.name}>
          {model.name}
      </p>
    ))
  }

  const popoverContent = (
    <div className={styles.PopoverContent}>
      <Title level={4}>Gemini</Title>
      <div>
        {getModelsListByProvider(AIProvider.GEMINI)}
      </div>
      <Title level={4}>OpenAI</Title>
      <div>
        {getModelsListByProvider(AIProvider.OPENAI)}
      </div>
      <Title level={4}>DeepSeek</Title>
      <div>
        {getModelsListByProvider(AIProvider.DEEPSEEK)}
      </div>
      <Title level={4}>Mistral</Title>
      <div>
        {getModelsListByProvider(AIProvider.MISTRAL)}
      </div>
    </div>
  )

  return (
    <div className={styles.Container}>
      {currentAiProvider && (
        <div className={styles.SettingsContainer}>
          <Title level={5} className={styles.ProviderTitle}>
            {selectedModel?.name || 'Select a model'}
          </Title>
          <Popover placement="bottomLeft" content={popoverContent} trigger="click" showArrow={false}>
            <div className={styles.SettingsIcon}>
              <SettingOutlined/>
            </div>
          </Popover>
          </div>
      )}
      
    </div>
  )
}

export default TopBar