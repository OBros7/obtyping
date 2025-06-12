import React from 'react'
import { MySlider, MyInputNumber } from './'

interface MySliderInputNumberProps {
  state: number | number[]
  setState: React.Dispatch<React.SetStateAction<any>>
  stateIndex?: number // this is used only if the state is an array of numbers
  min: number
  max: number
  step: number
  attrsParent?: object
  attrSlider?: object
  attrsSliderParent?: object
  attrsInputNumber?: object
  defaultState?: number
  children?: React.ReactNode
}

//// attrs to put slide and input next to each other
const attrsParentDefault = { className: 'flex flex-row' }
const attrsSliderParentDefault = { className: 'flex justify-center items-center' }
const attrsSliderDefault = { className: 'number-slider w-16 h-2 m-1' }
const attrsInputNumberDefault = { className: 'input-number w-16 m-1' }

//// attrs to put slide below input
// const attrsParentDefault = { className: '' }
// const attrsSliderParentDefault = { className: '' }
// const attrsSliderDefault = { className: 'number-slider w-16 h-2 m-1' }
// const attrsInputNumberDefault = { className: 'input-number w-16 m-1' }

export default function MySliderInputNumber({
  state,
  setState,
  stateIndex = 0,
  min,
  max,
  step,
  attrsParent = attrsParentDefault,
  attrSlider = attrsSliderDefault, //{ className: 'number-slider w-16 h-2 m-1' },
  attrsSliderParent = attrsSliderParentDefault,
  attrsInputNumber = attrsInputNumberDefault, //{ className: 'input-number w-16 m-1' },
  defaultState,
  children = null,
}: MySliderInputNumberProps) {
  return (
    <div {...attrsParent}>
      <MyInputNumber
        state={state}
        setState={setState}
        stateIndex={stateIndex}
        min={min}
        max={max}
        step={step}
        attrs={attrsInputNumber}
        defaultState={defaultState}
      />
      <MySlider
        state={state}
        setState={setState}
        stateIndex={stateIndex}
        min={min}
        max={max}
        step={step}
        attrsParent={attrsSliderParent}
        attrsSlider={attrSlider}
        showValue={false}
      />
      {children}
    </div>
  )
}
