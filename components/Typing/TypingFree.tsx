import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { ReceivedText } from '@/MyLib/UtilsAPITyping'

interface TypingFreeProps {
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
  if (potentialEndIndex >= str.length) return potentialEndIndex;

  // 単語の途中で折り返さないように後ろへ走査（最大10文字）
  let searchLimit = 10;
  while (str[potentialEndIndex] !== " " && searchLimit > 0) {
    potentialEndIndex--;
    searchLimit--;
  }
  if (searchLimit === 0) potentialEndIndex = startIndex + charsPerLine;
  return potentialEndIndex;
};

// 先頭 lines 行ぶんを、単語途中で切らずに取り出す
const getPreviewSlice = (str: string, charsPerLine: number, lines: number) => {
  let startIdx = 0;
  for (let i = 0; i < lines; i++) {
    if (startIdx >= str.length) break;
    startIdx = getEndOfLineIndex(str, startIdx, charsPerLine);
  }
  return str.slice(0, startIdx);
};

export default function TypingFree({
  textList,
  setStatus,
  score,
  setScore,
  mistake,
  setMistake,
  languageType,
  mode = '1m',
  remainingTime
}: TypingFreeProps) {

  // ===== 派生値 / 初期値 =====
  const textListLength = textList.length;
  const firstText = textList[0]?.text11 ?? '';

  // ===== state =====
  const [countTextIndex, setCountTextIndex] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>(firstText);
  const [currentTextLength, setCurrentTextLength] = useState<number>(firstText.length);
  const [nextText, setNextText] = useState<string>(textListLength > 1 ? textList[1 % textListLength].text11 : '');

  const [charsPerLine, setCharsPerLine] = useState<number>(80); // 表示幅に応じた1行あたり文字数
  const [inputText, setInputText] = useState<string>('');
  const isCorrects = useRef<boolean[]>([]);
  const refTextBox = useRef<HTMLTextAreaElement>(null);
  const finalizedRef = useRef(false);

  // ===== レイアウト閾値 =====
  const twoXlScrenWordNum = 75;
  const xlScrenWordNum = 60;
  const lgScrenWordNum = 45;
  const mdScrenWordNum = 30;
  const smScrenWordNum = 15;
  const verySmallScrenWordNum = 10;

  // ===== 初回フォーカス =====
  useEffect(() => {
    refTextBox.current?.focus();
  }, []);

  // ===== スコア更新（メモ化）=====
  const scoreUpdate = useCallback((scoreArray: boolean[], shortage: number) => {
    if (scoreArray.length > 0 || shortage > 0) {
      let addNum = 0, missNum = 0;
      for (let i = 0; i < scoreArray.length; i++) {
        if (scoreArray[i]) addNum += 1; else missNum += 1;
      }
      setScore((prev) => prev + addNum);
      setMistake((prev) => prev + missNum + shortage);
    }
  }, [setScore, setMistake]);

  // ===== 入力ハンドラ（メモ化）=====
  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputSentence = event.target.value;
    const inputPosition: number = inputSentence.length;
    setInputText(inputSentence);

    const textLength: number = Math.min(inputPosition, currentTextLength);

    // Enter で確定して次テキストへ
    if (inputSentence.charAt(inputPosition - 1) === '\n') {
      const shortage = Math.abs(currentTextLength - (inputPosition - 1));
      scoreUpdate(isCorrects.current, shortage);
      // 次のテキストへ進める
      setCountTextIndex((i) => (i + 1) % textListLength);
      setInputText('');
    } else {
      isCorrects.current = [];
      for (let i = 0; i < textLength; i++) {
        const charTarget = currentText.charAt(i);
        const char = inputSentence.charAt(i);
        isCorrects.current.push(charTarget === char);
      }
    }
  }, [currentText, currentTextLength, scoreUpdate, textListLength]);

  // ===== 次テキストの先頭2行をプレビュー =====
  const nextTextPreview = useMemo(() => {
    if (!nextText) return '';
    return getPreviewSlice(nextText, charsPerLine, 2);
  }, [nextText, charsPerLine]);

  // ===== テキスト切替：countTextIndex / textList の変化に同期 =====
  useEffect(() => {
    if (textListLength === 0) return;
    const cur = textList[countTextIndex % textListLength].text11;
    const nxt = textList[(countTextIndex + 1) % textListLength]?.text11 ?? '';
    setCurrentText(cur);
    setNextText(nxt);
  }, [countTextIndex, textList, textListLength]);

  // ===== currentText が変わったら各種初期化 =====
  useEffect(() => {
    setInputText('');
    setCurrentTextLength(currentText.length);
    isCorrects.current = [];
  }, [currentText]);

  // ===== タイムアップ時に残スコアを集計 =====
  useEffect(() => {
    if (remainingTime === 0) {
      scoreUpdate(isCorrects.current, 0);
    }
  }, [remainingTime, scoreUpdate]);

  // ===== レスポンシブ：charsPerLine の更新 =====
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

  useEffect(() => {
    // remainingTime が未指定なら何もしない
    if (remainingTime === undefined || remainingTime === null) return;

    // 0以下でタイムアップ（==0 だとフレームの遅れで負になる可能性に対応）
    if (remainingTime <= 0 && !finalizedRef.current) {
      finalizedRef.current = true;     // 二重実行防止
      scoreUpdate(isCorrects.current, 0); // 残り分の集計
      setStatus('result');               // リザルトへ遷移
    }
  }, [remainingTime, scoreUpdate, setStatus]);

  return (
    <>
      <div className="w-full flex flex-col items-start my-10 relative">
        <div className="w-full flex flex-col items-center">
          <div className="text-xl mb-4">
            <span className="ml-4">Score: {score}</span>
            <span className="ml-4">Mistakes: {mistake}</span>
          </div>

          <div className="text-3xl text-center px-6">
            {currentText.split('').map((c, i) => {
              let className = '';
              if (i < inputText.length) {
                className = isCorrects.current[i] ? 'bg-green-500' : 'bg-red-500';
              }
              return (
                <span key={i} className={className}>
                  {/* {c === ' ' ? '\u00A0' : c} */}
                  {c}
                </span>
              );
            })}
          </div>

          {nextTextPreview && (
            <div
              className="mt-3 w-full px-6 text-center text-gray-400 text-sm leading-relaxed select-none"
              style={{
                WebkitMaskImage:
                  'linear-gradient(180deg, rgba(0,0,0,0.9) 60%, rgba(0,0,0,0) 100%)'
              }}
            >
              {nextTextPreview}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center w-full mb-10">
        <textarea
          className="outline outline-2 select-none w-full max-w-4xl px-4 py-3"
          value={inputText}
          ref={refTextBox}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          onChange={handleInputChange}
          rows={5}
          cols={100}
          onMouseDown={(e) => {
            e.preventDefault();
            refTextBox.current?.focus();
            return false;
          }}
          onKeyDown={(e) => {
            if ([33, 34, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
              e.preventDefault();
            }
            return false;
          }}
        ></textarea>
      </div>
    </>
  );
}
