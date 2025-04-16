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
  resetMessages: () => void
}

export interface DefaultChatValues {
  messages: Message[]
  currentChat: Chat | null
  selectedModel: Model | null
}

export interface ChatStoreSlice extends DefaultChatValues {
  actions: Actions
}



