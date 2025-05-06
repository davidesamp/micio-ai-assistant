import { v4 as uuidv4 } from 'uuid'
import { Model } from '@/model/ai'
import { Message, MicioChat } from '@/model/chat'

const LOCAL_STORAGE_KEY = 'chats'

/**
 * Helper to load all chats from localStorage
 */
function loadChats(): Record<string, MicioChat> {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!raw) return {}

  try {
    return JSON.parse(raw) as Record<string, MicioChat>
  } catch (err) {
    console.error('Failed to parse localStorage chats', err)
    return {}
  }
}

/**
 * Helper to persist all chats to localStorage
 */
function saveChats(chats: Record<string, MicioChat>) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chats))
  } catch (err) {
    console.error('Failed to save chats to localStorage', err)
  }
}

/**
 * Save a chat to localStorage by UUID
 */
export async function saveChat(
  model: Model,
  messages: Message[],
  chatUid: string
): Promise<void> {
  const chats = loadChats()

  const chat: MicioChat = {
    uuid: chatUid,
    model,
    messages,
    userId: uuidv4(), // no auth, fallback
    createdAt: { seconds: Math.floor(Date.now() / 1000) },
  }

  chats[chatUid] = chat
  saveChats(chats)
}

/**
 * Retrieve a single chat by UUID from localStorage
 */
export async function getChat(
  chatUid: string
): Promise<MicioChat | null> {
  const chats = loadChats()
  return chats[chatUid] || null
}

/**
 * Retrieve all chats stored in localStorage, ordered by createdAt desc
 */
export async function getChatList(): Promise<Record<string, MicioChat>> {
  const chats = loadChats()
  // convert to array, sort, then back to record
  const sortedEntries = Object.entries(chats).sort(([, a], [, b]) => {
    const aTs = (a.createdAt?.seconds ?? 0)
    const bTs = (b.createdAt?.seconds ?? 0)
    return bTs - aTs
  })

  return sortedEntries.reduce((acc, [key, chat]) => {
    acc[key] = chat
    return acc
  }, {} as Record<string, MicioChat>)
}