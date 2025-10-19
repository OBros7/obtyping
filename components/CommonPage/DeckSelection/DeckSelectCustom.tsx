'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Layout, MainContainer } from '@/Layout';
import { MyInputNumber, MySelect } from '@/Basics';
import { DeckListButton, DeckUploadForm, DeckListPager } from '.';
import { ReceivedDeck, getDeckListPrivate, } from '@/MyLib/UtilsAPITyping';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showError, showSuccess } from 'utils/toast';
import { ApiError } from '@/MyLib/apiError';

const mainClass = 'flex flex-col items-center justify-center space-y-4';

export default function DeckSelectCustom() {
  const [pageType, setPageType] = useState<'EditMode' | 'Practice'>('Practice');

  /* user & query key */
  const [userID, setUserID] = useState(1)

  /* ---------- ① デッキ一覧を React Query で取得 ---------- */
  const {
    data: fetchedDecks = [],             // キャッシュされた一覧
    isLoading: deckLoading,
    isError: deckIsError,
    error: deckErr,
  } = useQuery<ReceivedDeck[], ApiError>({
    queryKey: ['decks', userID],
    queryFn: () => getDeckListPrivate(userID),
    staleTime: 5 * 60 * 1000,
  });

  /* エラーはトースト表示 */
  useEffect(() => {
    if (deckIsError && deckErr) {
      showError(`${deckErr.message} (status ${deckErr.status ?? '??'})`);
    }
  }, [deckIsError, deckErr]);

  return (
    <Layout>
      <MainContainer>
        <div className={mainClass}>
          <MySelect
            state={pageType}
            setState={setPageType}
            optionValues={['Practice', 'EditMode']}
            optionTexts={['Your Original Deck', 'Edit Mode']}
          />

          {pageType === 'EditMode' ? (
            <DeckUploadForm />
          ) : pageType === 'Practice' ? (
            <DeckListPager
              mode="byUser"
              userID={userID}
              perPage={10}
              orderBy="title"
              showPremiumBadge={false}
            />
          ) : null}
        </div>
      </MainContainer>
    </Layout>
  );
}
