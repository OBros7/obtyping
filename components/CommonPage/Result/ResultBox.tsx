import React from 'react'

interface ResultBoxPrep {
  record: number
  unit?: string
  additionalText?: string
}

export default function ResultBox({ record, unit, additionalText }: ResultBoxPrep) {
  return (
    <div className='outline outline-8 outline-yellow-400 bg-yellow-100 rounded-lg py-4 px-12 my-4'>
      <div className='flex flex-col items-center justify-center text-3xl font-bold mb-4'> - RESULT - </div>
      <div className='flex flex-row items-end justify-center text-3xl font-bold mb-4'>
        <span className='text-5xl font-bold'>{record}</span> <span className='text-3xl font-bold'>&nbsp;{unit}</span>
      </div>
      {additionalText && <div className='text-xl font-bold my-2'>{additionalText}</div>}
    </div>
  )
}
