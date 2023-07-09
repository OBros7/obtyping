import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from '@/MyCustomHooks'
import { langDict } from '.'
import { GlobalContext } from 'context/GlobalContext'
import { ResultDefault } from '@/CommonPage/Result'

interface resultProps {
  status: 'setting' | 'running' | 'result'
  setStatus: React.Dispatch<React.SetStateAction<'menu select' | 'setting' | 'running' | 'result'>>
  languageType: 'not selected' | 'hiragana' | 'english' | 'kanji' | "free"
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  mistake: number
  setMistake: React.Dispatch<React.SetStateAction<number>>
  record: number
  setTimePassed: React.Dispatch<React.SetStateAction<number>>
}

const url = process.env.API_URL + '/DefaultTyping/'

export default function Result({
  status,
  setStatus,
  languageType,
  score,
  setScore,
  mistake,
  setMistake,
  record,
  setTimePassed,
}: resultProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const { session, userID } = useContext(GlobalContext)

  const urlWithParams = url + `${userID}/${languageType}`

  const languageTypeText =
    languageType === 'hiragana'
      ? translater.hiragana
      : languageType === 'english'
        ? translater.english
        : languageType === 'kanji'
          ? translater.japanese
          : 'ERROR!'

  const handlePlayAgain = () => {
    setStatus('running')
    setScore(0)
    setMistake(0)
    setTimePassed(0)
  }
  const handleBackToStart = () => {
    languageType === 'not selected'
    setScore(0)
    setMistake(0)
    setStatus('setting')
    setTimePassed(0)
  }

  const decimal = 0.01
  const recordText =
    languageTypeText +
    `${'\xa0'.repeat(3)}` + // empty space
    translater.resultItem1 +
    ': ' +
    score +
    `${'\xa0'.repeat(3)}` +
    translater.resultItem2 +
    ': ' +
    mistake

  return (
    <ResultDefault
      urlPost={urlWithParams}
      urlGet={urlWithParams}
      record={record}
      unit={translater.resultUnit}
      resultBoxText={recordText}
      handlePlayAgain={handlePlayAgain}
      handleBackToStart={handleBackToStart}
      higherBetter={false}
    />
  )
}
