import React from 'react'

interface MyNumberPadProps {
  onClick: (number: number) => void
  buttonClass?: string
}

const defaultBtnClass =
  'bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 content-center border border-gray-400 rounded'

export default function MyNumberPad({ onClick, buttonClass = defaultBtnClass }: MyNumberPadProps) {
  return (
    <div className='grid grid-cols-3 grid-rows-4'>
      <button className={buttonClass} onClick={() => onClick(1)}>
        1
      </button>
      <button className={buttonClass} onClick={() => onClick(2)}>
        2
      </button>
      <button className={buttonClass} onClick={() => onClick(3)}>
        3
      </button>
      <button className={buttonClass} onClick={() => onClick(4)}>
        4
      </button>
      <button className={buttonClass} onClick={() => onClick(5)}>
        5
      </button>
      <button className={buttonClass} onClick={() => onClick(6)}>
        6
      </button>
      <button className={buttonClass} onClick={() => onClick(7)}>
        7
      </button>
      <button className={buttonClass} onClick={() => onClick(8)}>
        8
      </button>
      <button className={buttonClass} onClick={() => onClick(9)}>
        9
      </button>
      <button className={buttonClass} onClick={() => onClick(-1)}>
        Back
      </button>
      <button className={buttonClass} onClick={() => onClick(0)}>
        0
      </button>
      <button className={buttonClass} onClick={() => onClick(10)}>
        Enter
      </button>
    </div>
  )
}


