import React from 'react'

/*
Note that the box can contain numbers with many 0-prefix (e.g., 0001.2). Fix this later
*/
const attrsDefault = {
  className: 'input-number w-16 m-1',
}

interface InputNumberProps {
  state: number | number[]
  setState: React.Dispatch<React.SetStateAction<any>>
  stateIndex?: number // this is used only if the state is an array of numbers
  min: number
  max: number
  step: number
  attrs?: object
  defaultState?: number
}

export default function MyInputNumber({
  state,
  setState,
  stateIndex = 0,
  min,
  max,
  attrs = attrsDefault,
  step,
  defaultState,
}: InputNumberProps) {
  // set a default state if state is NaN when focus is lost
  const updateState = (value: number) => {
    if (Array.isArray(state)) {
      setState(state.map((x, i) => (i == stateIndex ? value : x)))
    } else {
      setState(value)
    }
  }

  const handleOnBlur = () => {
    if (Number.isNaN(state)) {
      updateState(defaultState || (min + max) / 2)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let strValue: string = event.target.value
    if (!event.target.validity.valid) {
      return
    }
    const value1: number = parseFloat(strValue)
    const value2 = Math.max(min, Math.min(max, value1))
    updateState(value2)
  }

  return (
    <input
      type='number'
      step={step}
      value={Array.isArray(state) ? state[stateIndex] : state}
      onChange={(e) => handleChange(e)}
      onBlur={() => handleOnBlur()}
      {...attrs}
    />
  )
}
