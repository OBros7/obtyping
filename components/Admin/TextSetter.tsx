// デバッグ用 不必要かも？
'use client';
import React, { useEffect, useState } from 'react';
import {
    MySelect,
    MyTextbox,
    MyTextarea,
} from '@/Basics';
import {
    lang2int,
} from '@/MyLib/Mapper';
import {
    PostText,
    PostTextDeck,
    getDeckListByUser,
    createText,
    createTextDeck,
    ReceivedDeck,
} from '@/MyLib/UtilsAPITyping';
import { checkLanguage } from '@/MyLib/UtilsTyping';
import { FormatCategory } from '@/CommonPage/DeckSelection';
import { useQuery, useMutation } from '@tanstack/react-query';
import { showError } from 'utils/toast';
import { ApiError } from '@/MyLib/apiError';

/* ---- 定数 ---- */
const langOptions = Object.keys(lang2int);
const classParDivDefault = 'flex flex-col items-start space-y-4 w-full';
const classChildDivDefault = 'w-full';

/* ---- Props 型は変更なし ---- */
interface TextSetterProps {
    userID: number
    visibilityInt: number
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    visibility?: string | undefined
    visibilityOptions?: string[] | undefined
    setVisibility?: React.Dispatch<React.SetStateAction<string>> | undefined
    text1: string
    setText1: React.Dispatch<React.SetStateAction<string>>
    text2: string
    setText2: React.Dispatch<React.SetStateAction<string>>
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    subcategory: string
    setSubcategory: React.Dispatch<React.SetStateAction<string>>
    level: string
    setLevel: React.Dispatch<React.SetStateAction<string>>
    deck: string
    setDeck: React.Dispatch<React.SetStateAction<string>>
    classParDiv?: string
    classChildDiv?: string
}

/* ---- コンポーネント ---- */
export default function TextSetter(props: TextSetterProps) {
    /* props 分割（略） */
    const {
        userID,
        visibilityInt,
        title,
        setTitle,
        visibility,
        setVisibility,
        visibilityOptions,
        text1,
        setText1,
        text2,
        setText2,
        category,
        setCategory,
        subcategory,
        setSubcategory,
        level,
        setLevel,
        deck,
        setDeck,
        classParDiv = classParDivDefault,
        classChildDiv = classChildDivDefault,
    } = props;

    /* UI state */
    const [isLangLearn, setIsLangLearn] = useState(false);
    const [msg, setMsg] = useState('');
    const [deckID, setDeckID] = useState(-1);
    const [deckTitle, setDeckTitle] = useState('');
    const [deckDescription, setDeckDescription] = useState('');

    /* ---------- ① デッキ一覧取得 ---------- */
    const {
        data: deckData = [],
        isLoading: deckLoading,
        error: deckErr,
        isError: deckIsError,
    } = useQuery<ReceivedDeck[], ApiError>({
        queryKey: ['decks', userID],
        queryFn: () => getDeckListByUser(userID),
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (deckIsError && deckErr)
            showError(`${deckErr.message} (status ${deckErr.status ?? '??'})`);
    }, [deckIsError, deckErr]);

    /* ---------- ② テキスト作成ミューテーション ---------- */
    const textSetter = useMutation({
        mutationFn: async () => {
            /* 入力バリデーション */
            if (!title || !text1)
                throw new ApiError('Please fill in the title and text1', 400);

            if (deckID === -1 && deckTitle === '')
                throw new ApiError('Please fill in the deck title', 400);

            /* 言語推定 */
            const lang1 = checkLanguage(text1);
            const lang1_int = lang2int(lang1) as number;
            let lang2_int: number | null = null;
            if (text2) lang2_int = lang2int(checkLanguage(text2));

            /* API 呼び出し */
            if (deckID === -1) {
                const data: PostTextDeck = {
                    title,
                    text11: text1,
                    text12: null,
                    text21: text2,
                    text22: null,
                    deck_title: deckTitle,
                    deck_description: deckDescription,
                    lang1_int,
                    lang2_int,
                    category,
                    subcategory,
                    level,
                    visibility_int: visibilityInt,
                    shuffle: false,
                };
                return createTextDeck(data);
            } else {
                const data: PostText = {
                    title,
                    text11: text1,
                    text12: null,
                    // text21: text2,
                    // text22: null,
                    // visibility_int: visibilityInt,
                    deck_id: deckID,
                };
                return createText(data);
            }
        },

        onSuccess: (json) => {
            setMsg('Success: ' + JSON.stringify(json));
        },

        onError: (e) => {
            const err = e as ApiError;
            showError(`${err.message} (status ${err.status ?? '??'})`);
            setMsg('Error');
        },
    });

    /* ---------- Submit ---------- */
    const handleSubmit = () => textSetter.mutate();

    /* ---------- JSX ---------- */
    return (
        <div className={classParDiv}>
            {/* Deck 選択 */}
            <div className={classChildDiv}>
                Deck:
                <MySelect
                    state={deckID}
                    setState={setDeckID}
                    optionValues={deckData.map((d) => d.deck_id)}
                    optionTexts={deckData.map((d) => d.title)}
                //   disabled={deckLoading}
                />
            </div>

            {/* Deck 新規作成用フィールド */}
            {deckID === -1 && (
                <>
                    <div className={classChildDiv}>
                        New Deck Title:
                        <MyTextbox state={deckTitle} setState={setDeckTitle} />
                    </div>
                    <div className={classChildDiv}>
                        Deck Description:
                        <MyTextbox
                            state={deckDescription}
                            setState={setDeckDescription}
                        />
                    </div>
                </>
            )}

            {/* テキスト入力など（元コードをほぼ維持） */}
            <div className={classChildDiv}>
                Text Title:
                <MyTextbox
                    state={title}
                    setState={setTitle}
                    textboxClass='text-box w-3/4 ml-2'
                />
            </div>

            {visibility && setVisibility && visibilityOptions && (
                <div className={classChildDiv}>
                    Visibility:
                    <MySelect
                        state={visibility}
                        setState={setVisibility}
                        optionValues={visibilityOptions}
                    />
                </div>
            )}

            <div className={classChildDiv}>
                Translation:
                <MySelect
                    state={isLangLearn}
                    setState={setIsLangLearn}
                    optionValues={['true', 'false']}
                />
            </div>

            {isLangLearn ? (
                <>
                    <div className={`${classChildDiv} flex-grow`}>
                        Text1:
                        <MyTextarea
                            state={text1}
                            setState={setText1}
                            textareaClass='text-box h-48 w-full'
                        />
                    </div>
                    <div className={classChildDiv}>
                        Text2:
                        <MyTextarea
                            state={text2}
                            setState={setText2}
                            textareaClass='text-box h-48 w-full'
                        />
                    </div>
                </>
            ) : (
                <div className={classChildDiv}>
                    Text:
                    <MyTextarea
                        state={text1}
                        setState={setText1}
                        textareaClass='text-box h-96 w-full'
                    />
                </div>
            )}

            <FormatCategory
                category={category}
                setCategory={setCategory}
                subcategory={subcategory}
                setSubcategory={setSubcategory}
                level={level}
                setLevel={setLevel}
            />

            {/* Submit */}
            <div
                className={`${classChildDiv} flex item-center justify-center py-6`}
            >
                <button
                    onClick={handleSubmit}
                    className='btn-primary'
                    disabled={textSetter.isPending || deckLoading}
                >
                    {textSetter.isPending ? 'Loading…' : 'Submit'}
                </button>
                {msg}
            </div>
        </div>
    );
}
