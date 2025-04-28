import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'
import { db } from './config'
import { auth } from './config'
import { AIProvider } from '@/model/ui'

const API_COLLECTION = 'apis'

export const saveApis = async (apiConfig: Record<AIProvider, string>) => {
   const user = auth.currentUser
    if (!user) {
     console.error('User must be authenticated to save apis')
     return
    }


  const apisRef = doc(db, API_COLLECTION, user.uid)

  const apisData = {
    config: apiConfig, 
    userId: user.uid,
    createdAt: new Date(),
  }

  await setDoc(apisRef, apisData)   
}

export const getApisConfig = async (): Promise<Record<AIProvider, string> | null> => {
  const user = auth.currentUser
  if (!user) {
    console.error('User must be authenticated to get apis')
    return null
  }

  const apisRef = doc(db, API_COLLECTION, user.uid)
  const apiDoc = await getDoc(apisRef)

  console.log('API DOC', apiDoc)
  
  if (!apiDoc.exists()) {
    console.error('No apis data found for the user')
    return null
  }

  const apiData = apiDoc.data()
  console.log('API DATA', apiData)
  if (apiData.userId !== user.uid) {
    console.error('Unauthorized access to apis data')
  }

  return apiData.config as Record<AIProvider, string>
}