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

    /* -------------------------------------------------- */
    const [textIdx, setTextIdx] = useState(0);
    const kanaSentence = textList[textIdx].text11;
    const jpSentence = textList[textIdx].text12;

    const matcher = useMemo(() => new RomajiMatcher(kanaSentence), [kanaSentence]);

    /* 進捗管理 */
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

    /* helper: 動的ローマ字列 */
    const getDynamicDisplay = () => {
        const typedPart = matcher.getTypedString(); // ← 新規 API (実装済みと仮定)
        const currentCand = matcher.getCurrentCandidateRemaining(); // 残り文字列 (現在トークン)
        const rest = matcher.getRemainingTokensDisplay(); // これ以降表示
        return typedPart + currentCand + rest;
    };

    /* keydown */
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (status !== 'running') return;
            if (e.key.length !== 1 || !/^[ -~]$/.test(e.key)) return;
            e.preventDefault();

            const ch = e.key.toLowerCase();
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
                setTextIdx((idx) => (idx + 1) % textList.length);
                setTypedPos(0);
                correctnessRef.current = [];
            }

            const set = matcher.getNextAllowedKeys();
            const rep = set.size ? Array.from(set)[0] : null;
            setNextKey(rep);
            setPressKey(rep);
        },
        [status, matcher, typedPos, setMistake, setScore]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    /* matcher 更新時 (文切替) */
    useEffect(() => {
        const set = matcher.getNextAllowedKeys();
        const rep = set.size ? Array.from(set)[0] : null;
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
            <div className="w-full flex flex-col items-start my-10 relative">
                <div className="absolute top-0 right-0 text-xl">
                    <span>Score: {score}</span>
                    <span className="ml-4">Mistakes: {mistake}</span>
                </div>
                <div className="text-3xl mt-2 mb-1 px-24 underline decoration-2 underline-offset-8 whitespace-pre-wrap">
                    {jpSentence}
                </div>
                <div className="text-4xl mt-1 text-left w-full py-2 px-24 font-mono whitespace-pre-wrap">
                    {romanSpans}
                </div>
            </div>
            <Keyboard nextKey={pressKey} />
            <div className="container flex flex-col justify-end">
                <Fingers nextKey={nextKey} />
            </div>
        </>
    );
}
