// 不必要かも？

'use client';
import React, { useState } from 'react';
import { MySelect, MyTextbox } from '@/Basics';
import { visibility2int, lang2int } from '@/MyLib/Mapper';
import { FormatCategory } from '@/CommonPage/DeckSelection';
import { createDeck } from '@/MyLib/UtilsAPITyping';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showError } from 'utils/toast';
import { ApiError } from '@/MyLib/apiError';

/* --- 省略していた定数を維持 --- */
const langOptions = Object.keys(lang2int);
const classParDivDefault = 'flex flex-col items-start space-y-4 w-full';
const classChildDivDefault = 'w-full';
const orderByList = ['random', 'title', 'like'];

interface DeckSetterProps {
    userID: number
    visibilityInt: number
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    description: string
    setDescription: React.Dispatch<React.SetStateAction<string>>
    lang1: string
    setLang1: React.Dispatch<React.SetStateAction<string>>
    lang2: string
    setLang2: React.Dispatch<React.SetStateAction<string>>
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    subcategory: string
    setSubcategory: React.Dispatch<React.SetStateAction<string>>
    level: string
    setLevel: React.Dispatch<React.SetStateAction<string>>
    orderBy?: string | undefined
    setOrderBy?: React.Dispatch<React.SetStateAction<string>> | undefined
    classParDiv?: string
    classChildDiv?: string
}

export default function DeckSetter(props: DeckSetterProps) {
    /* -------- props 展開 -------- */
    const {
        userID,
        visibilityInt,
        title,
        setTitle,
        description,
        setDescription,
        lang1,
        setLang1,
        lang2,
        setLang2,
        category,
        setCategory,
        subcategory,
        setSubcategory,
        level,
        setLevel,
        orderBy,
        setOrderBy,
        classParDiv = classParDivDefault,
        classChildDiv = classChildDivDefault,
    } = props;

    /* -------- ローカル state -------- */
    const [isLangLearn, setIsLangLearn] = useState(false);
    const [msg, setMsg] = useState('');

    /* -------- React Query mutation -------- */
    const queryClient = useQueryClient();

    const deckMutation = useMutation({
        /* ❶ リクエスト本体 */
        mutationFn: async () => {
            if (!title) throw new ApiError('Please fill in the title', 400);

            const lang1_int = lang2int(lang1) as number;
            const lang2_int = !isLangLearn ? lang2int(lang2) : null;

            const payload = {
                user_id: userID,
                title,
                description,
                lang: lang1,
                visibility: 'public',
                typing_mode: 'topic',
                category_id: null,
                subcategory_id: null,
                level_id: null,
                shuffle: true, // デフォルトでシャッフル
            };
            // const payload = {
            //     user_id: userID,
            //     title,
            //     description,
            //     category,
            //     subcategory,
            //     level,
            //     lang1_int,
            //     lang2_int,
            //     visibility_int: visibilityInt,
            // };
            return createDeck(payload);
        },

        /* ❷ 成功時 */
        onSuccess: (json) => {
            setMsg(JSON.stringify(json));
            // 例: ユーザーのデッキ一覧を再フェッチ
            queryClient.invalidateQueries({ queryKey: ['decks', userID] });
        },

        /* ❸ 失敗時 */
        onError: (e) => {
            const err = e as ApiError;
            showError(`${err.message} (status ${err.status ?? '??'})`);
            setMsg('Error');
        },
    });

    /* -------- JSX -------- */
    return (
        <div className={classParDiv}>
            <div className={classChildDiv}>
                Title:
                <MyTextbox state={title} setState={setTitle} />
            </div>

            <div className={classChildDiv}>
                Description:
                <MyTextbox state={description} setState={setDescription} />
            </div>

            {orderBy && setOrderBy && (
                <div className={`${classChildDiv} items-start`}>
                    OrderBy:
                    <MySelect state={orderBy} setState={setOrderBy} optionValues={orderByList} />
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

            <div className={classChildDiv}>
                Language 1:
                <MySelect state={lang1} setState={setLang1} optionValues={langOptions} />
            </div>

            <div className={classChildDiv}>
                Translation :
                <MySelect
                    state={isLangLearn}
                    setState={setIsLangLearn}
                    optionValues={['true', 'false']}
                />
            </div>

            {isLangLearn && (
                <div className={classChildDiv}>
                    Language 2:
                    <MySelect state={lang2} setState={setLang2} optionValues={langOptions} />
                </div>
            )}

            <div className={`${classChildDiv} flex item-center justify-center py-6`}>
                <button
                    onClick={() => deckMutation.mutate()}
                    className='btn-primary'
                    disabled={deckMutation.isPending}
                >
                    {deckMutation.isPending ? 'Saving…' : 'Submit'}
                </button>
                {msg}
            </div>
        </div>
    );
}
