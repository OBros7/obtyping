import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/MyCustomHooks'
import { langDict } from '.'
import { hms2ms, ms2hms } from '@/MyLib/TimeLib'
import { TimerBase, StopWatchBase } from '@/Timer'

interface ReadyScreenProps {
  status: 'menu select' | 'waiting' | 'ready' | 'setting' | 'running' | 'result'
  setStatus: React.Dispatch<React.SetStateAction<'menu select' | 'waiting' | 'ready' | 'setting' | 'running' | 'result'>>
}

export default function WaitingScreen({ status, setStatus }: ReadyScreenProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const [timePassed, setTimePassed] = useState(0)
  // for timer base
  const wataingTime = hms2ms(999, 3, 0, 0)
  const [finished, setFinished] = useState(false)
  const [ticking, setTicking] = useState(true)
  const [reset, setReset] = useState(true)
  const attrsParentTimer = { className: 'flex flex-col items-center justify-center text-5xl' }

  useEffect(() => {
    if (timePassed > 3000 && status === 'ready') {
      // statusを'running'に変更
      setStatus('running');
      setReset(!reset); // タイマーをリセット
    }
  }, [finished, timePassed, status, setStatus, setReset, setTimePassed, reset]);

  return (
    <>
      <div className="flex flex-col items-center justify-center">
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
      </div>
    </>
  )
}

