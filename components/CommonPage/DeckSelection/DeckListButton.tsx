import React from 'react'
import { DeckCardButton } from '.'
import { ReceivedDeck } from '@/MyLib/UtilsAPITyping'


interface DeckListProps {
    deckList: ReceivedDeck[]
    showPremiumBadge?: boolean
}

export default function DeckList({ deckList, showPremiumBadge = false }: DeckListProps) {
    return (
        <>
            {deckList.map(deck => (
                <DeckCardButton
                    key={deck.deck_id} // key プロパティを追加
                    deck={deck}
                    showPremiumBadge={showPremiumBadge}
                />
            ))}
        </>
    )
}
