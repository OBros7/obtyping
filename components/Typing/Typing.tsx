import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { TypingPageBase } from './'
import {
    ReceivedText,
    getTextListByDeck,
} from '@/MyLib/UtilsAPITyping'

interface TypingProps {
    deckId: number
    minutes: number
}


const sampleTextList1 = {
    text_id: 1, // Adding missing field
    title: "Sample Title 1", // Adding missing field
    text11: "Hello World",
    text12: null,
    text21: null,
    text22: null,
    lang1_int: 1,
    visibility_int: 1, // Fixed typo here
    shuffle: true,
}

const sampleTextList2 = {
    text_id: 2, // Adding missing field
    title: "Sample Title 2", // Adding missing field
    text11: "I am happy!",
    text12: null,
    text21: null,
    text22: null,
    lang1_int: 1,
    visibility_int: 1, // Fixed typo here
    shuffle: true,
}


const sampleTextListInput = [sampleTextList1, sampleTextList2]

export default function Typing({ deckId, minutes }: TypingProps) {
    const [textList, setTextList] = useState<ReceivedText[]>([])
    const [status, setStatus] = useState<'menu select' | 'setting' | 'running' | 'result'>('menu select')
    const [score, setScore] = useState(0)
    const [mistake, setMistake] = useState(0)
    const [languageType, setLanguageType] = useState<'eg' | 'jp' | 'free'>('eg')
    const [mode, setMode] = useState<'1m' | '2m' | '3m' | '5m'>('1m')

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
        console.log('textlist', textList)
    }, [textList])

    return (
        <Layout>
            <MainContainer addClass='p-4'>
                <div>
                    {/* Show text.text11 inside of textList */}
                    <p>Minutes: {minutes}</p>
                    <p>Text List: </p>
                    {textList.map((text, index) => (
                        <p key={index}>{text.text11}</p>
                    ))}
                </div>
                <TypingPageBase
                    textList={sampleTextListInput}
                    setStatus={setStatus}
                    score={score}
                    setScore={setScore}
                    mistake={mistake}
                    setMistake={setMistake}
                    languageType={languageType}
                    mode={mode}
                />

            </MainContainer>
        </Layout>

    )
}
