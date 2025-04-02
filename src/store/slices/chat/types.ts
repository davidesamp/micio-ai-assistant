import { GoogleGenAI } from '@google/genai'
import { Mistral } from '@mistralai/mistralai'
import OpenAI from 'openai'
import { ContentTypes, Message } from '../../../model/chat'

interface addMessagePayload {
  statement: string
  generatedContent: { content: string; type: ContentTypes }
}

interface Actions {
  setGeminiInstance: (instance: GoogleGenAI) => void
  setDeepSeekInstance: (instance: OpenAI) => void
  setMistralInstance: (instance: Mistral) => void
  addMessage: (payload: addMessagePayload) => void
}

export interface DefaultChatValues {
  messages: Message[]
  geminiInstance: GoogleGenAI | null
  deepSeekInstance: OpenAI | null 
  mistralInstance: Mistral | null 
}

export interface ChatStoreSlice extends DefaultChatValues {
  actions: Actions
}



