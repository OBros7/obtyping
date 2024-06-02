import React from 'react'
import { langDict, DeckCardButton } from '.'
import {
    ReceivedDeck,
} from '@/MyLib/UtilsAPITyping'


interface DeckListProps {
    deckList: ReceivedDeck[]
    setLanguage?: React.Dispatch<React.SetStateAction<'not selected' | 'japanese' | 'english' | 'free'>>
    // setSelectedDeckId: React.Dispatch<React.SetStateAction<string>>
}




export default function DeckList({ deckList, setLanguage }: DeckListProps) {
    return (
        <>
            {deckList.map(deck => (
                <DeckCardButton
                    key={deck.deck_id} // key プロパティを追加
                    deck={deck}
                    setLanguage={setLanguage} // setLanguage プロパティを渡す
                />
            ))}
        </>
    )
}
