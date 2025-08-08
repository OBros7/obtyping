import { useRef, useEffect } from 'react'
import { RomajiMatcher } from './matcher'

export function useRomajiMatcher(kana: string) {
  const matcherRef = useRef<RomajiMatcher | null>(null)
  useEffect(() => {
    matcherRef.current = new RomajiMatcher(kana)
  }, [kana])
  return matcherRef.current
}
