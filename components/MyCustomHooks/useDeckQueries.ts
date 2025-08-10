import { useQuery } from '@tanstack/react-query'
import { getDeckListPrivate, getTextListByDeck, ReceivedText, ReceivedDeck } from '@/MyLib/UtilsAPITyping'

export const useDecks = (userId: number | null) =>
  useQuery<ReceivedDeck[]>({
    queryKey: ['decks', userId],
    queryFn: () => getDeckListPrivate(userId, 100, 'title'),
    enabled: userId !== null,
    refetchOnMount: 'always', // ★ 追加
    refetchOnWindowFocus: true, // お好みで
  })

export const useTextsByDeck = (deckId?: number) =>
  useQuery<ReceivedText[]>({
    queryKey: ['deckTexts', deckId],
    queryFn: () => (deckId ? getTextListByDeck(deckId, 200, 'title') : Promise.resolve([])),
    enabled: !!deckId,
  })
