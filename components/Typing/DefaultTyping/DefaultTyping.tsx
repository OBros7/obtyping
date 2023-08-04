import React, { useEffect, useRef, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { InitialSetting, Typing, langDict, Result } from '.'
// import { TypingEnglish } from '.'
import { useTranslation } from '@/MyCustomHooks'
import { hiraganaSentense, englishSentense, kanjisentence } from './FixedContent'
import * as wanakana from 'wanakana';

export enum AppStatus {
  SETTINGS = 'settings',
  DESCRIPTION = 'description',
  GAME = 'game',
  RESULT = 'result',
}

export default function DefaultTyping() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const [menu, setMenu] = useState<string>('custom')
  const [mode, setMode] = useState<'time-attack' | '1-minute-challenge'>('time-attack')
  const [status, setStatus] = useState<'menu select' | 'setting' | 'running' | 'result'>('menu select')
  const [languageType, setLanguageType] = useState<'not selected' | 'hiragana' | 'english' | 'kanji' | 'free'>('not selected')
  const [translatedSentence, setTranslatedSentence] = useState<string>('')
  const [sentence, setSentence] = useState<string>('しょうかい')

  const [score, setScore] = useState(0)
  const [mistake, setMistake] = useState(0)
  const [timePassed, setTimePassed] = useState(0)
  const [record, setRecord] = useState(0)

  //Amount of sentence
  const amountOfSentence: number = 4

  // for initial setting
  const [selected, setSelected] = useState<number>(0)

  const isJapaneseText = (text: string) => {
    // Regex pattern to match any Japanese character (Hiragana, Katakana, or Kanji)
    const japanesePattern = /[\u3000-\u303f]|[\u3040-\u309f]|[\u30a0-\u30ff]|[\uff00-\uff9f]|[\u4e00-\u9faf]/;
    return japanesePattern.test(text);
  };


  useEffect(() => {
    if (isJapaneseText(sentence)) {
      setTranslatedSentence(wanakana.toRomaji(sentence))
    }
  }, [sentence]);

  useEffect(() => {
    if (isJapaneseText(sentence)) {
      //x If the text is Japanese, convert it to romaji using Wanakana
      const romajiText = wanakana.toRomaji(sentence);
      console.log('Romaji: ', romajiText);
    } else {
      // If the text is not Japanese, process it as English or any other language
      console.log('English: ', sentence);
    }
  }, [sentence])


  return (
    <Layout>
      <MainContainer addClass='align-middle flex flex-col justify-center items-center'>
        {status === 'menu select' || status === 'setting' ? (
          <InitialSetting
            menu={menu}
            status={status}
            setStatus={setStatus}
            setLanguageType={setLanguageType}
            languageType={languageType}
          />
        ) : status === 'running' && (languageType === "english" || languageType === "hiragana" || languageType === "kanji" || languageType === "free") ? (
          <div className='flex flex-col'>
            <Typing
              translatedSentence={translatedSentence}
              setTranslatedSentence={setTranslatedSentence}
              sentence={sentence}
              setSentence={setSentence}
              status={status}
              setStatus={setStatus}
              score={score}
              setScore={setScore}
              mistake={mistake}
              setMistake={setMistake}
              timePassed={timePassed}
              setTimePassed={setTimePassed}
              record={record}
              setRecord={setRecord}
              mode={mode}
            />
          </div>
        ) : status === 'result' ? (
          <Result
            status={status}
            setStatus={setStatus}
            languageType={languageType}
            score={score}
            setScore={setScore}
            mistake={mistake}
            setMistake={setMistake}
            record={Number(record.toFixed(1))}
            setTimePassed={setTimePassed}
          />
        ) : (
          <></>
        )}
      </MainContainer>
    </Layout>
  )

}
