import React, { useEffect, useState } from 'react'
// Helper function to infer the type
function inferType(state: any): 'string' | 'number' | 'boolean' | '' {
  const type = typeof state;
  return type === 'string' || type === 'number' || type === 'boolean' ? type : '';
}

interface MySelectProps {
  state: any
  setState: React.Dispatch<React.SetStateAction<any>>
  stateIndex?: number
  optionValues: Array<any>
  optionTexts?: Array<string> | string
  attrs?: object
  stateType?: 'string' | 'number' | 'boolean' | ''
}

export default function MySelect({
  state,
  setState,
  stateIndex = 0,
  optionValues,
  optionTexts = '',
  attrs = { className: 'select m-2' },
  stateType = '',
}: MySelectProps) {
  const [selectedTexts, setSelectedTexts] = useState<Array<string>>([])

  // Auto-detect stateType based on initial state value
  stateType = inferType(state);

  useEffect(() => {
    if (optionTexts === '') {
      setSelectedTexts(optionValues.map((ov) => String(ov)))
    } else {
      setSelectedTexts(Array.isArray(optionTexts) ? optionTexts : [optionTexts])
    }

    if (!optionValues.includes(state)) {
      setState(optionValues[0])
    }
  }, [state, setState, optionValues, optionTexts])

  const updateState = (value: any) => {
    if (Array.isArray(state)) {
      setState(state.map((x, i) => (i == stateIndex ? value : x)))
    } else {
      setState(value)
    }
  }

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let value;
    if (stateType === 'number') {
      value = Number(event.target.value)
    } else if (stateType === 'boolean') {
      value = event.target.value === 'true'
    } else {
      value = event.target.value
    }
    updateState(value)
  }

  return (
    <select value={state} onChange={changeHandler} {...attrs}>
      {optionValues.map((o, i) => {
        return (
          <option key={i} value={o}>
            {selectedTexts[i]}
          </option>
        )
      })}
    </select>
  )
}

