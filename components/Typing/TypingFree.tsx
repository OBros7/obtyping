import React, { useEffect, useRef, useState } from 'react'
import Keyboard from './Keyboard'
import Fingers from './Fingers';
import { ReceivedText } from '@/MyLib/UtilsAPITyping'
import { set } from 'react-hook-form';

interface TypingFreeProps {
  textList: ReceivedText[]
  setStatus: React.Dispatch<React.SetStateAction<'menu select' | 'waiting' | 'ready' | 'setting' | 'running' | 'result'>>
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  mistake: number
  setMistake: React.Dispatch<React.SetStateAction<number>>
  languageType?: 'eg' | 'jp' | 'free'
  mode?: '1m' | '2m' | '3m' | '5m'
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

export default function TypingFree(
  {
    textList,
    setStatus,
    score,
    setScore,
    mistake,
    setMistake,
    languageType,
    mode = '1m',
  }: TypingFreeProps
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
  const [inputText, setInputText] = useState<string>('')
  const refTextBox = useRef<HTMLTextAreaElement>(null)

  const twoXlScrenWordNum = 75;
  const xlScrenWordNum = 60;
  const lgScrenWordNum = 45;
  const mdScrenWordNum = 30;
  const smScrenWordNum = 15;
  const verySmallScrenWordNum = 10;
  const missSound = new Audio('/sounds/beep-03.mp3');

  let sentenceNum: number = 0

  // useEffect(() => {
  //   // Attach the event listener to the window to handle key press globally
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     // Cleanup listener when the component is unmounted
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, [nextKey, countCharWithin, currentTextLength, currentText]);

  useEffect(() => {
    // テキストエリアにフォーカスを当てる
    refTextBox.current?.focus();
  }, []);

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

  const scoreUpdate = (scoreArray: boolean[], shortage: number) => {
    if (scoreArray.length > 0) {
      let addNum: number = 0
      let missNum: number = 0
      for (let i = 0; i < scoreArray.length; i++) {
        if (scoreArray[i]) {
          addNum += 1
        } else {
          missNum += 1
        }
      }
      setScore(score + addNum)
      setMistake(mistake + missNum + shortage)
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputSentence = event.target.value
    const inputPositon: number = inputSentence.length
    setInputText(inputSentence);

    let textLength: number = Math.min(inputPositon, currentTextLength)

    if (inputSentence.charAt(inputPositon - 1) === '\n') {
      let shortage: number = Math.abs(currentTextLength - (inputPositon - 1))
      sentenceNum += 1
      scoreUpdate(isCorrects.current, shortage)
      setCurrentText(textList[sentenceNum].text11)
      setCurrentTextLength(textList[sentenceNum].text11.length)
      setInputText('')
    } else {
      isCorrects.current = []
      for (var i = 0; i < textLength; i++) {
        const charTarget = currentText.charAt(i)
        const char = inputSentence.charAt(i)
        isCorrects.current.push(charTarget === char)
      }
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


  return (
    <>
      <div className="w-full flex flex-col items-start my-10 relative">
        <div className="w-full flex flex-col items-center">
          <div className="text-xl mb-4">
            <span className="ml-4">Score: {score}</span>
            <span className="ml-4">Mistakes: {mistake}</span>
          </div>
          <div className='text-3xl text-center px-6'>
            {currentText.split('').map((c, i) => {
              let className = '';
              if (i < inputText.length) {
                // i文字目までの処理：入力された文字とお題の文字を比較
                className = isCorrects.current[i] ? 'bg-green-500' : 'bg-red-500';
              }

              return (
                <span key={i} className={className}>
                  {c === ' ' ? '\u00A0' : c} {/* スペースの場合は表示用のスペースを使う */}
                </span>
              );
            })}

          </div>

          <div className='text-sm text-gray-400 text-center'>
            {nextText}
          </div>
        </div>

        {/* <div className="text-4xl mt-8 text-left w-full p-4 outline rounded-lg">
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
        </div> */}
      </div>
      <div className="flex justify-center w-full mb-10">
        <textarea
          className="outline outline-2 select-none"
          value={inputText}
          ref={refTextBox}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          onChange={(e) => handleInputChange(e)}
          rows={5}
          cols={100}
          onMouseDown={(e) => {
            e.preventDefault()
            refTextBox.current?.focus()
            return false
          }}
          onKeyDown={(e) => {
            if ([33, 34, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
              e.preventDefault()
            }
            return false
          }}
        ></textarea>
      </div>
    </>
  );
}

