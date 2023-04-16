import React, { useEffect, useRef, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { Typing } from '../DefaultTyping'
import { useTranslation } from '@/MyCustomHooks'
import { langDict, TextSetting, Result } from '.'

export default function DefaultTyping() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const [targetSentence, setTargetSentence] = useState<string>('文章が設定できていません。')
  const [status, setStatus] = useState<'setting' | 'running' | 'result'>('setting')
  const [score, setScore] = useState(0)
  const [mistake, setMistake] = useState(0)
  const [timePassed, setTimePassed] = useState(0)
  const [record, setRecord] = useState(0)

  return (
    <Layout>
      <MainContainer addClass='align-middle flex flex-col justify-center items-center'>
        {status === 'setting' ? (
          <>
            <TextSetting
              description={translater.settingDescription}
              setStatus={setStatus}
              targetSentence={targetSentence}
              setTargetSentence={setTargetSentence}
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
              />
            </>
          </div>
        ) : status === 'result' ? (
          <>
            <Result
              status={status}
              setStatus={setStatus}
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
