import { ChatStoreSlice } from './slices/chat/types'
import { UIStoreSlice } from './slices/ui/types'
import { UserStoreSlice } from './slices/user/types'

export interface Store {
  chat: ChatStoreSlice
  user: UserStoreSlice
  ui: UIStoreSlice
}