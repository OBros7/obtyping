'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { Layout, MainContainer } from '@/Layout';
import { TypingPageBase, ReadyScreen, langDict } from './';
import { creteRandomDeck } from './UtilsTyping';
import {
    ReceivedText,
    getTextListByDeck,
} from '@/MyLib/UtilsAPITyping';
import { useTranslation } from '@/MyCustomHooks';
import { ResultDefault } from '@/CommonPage/Result';
import { useQuery } from '@tanstack/react-query';
import { showError } from 'utils/toast';
import { ApiError } from '@/MyLib/apiError';

/* ---------- props ---------- */
interface TypingProps {
    deckId: number;
    minutes: number;
}

type LanguageType = "english" | "japanese" | "free";
type LanguageTypeOrNull = LanguageType | null;

export default function Typing({ deckId, minutes }: TypingProps) {
    /* --- i18n --- */
    const [trans] = useTranslation(langDict);
    const router = useRouter();

    /* --- React Query: テキスト取得 --- */
    const {
        data: textList = [],
        isLoading,
        isError,
        error,
    } = useQuery<ReceivedText[], ApiError>({
        queryKey: ['texts', deckId, minutes],
        queryFn: () =>
            deckId < 0
                ? Promise.resolve(creteRandomDeck(deckId, minutes))
                : getTextListByDeck(deckId, 10, 'title'),
        staleTime: 5 * 60 * 1000,
    });

    /* --- エラーならトースト表示 --- */
    useEffect(() => {
        if (isError && error) {
            showError(`${error.message} (status ${error.status ?? '??'})`);
        }
    }, [isError, error]);

    /* --- UI / 計測 states（旧コードを維持） --- */
    const [status, setStatus] = useState<'waiting' | 'ready' | 'setting' | 'running' | 'result'>(
        'waiting',
    );
    const [score, setScore] = useState(0);
    const [mistake, setMistake] = useState(0);
    const [languageType, setLanguageType] = useState<LanguageTypeOrNull>(null);
    const [mode, setMode] = useState<'1m' | '2m' | '3m' | '5m'>('1m');
    const [cpm, setCpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [recordScore, setRecordScore] = useState(0);
    const [mostMistakenKeys, setMostMistakenKeys] = useState<{ key: string; count: number }[]>([]);

    useEffect(() => {
        if (!router.isReady) return;

        const raw = Array.isArray(router.query.lang)
            ? router.query.lang[0]
            : router.query.lang;

        const key = (raw ?? '').toString().trim().toLowerCase();

        // en/ja/数字やフルスペルの両方をカバー
        const map: Record<string, LanguageType> = {
            en: 'english',
            english: 'english',
            '1': 'english',
            ja: 'japanese',
            japanese: 'japanese',
            '2': 'japanese',
            free: 'free',
            '0': 'free',
        };

        if (key in map) {
            setLanguageType(map[key]);
        } else {
            // 既定値を決めたいならここで
            setLanguageType('free');
        }
    }, [router.isReady, router.query.lang]);

    /* --- データ取得後に waiting へ遷移 --- */
    useEffect(() => {
        if (!isLoading && textList.length > 0) {
            setStatus('waiting');
        }
    }, [isLoading, textList]);

    /* --- スペースキーで ready 回送 --- */
    useEffect(() => {
        const handleSpacePress = (e: KeyboardEvent) => {
            if (e.code === 'Space' && status === 'waiting') setStatus('ready');
        };
        window.addEventListener('keydown', handleSpacePress);
        return () => window.removeEventListener('keydown', handleSpacePress);
    }, [status]);

    /* --- 結果計算ロジック（旧コードそのまま） --- */
    useEffect(() => {
        if (status === 'result') {
            if (score > 0) {
                const tempCpm = Math.round(score / minutes);
                setCpm(tempCpm);
                const acc = score / (score + mistake);
                setAccuracy(Math.round(acc * 10000) / 100);
            } else {
                setCpm(0);
                setAccuracy(0);
                setRecordScore(0);
            }
        }
    }, [status, score, minutes, mistake]);

    useEffect(() => {
        if (status === 'result' && score > 0) {
            setRecordScore(Math.round((cpm * accuracy) / 100));
        }
    }, [cpm, accuracy, score, status]);

    /* --- ハンドラ --- */
    const handleReset = () => {
        setScore(0);
        setMistake(0);
        setCpm(0);
        setAccuracy(0);
        setRecordScore(0);
        setStatus('waiting');
    };

    const handleBackToHome = () => (window.location.href = '/');

    /* ---------- JSX ---------- */
    return (
        <Layout>
            <MainContainer addClass='p-4'>
                {isLoading ? (
                    <div className='flex w-full justify-center items-center text-center text-5xl h-96'>
                        {trans.loading}
                    </div>
                ) : status === 'waiting' ? (
                    <div className='flex w-full justify-center items-center text-center text-5xl h-96'>
                        {trans.pleasePressSpace}
                    </div>
                ) : status === 'ready' ? (
                    <div className='flex w-full justify-center items-center text-center text-5xl h-96'>
                        <ReadyScreen status={status} setStatus={setStatus} />
                    </div>
                ) : status === 'running' ? (
                    textList.length > 0 && languageType && (
                        <TypingPageBase
                            textList={textList}
                            status={status}
                            setStatus={setStatus}
                            score={score}
                            setScore={setScore}
                            mistake={mistake}
                            setMistake={setMistake}
                            languageType={languageType}
                            mode={mode}
                            mostMistakenKeys={mostMistakenKeys}
                            setMostMistakenKeys={setMostMistakenKeys}
                        />
                    )
                ) : (
                    <ResultDefault
                        deckId={deckId}
                        minutes={minutes}
                        record={recordScore}
                        unit=''
                        resultBoxText='Your typing speed is '
                        supplementaryItem1='Accuracy : '
                        supplementaryRecord1={accuracy}
                        supplementaryUnit1='%'
                        supplementaryItem2='cpm : '
                        supplementaryRecord2={cpm}
                        handlePlayAgain={handleReset}
                        handleBackToHome={handleBackToHome}
                        higherBetter
                        mostMistakenKeys={mostMistakenKeys}
                        setMostMistakenKeys={setMostMistakenKeys}
                        mistake={mistake}
                    />
                )}
            </MainContainer>
        </Layout>
    );
}
