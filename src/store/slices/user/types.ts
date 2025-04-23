import { User } from 'firebase/auth'

interface Actions {
  // eslint-disable-next-line no-unused-vars
  setUser: (user: User) => void
}

export interface DefaultUserValues {
  loggedUser: User | null
}

export interface UserStoreSlice extends DefaultUserValues {
  actions: Actions
}
