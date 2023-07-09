import React, { useEffect, useRef, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { langDict } from '.'
import { useTranslation } from '@/MyCustomHooks'
import { hms2ms, ms2hms } from '@/MyLib/TimeLib'
import { TimerBase, StopWatchBase } from '@/Timer'
import { ok } from 'assert'
import Keyboard from './Keyboard'
import Fingers from './Fingers';
import romajiDict from './Romaji.json';
import { copyFileSync } from 'fs'

interface TypingProps {
  original: string
  setOriginal: React.Dispatch<React.SetStateAction<string>>
  sentence: string
  setSentence: React.Dispatch<React.SetStateAction<string>>
  status: 'setting' | 'running' | 'result'
  setStatus: React.Dispatch<React.SetStateAction<'menu select' | 'setting' | 'running' | 'result'>>
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  mistake: number
  setMistake: React.Dispatch<React.SetStateAction<number>>
  timePassed: number
  setTimePassed: React.Dispatch<React.SetStateAction<number>>
  record: number
  setRecord: React.Dispatch<React.SetStateAction<number>>
  languageType?: 'not selected' | 'hiragana' | 'english' | 'kanji'
  mode?: 'time-attack' | '1-minute-challenge'
}

let newLineItems: number = 0
let numSentences: number
let shortage: number = 0

export default function Typing({
  original,
  setOriginal,
  sentence = '変更前。デバッグ中。',
  setSentence,
  status,
  setStatus,
  score,
  setScore,
  mistake,
  setMistake,
  timePassed,
  setTimePassed,
  record,
  setRecord,
  languageType
}: TypingProps) {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const [japaneseText, setjapaneseText] = useState<string[]>([])
  const [targetText, setTargetText] = useState<string[]>([])
  const refTextBox = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState('')
  const isCorrects = useRef<boolean[]>([])
  const [judgeArrayUpdated, setJudgeArrayUpdated] = useState<boolean[]>([])
  const [japaneseIndex, setJapaneseIndex] = useState<number>(0)
  const [currentInputLength, setCurrentInputLength] = useState<number>(0) // ひらがな1文字内のローマ字の位置?不要？
  const [currentInputText, setCurrentInputText] = useState<string>('') // 今打ち込んでいるローマ字群?不用？
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextKey, setNextKey] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [isInputBlocked, setIsInputBlocked] = useState(false);
  const [withinCharacterIndex, setWithinCharacterIndex] = useState<number>(0); // ひらがな1文字内のローマ字の位置
  // const [withinCharacterText, setWithinCharacterText] = useState<string>(''); // ひらがな1文字内のローマ字
  const withinCharacterText = useRef<string>(''); // ひらがな1文字内のローマ字
  const [isMatched, setIsMatched] = useState(false);
  const isJapaneseCorrects = useRef<boolean[]>([])
  const [prevText, setPrevText] = useState('');



  const lang = languageType === 'english' ? 'en' : languageType === 'hiragana' || languageType === 'kanji' ? 'ja' : 'und';
  let finishTime: number

  // for timer base
  const totalTime = hms2ms(0, 10, 0, 0)
  const [finished, setFinished] = useState(false)
  const [ticking, setTicking] = useState(false)
  const [reset, setReset] = useState(true)
  const attrsParentTimer = { className: 'flex flex-col items-center justify-center text-5xl' }

  interface romajiDict {
    [key: string]: string;
  }

  const convertTable: romajiDict = romajiDict

  useEffect(() => {
    if (status === "running" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, status]);

  function calcDiffScore(judgeArray: boolean[]) {
    let diffScore = 0
    for (let i = 0; i < judgeArray.length; i++) {
      if (judgeArray[i]) {
        diffScore += 1
      }
    }
    return diffScore
  }

  function calcDiffMistake(judgeArray: boolean[], shortage: number) {
    let diffMistake = 0
    for (let i = 0; i < judgeArray.length; i++) {
      if (!judgeArray[i]) {
        diffMistake += 1
      }
    }
    diffMistake += shortage
    return diffMistake
  }

  function resetGame() {
    setScore(0)
    setMistake(0)
    setTimePassed(0)
    setFinished(false)
    setTicking(false)
    newLineItems = 0
    setText('')
    isCorrects.current = []
  }

  function isLowerCase(char: string) {
    return char === char.toLowerCase();
  }

  function convertToRomaji(character: string): string {
    return convertTable[character] || ''; // Return the Romaji value from the romajiDict object or an empty string if not found
  }

  function findMatchingString(array: string[], searchString: string) {
    for (let i = 0; i < array.length; i++) {
      const currentString = array[i];
      if (currentString === searchString) {
        return true;
      }
    }
    return false;
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    // Check if the key is a printable character
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }
    const eventTarget = event.currentTarget.value.slice(0, -1 * Number(isInputBlocked)) + event.key;
    const targetLength = targetText[newLineItems].length;
    const currentLength: number = eventTarget.length;
    let textLength: number = Math.min(currentLength, targetLength);
    const isPrintable = /^[ -~]+$/
    if (!isPrintable.test(event.key)) return;

    const currentKey = event.key;
    const currentTargetChar = targetText[newLineItems].charAt(currentIndex); // 打ち込むべき1文字(不要？)
    const currentTargetJapaneseChar = japaneseText[newLineItems].charAt(japaneseIndex); //対象のひらがな1文字
    const tempTargetRomaji = convertToRomaji(currentTargetJapaneseChar);
    const currentTargetRomaji = tempTargetRomaji.split(', ')  // 打ち込むべきローマ字群
    const targetCharLength: number = getLongestString(currentTargetRomaji); // 打ち込むべきローマ字の最大の長さ
    const currentInputtext = eventTarget.slice(-1 * targetCharLength); //今打ち込んでいるローマ字群 (不要？)
    const newWithinCharacterText = isInputBlocked ? prevText.slice(0, -1) + currentKey : prevText + currentKey;

    function prgressTargetSentence() {
      newLineItems += 1;
      setCurrentIndex(0);
      setJapaneseIndex(0)
      isCorrects.current = []
      isJapaneseCorrects.current = []
      setText('');
      setWithinCharacterIndex(0)
      withinCharacterText.current = ''
      setScore((prevscore) => prevscore + 1)
    }

    function progressJapaneseChar() {
      setJapaneseIndex((prevIndex) => prevIndex + 1)
      setWithinCharacterIndex(0)
      withinCharacterText.current = ''
      setScore((prevscore) => prevscore + 1)
      // isCorrects.current.push(true)
      isJapaneseCorrects.current.push(true)
    }

    function getLongestString(array: string[]) {
      let maxLength = 0;
      let longestString = "";

      for (let i = 0; i < array.length; i++) {
        const currentString = array[i];
        const currentLength = currentString.length;

        if (currentLength > maxLength) {
          maxLength = currentLength;
          longestString = currentString;
        }
      }
      return maxLength
    }

    // Check if the key is a 'Backspace'
    if (event.key === 'Backspace' && withinCharacterText.current.length > 0) {
      // Remove the last character from the current text input
      withinCharacterText.current = withinCharacterText.current.slice(0, -1);
      setText((prevText) => prevText.slice(0, -1));
      // isCorrects.current = isCorrects.current.slice(0, -1);
      isCorrects.current.pop();
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setWithinCharacterIndex((prevIndex) => prevIndex - 1)
      setIsInputBlocked(false);
      return;
    }

    if (event.key.length > 1) {
      return;
    }

    if (!isInputBlocked) {
      setWithinCharacterIndex((prevIndex) => prevIndex + 1)
      withinCharacterText.current = withinCharacterText.current + currentKey
      setCurrentIndex((prevIndex) => prevIndex + 1)
      setText((prevText) => prevText + currentKey)
      console.log('check1')
      // const isCorrect = currentTargetChar === currentKey;
      isCorrects.current.push(currentTargetChar === currentKey);
    } else {
      withinCharacterText.current = withinCharacterText.current.slice(0, -1) + currentKey
      setText((prevText) => prevText.slice(0, -1) + currentKey)
    }


    const matched = findMatchingString(currentTargetRomaji, withinCharacterText.current);

    console.log('currentTargetRomaji:' + currentTargetRomaji);
    console.log('withinCharacterText:' + withinCharacterText.current);
    console.log('curentIndex:' + currentIndex);
    console.log('targetCharLength:' + targetCharLength);
    console.log('currentTargetChar:' + currentTargetChar);
    console.log('currentKey:' + currentKey);
    console.log('isCorrect.current:' + isCorrects.current);

    if (matched) {
      if (currentIndex === targetLength - 1) {
        prgressTargetSentence()
      } else {
        progressJapaneseChar()
      }
      // setCurrentIndex((prevIndex) => prevIndex + 1);
      setIsInputBlocked(false);

    } else if (targetCharLength > withinCharacterText.current.length) {

      // isCorrects.current[currentIndex] = findMatchingString(currentTargetRomaji, withinCharacterText.current)
      setIsInputBlocked(false);

    } else if (targetCharLength === withinCharacterText.current.length) {
      setIsInputBlocked(true);
      setMistake((prevMistake) => prevMistake + 1)

    }
    console.log('matched:' + matched);

  }

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    return false
  }

  useEffect(() => {
    if (status === 'running') {
      resetGame()
    }
  }, [status])

  useEffect(() => {
    if (currentIndex < targetText[newLineItems]?.length) {
      if (isLowerCase(targetText[newLineItems]?.charAt(currentIndex))) {
        setNextKey(targetText[newLineItems]?.charAt(currentIndex).toUpperCase())
      } else {
        setNextKey(targetText[newLineItems]?.charAt(currentIndex))
      }
    }
  }, [currentIndex, targetText]);

  useEffect(() => {
    if (judgeArrayUpdated.length > 0) {
      setScore((prevScore) => prevScore + calcDiffScore(judgeArrayUpdated))
      setMistake((prevMistake) => prevMistake + calcDiffMistake(judgeArrayUpdated, shortage))
    }
  }, [judgeArrayUpdated])

  useEffect(() => {
    let tempSentence: string[] = []
    let tempOriginal: string[] = []
    let typingtext: string[] = []
    tempSentence = sentence.split(/(?<=[。、.,!?])/)
    tempOriginal = original.split(/(?<=[。、.,!?])/)
    numSentences = tempSentence.length
    tempSentence.forEach((e, i) => {
      if (e.charAt(0) === ' ') {
        typingtext[i] = e.slice(1)
      } else {
        typingtext[i] = e
      }
    })
    setTargetText(typingtext)
    setjapaneseText(tempOriginal)
  }, [sentence])

  useEffect(() => {
    const allSentencesTyped = newLineItems === numSentences

    if ((totalTime === timePassed || allSentencesTyped) && ticking) {
      finishTime = timePassed
      setTicking(false)
      setFinished(true)
      setScore((prevScore) => prevScore + calcDiffScore(isCorrects.current))
      setMistake((prevMistake) => prevMistake + calcDiffMistake(isCorrects.current, 0))
      setRecord(score / (finishTime / 1000))
      setStatus('result')
    }
  }, [totalTime, timePassed, newLineItems, targetText])

  return (
    <MainContainer addClass="align-middle flex flex-col justify-center items-center">
      <>
        <div className="w-full text-center text-5xl mt-8 mb-0">
          <TimerBase
            totalTime={totalTime}
            timePassed={timePassed}
            setTimePassed={setTimePassed}
            ticking={ticking}
            reset={reset}
            finished={finished}
            setFinished={setFinished}
            attrsParent={attrsParentTimer}
          />
        </div>
        <div className="w-full flex flex-col items-start my-10 relative">
          <div className="absolute top-0 right-0 text-xl">
            <span>Typed: {score}</span>
            <span className="ml-4">Mistakes: {mistake}</span>
          </div>
          <div className="targetText text-4xl mt-8 text-left w-full">
            {japaneseText[newLineItems] && japaneseText[newLineItems].split("").map((char, index) => {
              let className;
              if (index < japaneseIndex) {
                className = isJapaneseCorrects.current[index] ? "text-green-500" : "text-red-500";
              } else if (index === japaneseIndex) {
                className = "text-blue-500 underline";
              } else {
                className = "text-black";
              }
              return (
                <span key={index} className={className}>
                  {char}
                </span>
              );
            })}
          </div>
          <div className="targetText text-4xl mt-8 text-left w-full">
            {targetText[newLineItems] &&
              targetText[newLineItems].split("").map((char, index) => {
                let className;
                if (index < currentIndex) {
                  className = isCorrects.current[index] ? "text-green-500" : "text-red-500";
                } else if (index === currentIndex) {
                  className = "text-blue-500 underline";
                } else {
                  className = "text-black";
                }
                return (
                  <span key={index} className={className}>
                    {char}
                  </span>
                );
              })}
          </div>
          <textarea
            value={text}
            onKeyDown={handleKeyDown}
            onChange={() => { }} // Add a dummy onChange handler
            onPaste={handlePaste}
            className="typedText flex flex-col text-4xl text-left mt-4 w-full"
            tabIndex={0}
            onFocus={() => setNextKey(targetText[currentIndex])}
            autoFocus
            readOnly={false}
          ></textarea>
        </div>
        <div className="text-sm text-gray-400 mt-5 mb-4 text-left">{targetText[newLineItems + 1]}</div>
        <Keyboard nextKey={nextKey} />
        <div className="container flex flex-col justify-end">
          <Fingers nextKey={nextKey} />
        </div>
      </>
    </MainContainer>
  )
}
