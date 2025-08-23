// 使用箇所ない 不必要かも？

'use client';

import React, { useState, useEffect } from 'react';
import { MySelect } from '@/Basics';
import langDict from './langDict';
import { useTranslation } from '@/MyCustomHooks';
import {
  ReceivedDeck,
  getDeckListByUser,
  createText,
  PostText,
} from '@/MyLib/UtilsAPITyping';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showError } from 'utils/toast';
import { ApiError } from '@/MyLib/apiError';

/* ---------- 定数 ---------- */
const saveButtonClass = 'btn-second';

/* ---------- Props ---------- */
interface AddTextProps {
  deckList: ReceivedDeck[];
  setDeckList: React.Dispatch<React.SetStateAction<ReceivedDeck[]>>;
  deckName: string;
  setDeckName: React.Dispatch<React.SetStateAction<string>>;
}

export default function AddText({
  deckList,
  setDeckList,
  deckName,
  setDeckName,
}: AddTextProps) {
  /* -------- i18n -------- */
  const [trans] = useTranslation(langDict);

  /* -------- UI states -------- */
  const [userID] = useState(1);
  const [text, setText] = useState('');
  const [textTitle, setTextTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDeckId, setSelectedDeckId] = useState<number | ''>('');

  /* -------- React Query -------- */
  const queryClient = useQueryClient();

  /* ① デッキ一覧取得 */
  const {
    data: fetchedDecks = [],
    isLoading: deckLoading,
    error: deckErr,
    isError: deckIsError,
  } = useQuery<ReceivedDeck[], ApiError>({
    queryKey: ['decks', userID],
    queryFn: () => getDeckListByUser(userID),
    staleTime: 5 * 60 * 1000,
  });

  /* 取得できたら親 state に反映 */
  useEffect(() => {
    setDeckList(fetchedDecks);
  }, [fetchedDecks, setDeckList]);

  useEffect(() => {
    if (deckIsError && deckErr)
      showError(`${deckErr.message} (status ${deckErr.status ?? '??'})`);
  }, [deckIsError, deckErr]);

  /* ② テキスト保存ミューテーション */
  const saveText = useMutation({
    mutationFn: async () => {
      if (!textTitle || !text)
        throw new ApiError(trans.fillTitleAndText, 400);

      if (selectedDeckId === '') throw new ApiError(trans.selectDeck, 400);

      const payload: PostText = {
        title: textTitle,
        text11: text,
        text12: null,
        // text21: '',
        // text22: null,
        // visibility_int: visibility2int.public,
        deck_id: selectedDeckId as number,
      };
      return createText(payload);
    },

    onSuccess: () => {
      alert(trans.saveComplete);

      /* v5 ではオブジェクト形式で渡す */
      if (selectedDeckId !== '') {
        queryClient.invalidateQueries({ queryKey: ['texts', selectedDeckId] });
      }

      setText('');
      setTextTitle('');
      setDescription('');
    },

    onError: (e) => {
      const err = e as ApiError;
      showError(`${err.message} (status ${err.status ?? '??'})`);
    },
  });

  /* -------- JSX -------- */
  return (
    <>
      {deckLoading ? (
        <p>{trans.loading}</p>
      ) : fetchedDecks.length ? (
        <div className='flex flex-col space-y-4'>
          {/* デッキ選択 */}
          <div className='flex items-center justify-center space-x-2'>
            <p>{trans.deckToAddTo}</p>
            <MySelect
              state={selectedDeckId}
              setState={(v) => setSelectedDeckId(Number(v))}
              optionValues={fetchedDecks.map((d) => d.deck_id)}
              optionTexts={fetchedDecks.map((d) => d.title)}
            />
          </div>

          {/* タイトル・説明 */}
          <div className='flex items-center justify-center space-x-2'>
            <p>{trans.textTitle}</p>
            <input
              type='text'
              value={textTitle}
              onChange={(e) => setTextTitle(e.target.value)}
              className='input-text border-2 border-black rounded-md w-80'
            />
          </div>

          <div className='flex items-center justify-center space-x-2'>
            <p>{trans.textDescription}</p>
            <input
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='input-text border-2 border-black rounded-md w-96'
            />
          </div>

          {/* 本文入力 */}
          <div className='flex flex-col items-center justify-center bg-blue-100 border-2 border-blue-200 rounded p-4 my-4'>
            <div className='items-center pb-2'>{trans.descriptionTextArea}</div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className='w-full h-48 border-2 border-black'
            />
          </div>

          {/* 保存ボタン */}
          <div className='flex flex-col items-center justify-center space-y-2'>
            <button
              disabled={!textTitle || !text || saveText.isPending}
              className={`${saveButtonClass} ${!textTitle || !text ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              onClick={() => saveText.mutate()}
            >
              {saveText.isPending ? trans.loading : trans.save}
            </button>
          </div>
        </div>
      ) : (
        <p>{trans.deckNothing}</p>
      )}
    </>
  );
}
