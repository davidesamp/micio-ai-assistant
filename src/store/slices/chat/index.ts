import { lens } from '@dhmk/zustand-lens'
import { ChatStoreSlice, DefaultChatValues } from './types'
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
    newAddMessage: (passedMessage) => {
      const currentMessages = get().messages
      const findMessage = currentMessages.find((msg) => msg.id === passedMessage.id)
      if (findMessage) {
        let currentText = findMessage.message
        const newText = currentText += passedMessage.message
        const updatedMessages = currentMessages.map((msg) =>
          msg.id === passedMessage.id ? { ...msg, message: newText } : msg
        )
        set((draft) => {
          draft.messages = updatedMessages
        })
      } else {
        const newList = [...currentMessages, passedMessage]
        set((draft) => {
          draft.messages = newList
        })


        const selectedModel = get().selectedModel

        if (selectedModel) setChatHistory(selectedModel, newList)
      }
     

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