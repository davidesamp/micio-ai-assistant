import { withLenses } from '@dhmk/zustand-lens'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { chat } from './slices/chat'
import { ui } from './slices/ui'
import { user } from './slices/user'
import { Store } from './types'

export const useMicioStore: () => Store = create<Store>()(
  immer(
    withLenses((set, _, store) => ({
      ui,
      chat,
      user,
      global: {
        actions: {
          resetStore: () => {
            set({
              ...store.getInitialState(),
            })
          }
        }
      }
    })),
  ),
)