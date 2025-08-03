import React, { useEffect, useRef, useState, useCallback } from 'react';
import Keyboard from './Keyboard';
import Fingers from './Fingers';
import { ReceivedText } from '@/MyLib/UtilsAPITyping';

interface TypingJapaneseProps {
    textList: (ReceivedText & { text12: string })[];
    status: 'waiting' | 'ready' | 'setting' | 'running' | 'result';
    setStatus: React.Dispatch<React.SetStateAction<'waiting' | 'ready' | 'setting' | 'running' | 'result'>>;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    mistake: number;
    setMistake: React.Dispatch<React.SetStateAction<number>>;
    languageType?: 'english' | 'japanese' | 'free';
    mode?: '1m' | '2m' | '3m' | '5m';
    remainingTime: number;
    mostMistakenKeys: { key: string; count: number }[];
    setMostMistakenKeys: React.Dispatch<React.SetStateAction<{ key: string; count: number }[]>>;
}

/*
  テキスト表示の改行位置を決めるヘルパー関数。
  スペースで単語を切らないよう、charsPerLine 文字目から最大 10 文字手前まで
  スペースを探して改行位置を決める。
*/
const getEndOfLineIndex = (str: string, startIndex: number, charsPerLine: number): number => {
    let potentialEndIndex = startIndex + charsPerLine;

    if (potentialEndIndex >= str.length) {
        return potentialEndIndex;
    }

    // Move the potential end index back until we find a space or we've moved back 10 characters.
    let searchLimit = 10; // Number of characters to look backward to find a space.
    while (str[potentialEndIndex] !== ' ' && searchLimit > 0) {
        potentialEndIndex--;
        searchLimit--;
    }

    // If we didn't find a space within the search limit, just split at the original end index.
    if (searchLimit === 0) {
        potentialEndIndex = startIndex + charsPerLine;
    }

    return potentialEndIndex;
};

// キー入力を正規化（日本語ローマ字入力では大文字小文字を区別しないので小文字化）
const normalizeKey = (key: string): string => key.toLowerCase();

