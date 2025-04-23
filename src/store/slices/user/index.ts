import { lens } from '@dhmk/zustand-lens'
import { Store } from '../../types'
import { DefaultUserValues, UserStoreSlice } from './types'

const uiInitialValues: DefaultUserValues = {
  loggedUser: null
}

export const user = lens<UserStoreSlice, Store>(set => ({
  ...uiInitialValues,
  actions: {
    setUser: (user) => {
      set(draft => {
        draft.loggedUser = user
      })
    }
  }
}))