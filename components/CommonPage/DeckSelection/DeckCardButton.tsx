import React, { useState } from 'react'
import {
    ReceivedDeck,
} from '@/MyLib/UtilsAPITyping'
interface DeckCardButtonProps {
    deck: ReceivedDeck
    // setSelectedDeckId: React.Dispatch<React.SetStateAction<string>>
}
import { MySelect } from '@/Basics'


const mainDivClass = 'flex flex-row items-center flex-wrap justify-center w-full rounded-xl p-1 m-1'
const divClass = 'flex flex-col flex-wrap justify-center w-8/12 bg-blue-200 rounded-xl p-4 m-4'
const buttonClass = 'bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-fit w-fit'
export default function DeckCardButton({ deck }: DeckCardButtonProps) {
    const [modeTime, setModeTime] = useState<1 | 2 | 3 | 5>(1)

    const handleClick = () => {
        const url = `/typing/typing?deckid=${deck.deck_id}&minutes=${modeTime}`;
        window.location.href = url;
    }

    return (
        <div className={mainDivClass}>
            <div key={deck.deck_id} className={divClass}>
                <p>{deck.title}</p>
                <hr className="my-0.5 border-t border-white" />
                <p>{deck.description}</p>
            </div>
            <MySelect
                state={modeTime}
                setState={setModeTime}
                optionValues={[1, 2, 3, 5]}
                optionTexts={['1m', '2m', '3m', '5m']}
            />

            <button className={buttonClass} onClick={handleClick}>START</button>
        </div>
    )
}
