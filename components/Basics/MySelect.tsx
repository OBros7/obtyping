// Basics/MySelect.tsx
import React, { useEffect, useState } from 'react'

// Helper function to infer the type
function inferType(state: any): 'string' | 'number' | 'boolean' | 'null' | '' {
  if (state === null) return 'null'
  const type = typeof state
  return type === 'string' || type === 'number' || type === 'boolean' ? type : ''
}

const NULL_TOKEN = '__NULL__'

interface MySelectProps<T = any> {
  state: T
  setState: React.Dispatch<React.SetStateAction<T>>
  stateIndex?: number
  optionValues: Array<T>
  optionTexts?: Array<string> | string
  attrs?: object
  stateType?: 'string' | 'number' | 'boolean' | 'null' | ''
}

export default function MySelect<T = any>({
  state,
  setState,
  stateIndex = 0,
  optionValues,
  optionTexts = '',
  attrs = { className: 'select m-2' },
  stateType = '',
}: MySelectProps<T>) {
  const [selectedTexts, setSelectedTexts] = useState<Array<string>>([])

  // Auto-detect stateType based on current state value
  stateType = inferType(state)

  useEffect(() => {
    if (optionTexts === '') {
      setSelectedTexts(optionValues.map((ov) => ov === null ? '(Any)' : String(ov)))
    } else {
      setSelectedTexts(Array.isArray(optionTexts) ? optionTexts : [optionTexts])
    }

    // 現在値がリストに無い場合のみ初期化（null は許容）
    if (!optionValues.includes(state)) {
      // optionValues[0] が存在すればそれへ
      if (optionValues.length > 0) {
        setState(optionValues[0] as T)
      }
    }
  }, [state, setState, optionValues, optionTexts])

  const updateState = (value: any) => {
    if (Array.isArray(state)) {
      setState(state.map((x, i) => (i === stateIndex ? value : x)) as T)
    } else {
      setState(value as T)
    }
  }

  const fromDomValue = (raw: string) => {
    if (raw === NULL_TOKEN) return null
    if (stateType === 'number') return Number(raw)
    if (stateType === 'boolean') return raw === 'true'
    // 'null' 型でも raw が NULL_TOKEN で来るので上で処理済み。残りは string。
    return raw
  }

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = fromDomValue(event.target.value)
    updateState(value)
  }

  const toDomValue = (v: any) => (v === null ? NULL_TOKEN : v)

  return (
    <select value={toDomValue(state)} onChange={changeHandler} {...attrs}>
      {optionValues.map((o, i) => {
        return (
          <option key={i} value={toDomValue(o)}>
            {selectedTexts[i]}
          </option>
        )
      })}
    </select>
  )
}