export default function TypingJapanese({
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
    setMostMistakenKeys,
}: TypingJapaneseProps) {
    /*
      text11 ... 日本語原文（表示用）
      text12 ... ローマ字（タイピング判定用）
    */
    const [nextKey, setNextKey] = useState<string | null>(textList[0]?.text12[0]?.toLowerCase() ?? null);
    const [pressKey, setPressKey] = useState<string | null>(nextKey);
    const [textListLength] = useState<number>(textList.length);
    const [countTextIndex, setCountTextIndex] = useState<number>(0);
    const [countCharWithin, setCountCharWithin] = useState<number>(0); // インデックス（ローマ字側）
    const [currentJPText, setCurrentJPText] = useState<string>(textList[0].text11);
    const [currentRomanText, setCurrentRomanText] = useState<string>(textList[0].text12.toLowerCase());
    const [currentRomanLength, setCurrentRomanLength] = useState<number>(textList[0].text12.length);
    const [nextJPText, setNextJPText] = useState<string>(textList[1 % textListLength].text11);
    const isCorrects = useRef<boolean[]>([]);
    const [charsPerLine, setCharsPerLine] = useState<number>(80); // デフォルト
    const [currentLine, setCurrentLine] = useState<number>(0);
    const [numberOfRows] = useState<number>(5);
    const [endIndicesOfLines, setEndIndicesOfLines] = useState<number[]>([]);
    const [errorKeys, setErrorKeys] = useState<Record<string, number>>({});

    // 画面幅ごとの 1 行文字数
    const twoXlScrenWordNum = 65;
    const xlScrenWordNum = 55;
    const lgScrenWordNum = 45;
    const mdScrenWordNum = 30;
    const smScrenWordNum = 15;
    const verySmallScrenWordNum = 10;

    /**
     * キー入力処理
     */
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            event.preventDefault();
            let inputKey = event.key;
            const isPrintable = /^[ -~]+$/; // Printable ASCII

            if (!isPrintable.test(inputKey)) return;
            if (inputKey === 'Shift') return;

            inputKey = normalizeKey(inputKey);
            const normalizedNextKey = normalizeKey(nextKey || '');

            if (inputKey === normalizedNextKey) {
                // 正解
                isCorrects.current[countCharWithin] = true;
                setScore((prev) => prev + 1);

                if (currentRomanLength - 1 === countCharWithin) {
                    // 文末に到達
                    setCountTextIndex((prev) => prev + 1);
                    setCountCharWithin(0);
                    setCurrentLine(0);
                } else {
                    const nextChar = currentRomanText[countCharWithin + 1] || null;
                    setCountCharWithin((prev) => prev + 1);
                    setNextKey(nextChar);
                    setPressKey(nextChar);

                    // 行末でスペースが押された場合に line を進める
                    if (inputKey === ' ' && countCharWithin + 1 > (endIndicesOfLines[currentLine] || 0)) {
                        setCurrentLine((prev) => prev + 1);
                    }
                }
            } else {
                // ミス
                isCorrects.current[countCharWithin] = false;
                setMistake((prev) => prev + 1);
                if (nextKey) {
                    setErrorKeys((prev) => ({
                        ...prev,
                        [nextKey.toLowerCase()]: (prev[nextKey.toLowerCase()] || 0) + 1,
                    }));
                }
            }
        },
        [nextKey, countCharWithin, currentRomanLength, currentRomanText, endIndicesOfLines, currentLine]
    );

    // グローバルで keydown を監視
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    /**
     * テキスト（JP/Roman）の切り替え
     */
    useEffect(() => {
        const jp = textList[countTextIndex % textListLength].text11;
        const roman = textList[countTextIndex % textListLength].text12.toLowerCase();
        setCurrentJPText(jp);
        setCurrentRomanText(roman);
        setCurrentRomanLength(roman.length);
        setNextJPText(textList[(countTextIndex + 1) % textListLength].text11);
    }, [countTextIndex, textList, textListLength]);

    // テキスト変更時の初期化
    useEffect(() => {
        const firstChar = currentRomanText[0] ?? null;
        setNextKey(firstChar);
        setPressKey(firstChar);
        setCountCharWithin(0);
        setCurrentLine(0);
        isCorrects.current = [];
    }, [currentRomanText]);

    /**
     * レスポンシブで 1 行文字数を更新
     */
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
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * 改行位置を計算
     */
    const calculateEndIndices = () => {
        const localEnd: number[] = [];
        let startIdx = 0;
        while (startIdx < currentRomanText.length) {
            const endIdx = getEndOfLineIndex(currentRomanText, startIdx, charsPerLine);
            localEnd.push(endIdx);
            startIdx = endIdx;
        }
        return localEnd;
    };

    useEffect(() => {
        setEndIndicesOfLines(calculateEndIndices());
    }, [currentRomanText, charsPerLine]);

    /**
     * 残り時間が 0 になったら結果画面へ
     */
    useEffect(() => {
        if (remainingTime <= 0) {
            setStatus('result');
            const getTopMistakenKeys = (limit: number = 3) => {
                const entries = Object.entries(errorKeys);
                if (entries.length === 0) return [];
                entries.sort((a, b) => b[1] - a[1]);
                return entries.slice(0, limit).map(([key, count]) => ({ key, count }));
            };
            setMostMistakenKeys(getTopMistakenKeys());
        }
    }, [remainingTime, errorKeys, setStatus, setMostMistakenKeys]);

    return (
        <>
            <div className="w-full flex flex-col items-start my-10 relative">
                <div className="absolute top-0 right-0 text-xl">
                    <span>Score: {score}</span>
                    <span className="ml-4">Mistakes: {mistake}</span>
                </div>
                {/* 日本語原文を先に表示 */}
                <div className="text-3xl mt-2 mb-1 px-24 underline decoration-2 underline-offset-8 whitespace-pre-wrap">
                    {currentJPText}
                </div>


                {/* ローマ字表示 & ハイライト */}
                <div className="text-4xl mt-2 text-left w-full py-4 px-24">
                    {currentRomanText &&
                        endIndicesOfLines.map((endIdx, rowIndex) => {
                            if (rowIndex < currentLine) return null;
                            if (rowIndex >= currentLine + numberOfRows) return null;

                            const startIdx = rowIndex === 0 ? 0 : endIndicesOfLines[rowIndex - 1];
                            const displayText = currentRomanText.slice(startIdx, endIdx);

                            return (
                                <div key={rowIndex}>
                                    {displayText.split('').map((char, charIndex) => {
                                        let className = 'text-black';
                                        const relativeIndex = startIdx + charIndex;

                                        if (relativeIndex < countCharWithin) {
                                            className = isCorrects.current[relativeIndex]
                                                ? 'text-green-500'
                                                : 'text-red-500 underline';
                                        } else if (relativeIndex === countCharWithin) {
                                            className = isCorrects.current[relativeIndex] !== false
                                                ? 'text-blue-500 underline'
                                                : 'text-red-500 underline';
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

            {/* キーボードと指ガイド */}
            <Keyboard nextKey={pressKey} />
            <div className="container flex flex-col justify-end">
                <Fingers nextKey={nextKey} />
            </div>
        </>
    );
}
