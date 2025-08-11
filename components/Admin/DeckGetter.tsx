'use client'
import React, { useState } from 'react'
import { MyInputNumber, MySelect, MyTextbox } from '@/Basics'
import { FormatCategory } from '@/CommonPage/DeckSelection'
import {
    getDeckListByUser,
    getDeckListBasic,
    getDeckListPrivate,
    getDeckListByCategory,
} from '@/MyLib/UtilsAPITyping'
import { visibility2int, _lang2int } from '@/MyLib/Mapper'
import { useMutation } from '@tanstack/react-query'
import { showError } from 'utils/toast'
import { ApiError } from '@/MyLib/apiError'

/* ---------- 定数 ---------- */
const visibilityOptions = Object.keys(visibility2int)
// const langOptions = Object.keys(_lang2int)
const langOptions = ['english', 'others']
const classParDivDefault = 'flex flex-col items-start space-y-4 w-full'
const classChildDivDefault = 'w-full'

/* ---------- 型 ---------- */
interface DeckGetterProps {
    url: string
    userID: number
    lang1: string
    setLang1: React.Dispatch<React.SetStateAction<string>>
    lang2: string
    setLang2: React.Dispatch<React.SetStateAction<string>>
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    description: string
    setDescription: React.Dispatch<React.SetStateAction<string>>
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    subcategory: string
    setSubcategory: React.Dispatch<React.SetStateAction<string>>
    level: string
    setLevel: React.Dispatch<React.SetStateAction<string>>
    nSelect: number
    setNSelect: React.Dispatch<React.SetStateAction<number>>
    setReturnedData: React.Dispatch<React.SetStateAction<any>>
    orderBy: string
    classParDiv?: string
    classChildDiv?: string
}

/* ---------- コンポーネント ---------- */
export default function DeckGetter(props: DeckGetterProps) {
    /* 抽出しておくと hooks の依存が最小になる */
    const {
        url,
        userID,
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
        nSelect,
        setNSelect,
        setReturnedData,
        orderBy,
        classParDiv = classParDivDefault,
        classChildDiv = classChildDivDefault,
    } = props

    const [msg, setMsg] = useState('')
    const [newDeckTitle, setNewDeckTitle] = useState('')
    const [deckDescription, setDeckDescription] = useState('')

    /* ---------- useMutation ---------- */
    const deckGetter = useMutation({
        /* ❶ どの URL かに応じて API 関数を切り替え */
        mutationFn: async () => {
            if (url.includes('get_decklist_by_user')) {
                return getDeckListByUser(userID)
            }
            if (url.includes('get_decklist_basic')) {
                return getDeckListBasic(lang1, nSelect, orderBy)
            }
            if (url.includes('get_decklist_custom_by_user')) {
                return getDeckListPrivate(nSelect)
            }
            if (url.includes('get_decklist_by_category')) {
                return getDeckListByCategory(category, subcategory, level, nSelect, orderBy)
            }
            /* ここに新しい API が増えたら else if を追加 */
            throw new ApiError('URL not supported', 400)
        },

        /* ❷ 成功時: 親 state へ結果を渡す */
        onSuccess: (data) => {
            setReturnedData(data)
            setMsg('Done')
        },

        /* ❸ 失敗時: トースト */
        onError: (e) => {
            const err = e as ApiError
            showError(`${err.message} (status ${err.status ?? '??'})`)
            setMsg('Error')
        },
    })

    /* ボタンハンドラ */
    const handleSubmit = () => deckGetter.mutate()

    return (
        <div className={classParDiv}>
            <div className={classChildDiv}>
                Language of the deck
                <MySelect state={lang1} setState={setLang1} optionValues={langOptions} />
            </div>
            <div className={classChildDiv}>
                New Deck Title:
                <MyTextbox state={newDeckTitle} setState={setNewDeckTitle} />
            </div>

            <div className={classChildDiv}>
                Deck Description:
                <MyTextbox state={deckDescription} setState={setDeckDescription} />
            </div>

            {/* <div className={classChildDiv}>
                Number of Select:
                <MyInputNumber
                    state={nSelect}
                    setState={setNSelect}
                    min={1}
                    max={100}
                    step={1}
                    defaultState={10}
                />
            </div> */}

            <FormatCategory
                category={category}
                setCategory={setCategory}
                subcategory={subcategory}
                setSubcategory={setSubcategory}
                level={level}
                setLevel={setLevel}
            />

            <div className={`${classChildDiv} flex item-center justify-center py-6`}>
                <button
                    onClick={handleSubmit}
                    className="btn-primary"
                    disabled={deckGetter.isPending}
                >
                    {deckGetter.isPending ? 'Loading…' : 'Submit'}
                </button>
                {msg}
            </div>
        </div>
    )
}
