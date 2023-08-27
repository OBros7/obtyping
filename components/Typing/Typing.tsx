import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { TypingPageBase } from './'
import { creteRandomDeck } from './UtilsTyping'
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
    const [status, setStatus] = useState<'menu select' | 'setting' | 'running' | 'result'>('menu select')
    const [score, setScore] = useState(0)
    const [mistake, setMistake] = useState(0)
    const [languageType, setLanguageType] = useState<'eg' | 'jp' | 'free'>('eg')
    const [mode, setMode] = useState<'1m' | '2m' | '3m' | '5m'>('1m')

    useEffect(() => {
        async function fetchTextList() {
            let receivedTexts: ReceivedText[] = [];

            if (deckId < 0) {
                receivedTexts = creteRandomDeck(deckId, minutes);
            } else {
                receivedTexts = await getTextListByDeck(deckId, 10, 'title');
            }

            setTextList(receivedTexts);
        }

        console.log('deckId', deckId, 'minutes', minutes);
        fetchTextList();
    }, [deckId, minutes]);

    useEffect(() => {
        console.log('textlist', textList)
    }, [textList])

    return (
        <Layout>
            <MainContainer addClass='p-4'>
                <div>
                    <p>Minutes: {minutes}</p>
                    <p>Text List: </p>
                    {/* Check if textList is not empty before mapping */}
                    {textList && textList.length > 0 && textList.map((text, index) => (
                        <p key={index}>{text.text11}</p>
                    ))}
                </div>
                {textList && textList.length > 0 && (
                    <TypingPageBase
                        textList={textList}
                        setStatus={setStatus}
                        score={score}
                        setScore={setScore}
                        mistake={mistake}
                        setMistake={setMistake}
                        languageType={languageType}
                        mode={mode}
                    />
                )}

            </MainContainer>
        </Layout>
    )
}
