import React from 'react'

interface DeckCardProps {
    deckName: string
    deckDescription: string
}

const divClass1 = 'flex flex-row flex-wrap justify-center w-11/12 bg-blue-200 rounded-xl p-4 m-4'

export default function DeckCard({ deckName, deckDescription }: DeckCardProps) {
    return (
        <div className={divClass1}>
            <p>{deckName}</p>
            <p>{deckDescription}</p>
        </div>
    )
}
