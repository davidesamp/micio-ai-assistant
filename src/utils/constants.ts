import { Model } from '@/model/ai'
import { AIProvider } from '@/model/ui'

export const ModelsList: Model[] = [
  {name: 'gemini-2.5-pro-preview-03-25', displayName: '2.5 Flash (Experimental)', provider: AIProvider.GEMINI},
  {name: 'gemini-2.0-flash', displayName: '2.0 Flash', provider: AIProvider.GEMINI},
  {name: 'gemini-1.5-flash', displayName: '1.5 Flash', provider: AIProvider.GEMINI},
  {name: 'gemini-1.5-pro', displayName: '1.5 Pro', provider: AIProvider.GEMINI},
  {name: 'deepseek-chat', displayName: 'DeepSeek Chat', provider: AIProvider.DEEPSEEK},
  {name: 'deepseek-reasoner', displayName: 'DeepSeek Reasoner', provider: AIProvider.DEEPSEEK},
  {name: 'mistral-small-latest', displayName: 'Mistral Small', provider: AIProvider.MISTRAL},
  {name: 'open-mistral-nemo', displayName: 'Open Mistral Nemo', provider: AIProvider.MISTRAL},
  {name: 'gpt-4-turbo-preview', displayName: 'GPT-4 Turbo', provider: AIProvider.OPENAI},
  {name: 'gpt-4', displayName: 'GPT-4', provider: AIProvider.OPENAI},
  {name: 'gpt-3.5-turbo', displayName: 'GPT-3.5 Turbo', provider: AIProvider.OPENAI}
]

export type GeminiModels = Extract<typeof ModelsList[number], { provider: AIProvider.GEMINI }>;
export type DeepSeekModels = Extract<typeof ModelsList[number], { provider: AIProvider.DEEPSEEK }>;
export type MistralModels = Extract<typeof ModelsList[number], { provider: AIProvider.MISTRAL }>;
export type OpenAIModels = Extract<typeof ModelsList[number], { provider: AIProvider.OPENAI }>;


export const localstorage_prefix = 'MICIO-AI'

