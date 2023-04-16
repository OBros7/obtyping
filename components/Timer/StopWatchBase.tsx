import React, { useEffect, useRef } from 'react'
import { ms2hms } from '@/MyLib/TimeLib'

interface StopWatchBaseProps {
  timePassed: number
  setTimePassed: React.Dispatch<React.SetStateAction<number>>
  ticking: boolean
  reset: boolean
  attrsParent?: object
  timeInterval?: number
  digit?: 0 | 1
}

export default function StopWatchBase({
  timePassed,
  setTimePassed,
  ticking,
  reset,
  attrsParent,
  timeInterval = 50,
  digit = 1,
}: StopWatchBaseProps) {
  const timePassedToLastStop = useRef(0)
  const interval = useRef(0)

  useEffect(() => {
    const timerCycle = (startTime: number, timePassedToLastStop: number) => {
      setTimePassed(Date.now() - startTime + timePassedToLastStop)
    }

    if (ticking) {
      const startTime = Date.now()
      interval.current = window.setInterval(timerCycle, timeInterval, startTime, timePassedToLastStop.current)
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
    }
  }, [reset])

  return <span {...attrsParent}>{ms2hms(timePassed, digit)}</span>
}
