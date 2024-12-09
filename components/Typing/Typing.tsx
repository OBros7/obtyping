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
// import { useNavigate } from 'react-router-dom';

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
    const [languageType, setLanguageType] = useState<'english' | 'japanese' | 'free'>('english')
    const [mode, setMode] = useState<'1m' | '2m' | '3m' | '5m'>('1m')
    const [cpm, setCpm] = useState(0)
    const [accuracy, setAccuracy] = useState(0)
    const [recordScore, setRecordScore] = useState(0)

    // let navigate = useNavigate();

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

    useEffect(() => {
        if (status === "result") {
            if (score > 0) {
                console.log('score', score, 'mistake', mistake, 'minutes', minutes)
                const tempCpm = Math.round((score / minutes) * 100) / 100;
                setCpm(tempCpm);
                const calculatedAccuracy = score / (score + mistake);
                // 小数点第二位で四捨五入
                const roundedAccuracy = Math.round(calculatedAccuracy * 100) / 100;
                // %表示のために100倍
                setAccuracy(roundedAccuracy * 100);
            } else {
                setCpm(0);
                setAccuracy(0);
                setRecordScore(0);
            }
        }
    }, [status, score, minutes, mistake]);

    // cpmとaccuracyが更新された後にrecordScoreを更新
    useEffect(() => {
        if (status === "result" && score > 0) {
            setRecordScore(Math.round(cpm * accuracy / 100));
        }
    }, [cpm, accuracy, score, status]);

    const handleReset = () => {
        allReset();
        setStatus('waiting');
    }

    const allReset = () => {
        setScore(0);
        setMistake(0);
        setCpm(0);
        setAccuracy(0);
        setRecordScore(0);
    }

    // const handleBackToHome = () => {
    //     navigate('/')
    // }

    const handleBackToHome = () => {
        window.location.href = '/';
    }
    return (
        <Layout>
            <MainContainer addClass='p-4'>
                {/* <button
                    onClick={() => setStatus(status === "running" ? "result" : "running")}
                    className='btn-second'
                >Toggle Status</button> */}

                {status === 'waiting' ? (
                    // <div className="w-full text-center text-5xl mt-48 mb-48">
                    <div className="flex w-full justify-center items-center text-center text-5xl h-96">
                        {translater.pleasePressSpace}
                    </div>
                ) : status === 'ready' ? (
                    <div className="flex w-full justify-center items-center text-center text-5xl h-96">
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
                                setLanguageType={setLanguageType}
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
                        record={recordScore}
                        unit={''}
                        resultBoxText={'Your typing speed is '}
                        supplementaryItem1={"Accuracy : "}
                        supplementaryRecord1={accuracy}
                        supplementaryUnit1={"%"}
                        supplementaryItem2={"cpm : "}
                        supplementaryRecord2={cpm}
                        handlePlayAgain={() => handleReset()}
                        handleBackToHome={() => handleBackToHome()}
                        higherBetter={true}
                    />

                }
            </MainContainer>
        </Layout>
    )
}
