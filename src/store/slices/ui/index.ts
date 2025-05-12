import { lens } from '@dhmk/zustand-lens'
import { Store } from '../../types'
import { DefaultUIValues, UIStoreSlice } from './types'
import { AIProvider } from '@/model/ui'

const uiInitialValues: DefaultUIValues = {
  currentAiProvider: null,
  configModalOpen: false,
  settingsModalOpen: false,
  notification: null,
  currentTheme: localStorage.getItem('theme') === 'light' ? 'light' : 'dark',
}

export const ui = lens<UIStoreSlice, Store>(set => ({
  ...uiInitialValues,
  actions: {
    setAiProvider: (provider: AIProvider) => {
      set(draft => {
        draft.currentAiProvider = provider
      })
    },
    openConfigModal: () => {
      set(draft => {
        draft.configModalOpen = true
      })
    },
    closeConfigModal: () => {
      set(draft => {
        draft.configModalOpen = false
      })
    },
    openSettingsModal: () => {
      set(draft => {
        draft.settingsModalOpen = true
      })
    },
    closeSettingsModal: () => {
      set(draft => {
        draft.settingsModalOpen = false
      })
    },
    setNotification: (notification) => {
      set(draft => {
        draft.notification = notification
      })
    },
    clearNotification: () => {
      set(draft => {
        draft.notification = null
      })
    },
    setTheme: (theme) => {
      set(draft => {
        draft.currentTheme = theme
      })
    },
  }
}))