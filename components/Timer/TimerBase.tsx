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
  const accumulatedRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)

  // 開始/停止（ticking, finished などに追従）
  useEffect(() => {
    if (!ticking || finished) return

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    startTimeRef.current = Date.now()

    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current == null) return
      const elapsed = Date.now() - startTimeRef.current + accumulatedRef.current
      if (elapsed < totalTime) {
        setTimePassed(elapsed)
      } else {
        setTimePassed(totalTime)
        setFinished(true)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        startTimeRef.current = null
      }
    }, timeInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      if (startTimeRef.current != null) {
        accumulatedRef.current += Date.now() - startTimeRef.current
        startTimeRef.current = null
      }
    }
  }, [ticking, finished, timeInterval, totalTime, setTimePassed, setFinished])

  // リセット：完全初期化 & ticking=true なら即再開
  useEffect(() => {
    if (!reset) return

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    accumulatedRef.current = 0
    startTimeRef.current = null
    setTimePassed(0)
    setFinished(false)

    if (ticking) {
      startTimeRef.current = Date.now()
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current == null) return
        const elapsed = Date.now() - startTimeRef.current + accumulatedRef.current
        if (elapsed < totalTime) {
          setTimePassed(elapsed)
        } else {
          setTimePassed(totalTime)
          setFinished(true)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          startTimeRef.current = null
        }
      }, timeInterval)
    }
  }, [reset, ticking, timeInterval, totalTime, setTimePassed, setFinished])

  return (
    <span {...attrsParent}>
      {finished ? ms2hms(0, digit) : ms2hms(Math.max(0, totalTime - timePassed), digit)}
    </span>
  )
}
