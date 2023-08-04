import React, { useEffect, useState } from 'react'
import {
    ReceivedText,
    getTextListByDeck,
} from '@/MyLib/UtilsAPITyping'

interface TypingProps {
    deckId: number
    minutes: number
}

export default function Typing({ deckId, minutes }: TypingProps) {
    const [textList, setTextList] = useState<ReceivedText[]>([])

    // Call the getTextListByDeck function when the component is mounted
    useEffect(() => {
        async function fetchTextList() {
            const receivedTexts = await getTextListByDeck(deckId, 10, 'title')
            setTextList(receivedTexts)
        }
        console.log('deckId', deckId, 'minutes', minutes)
        fetchTextList()
    }, [])

    useEffect(() => {
        console.log(textList)
    }, [textList])

    return (
        <div>
            {/* Show text.text11 inside of textList */}
            <p>Minutes: {minutes}</p>
            <p>Text List: </p>
            {textList.map((text, index) => (
                <p key={index}>{text.text11}</p>
            ))}
        </div>
    )
}
