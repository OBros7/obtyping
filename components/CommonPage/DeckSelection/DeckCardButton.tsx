import React, { useState } from 'react'
import {
    ReceivedDeck,
} from '@/MyLib/UtilsAPITyping'
interface DeckCardButtonProps {
    deck: ReceivedDeck
    // setSelectedDeckId: React.Dispatch<React.SetStateAction<string>>
    setLanguage: React.Dispatch<React.SetStateAction<'waiting' | 'ready' | 'setting' | 'running' | 'result'>>

}
import { MySelect } from '@/Basics'


const mainDivClass = 'flex flex-row items-center flex-wrap justify-center w-5/6 rounded-xl m-1 my-4 border-solid border-4 border-blue-200'
const divClass = 'flex flex-col flex-wrap justify-center w-8/12 rounded-xl p-8'
const buttonClass = 'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded h-fit w-fit'
const titleClass = 'text-2xl font-bold'
const descriptionClass = 'text-sm text-gray-500 pt-4'
export default function DeckCardButton({ deck }: DeckCardButtonProps) {
    const [modeTime, setModeTime] = useState<1 | 2 | 3 | 5>(1)

    const handleClick = () => {
        const url = `/typing/typing?deckid=${deck.deck_id}&minutes=${modeTime}&lang=${deck.lang1_int}`;
        window.location.href = url;
        // setLanguage(deck.lang1_int)
    }

    return (
        <div className={mainDivClass}>
            <div key={deck.deck_id} className={divClass}>
                <div className={titleClass}>{deck.title}</div>
                {/* <hr className="my-0.5 border-t border-white" /> */}
                <div className={descriptionClass}>{deck.description}</div>
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
