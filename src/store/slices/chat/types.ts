import { Chat } from '@google/genai'
import { Message } from '../../../model/chat'
import { Model } from '@/model/ai'

interface Actions {
  // eslint-disable-next-line no-unused-vars
  setCurrentChat: (chat: Chat) => void
  // eslint-disable-next-line no-unused-vars
  newAddMessage: (payload: Message) => void
  // eslint-disable-next-line no-unused-vars
  setModel: (model: Model) => void
  // eslint-disable-next-line no-unused-vars
  setChatUid: (chatId: string) => void
  // eslint-disable-next-line no-unused-vars
  restoreMessages: (messages: Message[]) => void
  resetMessages: () => void
}

export interface DefaultChatValues {
  messages: Message[]
  currentChat: Chat | null
  selectedModel: Model | null
  chatUid: string | null
}

export interface ChatStoreSlice extends DefaultChatValues {
  actions: Actions
}



