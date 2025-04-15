import { lens } from '@dhmk/zustand-lens'
import { v4 as uuidv4 } from 'uuid'
import { ChatStoreSlice, DefaultChatValues } from './types'
import { ContentTypes, Message } from '@/model/chat'
import { Store } from '@/store/types'
import { setChatHistory } from '@/utils/localStorage'

const chatInitialValues: DefaultChatValues = {
  messages: [],
  currentChat: null,
  selectedModel: null, 
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
      const newList = [...currentMessages, question, ...receivedMessages]
      set((draft) => {
        draft.messages = newList
      })

      const selectedModel = get().selectedModel

      if (selectedModel) setChatHistory(selectedModel, newList)
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