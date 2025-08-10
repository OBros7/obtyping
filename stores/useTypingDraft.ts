import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface DraftText {
  name: string
  content: string
}
interface DraftState {
  deckName: string
  texts: DraftText[]
}
interface DraftStore {
  draft: DraftState | null
  setDraft: (d: DraftState) => void
  clearDraft: () => void
}

export const useTypingDraft = create<DraftStore>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (d) => set({ draft: d }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'typing-draft',
      storage: createJSONStorage(() => sessionStorage), // ★ これで OK
      // localStorage を使いたい場合は (() => localStorage)
    }
  )
)
