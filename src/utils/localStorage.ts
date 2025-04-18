import { localstorage_prefix } from './constants'
import { Model } from '@/model/ai'
import { Message, MicioChat } from '@/model/chat'


const saveList = (key: string, list: MicioChat) => {
  localStorage.setItem(key, JSON.stringify(list))
}

// const getList = (key: string): string[] => {
//   return JSON.parse(localStorage.getItem(key) || '[]');
// }

const getItemsWithPrefix = (prefix: string): Record<string, MicioChat> => {
  const result: Record<string, MicioChat> = {}

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      const value = localStorage.getItem(key)
      try {
        result[key] = JSON.parse(value!) // safely parse JSON values
      } catch {
        result[key] = value ? JSON.parse(value) : [] // fallback to empty array
      }
    }
  }

  return result
}

export const setChatHistory = (model: Model, messages: Message[], chatUid: string) => {
  const finalList = [...messages]
  const chat: MicioChat = {
    uuid: chatUid,
    model: model,
    messages: finalList
  }
  saveList(`${localstorage_prefix}-${chatUid}`, chat)
}

export const getChatHistory = (key: string): MicioChat | null => {
  const toParseChat = localStorage.getItem(key)
  return toParseChat ? JSON.parse(toParseChat) as MicioChat : null
}


export const getChatList = () => {
  const list = getItemsWithPrefix(localstorage_prefix)
  return list
}
