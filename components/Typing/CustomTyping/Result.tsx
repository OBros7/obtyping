import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from '@/MyCustomHooks'
import { langDict } from '.'
import { GlobalContext } from 'context/GlobalContext'
import { ResultDefault } from '@/CommonPage/Result'

interface resultProps {
  status: 'setting' | 'running' | 'result'
  setStatus: React.Dispatch<React.SetStateAction<'setting' | 'running' | 'result'>>
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  mistake: number
  setMistake: React.Dispatch<React.SetStateAction<number>>
  record: number
  setTimePassed: React.Dispatch<React.SetStateAction<number>>
}

const url = process.env.API_URL + '/CustomTyping/'

export default function Result({
  status,
  setStatus,
  score,
  setScore,
  mistake,
  setMistake,
  record,
  setTimePassed,
}: resultProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const { session, userID } = useContext(GlobalContext)

  const urlWithParams = url + `${userID}`

  const handlePlayAgain = () => {
    setStatus('running')
    setScore(0)
    setMistake(0)
    setTimePassed(0)
  }
  const handleBackToStart = () => {
    setScore(0)
    setMistake(0)
    setStatus('setting')
    setTimePassed(0)
  }

  const decimal = 0.01
  // const record = Math.floor(decimal * timePassed) / decimal / 1000
  const recordText =
    translater.resultItem1 + ': ' + score + `${'\xa0'.repeat(3)}` + translater.resultItem2 + ': ' + mistake

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
