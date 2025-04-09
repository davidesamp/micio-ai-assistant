import {
  SettingOutlined,
} from '@ant-design/icons'
import { Popover, Select } from 'antd'
import { Typography } from 'antd'
import React from 'react'
import styles from './TopBar.module.scss'
import useGenerateContent from '@/hooks/useGenerateContent'
import { AIProvider } from '@/model/ui'
import { useMicioStore } from '@/store'
import {  ModelsList } from '@/utils/constants'

interface TopBarProps {
  onProviderChange: (provider: AIProvider) => void
}

const TopBar = ({ onProviderChange }: TopBarProps) => {

  const {
    ui: { currentAiProvider },
  } = useMicioStore()

  const { changeModel } = useGenerateContent()

  const { Title } = Typography

  const handleProviderChange = (provider: AIProvider) => {
    onProviderChange(provider as AIProvider)
  }

  const items = [
    {
      value: 'Gemini',
      key: AIProvider.GEMINI,
    },
    {
      value: 'Deepseek',
      key: AIProvider.DEEPSEEK,
    },
    {
      value: 'Mistral',
      key: AIProvider.MISTRAL,
    },
  ]



  const getModelsListByProvider = (provider: AIProvider) => {
    const models = ModelsList.filter((model) => model.provider === provider)
    return models.map((model) => (
      <p onClick={() => changeModel(model)} className={styles.PopoverItem} key={model.name}>{model.name}</p>
    ))
  }

  const popoverContent = (
    <div className={styles.PopoverContent}>
      <Title level={4}>Gemini</Title>
      <div>
        {getModelsListByProvider(AIProvider.GEMINI)}
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
      <Select
        placeholder="Select AI Provider"
        style={{ width: 200 }}
        onChange={handleProviderChange}
      >
        {items.map((item) => (
          <Select.Option key={item.key} value={item.key}>
            {item.value}
          </Select.Option>
        ))}

      </Select>
      {currentAiProvider && (
        <Popover placement="bottomLeft" content={popoverContent} trigger="click" showArrow={false}>
          <div className={styles.SettingsIcon}>
            <SettingOutlined />
          </div>
        </Popover>
      )}
      
    </div>
  )
}

export default TopBar