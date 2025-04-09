import { Chat, GoogleGenAI } from '@google/genai'
import { Mistral } from '@mistralai/mistralai'
import OpenAI from 'openai'
import { GeneratedContent, Message } from '../../../model/chat'
import { Model } from '@/model/ai'

interface addMessagePayload {
  statement: string
  generatedContent: GeneratedContent[]
}

interface Actions {
  setGeminiInstance: (instance: GoogleGenAI) => void
  setCurrentChat: (chat: Chat) => void
  setDeepSeekInstance: (instance: OpenAI) => void
  setMistralInstance: (instance: Mistral) => void
  addMessage: (payload: addMessagePayload) => void
  setModel: (model: Model) => void
  resetMessages: () => void
}

export interface DefaultChatValues {
  messages: Message[]
  geminiInstance: GoogleGenAI | null
  deepSeekInstance: OpenAI | null 
  mistralInstance: Mistral | null 
  currentChat: Chat | null
  selectedModel: Model | null
}

export interface ChatStoreSlice extends DefaultChatValues {
  actions: Actions
}



