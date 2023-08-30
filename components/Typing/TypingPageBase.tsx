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
    setStatus: React.Dispatch<React.SetStateAction<'menu select' | 'setting' | 'running' | 'result'>>
    score: number
    setScore: React.Dispatch<React.SetStateAction<number>>
    mistake: number
    setMistake: React.Dispatch<React.SetStateAction<number>>
    languageType?: 'eg' | 'jp' | 'free'
    mode?: '1m' | '2m' | '3m' | '5m'
}






export default function TypingPageBase({
    textList,
    setStatus,
    score,
    setScore,
    mistake,
    setMistake,
    languageType,
    mode = '1m',
}: TypingPageBaseProps) {
    const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
    const [timePassed, setTimePassed] = useState(0)



    // for timer base
    const totalTime = hms2ms(0, 10, 0, 0)
    const [finished, setFinished] = useState(false)
    const [ticking, setTicking] = useState(false)
    const [reset, setReset] = useState(true)
    const attrsParentTimer = { className: 'flex flex-col items-center justify-center text-5xl' }


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




    return (
        <>
            <div className="w-full text-center text-5xl mt-8 mb-0">
                <TimerBase
                    totalTime={totalTime}
                    timePassed={timePassed}
                    setTimePassed={setTimePassed}
                    ticking={ticking}
                    reset={reset}
                    finished={finished}
                    setFinished={setFinished}
                    attrsParent={attrsParentTimer}
                />
            </div>
            {languageType === 'eg' ? (
                <TypingEnglish
                    textList={textList}
                    setStatus={setStatus}
                    score={score}
                    setScore={setScore}
                    mistake={mistake}
                    setMistake={setMistake}
                    languageType={languageType}
                    mode={mode}
                />
            )
                : languageType === 'jp' ? (
                    <TypingJapanese />
                ) : (
                    <TypingFree />
                )
            }

        </>
    )
}