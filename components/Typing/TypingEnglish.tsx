import React, { useEffect, useRef, useState } from 'react'
import Keyboard from './Keyboard'
import Fingers from './Fingers';
import { ReceivedText } from '@/MyLib/UtilsAPITyping'

interface TypingEnglishProps {
  textList: ReceivedText[]
  setStatus: React.Dispatch<React.SetStateAction<'waiting' | 'ready' | 'setting' | 'running' | 'result'>>
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  mistake: number
  setMistake: React.Dispatch<React.SetStateAction<number>>
  languageType?: 'english' | 'japanese' | 'free'
  mode?: '1m' | '2m' | '3m' | '5m'
  remainingTime?: number
}

const getEndOfLineIndex = (str: string, startIndex: number, charsPerLine: number): number => {
  let potentialEndIndex = startIndex + charsPerLine;

  // If the potential end index is beyond the string length, just return it.
  if (potentialEndIndex >= str.length) {
    return potentialEndIndex;
  }

  // Move the potential end index back until we find a space or we've moved back 10 characters.
  // This prevents the break in the middle of a word.
  let searchLimit = 10; // Number of characters to look backward to find a space.
  while (str[potentialEndIndex] !== " " && searchLimit > 0) {
    potentialEndIndex--;
    searchLimit--;
  }

  // If we didn't find a space within the search limit, just split at the original end index.
  if (searchLimit === 0) {
    potentialEndIndex = startIndex + charsPerLine;
  }

  return potentialEndIndex;
};

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
    remainingTime
  }: TypingEnglishProps
) {
  const [nextKey, setNextKey] = useState<string | null>(textList[0]?.text11[0].toUpperCase());
  const [pressKey, setPressKey] = useState<string | null>(nextKey ? nextKey.toUpperCase() : null);
  const [textListLength, setTextListLength] = useState<number>(textList.length)
  const [countTextIndex, setCountTextIndex] = useState<number>(0)
  const [countCharWithin, setCountCharWithin] = useState<number>(0)// count text within a text
  const [currentText, setCurrentText] = useState<string>(textList[0].text11)
  const [currentTextLength, setCurrentTextLength] = useState<number>(textList[0].text11.length)
  const [nextText, setNextText] = useState<string>(textList[1 % textListLength].text11)
  const isCorrects = useRef<boolean[]>([])
  const [charsPerLine, setCharsPerLine] = useState<number>(80); // Starting default
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [numberOfRows, setNumberOfRows] = useState<number>(5); // Default to 1 row.
  const [endIndicesOfLines, setEndIndicesOfLines] = useState<number[]>([]);

  const twoXlScrenWordNum = 75;
  const xlScrenWordNum = 60;
  const lgScrenWordNum = 45;
  const mdScrenWordNum = 30;
  const smScrenWordNum = 15;
  const verySmallScrenWordNum = 10;
  const missSound = new Audio('/sounds/beep-03.mp3');

  useEffect(() => {
    // Attach the event listener to the window to handle key press globally
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      // Cleanup listener when the component is unmounted
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextKey, countCharWithin, currentTextLength, currentText]);

  const calculateEndIndices = () => {
    const localEndIndices = [];
    let startIdx = 0;
    while (startIdx < currentText.length) {
      const endDisplayIndex = getEndOfLineIndex(currentText, startIdx, charsPerLine);
      localEndIndices.push(endDisplayIndex);
      startIdx = endDisplayIndex;
    }
    return localEndIndices;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();
    const inputKey = event.key;
    const isPrintable = /^[ -~]+$/;

    if (!isPrintable.test(inputKey)) return;

    if (inputKey === "Shift") {
      return;
    }

    if (inputKey === nextKey) {
      isCorrects.current[countCharWithin] = true;
      setScore((prevScore) => prevScore + 1);

      if (currentTextLength - 1 === countCharWithin) {
        setCountTextIndex((prevIndex) => prevIndex + 1);
        setCountCharWithin(0); // Reset character counter for the new text
        setCurrentLine(0);     // Reset the line whenever you move to the next text
      } else {
        setCountCharWithin((prevIndex) => prevIndex + 1);
        setNextKey(currentText[countCharWithin + 1]);
        setPressKey(currentText[countCharWithin + 1]?.toUpperCase());

        // If we're at a space AND this is the last space on the line, advance to next line
        if (inputKey === " " && countCharWithin + 1 > endIndicesOfLines[currentLine]) {
          setCurrentLine((prevLine) => prevLine + 1);  // Update the line when the current line is completed
        }
      }
    } else {
      isCorrects.current[countCharWithin] = false;
      setMistake((prevMistake) => prevMistake + 1);
      missSound.currentTime = 0
      missSound.play();
    }
  };

  useEffect(() => {
    setCurrentText(textList[countTextIndex % textListLength].text11);
    setNextText(textList[(countTextIndex + 1) % textListLength].text11);
  }, [countTextIndex]);

  useEffect(() => {
    setCurrentLine(0);  // Reset the current line
    setNextKey(currentText[0]);
    setCurrentTextLength(currentText.length);
    isCorrects.current = [];
  }, [currentText]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1536) {
        setCharsPerLine(twoXlScrenWordNum);
      } else if (width >= 1280 && width < 1536) {
        setCharsPerLine(xlScrenWordNum);
      } else if (width >= 1024 && width < 1280) {
        setCharsPerLine(lgScrenWordNum);
      } else if (width >= 768 && width < 1024) {
        setCharsPerLine(mdScrenWordNum);
      } else if (width >= 640 && width < 768) {
        setCharsPerLine(smScrenWordNum);
      } else {
        setCharsPerLine(verySmallScrenWordNum);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call it immediately to set the initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const newEndIndices = calculateEndIndices();
    setEndIndicesOfLines(newEndIndices);
  }, [currentText, charsPerLine]);

  useEffect(() => {
    if (remainingTime === 0) {
      if (isCorrects.current.length > 0) {
        let addNum: number = 0
        let missNum: number = 0
        for (let i = 0; i < isCorrects.current.length; i++) {
          if (isCorrects.current[i]) {
            addNum += 1
          } else {
            missNum += 1
          }
        }
        setScore(score + addNum)
        setMistake(mistake + missNum)
      }
    }
  }, [remainingTime])

  return (
    <>
      <div className="w-full flex flex-col items-start my-10 relative">
        <div className="absolute top-0 right-0 text-xl">
          <span>Score: {score}</span>
          <span className="ml-4">Mistakes: {mistake}</span>
        </div>
        <div className="text-4xl mt-8 text-left w-full p-4 outline rounded-lg">
          {currentText && endIndicesOfLines.map((endIdx, rowIndex) => {
            if (rowIndex < currentLine) {
              return null;
            }

            if (rowIndex >= currentLine + numberOfRows) {
              return null;
            }

            const startIdx = rowIndex === 0 ? 0 : endIndicesOfLines[rowIndex - 1];
            const displayText = currentText.slice(startIdx, endIdx);

            return (
              <div key={rowIndex}>
                {displayText.split("").map((char, charIndex) => {
                  let className;
                  const relativeIndex = startIdx + charIndex;

                  if (relativeIndex < countCharWithin) {
                    className = isCorrects.current[relativeIndex] ? "text-green-500" : "text-red-500 underline";
                  } else if (relativeIndex === countCharWithin) {
                    className = isCorrects.current[relativeIndex] !== false ? "text-blue-500 underline" : "text-red-500 underline";
                  } else {
                    className = "text-black";
                  }

                  return (
                    <span key={charIndex} className={className}>
                      {char}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <Keyboard nextKey={pressKey} />
      <div className="container flex flex-col justify-end">
        <Fingers nextKey={nextKey} />
      </div>
    </>
  );
}
