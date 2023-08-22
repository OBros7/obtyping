import React, { useEffect, useRef, useState } from 'react'
import Keyboard from './Keyboard'
import Fingers from './Fingers';
import { ReceivedText } from '@/MyLib/UtilsAPITyping'

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
  const [nextKey, setNextKey] = useState<string | null>(textList[0]?.text11[0]);
  const [textListLength, setTextListLength] = useState<number>(textList.length)
  const [countTextIndex, setCountTextIndex] = useState<number>(0)
  const [countCharWithin, setCountCharWithin] = useState<number>(0)// count text within a text
  const [currentText, setCurrentText] = useState<string>(textList[0].text11)
  const [currentTextLength, setCurrentTextLength] = useState<number>(textList[0].text11.length)
  const [nextText, setNextText] = useState<string>(textList[1 % textListLength].text11)
  const isCorrects = useRef<boolean[]>([])


  useEffect(() => {
    // Attach the event listener to the window to handle key press globally
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      // Cleanup listener when the component is unmounted
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextKey, countCharWithin, currentTextLength, currentText]);

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    const inputKey = event.key;
    const isPrintable = /^[ -~]+$/;
    if (!isPrintable.test(inputKey)) return;

    if (inputKey === nextKey) {
      isCorrects.current[countCharWithin] = true;
      setScore((prevScore) => prevScore + 1);
      if (currentTextLength - 1 === countCharWithin) {
        setCountTextIndex((prevIndex) => prevIndex + 1);
        setCountCharWithin(0); // Reset character counter for the new text
        setNextKey(currentText[0]); // Set the next key for the new text
      } else {
        setCountCharWithin((prevIndex) => prevIndex + 1);
        setNextKey(currentText[countCharWithin + 1]); // Set the next key for the next character
      }
    } else {
      isCorrects.current[countCharWithin] = false;
      setMistake((prevMistake) => prevMistake + 1);
    }
  };

  useEffect(() => {
    setCurrentText(textList[countTextIndex % textListLength].text11);
    setNextText(textList[(countTextIndex + 1) % textListLength].text11);
  }, [countTextIndex]);

  return (
    <>
      <div className="w-full flex flex-col items-start my-10 relative"> {/* Add the 'relative' class */}
        {/* Add this new div for displaying typed characters and mistakes count */}
        <div className="absolute top-0 right-0 text-xl">
          <span>Typed: {score}</span>
          <span className="ml-4">Mistakes: {mistake}</span>
        </div>
        <div className="text-4xl mt-8 text-left w-full p-4 outline rounded-lg">
          {currentText &&
            currentText.split("").map((char, index) => {
              let className;
              if (index < countCharWithin) {
                className = isCorrects.current[index] ? "text-green-500" : "text-red-500";
              } else if (index === countCharWithin) {
                className = "text-blue-500 underline";
              } else {
                className = "text-black";
              }
              return (
                <span key={index} className={className}>
                  {char}
                </span>
              )
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
