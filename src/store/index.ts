import { withLenses } from '@dhmk/zustand-lens'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { chat } from './slices/chat'
import { ui } from './slices/ui'
import { Store } from './types'

export const useMicioStore: () => Store = create<Store>()(
  immer(
    // @ts-expect-error TODO fix this type error
    withLenses(() => ({
      ui,
      chat
    })),
  ),
)