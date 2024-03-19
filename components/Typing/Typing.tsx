import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { TypingPageBase, ReadyScreen, langDict } from './'
import { creteRandomDeck } from './UtilsTyping'
import {
    ReceivedText,
    getTextListByDeck,
} from '@/MyLib/UtilsAPITyping'
import { useTranslation } from '@/MyCustomHooks'
import { ResultDefault } from '@/CommonPage/Result'

interface TypingProps {
    deckId: number
    minutes: number
}


export default function Typing({ deckId, minutes }: TypingProps) {
    const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
    const [textList, setTextList] = useState<ReceivedText[]>([])
    const [status, setStatus] = useState<'waiting' | 'ready' | 'setting' | 'running' | 'result'>('waiting')
    const [score, setScore] = useState(0)
    const [mistake, setMistake] = useState(0)
    const [languageType, setLanguageType] = useState<'eg' | 'jp' | 'free'>('free')
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
            if (receivedTexts.length > 0) {
                setStatus('waiting');
            }
        }

        console.log('deckId', deckId, 'minutes', minutes);
        fetchTextList();
    }, [deckId, minutes]);

    useEffect(() => {
        console.log('textlist', textList)
    }, [textList])

    useEffect(() => {
        const handleSpacePress = (event: KeyboardEvent) => {
            if (event.code === "Space" && status === 'waiting') {
                setStatus('ready');
            }
        };

        window.addEventListener('keydown', handleSpacePress);

        return () => {
            window.removeEventListener('keydown', handleSpacePress);
        };
    }, [status, setStatus]);

    return (
        <Layout>
            <MainContainer addClass='p-4'>
                <button
                    onClick={() => setStatus(status === "running" ? "result" : "running")}
                    className='btn-second'
                >Toggle Status</button>

                {status === 'waiting' ? (
                    <div className="w-full text-center text-5xl mt-48 mb-48">
                        {translater.pleasePressSpace}
                    </div>
                ) : status === 'ready' ? (
                    <div className="w-full text-center text-5xl mt-48 mb-48">
                        <ReadyScreen
                            status={status}
                            setStatus={setStatus}
                        />
                    </div>
                ) : status === 'running' ?
                    <>
                        {/* <div>
                            <p>Minutes: {minutes}</p>
                            <p>Text List: </p>
                            Check if textList is not empty before mapping
                            {textList && textList.length > 0 && textList.map((text, index) => (
                                <p key={index}>{text.text11}</p>
                            ))}
                        </div> */}

                        {textList && textList.length > 0 && (
                            <TypingPageBase
                                textList={textList}
                                status={status}
                                setStatus={setStatus}
                                score={score}
                                setScore={setScore}
                                mistake={mistake}
                                setMistake={setMistake}
                                languageType={languageType}
                                mode={mode}
                            />
                        )}
                    </>
                    :
                    <ResultDefault
                        // urlPost={'/api/typing/post'}
                        // urlGet={'/api/typing/get'}
                        deckId={deckId}
                        minutes={minutes}
                        record={score}
                        unit={'wpm'}
                        resultBoxText={'Your typing speed is '}
                        handlePlayAgain={() => setStatus('running')}
                        handleBackToStart={() => setStatus('waiting')}
                        higherBetter={true}
                    />

                }
            </MainContainer>
        </Layout>
    )
}
