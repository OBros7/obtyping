// DeckListPager.tsx（クライアントページング版）
'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { DeckListButton } from '.';
import MyPagination from '@/Basics/MyPagination';
import { getDeckListByUser, type ReceivedDeck } from '@/MyLib/UtilsAPITyping';
import { ApiError } from '@/MyLib/apiError';

type Props = {
  userID: number | null;
  perPage?: number;              // 1ページの件数（デフォ 10）
  orderBy?: 'title' | string;
  setLanguage?: React.Dispatch<React.SetStateAction<'not selected' | 'japanese' | 'english' | 'free'>>;
  maxFetch?: number;             // 一度に取る最大件数（デフォ 1000）
};

type KeyAll = ['decks-all', number | null, number, string];

export default function DeckListPager({
  userID,
  perPage = 10,
  orderBy = 'title',
  setLanguage,
  maxFetch = 1000,
}: Props) {
  const [page, setPage] = useState(1);

  const queryKey: KeyAll = ['decks-all', userID, maxFetch, orderBy];
  const queryFn: () => Promise<ReceivedDeck[]> = () =>
    // ★ 既存エンドポイントをそのまま利用。nSelect を大きくして全件相当を取得
    getDeckListByUser(userID, maxFetch, orderBy);

  const { data, status, isFetching, isError, error } = useQuery<
    ReceivedDeck[],  // TQueryFnData
    ApiError,        // TError
    ReceivedDeck[],  // TData
    KeyAll           // TQueryKey
  >({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    enabled: userID != null,
  });

  const isLoading = status === 'pending';
  const all = data ?? [];
  const total = all.length;

  // ★ ここで 10 件ずつに分割
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const decks: ReceivedDeck[] = useMemo(() => all.slice(start, end), [all, start, end]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const startNo = Math.min(total, start + 1);
  const endNo = Math.min(total, end);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="self-end text-sm text-gray-600 mr-2">
        {isFetching && !isLoading ? '更新中…' : total > 0 ? `${startNo}–${endNo} / ${total}` : '0 件'}
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl min-h-[260px]">
          {isLoading ? (
            <div className="text-gray-500 my-6 text-center">読み込み中…</div>
          ) : decks.length === 0 ? (
            <div className="text-gray-500 my-6 text-center">デッキがありません</div>
          ) : (
            <div className="w-full flex flex-col gap-4 items-center">
              <DeckListButton deckList={decks} setLanguage={setLanguage} />
            </div>
          )}
        </div>
      </div>

      <MyPagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
        disabled={isLoading}
      />
    </div>
  );
}
