import { Model } from '@/model/ai'
import { AIProvider } from '@/model/ui'

export const ModelsList: Model[] = [
  {name: 'gemini-2.5-pro-preview-03-25', provider: AIProvider.GEMINI},
  {name: 'gemini-2.0-flash', provider: AIProvider.GEMINI},
  {name: 'gemini-2.0-flash-lite', provider: AIProvider.GEMINI},
  {name: 'gemini-2.0-flash-exp-image-generation', provider: AIProvider.GEMINI},
  {name: 'gemini-1.5-flash', provider: AIProvider.GEMINI},
  {name: 'gemini-1.5-flash-8b', provider: AIProvider.GEMINI},
  {name: 'gemini-1.5-pro', provider: AIProvider.GEMINI},
  {name: 'gemini-embedding-exp', provider: AIProvider.GEMINI},
  {name: 'deepseek-chat', provider: AIProvider.DEEPSEEK},
  {name: 'deepseek-reasoner', provider: AIProvider.DEEPSEEK},
  {name: 'mistral-small-latest', provider: AIProvider.MISTRAL},
  {name: 'open-mistral-nemo', provider: AIProvider.MISTRAL},
  {name: 'gpt-4-turbo-preview', provider: AIProvider.OPENAI},
  {name: 'gpt-4', provider: AIProvider.OPENAI},
  {name: 'gpt-3.5-turbo', provider: AIProvider.OPENAI}
]

export type GeminiModels = Extract<typeof ModelsList[number], { provider: AIProvider.GEMINI }>;
export type DeepSeekModels = Extract<typeof ModelsList[number], { provider: AIProvider.DEEPSEEK }>;
export type MistralModels = Extract<typeof ModelsList[number], { provider: AIProvider.MISTRAL }>;
export type OpenAIModels = Extract<typeof ModelsList[number], { provider: AIProvider.OPENAI }>;


export const localstorage_prefix = 'MICIO-AI';

