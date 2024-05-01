import React from 'react'
import { langDict, DeckCardButton } from '.'
import {
    ReceivedDeck,
} from '@/MyLib/UtilsAPITyping'


interface DeckListProps {
    deckList: ReceivedDeck[]
    // setSelectedDeckId: React.Dispatch<React.SetStateAction<string>>
}




export default function DeckList({ deckList }: DeckListProps) {
    return (
        <>
            {deckList.map(deck => (
                <DeckCardButton
                    deck={deck}
                />
            ))}
        </>
    )
}
