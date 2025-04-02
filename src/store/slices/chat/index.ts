import { lens } from '@dhmk/zustand-lens'
import { GoogleGenAI } from '@google/genai'
import { Mistral } from '@mistralai/mistralai'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'
import { ChatStoreSlice, DefaultChatValues } from './types'
import { ContentTypes, Message } from '@/model/chat'
import { Store } from '@/store/types'

const chatInitialValues: DefaultChatValues = {
  messages: [],
  deepSeekInstance: null,
  mistralInstance: null,
  geminiInstance: null,
}

export const chat = lens<ChatStoreSlice, Store>((set, get) => ({
  ...chatInitialValues,
  actions: {
    addMessage: ({ statement, generatedContent }) => {
      const question: Message = {
        id: uuidv4(),
        sender: 'robot',
        message: statement,
        type: ContentTypes.TEXT,
      }

      const { type, content } = generatedContent

      const receivedMessage: Message = {
        id: uuidv4(),
        sender: 'user',
        message: content,
        type: type,
      }
      const currentMessages = get().messages
      set((draft) => {
        draft.messages = [...currentMessages, question, receivedMessage]
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
    resetMessages: () => {
      set((draft) => {
        draft.messages = []
      })
    }
  }
}))