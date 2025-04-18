import { lens } from '@dhmk/zustand-lens'
import { ChatStoreSlice, DefaultChatValues } from './types'
import { Store } from '@/store/types'
import { setChatHistory } from '@/utils/localStorage'

const chatInitialValues: DefaultChatValues = {
  messages: [],
  currentChat: null,
  selectedModel: null, 
  chatUid: null
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
        const chatUid = get().chatUid

        if (selectedModel && chatUid) setChatHistory(selectedModel, newList, chatUid)
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
    restoreMessages: (messages) => {
      set((draft) => {
        draft.messages = messages
      })
    },
    resetMessages: () => {
      set((draft) => {
        draft.messages = []
      })
    },
    setChatUid: (chatId) => {
      set((draft) => {
        draft.chatUid = chatId
      })
    }
  }
}))