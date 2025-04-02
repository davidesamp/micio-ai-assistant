import { ChatStoreSlice } from './slices/chat/types'
import { UIStoreSlice } from './slices/ui/types'

export interface Store {
  chat: ChatStoreSlice
  ui: UIStoreSlice
}