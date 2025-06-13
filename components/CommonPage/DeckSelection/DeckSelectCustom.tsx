'use client';
import React, { useEffect, useState } from 'react';
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
  DeckListButton,
} from '.';
import {
  ReceivedDeck,
  getDeckListByUser,
} from '@/MyLib/UtilsAPITyping';
import { useQuery } from '@tanstack/react-query';
import { showError } from 'utils/toast';
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
  const [pageType, setPageType] = useState<'EditMode' | 'YourDeck'>('YourDeck');

  /* user & query key */
  const [userID, setUserID] = useState(1)

  const [url, setUrl] = useState(urlListGetText[0])
  const [urlList, setUrlList] = useState(urlListGetText)

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

  /* ---------- JSX ---------- */
  return (
    <Layout>
      <MainContainer>
        <div className={mainClass}>
          <MySelect
            state={pageType}
            setState={setPageType}
            optionValues={['YourDeck', 'EditMode']}
            optionTexts={['Your Original Deck', 'Edit Mode']}
          />

          {pageType === 'EditMode' ? (
            /* --- 画面上部のモード選択 --- */
            (<div className='flex flex-col items-center'>
              <div className='flex space-x-32 pb-4'>
                <MySelect
                  state={selectedAction}
                  setState={setSelectedAction}
                  optionValues={['none', 'create', 'edit']}
                  optionTexts={['choose create or edit', 'Create', 'Edit']}
                />
                <MySelect
                  state={dataType}
                  setState={setDataType}
                  optionValues={['none', 'deck', 'text']}
                  optionTexts={['choose deck or text', 'Deck', 'Text']}
                />
              </div>
              {/* ------ ここから分岐レンダリング ------ */}
              {selectedAction === 'create' && dataType === 'text' ? (
                /* 例：TextGetter を表示 */
                (<TextGetter
                  userID={userID}
                  url={fastAPIURL + url}
                  title={title}
                  setTitle={setTitle}
                  visibility={visibility}
                  setVisibility={setVisibility}
                  visibilityOptions={visibilityOptions}
                  text1={text1}
                  setText1={setText1}
                  text2={text2}
                  setText2={setText2}
                  lang1={lang1}
                  setLang1={setLang1}
                  lang2={lang2}
                  setLang2={setLang2}
                  category={category}
                  setCategory={setCategory}
                  subcategory={subcategory}
                  setSubcategory={setSubcategory}
                  level={level}
                  setLevel={setLevel}
                  nSelect={nSelect}
                  setNSelect={setNSelect}
                  setReturnedData={setReturnedData}
                  orderBy={orderBy}
                />)
              ) : selectedAction === 'create' && dataType === 'deck' ? (
                <DeckGetter
                  url={fastAPIURL + url}
                  userID={userID}
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  lang1={lang1}
                  setLang1={setLang1}
                  lang2={lang2}
                  setLang2={setLang2}
                  category={category}
                  setCategory={setCategory}
                  subcategory={subcategory}
                  setSubcategory={setSubcategory}
                  level={level}
                  setLevel={setLevel}
                  nSelect={nSelect}
                  setNSelect={setNSelect}
                  setReturnedData={setReturnedData}
                  orderBy={orderBy}
                />
              ) : selectedAction === 'edit' && dataType === 'text' ? (
                <TextSetter
                  userID={userID}
                  visibilityInt={visibility2int[visibility]}
                  title={title}
                  setTitle={setTitle}
                  visibility={visibility}
                  setVisibility={setVisibility}
                  visibilityOptions={visibilityOptions}
                  text1={text1}
                  setText1={setText1}
                  text2={text2}
                  setText2={setText2}
                  category={category}
                  setCategory={setCategory}
                  subcategory={subcategory}
                  setSubcategory={setSubcategory}
                  level={level}
                  setLevel={setLevel}
                  deck={deck}
                  setDeck={setDeck}
                />
              ) : selectedAction === 'edit' && dataType === 'deck' ? (
                <DeckSetter
                  userID={userID}
                  visibilityInt={visibility2int[visibility]}
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  lang1={lang1}
                  setLang1={setLang1}
                  lang2={lang2}
                  setLang2={setLang2}
                  category={category}
                  setCategory={setCategory}
                  subcategory={subcategory}
                  setSubcategory={setSubcategory}
                  level={level}
                  setLevel={setLevel}
                  orderBy={orderBy}
                  setOrderBy={setOrderBy}
                />
              ) : (
                <p>Please select whether to create / edit, text / deck.</p>
              )}
            </div>)
          ) : pageType === 'YourDeck' ? (
            /* Your Deck 一覧表示 */
            (<DeckListButton
              deckList={fetchedDecks}
              setLanguage={() => { }}
            />)
          ) : null}
        </div>
      </MainContainer>
    </Layout>
  );
}
