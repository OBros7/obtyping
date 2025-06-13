import React, { useEffect, useRef } from 'react'
import { ms2hms } from '@/MyLib/TimeLib'

interface TimerBaseProps {
  totalTime: number
  timePassed: number
  setTimePassed: React.Dispatch<React.SetStateAction<number>>
  ticking: boolean
  reset: boolean
  finished: boolean
  setFinished: React.Dispatch<React.SetStateAction<boolean>>
  attrsParent?: object
  timeInterval?: number
  digit?: 0 | 1
}

export default function TimerBase({
  totalTime,
  timePassed,
  setTimePassed,
  ticking,
  reset,
  finished,
  setFinished,
  attrsParent,
  timeInterval = 50,
  digit = 1,
}: TimerBaseProps) {
  const timePassedToLastStop = useRef(0)
  const interval = useRef(0)

  useEffect(() => {
    const timerCycle = (startTime: number, timePassedToLastStop: any) => {
      const tmp = Date.now() - startTime + timePassedToLastStop.current
      if (totalTime > tmp) {
        setTimePassed(tmp)
      } else {
        setTimePassed(totalTime)
        // timePassedToLastStop.current = 0
        setFinished(true)
        clearInterval(interval.current)
      }
    }
    if (ticking && !finished) {
      const startTime = Date.now()
      interval.current = window.setInterval(timerCycle, timeInterval, startTime, timePassedToLastStop)
      return () => {
        clearInterval(interval.current)
        timePassedToLastStop.current += Date.now() - startTime
      }
    }
  }, [ticking])

  useEffect(() => {
    if (reset) {
      timePassedToLastStop.current = 0
      setTimePassed(0)
      setFinished(false)
    }
  }, [reset])

  return <span {...attrsParent}>{finished ? ms2hms(0, digit) : ms2hms(totalTime - timePassed, digit)}</span>
}
