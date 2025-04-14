import { Chat } from '@google/genai'
import { GeneratedContent, Message } from '../../../model/chat'
import { Model } from '@/model/ai'

interface addMessagePayload {
  statement: string
  generatedContent: GeneratedContent[]
}

interface Actions {
  setCurrentChat: (chat: Chat) => void
  addMessage: (payload: addMessagePayload) => void
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



