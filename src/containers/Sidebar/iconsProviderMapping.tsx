import React from 'react'
import DeepSeekIcon from '@/icons/deepseek.svg'
import GeminiIcon from '@/icons/gemini.svg'
import MistralIcon from '@/icons/mistral.svg'
import OpenAIIcon from '@/icons/openai.svg'
import PerplexityIcon from '@/icons/perplexity.svg'
import { AIProvider } from '@/model/ui'

export const iconsProviderMapping = {
  [AIProvider.GEMINI]: {
    icon: <GeminiIcon />,
    alt: 'Gemini',
  },
  [AIProvider.MISTRAL]: {
    icon: <MistralIcon />,
    alt: 'Mistral',
  },
  [AIProvider.DEEPSEEK]: {
    icon: <DeepSeekIcon />,
    alt: 'DeepSeek',
  },
  [AIProvider.OPENAI]: {
    icon: <OpenAIIcon />,
    alt: 'OpenAI',
  },
  [AIProvider.PERPLEXITY]: {
    icon: <PerplexityIcon />,
    alt: 'Perplexity',
  },
}
export type IconsProviderMapping = typeof iconsProviderMapping
export type IconsProviderMappingKey = keyof IconsProviderMapping  