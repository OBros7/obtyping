import React, { useRef, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { langDict } from '.'

interface InitialSettingProps {
  description: string // Explanation of question text and options
  labelA: string // Labels for Option A
  labelB: string // Labels for Option B
  labelC: string // Labels for Option C
  setSelected: React.Dispatch<React.SetStateAction<number>> // Function to set selected option
}

export default function InitialSetting({ description, labelA, labelB, labelC, setSelected }: InitialSettingProps) {
  return (
    <div className='flex flex-col items-center'>
      {description}
      <div className='flex'>
        <button className='btn-primary m-5 flex-1' onClick={() => setSelected(1)}>
          {labelA}
        </button>
        <button className='btn-second m-5 flex-1' onClick={() => setSelected(2)}>
          {labelB}
        </button>
        <button className='btn-third m-5 flex-1' onClick={() => setSelected(3)}>
          {labelC}
        </button>
      </div>
    </div>
  )
}
