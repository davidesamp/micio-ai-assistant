import { auth } from '../firebase/config'
import { 
  getApisConfig as getFirebaseApisConfig,
  saveApis as saveFirebaseApisConfig,
} from '@/firebase/apiService'
import { 
  saveChat, 
  getChat, 
  getChatList as getFirebaseChatList,
  deleteChat as deleteFirebaseChat,
} from '@/firebase/chatService'
import {
  getApisConfig as getLocalStorageApisConfig,
  saveApis as saveLocalStorageApisConfig,
} from '@/localStorage/local-storage-api'
import {
  saveChat as saveLocalStorageChat,
  getChat as getLocalStorageChat,
  getChatList as getLocalStorageChatList,
  deleteChat as deleteLocalStorageChat,
} from '@/localStorage/local-storage-chat'
import { Model } from '@/model/ai'
import { Message, MicioChat } from '@/model/chat'
import { AIProvider } from '@/model/ui'

export const setChatHistory = async (model: Model, messages: Message[], chatUid: string) => {
  if (!auth.currentUser) await saveLocalStorageChat(model, messages, chatUid)
  else await saveChat(model, messages, chatUid)
}

export const getChatHistory = async (key: string): Promise<MicioChat | null> => {
  if (!auth.currentUser) return await getLocalStorageChat(key)
  else return await getChat(key)
}

export const getChatList = async (): Promise<Record<string, MicioChat>> => {
  if (!auth.currentUser) return await getLocalStorageChatList()
  else return await getFirebaseChatList()
}

export const getApisConfig = async (): Promise<Record<AIProvider, string> | null> => {
  if (!auth.currentUser) return await getLocalStorageApisConfig()
  else return await getFirebaseApisConfig()
}

export const saveApisConfig = async (apiConfig: Record<AIProvider, string>) => {
  if (!auth.currentUser) return await saveLocalStorageApisConfig(apiConfig)
  else return await saveFirebaseApisConfig(apiConfig)
}

export const deleteChat = async (chatUid: string) => {
  if (!auth.currentUser) return await deleteLocalStorageChat(chatUid)
  else return await deleteFirebaseChat(chatUid)
}

/*
 * Transfer chats from local storage to firebase
 */
export const transferChats = async () => {
  if (auth.currentUser) {
    const localStorageChats = await getLocalStorageChatList()
    for (const key in localStorageChats) {
      if (localStorageChats[key]) {
        localStorageChats[key].userId = auth.currentUser?.uid || localStorageChats[key].userId
        await saveChat(localStorageChats[key].model, localStorageChats[key].messages, key)
      }
    }

    localStorage.clear()
  }
}
