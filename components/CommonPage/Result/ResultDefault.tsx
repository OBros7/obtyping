// components/Typing/ResultDefault.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useUserContext } from '@contexts/UserContext';
import { useTranslation } from '@/MyCustomHooks';

import {
  ResultBox,
  ResultTable,
  ResultButtons,
  ResultGraph,
  langDict,
  createChartData,
  createXY4Graph,
} from './';
import {
  PostRecordTime,
  useRecentRecords,
  useTopScoreRecords,
  useCreateRecordTime,
  ReceivedRecordTime,
} from '@/MyLib/UtilsAPIRecord';
import { useQueryClient } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import type { ChartOptions } from 'chart.js';

/* ----- Chart.js グローバルオプション ----- */
const options: ChartOptions<'line'> = {
  scales: { y: { beginAtZero: false } },
  plugins: { legend: { display: false } },
};

/* ----- Props 型 ----- */
interface ResultDefaultProps {
  deckId: number;
  minutes: number;
  record: number;
  unit?: string;
  resultBoxText?: string;
  topK?: number;
  recentK?: number;
  supplementaryItem1?: string;
  supplementaryRecord1: number;
  supplementaryUnit1?: string;
  supplementaryItem2?: string;
  supplementaryRecord2: number;
  supplementaryUnit2?: string;
  handlePlayAgain: () => void;
  handleBackToHome: () => void;
  higherBetter: boolean;
  mostMistakenKeys: { key: string; count: number }[];
  setMostMistakenKeys: React.Dispatch<
    React.SetStateAction<{ key: string; count: number }[]>
  >;
  mistake: number;
}

