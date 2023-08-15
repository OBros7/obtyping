import React, { useEffect, useState } from 'react';
import { Layout, MainContainer } from '@/Layout'
import { langDict } from '.'
import TextMenu from './TextMenu'
import Toggle from './ToggleSwitch';

interface InitialSettingProps {
  menu: string
  status: 'menu select' | 'setting' | 'running' | 'result'
  setStatus: React.Dispatch<React.SetStateAction<'menu select' | 'setting' | 'running' | 'result'>>
  languageType: 'not selected' | 'hiragana' | 'english' | 'kanji' | 'free'
  setLanguageType: React.Dispatch<React.SetStateAction<'not selected' | 'hiragana' | 'english' | 'kanji' | 'free'>>
  timerSetting: '30 seconds' | '1 minute' | '2 minute' | '3 minutes' | '5 minutes'
  setTimerSetting: React.Dispatch<React.SetStateAction<'30 seconds' | '1 minute' | '2 minute' | '3 minutes' | '5 minutes'>>
}

export interface Settings {
  mode: 'time-attack' | '1-minute-challenge'
  tag: string
  practiceText: string
}

export default function InitialSetting({ menu, status, setStatus, languageType, setLanguageType, timerSetting, setTimerSetting }: InitialSettingProps) {
  const [mode, setMode] = useState<Settings['mode']>('time-attack')
  const [tag, setTag] = useState('')
  const [practiceText, setPracticeText] = useState('')
  const [isKeyboardAndHands, setIsKeyboardAndHands] = useState<boolean>(true)

  const settinReflection = () => {
    setStatus('running')
  }

  useEffect(() => {
    const savedSettings = localStorage.getItem('isKeyboardAndHands')
    console.log('savedSettings_A: ', savedSettings)
    if (savedSettings) {
      setIsKeyboardAndHands(savedSettings === 'true' ? true : false)
      console.log('savedSettings_B: ', savedSettings)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('isKeyboardAndHands', JSON.stringify(isKeyboardAndHands))
  }, [isKeyboardAndHands])

  const handleClick = () => {
    setIsKeyboardAndHands(!isKeyboardAndHands); // Switch the state between true and false
    // localStorage.setItem('isKeyboardAndHands', JSON.stringify(isKeyboardAndHands))
  };

  return (
    <>
      <h2 className='text-4xl mb-20'>Typing Test Settings</h2>

      {/* Language */}
      <div className='mb-10'>
        <label htmlFor="language">Language:</label>
        <select id="language" value={languageType} onChange={(e) => setLanguageType(e.target.value as 'not selected' | 'hiragana' | 'english' | 'kanji' | 'free')}>
          <option value="not selected">Not Selected</option>
          <option value="hiragana">Hiragana</option>
          <option value="english">English</option>
          <option value="kanji">Kanji</option>
          <option value="free">Free</option>
        </select>
      </div>

      <TextMenu text="Your text here" />

      <div className='m-5 flex flex-row justify-center'>
        <div className='text-2xl mb-5'>Keyboard&Hands</div>
        <button className={isKeyboardAndHands ? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2" : "bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mr-2"} onClick={handleClick}>{isKeyboardAndHands ? "ON" : "OFF"}</button>
      </div>

      {/* Submit */}
      <div className="flex justify-center mt-4">
        <button type="submit" onClick={() => settinReflection()} className='btn-second  flex-1 px-4'>Submit</button>
      </div>
    </>
  )
}
