import React from 'react'
import {
    ReceivedDeck,
} from '@/MyLib/UtilsAPITyping'
interface DeckCardProps {
    deck: ReceivedDeck
}

const divClass = 'flex flex-col flex-wrap justify-center w-8/12 bg-blue-200 rounded-xl p-4 m-4'
const buttonClass = 'bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-fit w-3/12'
export default function DeckCard({ deck }: DeckCardProps) {
    return (
        <div className="flex flex-row flex-wrap justify-center w-full rounded-xl p-4 m-4">
            <div key={deck.deck_id} className={divClass}>
                <p>{deck.title}</p>
                <p>{deck.description}</p>
                <p>Mode: 1m, 2m 3m 5m</p>
            </div>
            <button className={buttonClass} onClick={() => { }}>START</button>
        </div>
    )
}
