import { AIProvider } from '@/model/ui'

interface Actions {
  // eslint-disable-next-line no-unused-vars
  setAiProvider: (provider: AIProvider) => void
  openConfigModal: () => void
  closeConfigModal: () => void
  openSettingsModal: () => void
  closeSettingsModal: () => void
}

export interface DefaultUIValues {
  currentAiProvider: AIProvider | null
  configModalOpen: boolean
  settingsModalOpen: boolean
}

export interface UIStoreSlice extends DefaultUIValues {
  actions: Actions
}



