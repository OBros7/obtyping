import React, { useState } from 'react';
import { Layout, MainContainer } from '@/Layout'
import { langDict } from '.'

interface InitialSettingProps {
  menu: string
  status: 'menu select' | 'setting' | 'running' | 'result'
  setStatus: React.Dispatch<React.SetStateAction<'menu select' | 'setting' | 'running' | 'result'>>
  languageType: 'not selected' | 'hiragana' | 'english' | 'kanji' | 'free'
  setLanguageType: React.Dispatch<React.SetStateAction<'not selected' | 'hiragana' | 'english' | 'kanji' | 'free'>>
}

export interface Settings {
  mode: 'time-attack' | '1-minute-challenge'
  tag: string
  practiceText: string
}

export default function InitialSetting({ menu, status, setStatus, languageType, setLanguageType }: InitialSettingProps) {
  const [mode, setMode] = useState<Settings['mode']>('time-attack')
  const [tag, setTag] = useState('')
  const [practiceText, setPracticeText] = useState('')

  const settinReflection = () => {
    setStatus('running')
  }

  return (
    <>
      <h2 className='text-4xl mb-20'>Typing Test Settings</h2>

      {/* Mode */}
      <div className='mb-10'>
        <label htmlFor="mode">Mode:</label>
        <select id="mode" value={mode} onChange={(e) => setMode(e.target.value as Settings['mode'])}>
          <option value="time-attack">Time Attack</option>
          <option value="1-minute-challenge">1 Minute Challenge</option>
        </select>
      </div>

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

      {/* Tag */}
      <div className='mb-10'>
        <label htmlFor="tag">Tag:</label>
        <input
          id="tag"
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
      </div>

      {/* Practice Text */}
      <div className='mb-10'>
        <label htmlFor="practiceText">Text to Practice:</label>
        <textarea
          id="practiceText"
          value={practiceText}
          onChange={(e) => setPracticeText(e.target.value)}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-center mt-4">
        <button type="submit" onClick={() => settinReflection()} className='btn-second  flex-1 px-4'>Submit</button>
      </div>
    </>
  )
}
