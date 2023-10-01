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

// const getEndOfLineIndex = (str: string, startIndex: number, charsPerLine: number): number => {
//   // const potentialEndIndex = startIndex + charsPerLine;
//   // const remainingStr = str.slice(potentialEndIndex);
//   // const spaceIndex = remainingStr.indexOf(" ");

//   // // If we find a space within the next 10 characters, split there. Otherwise, split at charsPerLine.
//   // // The number 10 is arbitrary and can be adjusted.
//   // if (spaceIndex !== -1 && spaceIndex < 10) {
//   //   return potentialEndIndex + spaceIndex;
//   // } else {
//   //   return potentialEndIndex;
//   // }
//   return startIndex + charsPerLine;
// };

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
  const [charsPerLine, setCharsPerLine] = useState<number>(80); // Starting default
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [numberOfRows, setNumberOfRows] = useState<number>(3); // Default to 1 row.



  useEffect(() => {
    // Attach the event listener to the window to handle key press globally
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      // Cleanup listener when the component is unmounted
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextKey, countCharWithin, currentTextLength, currentText]);

  const handleKeyDown = (event: KeyboardEvent) => {
    console.log('nextKey', nextKey, 'event.key', event.key);
    event.preventDefault();
    const inputKey = event.key;
    const isPrintable = /^[ -~]+$/;
    const endIndexOfCurrentLine = (currentLine + 1) * charsPerLine;
    if (!isPrintable.test(inputKey)) return;

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
        if (countCharWithin + 1 === endIndexOfCurrentLine) {
          setCurrentLine((prevLine) => prevLine + 1);  // Update the line when the current line is completed
        }
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

  // useEffect(() => {
  //   setNextKey(currentText[0]); // Set the next key for the next character
  //   setCurrentTextLength(currentText.length);
  //   isCorrects.current = [];
  // }, [currentText]);

  useEffect(() => {
    setCurrentLine(0);  // Reset the current line
    setNextKey(currentText[0]);
    setCurrentTextLength(currentText.length);
    isCorrects.current = [];
  }, [currentText]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width > 1200) {
        setCharsPerLine(30);
      } else if (width > 992) {
        setCharsPerLine(90);
      } else if (width > 768) {
        setCharsPerLine(80);
      } else {
        setCharsPerLine(70);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call it immediately to set the initial value

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <>
      <div className="w-full flex flex-col items-start my-10 relative">
        {/* ... (rest of the div remains the same) */}

        <div className="text-4xl mt-8 text-left w-full p-4 outline rounded-lg">
          {currentText && (() => {
            return Array.from({ length: numberOfRows }).map((_, rowIndex) => {
              const startDisplayIndex = (currentLine + rowIndex) * charsPerLine;
              const endDisplayIndex = getEndOfLineIndex(currentText, startDisplayIndex, charsPerLine);
              let displayText = currentText.slice(startDisplayIndex, endDisplayIndex);

              return (
                <div key={rowIndex}>
                  {displayText.split("").map((char, charIndex) => {
                    let className;
                    const relativeIndex = charIndex + (currentLine + rowIndex) * charsPerLine;

                    if (relativeIndex < countCharWithin) {
                      className = isCorrects.current[relativeIndex] ? "text-green-500" : "text-red-500";
                    } else if (relativeIndex === countCharWithin) {
                      className = "text-blue-500 underline";
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
            });
          })()}
        </div>
      </div>

      <Keyboard nextKey={nextKey} />
      <div className="container flex flex-col justify-end">
        <Fingers nextKey={nextKey} />
      </div>
    </>
  );
}
