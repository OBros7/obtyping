import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Keyboard from './Keyboard'
import Fingers from './Fingers';
import { ReceivedText } from '@/MyLib/UtilsAPITyping'

interface TypingEnglishProps {
  textList: ReceivedText[]
  status: 'waiting' | 'ready' | 'setting' | 'running' | 'result'
  setStatus: React.Dispatch<React.SetStateAction<'waiting' | 'ready' | 'setting' | 'running' | 'result'>>
  score: number
  setScore: React.Dispatch<React.SetStateAction<number>>
  mistake: number
  setMistake: React.Dispatch<React.SetStateAction<number>>
  languageType?: 'english' | 'japanese' | 'free'
  mode?: '1m' | '2m' | '3m' | '5m'
  remainingTime: number
  mostMistakenKeys: { key: string; count: number }[]
  setMostMistakenKeys: React.Dispatch<React.SetStateAction<{ key: string; count: number }[]>>
}

const getEndOfLineIndex = (str: string, startIndex: number, charsPerLine: number): number => {
  let potentialEndIndex = startIndex + charsPerLine;
  if (potentialEndIndex >= str.length) return potentialEndIndex;

  let searchLimit = 10;
  while (str[potentialEndIndex] !== " " && searchLimit > 0) {
    potentialEndIndex--;
    searchLimit--;
  }
  if (searchLimit === 0) potentialEndIndex = startIndex + charsPerLine;
  return potentialEndIndex;
};

// クォートを正規化する関数
const normalizeKey = (key: string): string => {
  const quoteMap: Record<string, string> = { '’': "'", '‘': "'", '“': '"', '”': '"' };
  return quoteMap[key] || key;
};

