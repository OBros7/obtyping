import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  updateDeck,
  updateText,
  deleteDeck as apiDeleteDeck,
  deleteText as apiDeleteText,
  PostDeck,
  PostText,
  UpdateDeckPayload,
  UpdateTextPayload,
} from '@/MyLib/UtilsAPITyping'
import { showSuccess, showError } from 'utils/toast'

// 呼び出し側が userId / deckId をくれる前提で型を明示
type UpdateDeckVars = {
  id: number
  data: Partial<PostDeck>
  userId?: number | null
}
type UpdateTextVars = {
  id: number
  data: Partial<Omit<PostText, 'deck_id'>>
  deckId: number
}
type DeleteDeckVars = { deckId: number; userId?: number | null }
type DeleteTextVars = { textId: number; deckId: number }

export function useDeckMutations() {
  const qc = useQueryClient()

  // 互換のため、古いキー/新しいキーどちらも触る
  const invalidateDecks = (userId?: number | null) => {
    if (userId != null) {
      qc.invalidateQueries({ queryKey: ['decks', userId] })
    } else {
      qc.invalidateQueries({ queryKey: ['decks'] })
    }
  }
  const invalidateTextsByDeck = (deckId: number) => {
    qc.invalidateQueries({ queryKey: ['textsByDeck', deckId] })
    qc.invalidateQueries({ queryKey: ['deckTexts', deckId] }) // 旧キー互換
  }

  const mutUpdateDeck = useMutation({
    // ★ 変更点：URL パラメータではなく body に deck_id を入れて送る
    mutationFn: ({ id, data }: UpdateDeckVars) => updateDeck({ ...(data ?? {}), deck_id: id } as UpdateDeckPayload),
    onSuccess: (_res, vars) => {
      invalidateDecks(vars.userId)
      qc.invalidateQueries({ queryKey: ['deck', vars.id] })
      showSuccess('デッキを更新しました')
    },
    onError: (e: any) => showError(e?.message ?? 'デッキ更新に失敗しました'),
  })

  const mutUpdateText = useMutation({
    // ★ 変更点：body に text_id を入れて送る
    mutationFn: ({ id, data }: UpdateTextVars) => updateText({ ...(data ?? {}), text_id: id } as UpdateTextPayload),
    onSuccess: (_res, vars) => {
      invalidateTextsByDeck(vars.deckId)
      qc.invalidateQueries({ queryKey: ['text', vars.id] })
      showSuccess('テキストを更新しました')
    },
    onError: (e: any) => showError(e?.message ?? 'テキスト更新に失敗しました'),
  })

  const mutDeleteDeck = useMutation({
    mutationFn: ({ deckId }: DeleteDeckVars) => apiDeleteDeck(deckId),
    onSuccess: (_res, vars: DeleteDeckVars) => {
      invalidateDecks(vars.userId)
      // 当該デッキ配下のキャッシュ掃除（互換キーも）
      qc.removeQueries({ queryKey: ['textsByDeck', vars.deckId] })
      qc.removeQueries({ queryKey: ['deckTexts', vars.deckId] })
      showSuccess('デッキを削除しました')
    },
    onError: (e: any) => showError(e?.message ?? 'デッキ削除に失敗しました'),
  })

  const mutDeleteText = useMutation({
    mutationFn: ({ textId }: DeleteTextVars) => apiDeleteText(textId),
    onSuccess: (_res, vars: DeleteTextVars) => {
      invalidateTextsByDeck(vars.deckId)
      showSuccess('テキストを削除しました')
    },
    onError: (e: any) => showError(e?.message ?? 'テキスト削除に失敗しました'),
  })

  return { mutUpdateDeck, mutUpdateText, mutDeleteDeck, mutDeleteText }
}
