import { lens } from '@dhmk/zustand-lens'
import { Store } from '../../types'
import { DefaultUIValues, UIStoreSlice } from './types'
import { AIProvider } from '@/model/ui'

const uiInitialValues: DefaultUIValues = {
  currentAiProvider: null
}

export const ui = lens<UIStoreSlice, Store>(set => ({
  ...uiInitialValues,
  actions: {
    setAiProvider: (provider: AIProvider) => {
      set(draft => {
        draft.currentAiProvider = provider
      })
    }
  }
}))