import React from 'react'
import { langDict, DeckCard } from './'
import {
    ReceivedDeck,
} from '@/MyLib/UtilsAPITyping'



interface DeckListProps {
    deckList: ReceivedDeck[]
}




export default function DeckList({ deckList }: DeckListProps) {
    return (
        <>
            {deckList.map(deck => (
                <DeckCard deck={deck} />

            ))}
        </>
    )
}
