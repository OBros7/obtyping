import React, { useEffect, useRef, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { InitialSetting, Typing, langDict, Result } from '.'
import { useTranslation } from '@/MyCustomHooks'
import { hiraganaSentense, englishSentense, kanjisentence } from './FixedContent'

export default function DefaultTyping() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const [targetSentence, setTargetSentence] = useState<string>('文章が設定できていません。')
  const [status, setStatus] = useState<'setting' | 'running' | 'result'>('setting')
  const [score, setScore] = useState(0)
  const [mistake, setMistake] = useState(0)
  const [timePassed, setTimePassed] = useState(0)
  const [record, setRecord] = useState(0)
  const [languageType, setLanguageType] = useState<'not selected' | 'hiragana' | 'english' | 'kanji'>('not selected')

  //Amount of sentence
  const amountOfSentence: number = 4

  // for initial setting
  const [selected, setSelected] = useState<number>(0)

  useEffect(() => {
    let n: number = Math.floor(Math.random() * amountOfSentence)

    switch (selected) {
      case 1:
        setTargetSentence(hiraganaSentense[n])
        setLanguageType('hiragana')
        break
      case 2:
        setTargetSentence(englishSentense[0])
        setLanguageType('english')
        break
      case 3:
        setTargetSentence(kanjisentence[n])
        setLanguageType('kanji')
        break
    }
    if (selected !== 0) {
      setStatus('running')
    }
  }, [selected])

  return (
    <Layout>
      <MainContainer addClass='align-middle flex flex-col justify-center items-center'>
        {status === 'setting' ? (
          <>
            <InitialSetting
              description={translater.selectLangage}
              labelA={translater.hiragana}
              labelB={translater.english}
              labelC={translater.japanese}
              setSelected={setSelected}
            />
          </>
        ) : status === 'running' ? (
          <div className='flex flex-col'>
            <>
              <Typing
                sentence={targetSentence}
                setSentence={setTargetSentence}
                status={status}
                setStatus={setStatus}
                score={score}
                setScore={setScore}
                mistake={mistake}
                setMistake={setMistake}
                timePassed={timePassed}
                setTimePassed={setTimePassed}
                record={record}
                setRecord={setRecord}
                languageType={languageType}
              />
            </>
          </div>
        ) : status === 'result' ? (
          <>
            <Result
              status={status}
              setStatus={setStatus}
              languageType={languageType}
              score={score}
              setScore={setScore}
              mistake={mistake}
              setMistake={setMistake}
              record={Number(record.toFixed(1))}
              setTimePassed={setTimePassed}
            />
          </>
        ) : (
          <></>
        )}
      </MainContainer>
    </Layout>
  )
}
