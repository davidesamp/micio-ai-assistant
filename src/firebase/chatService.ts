import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  query, 
  where,
  orderBy,
  Timestamp,
  deleteDoc
} from 'firebase/firestore'
import { db } from './config'
import { auth } from './config'
import { Model } from '@/model/ai'
import { Message, MicioChat } from '@/model/chat'

const CHATS_COLLECTION = 'chats'

export const saveChat = async (model: Model, messages: Message[], chatUid: string) => {
  const user = auth.currentUser
  if (!user) {
   console.error('User must be authenticated to save chats')
   return
  }

  const chat: MicioChat = {
    uuid: chatUid,
    model: model,
    messages: messages,
    userId: user.uid,
    createdAt: Timestamp.now()
  }

  const chatRef = doc(db, CHATS_COLLECTION, chatUid)
  await setDoc(chatRef, chat)
}

export const getChat = async (chatUid: string): Promise<MicioChat | null> => {
  const user = auth.currentUser
  if (!user) {
    console.error('User must be authenticated to get chats')
    return null
  }

  const chatRef = doc(db, CHATS_COLLECTION, chatUid)
  const chatDoc = await getDoc(chatRef)

  if (!chatDoc.exists()) {
    return null
  }

  const chatData = chatDoc.data()
  if (chatData.userId !== user.uid) {
    console.error('Unauthorized access to chat')
  }

  return chatData as MicioChat
}

export const getChatList = async (): Promise<Record<string, MicioChat>> => {
  const user = auth.currentUser
  if (!user) {
    console.error('User must be authenticated to get chat list')
    return {}
  }

  const chatsQuery = query(
    collection(db, CHATS_COLLECTION),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  )

  const querySnapshot = await getDocs(chatsQuery)
  const chats: Record<string, MicioChat> = {}

  querySnapshot.forEach((doc) => {
    chats[doc.id] = doc.data() as MicioChat
  })

  return chats
}

export const deleteChat = async (chatId: string): Promise<void> => {
  const user = auth.currentUser
  if (!user) {
    console.error('User must be authenticated to delete chats')
    return
  }
  const chatRef = doc(db, 'chats', chatId)
  await deleteDoc(chatRef)
}