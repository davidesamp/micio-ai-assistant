import { 
  getApisConfig as getFirebaseApisConfig,
  saveApis as saveFirebaseApisConfig,
} from '@/firebase/apiService'
import { 
  saveChat, 
  getChat, 
  getChatList as getFirebaseChatList,
} from '@/firebase/chatService'

import { Model } from '@/model/ai'
import { Message, MicioChat } from '@/model/chat'
import { AIProvider } from '@/model/ui'

export const setChatHistory = async (model: Model, messages: Message[], chatUid: string) => {
  await saveChat(model, messages, chatUid)
}

export const getChatHistory = async (key: string): Promise<MicioChat | null> => {
  return await getChat(key)
}

export const getChatList = async (): Promise<Record<string, MicioChat>> => {
  return await getFirebaseChatList()
}

export const getApisConfig = async (): Promise<Record<AIProvider, string> | null> => {
  return await getFirebaseApisConfig()
}
export const saveApisConfig = async (apiConfig: Record<AIProvider, string>) => {
  return await saveFirebaseApisConfig(apiConfig)
}
