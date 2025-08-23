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
  // 経過の累積（停止⇄再開で保持）
  const accumulatedRef = useRef(0)
  // 走り始めた時刻
  const startTimeRef = useRef<number | null>(null)
  // interval ID
  const intervalRef = useRef<number | null>(null)

  // 走行制御：ticking 変更や interval 間隔変更に追従
  useEffect(() => {
    if (!ticking) return

    // 念のためクリアしてから開始
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    startTimeRef.current = Date.now()

    intervalRef.current = window.setInterval(() => {
      if (startTimeRef.current == null) return
      const elapsed = Date.now() - startTimeRef.current + accumulatedRef.current
      setTimePassed(elapsed)
    }, timeInterval)

    // 停止・依存変更・アンマウント時
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
  }, [ticking, timeInterval, setTimePassed])

  // リセット：完全初期化。ticking=true ならゼロから即再開
  useEffect(() => {
    if (!reset) return

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    accumulatedRef.current = 0
    startTimeRef.current = null
    setTimePassed(0)

    if (ticking) {
      startTimeRef.current = Date.now()
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current == null) return
        const elapsed = Date.now() - startTimeRef.current + accumulatedRef.current
        setTimePassed(elapsed)
      }, timeInterval)
    }
  }, [reset, ticking, timeInterval, setTimePassed])

  return <span {...attrsParent}>{ms2hms(timePassed, digit)}</span>
}
