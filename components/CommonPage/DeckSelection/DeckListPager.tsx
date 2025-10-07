// DeckListPager.tsx（修正版）
'use client';

import React, { useMemo, useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { DeckListButton } from '.';
import MyPagination from '@/Basics/MyPagination';
import { getDeckListByUser, type ReceivedDeck } from '@/MyLib/UtilsAPITyping';
import { ApiError } from '@/MyLib/apiError';

type CommonProps = {
  perPage?: number;
  showPremiumBadge?: boolean;
};
type PropsByUser = CommonProps & {
  mode: 'byUser';
  userID: number | null;
  orderBy?: 'title' | string;
  maxFetch?: number;
};
type PropsByData = CommonProps & {
  mode: 'byData';
  deckList: ReceivedDeck[];
};
type Props = PropsByUser | PropsByData;
type KeyAll = ['decks-all', number | null, number, string];

export default function DeckListPager(props: Props) {
  const { perPage = 10, showPremiumBadge = false } = props;
  const [page, setPage] = useState(1);

  const isByUser = props.mode === 'byUser';
  const userID = isByUser ? props.userID : null;
  const maxFetch = isByUser ? (props.maxFetch ?? 1000) : 0;
  const orderBy = isByUser ? (props.orderBy ?? 'title') : 'title';

  // ★ フックは常に一度だけ呼ぶ。byData の場合は enabled:false で無効化
  const { data, status, isFetching } = useQuery<
    ReceivedDeck[],
    ApiError,
    ReceivedDeck[],
    KeyAll
  >({
    queryKey: ['decks-all', userID, maxFetch, orderBy],
    queryFn: () => getDeckListByUser(userID, maxFetch, orderBy),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    enabled: isByUser && userID != null, // ← ここで制御
  });

  // データの決定
  const all: ReceivedDeck[] = isByUser ? (data ?? []) : (props.deckList ?? []);
  const isLoading = isByUser ? status === 'pending' : false;
  const fetchingUI = isByUser && isFetching && !isLoading;

  // ページング
  const total = all.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const decks = useMemo(() => all.slice(start, end), [all, start, end]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const startNo = Math.min(total, start + 1);
  const endNo = Math.min(total, end);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="self-end text-sm text-gray-600 mr-2">
        {fetchingUI ? '更新中…' : total > 0 ? `${startNo}–${endNo} / ${total}` : '0 件'}
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-6xl min-h-[260px]">
          {isLoading ? (
            <div className="text-gray-500 my-6 text-center">読み込み中…</div>
          ) : decks.length === 0 ? (
            <div className="text-gray-500 my-6 text-center">デッキがありません</div>
          ) : (
            <div className="w-full flex flex-col gap-4 items-center">
              <DeckListButton deckList={decks} showPremiumBadge={showPremiumBadge} />
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
