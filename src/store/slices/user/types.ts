import { User } from 'firebase/auth'
import { AISettings } from '@/model/user'

interface Actions {
  // eslint-disable-next-line no-unused-vars
  setUser: (user: User) => void
  // eslint-disable-next-line no-unused-vars
  setAISettings: (settings: AISettings) => void
}

export interface DefaultUserValues {
  loggedUser: User | null
  aiSettings: AISettings
}

export interface UserStoreSlice extends DefaultUserValues {
  actions: Actions
}
