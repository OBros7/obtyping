'use client';
import React, { useEffect, useState, useCallback } from 'react';
import {
  TextGetter,
  TextSetter,
  DeckGetter,
  DeckSetter,
} from '@/Admin';
import { Layout, MainContainer } from '@/Layout';
import { MyInputNumber, MySelect } from '@/Basics';
import { visibility2int, lang2int } from '@/MyLib/Mapper';
import {
  DeckListButton, DeckUploadForm
} from '.';
import {
  ReceivedDeck,
  createDeck,
  getDeckListByUser,
  PostDeck
} from '@/MyLib/UtilsAPITyping';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showError, showSuccess } from 'utils/toast';
import { ApiError } from '@/MyLib/apiError';

/* ---------- 定数 ---------- */
const fastAPIURL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api/typing/'
const selectedActionList = ['choose create or edit', 'Create', 'Edit']
const deckOrText = ['choose deck or text', 'Deck', 'Text']
const dataTypeList = ['choose deck or text', 'Deck', 'Text']
const minibox = 'flex flex-row  justify-center items-center'
const visibilityOptions = Object.keys(visibility2int);
const langOptions = Object.keys(lang2int);
const mainClass = 'flex flex-col items-center justify-center space-y-4';

/* ---------- URL 配列（省略可） ---------- */
const urlListGetText = [
  // 'get_textlist_basic',
  // 'get_textlist_selective',
  // 'get_textlist_private',
  'get_textlist_by_deck',
  // 'get_textlist_by_decklist',
  // 'get_textlist_by_category',
  // 'get_textlist_by_search',
];
const urlListGetDeck = [
  'get_decklist_by_user',
  'get_decklist_basic',
  'get_decklist_selective',
  'get_decklist_private',
  'get_decklist_by_category',
  'get_decklist_by_search'
];

const urlListCreateDeck = [
  'create_deck',
]

const urlListCreateText = [
  'create_text',
]

/* ---------- コンポーネント ---------- */
export default function DeckSelectCustom() {
  /* meta & menu state（元コードを維持） */
  const [selectedAction, setSelectedAction] = useState<'none' | 'create' | 'edit'>('none');
  const [dataType, setDataType] = useState<'none' | 'deck' | 'text'>('none');
  const [pageType, setPageType] = useState<'EditMode' | 'Practice'>('Practice');

  /* user & query key */
  const [userID, setUserID] = useState(1)

  const [url, setUrl] = useState(urlListGetText[0])
  const [urlList, setUrlList] = useState(urlListGetText)
  const [isLangLearn, setIsLangLearn] = useState(false);

  /* ---------- ② この画面用のローカル state ---------- */
  /* （元コードと同じ。例：lang1, title, text1 など） */
  const [lang1, setLang1] = useState(langOptions[0]);
  const [lang2, setLang2] = useState(langOptions[-1])
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [level, setLevel] = useState('')

  /////////// Getter ///////////
  const [nSelect, setNSelect] = useState(10)
  const [orderBy, setOrderBy] = useState('random')

  /////////// Setter ///////////
  const [title, setTitle] = useState('')
  const [visibility, setVisibility] = useState(visibilityOptions[0])

  /////////// Text Setter ///////////
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [deck, setDeck] = useState('')

  /////////// Deck Setter ///////////
  const [description, setDescription] = useState('')
  const [returnedData, setReturnedData] = useState<[{ [key: string]: any }]>([{}]);

  /////////// menu ///////////
  const [deckList, setDeckList] = useState<ReceivedDeck[]>([])
  const [language, setLanguage] = useState<'not selected' | 'japanese' | 'english' | 'free'>('not selected')
  /* ---------- ① デッキ一覧を React Query で取得 ---------- */
  const {
    data: fetchedDecks = [],             // キャッシュされた一覧
    isLoading: deckLoading,
    isError: deckIsError,
    error: deckErr,
  } = useQuery<ReceivedDeck[], ApiError>({
    queryKey: ['decks', userID],
    queryFn: () => getDeckListByUser(userID),
    staleTime: 5 * 60 * 1000,
  });

  /* エラーはトースト表示 */
  useEffect(() => {
    if (deckIsError && deckErr) {
      showError(`${deckErr.message} (status ${deckErr.status ?? '??'})`);
    }
  }, [deckIsError, deckErr]);

  const queryClient = useQueryClient();

  // const saveMutation = useMutation({
  //   /* ❶ リクエスト本体 */
  //   mutationFn: async () => {
  //     if (!title) throw new ApiError('Please fill in the title', 400);

  //     const lang1_int = lang2int(lang1) as number;
  //     const lang2_int = !isLangLearn ? lang2int(lang2) : null;

  //     const postData: PostDeck = {
  //       title,
  //       description,
  //       lang: lang1,
  //       visibility: "private",
  //       typing_mode: "TOPIC", // ここは適宜変更
  //       category_id: null,
  //       subcategory_id: null,
  //       level_id: null,
  //       shuffle: true, // デフォルトは true とする
  //     };
  //     return createDeck(postData);
  //   },

  //   /* ❷ 成功時 */
  //   onSuccess: (json) => {
  //     showSuccess('デッキを保存しました');
  //     queryClient.invalidateQueries({ queryKey: ['decks', userID] });
  //   },

  //   /* ❸ 失敗時 */
  //   onError: (e) => {
  //     const err = e as ApiError;
  //     showError(`${err.message} (status ${err.status ?? '??'})`);
  //   },
  // });

  // /* ---------- DeckUploadForm 呼び出し ---------- */
  // const handleSave = useCallback(
  //   (payload: any) => saveMutation.mutate(payload),
  //   [saveMutation],
  // );

  // // 保存ロジック (handleSave) のあとに追記
  // const handleTest = useCallback(
  //   (payload: { deckName: string; texts: { name: string; content: string }[] }) => {
  //     // ① sessionStorage に保存
  //     sessionStorage.setItem('typingDraft', JSON.stringify(payload));

  //     // ② 新しいタブ (or ウィンドウ) で練習画面を開く
  //     window.open('/typing/practice', '_blank');
  //   },
  //   [],
  // );

  /* ---------- JSX ---------- */
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
            <DeckListButton deckList={fetchedDecks} setLanguage={() => { }} />
          ) : null}
        </div>
      </MainContainer>
    </Layout>
  );
}
