import React, { useEffect, useRef, useState } from 'react'
import Keyboard from './Keyboard'
import Fingers from './Fingers';
import { ReceivedText } from '@/MyLib/UtilsAPITyping'
import { set } from 'react-hook-form';

interface TypingEnglishProps {
  textList: ReceivedText[]
  setStatus: React.Dispatch<React.SetStateAction<'menu select' | 'setting' | 'running' | 'result'>>
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  mistake: number
  setMistake: React.Dispatch<React.SetStateAction<number>>
  languageType?: 'eg' | 'jp' | 'free'
  mode?: '1m' | '2m' | '3m' | '5m'
}


export default function TypingEnglish(
  {
    textList,
    setStatus,
    score,
    setScore,
    mistake,
    setMistake,
    languageType,
    mode = '1m',
  }: TypingEnglishProps
) {
  const [nextKey, setNextKey] = useState<string | null>(null);
  const [textListLength, setTextListLength] = useState<number>(textList.length)
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0)
  const [currentCharIndex, setCurrentCharIndex] = useState<number>(0)
  const [currentText, setCurrentText] = useState<string>('')
  const [nextText, setNextText] = useState<string>('')
  const [orderList, setOrderList] = useState<number[]>([])
  const [targetText, setTargetText] = useState<string[]>([])
  const refTextBox = useRef<HTMLTextAreaElement>(null)
  const [text, setText] = useState('')
  const isCorrects = useRef<boolean[]>([])
  const [isInputBlocked, setIsInputBlocked] = useState(false);


  useEffect(() => {
    console.log('textList', textList, textList[0].text11)
    if (textListLength === 0) {
      setStatus('menu select')
    } else {
      // shuffle the list of text and create a list of random sentences
      // create a list of random numbers from 1 to textListLength
      const randomList = Array.from({ length: textListLength }, (_, i) => i);
      // shuffle the list
      for (let i = randomList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomList[i], randomList[j]] = [randomList[j], randomList[i]];
      }
      setOrderList(randomList)
      setCurrentTextIndex(randomList[0])
    }
  }, [])


  useEffect(() => {
    // target text selection

  }, [currentTextIndex])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    // Check if the key is a printable character
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    // Check if matches any printable ASCII character (space to tilde)
    const inputKey = event.key;
    const isPrintable = /^[ -~]+$/;
    if (!isPrintable.test(inputKey)) return;

    if (inputKey === 'Enter') {
      // do we need any special handling for Enter?
    }

    // Check if the key is a backspace
    if (inputKey === 'Backspace') {
      // do we need any special handling for Backspace?
    }

    // Check if the key is a tab
    if (inputKey === 'Tab') {
      // do we need any special handling for Tab?
    }

    // Check if the key is an escape  
    if (inputKey === 'Escape') {
      // do we need any special handling for Escape?
    }

    // Check if the key is a delete
    if (inputKey === 'Delete') {
      // do we need any special handling for Delete?
    }

    // check if the key is correct
    if (inputKey === nextKey) {
      // update the score
      setScore((prevscore) => prevscore + 1)
      // update the next key
      setNextKey(targetText[currentTextIndex].charAt(currentCharIndex + 1))
      // update the current index
      setCurrentCharIndex((prevIndex) => prevIndex + 1)
      // update the text
      setText((prevText) => prevText + inputKey)
      // update the isCorrects
      isCorrects.current.push(true)
    } else {
      // update the mistake
      setMistake((prevMistake) => prevMistake + 1)
      // update the isInputBlocked
      setIsInputBlocked(true)
    }





    const eventTarget = event.currentTarget.value.slice(0, -1 * Number(isInputBlocked)) + inputKey;
    const targetLength = targetText[currentTextIndex].length;
    const currentLength: number = eventTarget.length;

    const currentKey = inputKey;
    const currentTargetChar = targetText[currentTextIndex].charAt(currentCharIndex);

    function prgressTargetSentence() {
      setCurrentTextIndex(prev => prev + 1);
      setCurrentCharIndex(0);
      isCorrects.current = []
      setText('');
    }




    if (!isInputBlocked) {
      if (currentKey === currentTargetChar) {
        if (currentCharIndex === targetLength - 1) {
          prgressTargetSentence()
        } else {
          setCurrentCharIndex((prevIndex) => prevIndex + 1);
        }
        setScore((prevscore) => prevscore + 1)
      } else {
        setMistake((prevMistake) => prevMistake + 1)
        setIsInputBlocked(true);
      }
      setText((prevText) => prevText + currentKey);
      isCorrects.current.push(
        currentKey === currentTargetChar
      );
    } else {
      if (currentKey === currentTargetChar) {
        if (currentCharIndex === targetLength - 1) {
          prgressTargetSentence()
        } else {
          setCurrentCharIndex((prevIndex) => prevIndex + 1);
        }
        setScore((prevscore) => prevscore + 1)
        setIsInputBlocked(false);
      } else {
        setMistake((prevMistake) => prevMistake + 1)
      }
      setText((prevText) => prevText.slice(0, -1) + currentKey);
      isCorrects.current[currentCharIndex] = currentKey === currentTargetChar
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault()
    return false
  }

  return (
    <>
      <div className="w-full flex flex-col items-start my-10 relative"> {/* Add the 'relative' class */}
        {/* Add this new div for displaying typed characters and mistakes count */}
        <div className="absolute top-0 right-0 text-xl">
          <span>Typed: {score}</span>
          <span className="ml-4">Mistakes: {mistake}</span>
        </div>
        <div className="targetText text-4xl mt-8 text-left w-full">
          {targetText[currentTextIndex] &&
            targetText[currentTextIndex].split("").map((char, index) => {
              let className;
              if (index < currentCharIndex) {
                className = isCorrects.current[index] ? "text-green-500" : "text-red-500";
              } else if (index === currentCharIndex) {
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
      </div>
      <Keyboard nextKey={nextKey} />
      <div className="container flex flex-col justify-end">
        <Fingers nextKey={nextKey} />
      </div>
    </>
  )
}
