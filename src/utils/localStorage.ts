import { saveChat, getChat, getChatList as getFirebaseChatList } from '@/firebase/chatService'
import { Model } from '@/model/ai'
import { Message, MicioChat } from '@/model/chat'

export const setChatHistory = async (model: Model, messages: Message[], chatUid: string) => {
  await saveChat(model, messages, chatUid)
}

export const getChatHistory = async (key: string): Promise<MicioChat | null> => {
  return await getChat(key)
}

export const getChatList = async (): Promise<Record<string, MicioChat>> => {
  return await getFirebaseChatList()
}
