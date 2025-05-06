import { lens } from '@dhmk/zustand-lens'
import { Store } from '../../types'
import { DefaultUserValues, UserStoreSlice } from './types'

const uiInitialValues: DefaultUserValues = {
  loggedUser: null,
  aiSettings: {
    prompt: `You are a helpful assistant and today is ${new Date()}`,
    temperature: 1.0,
  }
}

export const user = lens<UserStoreSlice, Store>(set => ({
  ...uiInitialValues,
  actions: {
    setUser: (user) => {
      set(draft => {
        draft.loggedUser = user
      })
    },
    setAISettings: (settings) => {
      set(draft => {
        draft.aiSettings = settings
      })
    }
  }
}))