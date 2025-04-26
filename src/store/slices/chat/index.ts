import { lens } from '@dhmk/zustand-lens'
import { ChatStoreSlice, DefaultChatValues } from './types'
import { MicioChat } from '@/model/chat'
import { Store } from '@/store/types'
import { setChatHistory } from '@/utils/localStorage'

const chatInitialValues: DefaultChatValues = {
  messages: [],
  currentChat: null,
  selectedModel: null, 
  chatUid: null,
  chatList: {}
}

export const chat = lens<ChatStoreSlice, Store>((set, get, state) => ({
  ...chatInitialValues,
  actions: {
    newAddMessage: (passedMessage) => {
      const currentMessages = get().messages
      const findMessage = currentMessages.find((msg) => msg.id === passedMessage.id)
      const selectedModel = get().selectedModel
      const chatUid = get().chatUid
      const loggedUser = state.getState().user.loggedUser

      if (findMessage) {
        let currentText = findMessage.message
        const newText = currentText += passedMessage.message
        const updatedMessages = currentMessages.map((msg) =>
          msg.id === passedMessage.id ? { ...msg, message: newText } : msg
        )
        set((draft) => {
          draft.messages = updatedMessages
        })

        if (passedMessage.isLastPart && selectedModel && chatUid && loggedUser) {
          const chat: MicioChat = {
            uuid: chatUid,
            model: selectedModel,
            messages: updatedMessages,
            userId: loggedUser.uid,
            createdAt: new Date()
          }
          setChatHistory(selectedModel, updatedMessages, chatUid)
          get().actions.updateChatList(chat)
        }
      } else {
        const newList = [...currentMessages, passedMessage]
        set((draft) => {
          draft.messages = newList
        })

        if (selectedModel && chatUid && loggedUser) {
          const chat: MicioChat = {
            uuid: chatUid,
            model: selectedModel,
            messages: newList,
            userId: loggedUser.uid,
            createdAt: new Date()
          }
          setChatHistory(selectedModel, newList, chatUid)
          get().actions.updateChatList(chat)
        }
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
    },
    updateChatList: (chat) => {
      set((draft) => {
        if (!draft.chatList) {
          draft.chatList = {}
        }
        draft.chatList[chat.uuid] = chat
      })
    },
    deleteChat: (chatId) => {
      set((draft) => {
        if (draft.chatList) {
          delete draft.chatList[chatId]
        }
      })
    },
    reset: () => {
      set((draft) => {
        draft.messages = []
        draft.currentChat = null
        draft.selectedModel = null
        draft.chatUid = null
        draft.chatList = {}
      })
    }
  }
}))