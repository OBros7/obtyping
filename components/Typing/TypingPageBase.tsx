import React, { useEffect, useRef, useState } from 'react'
import {
    TypingEnglish,
    TypingJapanese,
    TypingFree,
    langDict
} from '.'
import { useTranslation } from '@/MyCustomHooks'
import { hms2ms, ms2hms } from '@/MyLib/TimeLib'
import { TimerBase, StopWatchBase } from '@/Timer'
import { ReceivedText } from '@/MyLib/UtilsAPITyping'


interface TypingPageBaseProps {
    textList: ReceivedText[]
    status: 'waiting' | 'ready' | 'setting' | 'running' | 'result'
    setStatus: React.Dispatch<React.SetStateAction<'waiting' | 'ready' | 'setting' | 'running' | 'result'>>
    score: number
    setScore: React.Dispatch<React.SetStateAction<number>>
    mistake: number
    setMistake: React.Dispatch<React.SetStateAction<number>>
    languageType?: 'english' | 'japanese' | 'free'
    setLanguageType?: React.Dispatch<React.SetStateAction<'english' | 'japanese' | 'free'>>
    mode?: '1m' | '2m' | '3m' | '5m'
    mostMistakenKeys: { key: string; count: number }[]
    setMostMistakenKeys: React.Dispatch<React.SetStateAction<{ key: string; count: number }[]>>
}

export default function TypingPageBase({
    textList,
    status,
    setStatus,
    score,
    setScore,
    mistake,
    setMistake,
    languageType,
    setLanguageType,
    mode = '1m',
    mostMistakenKeys,
    setMostMistakenKeys
}: TypingPageBaseProps) {
    const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
    const [timePassed, setTimePassed] = useState(0)

    // for timer base
    const totalTime = hms2ms(0, 10, 0, 0)
    const wataingTime = hms2ms(999, 3, 0, 0)
    const [finished, setFinished] = useState(false)
    const [ticking, setTicking] = useState(true)
    const [reset, setReset] = useState(true)
    const [remainingTime, setRemainingTime] = useState(60)
    const attrsParentTimer = { className: 'flex flex-col items-center justify-center text-5xl' }
    // let timeLimit = hms2ms(0, 7, 0, 0)
    const [timeLimit, setTimeLimit] = useState(hms2ms(0, 0, 1, 0))
    const timeLimitDic: { [key: number]: number } = {
        1: hms2ms(0, 0, 1, 0),
        2: hms2ms(0, 0, 2, 0),
        3: hms2ms(0, 0, 3, 0),
        5: hms2ms(0, 0, 5, 0),
    }

    const languageTypeDic: { [key: number]: 'english' | 'japanese' | 'free' | undefined } = {
        1: 'english',
        2: 'japanese',
        0: 'free'
    }

    // useEffect(() => {// shuffle
    //     console.log('textList', textList, textList[0].text11)
    //     if (textListLength === 0) {
    //       setStatus('menu select')
    //     } else {
    //       // shuffle the list of text and create a list of random sentences
    //       // create a list of random numbers from 1 to textListLength
    //       const randomList = Array.from({ length: textListLength }, (_, i) => i);
    //       // shuffle the list
    //       for (let i = randomList.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [randomList[i], randomList[j]] = [randomList[j], randomList[i]];
    //       }
    //       setOrderList(randomList)
    //       setCurrentTextIndex(randomList[0])
    //     }
    //   }, [])
    const getQueryParameter = (param: string): string | null => {
        const url = new URL(window.location.href);
        return url.searchParams.get(param);
    }

    useEffect(() => {
        const minutes = getQueryParameter('minutes');
        const language = getQueryParameter('lang');

        setTimeLimit(timeLimitDic[Number(minutes)])
        const resolvedLanguageType = language ? languageTypeDic[Number(language)] : undefined;
        if (setLanguageType && resolvedLanguageType) {
            setLanguageType(resolvedLanguageType);
        }

    }, [])

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
        if (timePassed > 3000 && status === 'ready') {
            // statusを'running'に変更
            setStatus('running');
            setReset(!reset); // タイマーをリセット
        }
    }, [finished, timePassed, status, setStatus, setReset, setTimePassed, reset]);

    useEffect(() => {
        setRemainingTime(timeLimit - timePassed);
    }, [timeLimit, timePassed]);

    // useEffect(() => {
    //     if (remainingTime <= 0) {
    //         setStatus('result');
    //     }
    // }, [remainingTime])

    return (
        <>
            {
                status === 'waiting' ? (
                    <div className="w-full text-center text-5xl mt-48 mb-48">
                        {translater.pleasePressSpace}
                    </div>
                ) : status === 'ready' ? (
                    <div className="w-full text-center text-5xl mt-48 mb-48">
                        <TimerBase
                            totalTime={wataingTime}
                            timePassed={timePassed}
                            setTimePassed={setTimePassed}
                            ticking={ticking}
                            reset={reset}
                            finished={finished}
                            setFinished={setFinished}
                            attrsParent={attrsParentTimer}
                            digit={0}
                        />
                    </div>
                ) : status === 'running' ? (
                    <>
                        <div className="w-full text-center text-5xl mt-8 mb-0">
                            <TimerBase
                                // totalTime={totalTime}
                                totalTime={timeLimit}
                                timePassed={timePassed}
                                setTimePassed={setTimePassed}
                                ticking={ticking}
                                reset={reset}
                                finished={finished}
                                setFinished={setFinished}
                                attrsParent={attrsParentTimer}
                            />
                        </div>
                        {languageType === 'english' ? (
                            <TypingEnglish
                                textList={textList}
                                status={status}
                                setStatus={setStatus}
                                score={score}
                                setScore={setScore}
                                mistake={mistake}
                                setMistake={setMistake}
                                languageType={languageType}
                                mode={mode}
                                remainingTime={remainingTime}
                                mostMistakenKeys={mostMistakenKeys}
                                setMostMistakenKeys={setMostMistakenKeys}
                            />
                        )
                            : languageType === 'japanese' ? (
                                <TypingJapanese />
                            ) : (
                                <TypingFree
                                    textList={textList}
                                    setStatus={setStatus}
                                    score={score}
                                    setScore={setScore}
                                    mistake={mistake}
                                    setMistake={setMistake}
                                    languageType={languageType}
                                    mode={mode}
                                    remainingTime={remainingTime}
                                />
                            )
                        }
                    </>
                ) : null
            }
        </>
    )
}
