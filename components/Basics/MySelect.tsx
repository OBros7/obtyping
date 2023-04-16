import React from 'react'

interface MySelectProps {
  state: any
  setState: React.Dispatch<React.SetStateAction<any>>
  stateIndex?: number // this is used only if the state is an array of numbers
  optionValues: Array<any>
  optionTexts?: Array<string> | string
  attrs?: object
  stateType?: 'string' | 'number' | 'boolean' | ''
}
/* Note: set state values are always string */
export default function MySelect({
  state,
  setState,
  stateIndex = 0,
  optionValues,
  optionTexts = '',
  attrs = { className: 'select m-2' },
  stateType = '',
}: MySelectProps) {
  if (optionTexts === '') {
    optionTexts = optionValues.map((ov) => String(ov))
  }

  if (stateType === '') {
    if (typeof state === 'number') {
      stateType = 'number'
    } else if (typeof state === 'boolean') {
      stateType = 'boolean'
    } else {
      stateType = 'string'
    }
  }

  const updateState = (value: any) => {
    if (Array.isArray(state)) {
      setState(state.map((x, i) => (i == stateIndex ? value : x)))
    } else {
      setState(value)
    }
  }

  const changeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (stateType === 'number') {
      updateState(Number(event.target.value))
    } else if (stateType === 'boolean') {
      updateState(event.target.value === 'true')
    } else {
      updateState(event.target.value)
    }
  }

  return (
    <select value={state} onChange={changeHandler} {...attrs}>
      {optionValues.map((o, i) => {
        return (
          <option key={i} value={o}>
            {optionTexts[i]}
          </option>
        )
      })}
    </select>
  )
}
