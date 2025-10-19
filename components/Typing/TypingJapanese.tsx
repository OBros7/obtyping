import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Keyboard from './Keyboard';
import Fingers from './Fingers';
import { ReceivedText } from '@/MyLib/UtilsAPITyping';
import { RomajiMatcher } from './kanaToRomaji';

interface TypingJapaneseProps {
    textList: (ReceivedText & { text11: string; text12: string })[];
    status: 'waiting' | 'ready' | 'setting' | 'running' | 'result';
    setStatus: React.Dispatch<React.SetStateAction<'waiting' | 'ready' | 'setting' | 'running' | 'result'>>;
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    mistake: number;
    setMistake: React.Dispatch<React.SetStateAction<number>>;
    remainingTime: number;
    mostMistakenKeys: { key: string; count: number }[];
    setMostMistakenKeys: React.Dispatch<React.SetStateAction<{ key: string; count: number }[]>>;
    languageType?: 'english' | 'japanese' | 'free';
    mode?: '1m' | '2m' | '3m' | '5m';
}

const SEP = '=separator5784209847=';

const splitBySep = (s: string): string[] =>
    (s ?? '')
        .split(SEP)
        .map((x) => x.trim())
        .filter((x) => x.length > 0);

export default function TypingJapanese(props: TypingJapaneseProps) {
    const {
        textList,
        status,
        setStatus,
        score,
        setScore,
        mistake,
        setMistake,
        remainingTime,
        setMostMistakenKeys,
    } = props;

    /* どのテキストか */
    const [textIdx, setTextIdx] = useState(0);

    /* テキストをセクション分割 */
    const kanaSegments = useMemo(
        () => splitBySep(textList[textIdx]?.text11 || ''),
        [textIdx, textList]
    );
    const jpSegments = useMemo(
        () => splitBySep(textList[textIdx]?.text12 || ''),
        [textIdx, textList]
    );

    /* どのセクションか */
    const [segIdx, setSegIdx] = useState(0);

    /* 現在の表示・判定対象 */
    const currentKana = kanaSegments[segIdx] ?? '';
    const currentJP = jpSegments[segIdx] ?? '';

    /* セクションが切り替わったら進捗をリセット */
    useEffect(() => {
        setTypedPos(0);
        correctnessRef.current = [];
    }, [textIdx, segIdx]);

    /* RomajiMatcher は “現在セクションのかな” に対して作る */
    const matcher = useMemo(() => new RomajiMatcher(currentKana), [currentKana]);

    /* 進捗管理（ローマ字表示の色分け用）*/
    const [typedPos, setTypedPos] = useState(0);
    const [currentMistake, setCurrentMistake] = useState(false);
    const correctnessRef = useRef<boolean[]>([]);

    /* 次キー表示 */
    const [nextKey, setNextKey] = useState<string | null>(null);
    const [pressKey, setPressKey] = useState<string | null>(null);

    /* ミスキー集計 */
    const errorKeysRef = useRef<Record<string, number>>({});
    const addErrorKey = (exp: string) => {
        errorKeysRef.current[exp] = (errorKeysRef.current[exp] || 0) + 1;
    };

    /* 次の文を漢字で表示ため */
    const nextPreviewJP = useMemo(() => {
        if (segIdx + 1 < jpSegments.length) return jpSegments[segIdx + 1] ?? '';
        const nextTextIdx = (textIdx + 1) % textList.length;
        const nextJpSegs = splitBySep(textList[nextTextIdx]?.text12 || '');
        return nextJpSegs[0] ?? '';
    }, [segIdx, jpSegments, textIdx, textList]);

    /* 動的ローマ字列（typed + 現在表示 + 以降の display） */
    const getDynamicDisplay = () => {
        const typed = matcher.getTypedString();
        const currentWord = matcher.getCurrentDisplayWord();
        const rest = matcher.getRemainingTokensDisplay();
        return typed + currentWord + rest;
    };

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (status !== 'running') return;
            if (e.key.length !== 1 || !/^[ -~]$/.test(e.key)) return;
            e.preventDefault();

            // const ch = e.key.toLowerCase();
            const ch = e.key;
            const res = matcher.feed(ch);

            if (!res.accepted) {
                setMistake((m) => m + 1);
                setCurrentMistake(true);
                const exp = matcher.getNextAllowedKeys();
                if (exp.size) addErrorKey(Array.from(exp)[0]);
                correctnessRef.current[typedPos] = false;
                return;
            }

            // 正解
            setCurrentMistake(false);
            setScore((s) => s + 1);
            correctnessRef.current[typedPos] = true;
            setTypedPos((p) => p + 1);

            if (res.finishedAll) {
                // いまのセクションを打ち切った
                if (segIdx < kanaSegments.length - 1) {
                    setSegIdx((i) => i + 1);
                } else {
                    // セクションを全て終えた → 次のテキストへ
                    setTextIdx((idx) => (idx + 1) % textList.length);
                    setSegIdx(0);
                }
                // 次セクション/次テキストの初期化は useEffect で行う
            }

            const rep = matcher.getPreferredNextKey() ?? null;
            setNextKey(rep);
            setPressKey(rep);
        },
        [status, matcher, typedPos, setMistake, setScore, segIdx, kanaSegments.length, textList.length]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    /* matcher 更新時 (セクション切替/文切替) → 次キー初期化 */
    useEffect(() => {
        const rep = matcher.getPreferredNextKey() ?? null;
        setNextKey(rep);
        setPressKey(rep);
    }, [matcher]);

    /* タイマー終了 */
    useEffect(() => {
        if (remainingTime <= 0) {
            setStatus('result');
            const top3 = Object.entries(errorKeysRef.current)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([key, count]) => ({ key, count }));
            setMostMistakenKeys(top3);
        }
    }, [remainingTime, setStatus, setMostMistakenKeys]);

    /* --------------------------------------------------描画 */
    const displayRoman = getDynamicDisplay();
    const romanSpans = displayRoman.split('').map((c, i) => {
        if (i < typedPos) {
            return (
                <span key={i} className={correctnessRef.current[i] ? 'text-green-500' : 'text-red-500'}>
                    {c}
                </span>
            );
        }
        if (i === typedPos) {
            const cls = currentMistake ? 'text-red-500 underline' : 'text-blue-500 underline';
            return (
                <span key={i} className={cls}>
                    {c}
                </span>
            );
        }
        return <span key={i}>{c}</span>;
    });

    return (
        <>
            <div className="relative w-full mt-2 md:mt-4 pt-8">
                <div className="absolute top-0 right-6 md:right-24 flex items-center gap-6 text-sm md:text-base">
                    <span>Score: {score}</span>
                    <span className="ml-4">Mistakes: {mistake}</span>
                </div>

                {/* 原文（現在セクションのみ） */}
                <div className="text-3xl mt-2 mb-1 px-24 underline decoration-2 underline-offset-8 whitespace-pre-wrap">
                    {currentJP}
                </div>

                {/* ひらがな文（現在セクションのみ） */}
                <div className="text-xl mt-2 mb-1 px-24 decoration-2 whitespace-pre-wrap">
                    {currentKana}
                </div>

                {/* ローマ字（動的） */}
                <div className="text-4xl mt-1 text-left w-full py-2 px-24 font-mono whitespace-pre-wrap break-words">
                    {romanSpans}
                </div>

                {nextPreviewJP && (
                    <div
                        className="mt-4 px-24 font-mono text-left w-full text-lg text-gray-400/80 whitespace-pre-wrap break-words"
                        aria-hidden="true"
                    >
                        <div className="inline-block text-black mr-1"></div>{nextPreviewJP}
                    </div>
                )}
            </div>

            <Keyboard nextKey={pressKey} />
            <div className="container flex flex-col justify-end">
                <Fingers nextKey={nextKey} />
            </div>
        </>
    );
}
