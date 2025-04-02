import { Select } from 'antd'
import React from 'react'
import { AIProvider } from '@/model/ui'

interface TopBarProps {
  onProviderChange: (provider: AIProvider) => void
}

const TopBar = ({ onProviderChange }: TopBarProps) => {
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

  return (
    <div>
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
    </div>
  )
}

export default TopBar