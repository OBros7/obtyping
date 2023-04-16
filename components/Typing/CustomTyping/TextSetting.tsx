import React, { useRef, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'
import { langDict } from '.'

interface InitialSettingProps {
  description: string // Explanation of question text and options
  setStatus: React.Dispatch<React.SetStateAction<'setting' | 'running' | 'result'>>
  targetSentence: string
  setTargetSentence: React.Dispatch<React.SetStateAction<string>>
}

export default function InitialSetting({ description, setStatus, setTargetSentence }: InitialSettingProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const refTextBox = useRef<HTMLTextAreaElement>(null)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  function handleInputChange() {
    const inputValue = refTextBox.current?.value ?? ''
    const numberOfCharacters = inputValue.length

    if (numberOfCharacters > 500 || numberOfCharacters === 0) {
      setIsButtonDisabled(true)
    } else {
      setIsButtonDisabled(false)
    }
  }

  function progress() {
    const inputValue = refTextBox.current?.value ?? ''
    setTargetSentence(inputValue)
    setStatus('running')
  }

  return (
    <div className='flex flex-col items-center'>
      {description}
      <div className='flex mt-5'>
        <textarea ref={refTextBox} className='outline outline-2 select-none' rows={10} cols={80} onChange={handleInputChange}></textarea>
      </div>
      <button
        className='btn-primary m-5 flex-1'
        onClick={() => progress()}
        disabled={isButtonDisabled}
      >
        {translater.start}
      </button>
      {isButtonDisabled && <p className="text-red-600">{translater.inputTextError}</p>}
    </div>
  )
}
