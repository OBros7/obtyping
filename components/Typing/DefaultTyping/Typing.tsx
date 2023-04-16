import React, { useEffect, useRef, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { langDict } from '.'
import { useTranslation } from '@/MyCustomHooks'
import { hms2ms, ms2hms } from '@/MyLib/TimeLib'
import { TimerBase, StopWatchBase } from '@/Timer'
import { ok } from 'assert'

interface TypingProps {
  sentence: string
  setSentence: React.Dispatch<React.SetStateAction<string>>
  status: 'setting' | 'running' | 'result'
  setStatus: React.Dispatch<React.SetStateAction<'setting' | 'running' | 'result'>>
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  mistake: number
  setMistake: React.Dispatch<React.SetStateAction<number>>
  timePassed: number
  setTimePassed: React.Dispatch<React.SetStateAction<number>>
  record: number
  setRecord: React.Dispatch<React.SetStateAction<number>>
  languageType?: 'not selected' | 'hiragana' | 'english' | 'kanji'

}

let newLineItems: number = 0
let numSentences: number
let shortage: number = 0

export default function Typing({
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
}: TypingProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const [targetText, setTargetText] = useState<string[]>([])
  const refTextBox = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState('')
  const isCorrects = useRef<boolean[]>([])
  const [judgeArrayUpdated, setJudgeArrayUpdated] = useState<boolean[]>([])
  const lang = languageType === 'english' ? 'en' : languageType === 'hiragana' || languageType === 'kanji' ? 'ja' : 'und';
  let finishTime: number

  // for timer base
  const totalTime = hms2ms(0, 10, 0, 0)
  const [finished, setFinished] = useState(false)
  const [ticking, setTicking] = useState(false)
  const [reset, setReset] = useState(true)
  const attrsParentTimer = { className: 'flex flex-col items-center justify-center text-5xl' }

  function calcDiffScore(judgeArray: boolean[]) {
    let diffScore = 0
    for (let i = 0; i < judgeArray.length; i++) {
      if (judgeArray[i]) {
        diffScore += 1
      }
    }
    return diffScore
  }

  function calcDiffMistake(judgeArray: boolean[], shortage: number) {
    let diffMistake = 0
    for (let i = 0; i < judgeArray.length; i++) {
      if (!judgeArray[i]) {
        diffMistake += 1
      }
    }
    diffMistake += shortage
    return diffMistake
  }

  function resetGame() {
    setScore(0)
    setMistake(0)
    setTimePassed(0)
    setFinished(false)
    setTicking(false)
    newLineItems = 0
    setText('')
    isCorrects.current = []
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const eventTarget = event.target.value
    const targetLength = targetText[newLineItems].length
    const currentLength: number = eventTarget.length
    let textLength: number = Math.min(currentLength, targetLength)
    setText(eventTarget)
    console.log(newLineItems)

    if (eventTarget.charAt(currentLength - 1) === '\n') {
      let tempShortage: number = Math.abs(targetLength - (currentLength - 1))
      shortage = tempShortage
      setJudgeArrayUpdated(isCorrects.current)
      newLineItems += 1
      setText('')
    } else {
      isCorrects.current = []
      for (var i = 0; i < textLength; i++) {
        const charTarget = targetText[newLineItems].charAt(i)
        const char = eventTarget.charAt(i)
        isCorrects.current.push(charTarget === char)
      }
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    return false
  }

  useEffect(() => {
    if (status === 'running') {
      resetGame()
    }
  }, [status])

  useEffect(() => {
    if (judgeArrayUpdated.length > 0) {
      setScore((prevScore) => prevScore + calcDiffScore(judgeArrayUpdated))
      setMistake((prevMistake) => prevMistake + calcDiffMistake(judgeArrayUpdated, shortage))
    }
  }, [judgeArrayUpdated])

  useEffect(() => {
    let tempSentence: string[] = []
    let typingtext: string[] = []
    tempSentence = sentence.split(/(?<=[。、.,!?])/)
    numSentences = tempSentence.length
    tempSentence.forEach((e, i) => {
      if (e.charAt(0) === ' ') {
        typingtext[i] = e.slice(1)
      } else {
        typingtext[i] = e
      }
    })
    setTargetText(typingtext)
  }, [sentence])

  useEffect(() => {
    const allSentencesTyped = newLineItems === numSentences

    if ((totalTime === timePassed || allSentencesTyped) && ticking) {
      finishTime = timePassed
      setTicking(false)
      setFinished(true)
      setScore((prevScore) => prevScore + calcDiffScore(isCorrects.current))
      setMistake((prevMistake) => prevMistake + calcDiffMistake(isCorrects.current, 0))
      setRecord(score / (finishTime / 1000))
      setStatus('result')
    }
  }, [totalTime, timePassed, newLineItems, targetText])

  return (
    <MainContainer addClass='align-middle flex flex-col justify-center items-center'>
      <>
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
        <div className='flex flex-col'>
          <div className='flex flex-row'>
            <div className='rounded border text-green-500 m-3 p-3 flex-2'>
              {translater.correct}
              {score}
            </div>
            <div className='rounded border text-red-500 m-3 p-3 flex-2'>
              {translater.mistake}
              {mistake}
            </div>
          </div>
        </div>
        <div className='text-4xl'>{targetText[newLineItems]}</div>
        <div className='text-sm text-gray-400'>{targetText[newLineItems + 1]}</div>
        <div className='flex justify-center items-center'>
          {text.split('').map((c, i) => {
            if (c === ' ') {
              return (
                <span key={i} className={`${isCorrects.current[i] ? 'bg-green-500' : 'bg-red-500'}`}>
                  &nbsp;
                </span>
              )
            } else {
              return (
                <span key={i} className={`${isCorrects.current[i] ? 'bg-green-500' : 'bg-red-500'}`}>
                  {c}
                </span>
              )
            }
          })}
        </div>
        <textarea
          value={text}
          ref={refTextBox}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          className='outline outline-2 select-none'
          rows={10}
          cols={80}
          lang={lang}
          onChange={(e) => handleChange(e)}
          onPaste={(e) => handlePaste(e)}
          onClick={(e) => setTicking(true)}
          onMouseDown={(e) => {
            e.preventDefault()
            refTextBox.current?.focus()
            return false
          }}
          onKeyDown={(e) => {
            if ([33, 34, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
              e.preventDefault()
            }
            return false
          }}
        ></textarea>
      </>
    </MainContainer>
  )
}
