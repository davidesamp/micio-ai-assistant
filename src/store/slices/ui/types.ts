import { AIProvider, Notiication } from '@/model/ui'

interface Actions {
  // eslint-disable-next-line no-unused-vars
  setAiProvider: (provider: AIProvider) => void
  // eslint-disable-next-line no-unused-vars
  setNotification: (notification: Notiication) =>  void
  clearNotification: () => void
  openConfigModal: () => void
  closeConfigModal: () => void
  openSettingsModal: () => void
  closeSettingsModal: () => void
}

export interface DefaultUIValues {
  currentAiProvider: AIProvider | null
  configModalOpen: boolean
  settingsModalOpen: boolean
  notification: Notiication | null
}

export interface UIStoreSlice extends DefaultUIValues {
  actions: Actions
}