export default function ResultDefault({
  deckId,
  minutes,
  record,
  unit,
  resultBoxText,
  topK = 5,
  recentK = 10,
  supplementaryItem1,
  supplementaryRecord1,
  supplementaryUnit1,
  supplementaryItem2,
  supplementaryRecord2,
  supplementaryUnit2,
  handlePlayAgain,
  handleBackToHome,
  higherBetter,
  mostMistakenKeys,
  setMostMistakenKeys,
}: ResultDefaultProps) {
  type MutateCtx = {
    prevRecent: ReceivedRecordTime[];
    prevTop: ReceivedRecordTime[];
  };

  const [translater] = useTranslation(langDict) as [
    { [key in keyof typeof langDict]: string },
    string,
  ];
  const { userData } = useUserContext();
  const qc = useQueryClient();

  /* ---------------- React-Query (取得系) ---------------- */
  const { data: recentRecords = [] } = useRecentRecords(
    userData.loginStatus ? deckId : undefined,
    recentK,
    { enabled: userData.loginStatus },
  );

  const { data: topScoreRecords = [] } = useTopScoreRecords(
    userData.loginStatus ? deckId : undefined,
    topK,
    { enabled: userData.loginStatus },
  );

  /* ---------------- ローカル state ---------------- */
  const [rank, setRank] = useState<'best' | 'topK' | 'none'>('none');
  const [saved, setSaved] = useState(false);

  /* ---------------- React-Query (登録系) ---------------- */
  const createRecordMutation = useCreateRecordTime({
    /* ★ 楽観的更新 */
    onMutate: async (newRec) => {
      await qc.cancelQueries({ queryKey: ['recentRecords', deckId] });
      await qc.cancelQueries({ queryKey: ['topScoreRecords', deckId] });

      const prevRecent =
        qc.getQueryData<ReceivedRecordTime[]>(['recentRecords', deckId, recentK]) || [];
      const prevTop =
        qc.getQueryData<ReceivedRecordTime[]>(['topScoreRecords', deckId, topK]) || [];

      const optimistic: ReceivedRecordTime = {
        ...newRec,
        record_id: -Date.now(),
        user_id: Number(userData.userID),
        timestamp: new Date().toISOString(),
      };

      // recent
      qc.setQueryData(['recentRecords', deckId, recentK], [
        optimistic,
        ...prevRecent,
      ].slice(0, recentK));

      // top score
      qc.setQueryData(['topScoreRecords', deckId, topK], [...prevTop, optimistic]
        .sort((a, b) => b.score - a.score)
        .slice(0, topK),
      );

      return { prevRecent, prevTop };
    },

    /* エラー時ロールバック */
    onError: (_err, _newRec, ctx) => {
      if (ctx?.prevRecent)
        qc.setQueryData(['recentRecords', deckId, recentK], ctx.prevRecent);
      if (ctx?.prevTop)
        qc.setQueryData(['topScoreRecords', deckId, topK], ctx.prevTop);
    },

    /* 成功時フラグ更新（invalidate は hook 内実装で自動） */
    onSuccess: () => {
      setSaved(true);
    },
  });

  /* ----- ① グラフ用データ ----- */
  const chartData = useMemo(() => {
    if (!userData.loginStatus) return createChartData([], []);

    /* ❶ まず "新しい順" で recentK 件だけ抜く */
    const newestFirst = [...recentRecords]
      .sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, recentK);

    /* ❷ グラフは "古い → 新しい" 並びにしたいので reverse() */
    const chronological = newestFirst.reverse();

    const { x, y } = createXY4Graph(chronological, chronological.length);
    return createChartData(x, y);
  }, [userData.loginStatus, recentRecords, recentK]);

  /* ----- ② テーブル用データ（順位の向きは higherBetter に従う） ----- */
  const recordTopK = useMemo(() => {
    const sorted = [...topScoreRecords];
    if (higherBetter) {
      sorted.sort((a, b) => b.score - a.score); // 大きい方が上位
    } else {
      sorted.sort((a, b) => a.score - b.score); // 小さい方が上位
    }
    return sorted;
  }, [topScoreRecords, higherBetter]);

  useEffect(() => {
    if (!userData.loginStatus) return;

    /* Rank 判定 (未保存時のみ) */
    if (!saved) {
      if (topScoreRecords.length === 0) {
        setRank('best');
        return;
      }

      const best = topScoreRecords[0].score;
      const kth = topScoreRecords[topScoreRecords.length - 1].score;

      if (higherBetter) {
        if (record > best) setRank('best');
        else if (topScoreRecords.length < topK || record > kth) setRank('topK');
        else setRank('none');
      } else {
        if (record < best) setRank('best');
        else if (topScoreRecords.length < topK || record < kth) setRank('topK');
        else setRank('none');
      }
    }
  }, [
    recentRecords,
    topScoreRecords,
    saved,
    higherBetter,
    record,
    recentK,
    topK,
    userData.loginStatus,
  ]);

  /* ---------------- 保存ボタン ---------------- */
  const handleSave = () => {
    if (saved) return; // 二重送信ガード

    const data: PostRecordTime = {
      deck_id: deckId,
      score: record,
      wpm: 1,
      cpm: supplementaryRecord2,
      accuracy: supplementaryRecord1,
      seconds: minutes * 60,
    };
    createRecordMutation.mutate(data);
  };

  /* ---------------- 画面 ---------------- */
  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* 上部のボタン群 */}
      <ResultButtons
        handleSave={handleSave}
        handlePlayAgain={handlePlayAgain}
        handleBackToHome={handleBackToHome}
        saved={saved}
      />

      {/* 記録ボックス */}
      <ResultBox
        record={record}
        unit={unit}
        additionalText={resultBoxText}
        supplementaryItem1={supplementaryItem1}
        supplementaryRecord1={supplementaryRecord1}
        supplementaryUnit1={supplementaryUnit1}
        supplementaryItem2={supplementaryItem2}
        supplementaryRecord2={supplementaryRecord2}
        supplementaryUnit2={supplementaryUnit2}
        mistakenKeys={mostMistakenKeys}
      />

      {userData.loginStatus ? (
        <>
          {/* New Record／Top K バナー
          {rank === 'best' && (
            <Banner text="New Record!!" sub={translater.saveRecord} />
          )}
          {rank === 'topK' && (
            <Banner
              text={`Your record is in your top ${topK}!!`}
              sub={translater.saveRecord}
            />
          )} */}

          {/* グラフ & テーブル */}
          <div className="flex flex-col items-center justify-center md:w-4/6 w-full">
            <ResultGraph data={chartData} options={options} />
            <ResultTable
              recordTopK={recordTopK}
              topK={topK}
              record={record}
            />
          </div>

          {/* 下部のボタン群（再掲） */}
          <ResultButtons
            handleSave={handleSave}
            handlePlayAgain={handlePlayAgain}
            handleBackToHome={handleBackToHome}
            saved={saved}
          />
        </>
      ) : (
        <button
          className="text-white text-3xl font-bold bg-green-500 hover:bg-green-700 p-4 rounded m-4"
          onClick={() => signIn()}
        >
          {translater.signinToRecord}
        </button>
      )}
    </div>
  );
}

/* ----- サブコンポーネント：バナー ----- */
function Banner({ text, sub }: { text: string; sub: string }) {
  return (
    <div className="my-2 outline outline-red-500 p-4 rounded bg-red-100 text-center">
      <p className="text-xl font-bold mb-1">{text}</p>
      <p className="text-xl font-bold">{sub}!</p>
    </div>
  );
}
