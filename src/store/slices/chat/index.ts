import { lens } from '@dhmk/zustand-lens'
import { GoogleGenAI } from '@google/genai'
import { Mistral } from '@mistralai/mistralai'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'
import { ChatStoreSlice, DefaultChatValues } from './types'
import { ContentTypes, Message } from '@/model/chat'
import { AIProvider } from '@/model/ui'
import { Store } from '@/store/types'

const chatInitialValues: DefaultChatValues = {
  messages: [],
  deepSeekInstance: null,
  mistralInstance: null,
  geminiInstance: null,
  currentChat: null,
  //TODO init based on user selection
  selectedModel: { name: 'gemini-2.0-flash-exp-image-generation', provider: AIProvider.GEMINI }, 
}

export const chat = lens<ChatStoreSlice, Store>((set, get) => ({
  ...chatInitialValues,
  actions: {
    addMessage: ({ statement, generatedContent }) => {
      const question: Message = {
        id: uuidv4(),
        sender: 'model',
        message: statement,
        type: ContentTypes.TEXT,
      }

      const receivedMessages: Message[] = generatedContent.map((message) => ({
        id: uuidv4(),
        sender: 'user',
        message: message.content,
        type: message.type,
      }))

      const currentMessages = get().messages
      set((draft) => {
        draft.messages = [...currentMessages, question, ...receivedMessages]
      })
    },
    setGeminiInstance: (instance: GoogleGenAI) => {
      set((draft) => {
        draft.geminiInstance = instance
      })
    },
    setDeepSeekInstance: (instance: OpenAI) => {
      set((draft) => {
        draft.deepSeekInstance = instance
      })
    },
    setMistralInstance: (instance: Mistral) => {
      set((draft) => {
        draft.mistralInstance = instance
      })
    },
    setCurrentChat: (chat) => {
      set((draft) => {
        draft.currentChat = chat
      })
    },
    setModel: (model) => {
      set((draft) => {
        draft.selectedModel = model
      })
    },
    resetMessages: () => {
      set((draft) => {
        draft.messages = []
      })
    }
  }
}))