import { AIProvider } from '@/model/ui'

interface Actions {
  setAiProvider: (provider: AIProvider) => void
}

export interface DefaultUIValues {
  currentAiProvider: AIProvider | null
}

export interface UIStoreSlice extends DefaultUIValues {
  actions: Actions
}



