import React, { useEffect, useRef, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { langDict } from '.'
import { useTranslation } from '@/MyCustomHooks'
import { hms2ms, ms2hms } from '@/MyLib/TimeLib'
import { TimerBase, StopWatchBase } from '@/Timer'
import Keyboard from './Keyboard'
import Fingers from './Fingers';

interface TypingPageBaseProps {
    translatedSentence: string
    setTranslatedSentence: React.Dispatch<React.SetStateAction<string>>
    sentence: string
    setSentence: React.Dispatch<React.SetStateAction<string>>
    status: 'setting' | 'running' | 'result'
    setStatus: React.Dispatch<React.SetStateAction<'menu select' | 'setting' | 'running' | 'result'>>
    score: number
    setScore: React.Dispatch<React.SetStateAction<number>>
    mistake: number
    setMistake: React.Dispatch<React.SetStateAction<number>>
    timePassed: number
    setTimePassed: React.Dispatch<React.SetStateAction<number>>
    record: number
    setRecord: React.Dispatch<React.SetStateAction<number>>
    languageType?: 'not selected' | 'hiragana' | 'english' | 'kanji'
    mode?: 'time-attack' | '1-minute-challenge'
}

let newLineItems: number = 0


export default function TypingPageBase({
    translatedSentence,
    setTranslatedSentence,
    sentence = '変更前。デバッグ中。',
    setSentence,
    status,
    setStatus,
    score,
    setScore,
    mistake,
    setMistake,
    timePassed,
    setTimePassed,
    record,
    setRecord,
    languageType
}: TypingPageBaseProps) {
    const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
    const [nextKey, setNextKey] = useState<string | null>(null);



    // for timer base
    const totalTime = hms2ms(0, 10, 0, 0)
    const [finished, setFinished] = useState(false)
    const [ticking, setTicking] = useState(false)
    const [reset, setReset] = useState(true)
    const attrsParentTimer = { className: 'flex flex-col items-center justify-center text-5xl' }







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
            {/* typing component */}
            <Keyboard nextKey={nextKey} />
            <div className="container flex flex-col justify-end">
                <Fingers nextKey={nextKey} />
            </div>
        </>
    )
}