export default function TypingEnglish({
  textList,
  status,
  setStatus,
  score,
  setScore,
  mistake,
  setMistake,
  languageType,
  mode = '1m',
  remainingTime,
  mostMistakenKeys,
  setMostMistakenKeys
}: TypingEnglishProps) {
  // -------- basic derived values / states --------
  const textListLength = textList.length; // ← stateではなく派生値
  const safeFirst = textList[0]?.text11 ?? '';
  const [nextKey, setNextKey] = useState<string | null>(safeFirst[0]?.toUpperCase() ?? null);
  const [pressKey, setPressKey] = useState<string | null>(nextKey ? nextKey.toUpperCase() : null);

  const [countTextIndex, setCountTextIndex] = useState<number>(0);
  const [countCharWithin, setCountCharWithin] = useState<number>(0); // count text within a text

  const [currentText, setCurrentText] = useState<string>(safeFirst);
  const currentTextLength = currentText.length;
  const [nextText, setNextText] = useState<string>(textListLength > 1 ? textList[1 % textListLength].text11 : '');

  const isCorrects = useRef<boolean[]>([]);

  const [charsPerLine, setCharsPerLine] = useState<number>(80);
  const [currentLine, setCurrentLine] = useState<number>(0);
  const [numberOfRows, setNumberOfRows] = useState<number>(5);

  const [errorKeys, setErrorKeys] = useState<Record<string, number>>({});

  const twoXlScrenWordNum = 65;
  const xlScrenWordNum = 55;
  const lgScrenWordNum = 45;
  const mdScrenWordNum = 30;
  const smScrenWordNum = 15;
  const verySmallScrenWordNum = 10;

  const normalizeSourceText = (s: string) => s.replace(/\r\n|\r|\n/g, ' ');

  // 任意の文字列に対して、現在の charsPerLine を使って行末インデックス配列を作る
  const calculateEndIndicesFor = useCallback((text: string) => {
    const indices: number[] = [];
    let startIdx = 0;
    while (startIdx < text.length) {
      const endIdx = getEndOfLineIndex(text, startIdx, charsPerLine);
      indices.push(endIdx);
      startIdx = endIdx;
    }
    return indices;
  }, [charsPerLine]);

  // 現在行の endIndices は useMemo（副作用不要）
  const endIndicesOfLines = useMemo(() => {
    return calculateEndIndicesFor(currentText);
  }, [currentText, calculateEndIndicesFor]);

  // ---- キーハンドラ（useCallbackで安定化） ----
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      event.preventDefault();
      let inputKey = event.key;
      const isSingleChar = inputKey.length === 1 || inputKey === 'Enter';

      inputKey = normalizeKey(inputKey);
      const normalizedNextKey = normalizeKey(nextKey || '');

      if (!isSingleChar) return;
      if (inputKey === 'Shift') return;

      if (inputKey === normalizedNextKey) {
        isCorrects.current[countCharWithin] = true;
        setScore((prev) => prev + 1);

        if (currentTextLength - 1 === countCharWithin) {
          setCountTextIndex((prevIndex) => prevIndex + 1);
          setCountCharWithin(0);
          setCurrentLine(0);
        } else {
          setCountCharWithin((prevIndex) => prevIndex + 1);
          const nextChar = currentText[countCharWithin + 1] || null;
          setNextKey(nextChar);
          setPressKey(nextChar ? nextChar : null);

          // 行末でスペースが押された場合
          if (inputKey === ' ' && countCharWithin + 1 > (endIndicesOfLines[currentLine] || 0)) {
            setCurrentLine((prevLine) => prevLine + 1);
          }
        }
      } else {
        isCorrects.current[countCharWithin] = false;
        setMistake((prevMistake) => prevMistake + 1);

        if (nextKey) {
          setErrorKeys((prev) => ({
            ...prev,
            [nextKey.toLowerCase()]: (prev[nextKey.toLowerCase()] || 0) + 1,
          }));
        }
      }
    },
    [
      nextKey,
      countCharWithin,
      currentTextLength,
      currentText,
      endIndicesOfLines,
      currentLine,
      setScore,       // ← 追加
      setMistake      // ← 追加
    ]
  );

  // リスナー登録は「handleKeyDown」依存の1か所だけ
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // テキスト切替：countTextIndex / textList の変化に同期（重複Effectを統合）
  useEffect(() => {
    if (textListLength === 0) return;

    const curRaw = textList[countTextIndex % textListLength].text11;
    const nxtRaw = textList[(countTextIndex + 1) % textListLength]?.text11 ?? '';

    const cur = normalizeSourceText(curRaw);
    const nxt = normalizeSourceText(nxtRaw);

    setCurrentText(cur);
    setNextText(nxt);

    const first = cur[0] ?? null;
    setNextKey(first);
    setPressKey(first);
    setCountCharWithin(0);
    setCurrentLine(0);
    isCorrects.current = [];
  }, [countTextIndex, textList, textListLength]);

  // レスポンシブ：charsPerLine の更新
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setCharsPerLine(twoXlScrenWordNum);
      else if (width >= 1280) setCharsPerLine(xlScrenWordNum);
      else if (width >= 1024) setCharsPerLine(lgScrenWordNum);
      else if (width >= 768) setCharsPerLine(mdScrenWordNum);
      else if (width >= 640) setCharsPerLine(smScrenWordNum);
      else setCharsPerLine(verySmallScrenWordNum);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // 初期化
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // タイムアップ時の処理
  useEffect(() => {
    if (remainingTime > 0) return;

    setStatus('result');

    const getTopMistakenKeys = (limit: number = 3): { key: string; count: number }[] => {
      const entries = Object.entries(errorKeys);
      if (entries.length === 0) return [];
      entries.sort((a, b) => b[1] - a[1]);
      return entries.slice(0, limit).map(([key, count]) => ({ key, count }));
    };

    setMostMistakenKeys(getTopMistakenKeys());
  }, [remainingTime, errorKeys, setStatus, setMostMistakenKeys]); // ← 依存を明示

  return (
    <>
      <div className="w-full flex flex-col items-start my-10 relative">
        <div className="absolute top-0 right-0 text-xl">
          <span>Score: {score}</span>
          <span className="ml-4">Mistakes: {mistake}</span>
        </div>

        <div className="text-4xl mt-8 text-left w-full py-4 px-24 outline rounded-lg">
          {currentText && endIndicesOfLines.map((endIdx, rowIndex) => {
            if (rowIndex < currentLine) return null;
            if (rowIndex >= currentLine + numberOfRows) return null;

            const startIdx = rowIndex === 0 ? 0 : endIndicesOfLines[rowIndex - 1];
            const displayText = currentText.slice(startIdx, endIdx);

            return (
              <div key={`cur-${rowIndex}`}>
                {displayText.split("").map((char, charIndex) => {
                  const relativeIndex = startIdx + charIndex;
                  let className: string;

                  if (relativeIndex < countCharWithin) {
                    className = isCorrects.current[relativeIndex] ? "text-green-500" : "text-red-500 underline";
                  } else if (relativeIndex === countCharWithin) {
                    className = isCorrects.current[relativeIndex] !== false ? "text-blue-500 underline" : "text-red-500 underline";
                  } else {
                    className = "text-black";
                  }
                  return <span key={charIndex} className={className}>{char}</span>;
                })}
              </div>
            );
          })}

          {(() => {
            const shownCurrentRows = Math.min(
              numberOfRows,
              Math.max(0, endIndicesOfLines.length - currentLine)
            );
            const remainingRows = Math.max(0, numberOfRows - shownCurrentRows);
            if (!nextText || remainingRows === 0) return null;

            const nextEndIndices = calculateEndIndicesFor(nextText);

            return Array.from({ length: Math.min(remainingRows, nextEndIndices.length) }, (_, i) => {
              const startIdx = i === 0 ? 0 : nextEndIndices[i - 1];
              const endIdx = nextEndIndices[i];
              const slice = nextText.slice(startIdx, endIdx);
              return (
                <div key={`next-${i}`} className="text-black">
                  {slice}
                </div>
              );
            });
          })()}
        </div>
      </div>

      <Keyboard nextKey={pressKey} />
      <div className="container flex flex-col justify-end">
        <Fingers nextKey={nextKey} />
      </div>
    </>
  );
}
