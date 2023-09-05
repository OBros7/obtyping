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


  const settinReflection = () => {
    setStatus('running')
  }

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

      {/* Submit */}
      <div className="flex justify-center mt-4">
        <button type="submit" onClick={() => settinReflection()} className='btn-second  flex-1 px-4'>Submit</button>
      </div>
    </>
  )
}
