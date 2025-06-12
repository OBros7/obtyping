import React from 'react'

interface SliderProps {
  state: number | number[]
  setState: React.Dispatch<React.SetStateAction<any>>
  stateIndex?: number // this is used only if the state is an array of numbers
  min: number
  max: number
  step: number
  showValue?: boolean
  attrsParent?: object
  attrsLabel?: object
  attrsSlider?: object
}

export default function MySlider({
  state,
  setState,
  stateIndex = 0,
  min,
  max,
  step,
  showValue = true,
  attrsParent = {},
  attrsLabel = { className: 'block w-2/12 text-center' },
  attrsSlider = { className: 'number-slider w-2/12 h-2' },
}: SliderProps) {
  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(min, Math.min(max, parseFloat(event.target.value)))

    if (Array.isArray(state)) {
      setState(state.map((x, i) => (i == stateIndex ? value : x)))
    } else {
      setState(value)
    }
  }
  return (
    <div {...attrsParent}>
      {showValue ? (
        <label htmlFor='input-range' {...attrsLabel}>
          {Array.isArray(state) ? state[stateIndex] : state}
        </label>
      ) : null}

      <input
        id='input-range'
        type='range'
        min={min}
        max={max}
        step={step}
        value={Array.isArray(state) ? state[stateIndex] : state}
        onChange={(e) => changeHandler(e)}
        {...attrsSlider}
      />
    </div>
  )
}
