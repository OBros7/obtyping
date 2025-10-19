// components/DeckSelectCategory.tsx
'use client'
import React, { useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { SearchBox, DeckListPager } from './'
import { getDeckListByCategory, ReceivedDeck } from '@/MyLib/UtilsAPITyping'
import { useMutation } from '@tanstack/react-query'
import { showError } from 'utils/toast'
import { ApiError } from '@/MyLib/apiError'

const parentClass = 'flex flex-col items-center justify-center p-4 rounded-md'
const buttonClass = 'btn-primary rounded-md m-4 mt-8'

export default function DeckSelectCategory() {
    /* -------- 検索条件（フォーム状態） -------- */
    const [category, setCategory] = useState<string | null>(null)
    const [subcategory, setSubcategory] = useState<string | null>(null)
    const [level, setLevel] = useState<string | null>(null)
    const [nSelect, setNSelect] = useState(1000)
    const [orderBy, setOrderBy] = useState('title')

    /* -------- 検索結果 -------- */
    const [deckList, setDeckList] = useState<ReceivedDeck[]>([])

    /* -------- React Query mutation -------- */
    const deckSearch = useMutation({
        mutationFn: (p: {
            category: string | null
            subcategory: string | null
            level: string | null
            nSelect: number
            orderBy: string
        }) =>
            // API 側は string を受ける想定なので null は '' に変換
            getDeckListByCategory(
                p.category ?? '',
                p.subcategory ?? '',
                p.level ?? '',
                p.nSelect,
                p.orderBy,
            ),

        onSuccess: (data) => setDeckList(data),
        onError: (e) => {
            const err = e as unknown
            if (err instanceof ApiError)
                showError(`${err.message} (status ${err.status ?? '??'})`)
            else showError('通信に失敗しました')
        },
    })

    const onSearch = () => {
        deckSearch.mutate({ category, subcategory, level, nSelect, orderBy })
    }

    return (
        <Layout>
            <MainContainer addClass='p-4'>
                <div className={parentClass}>
                    <SearchBox
                        category={category}
                        setCategory={setCategory}
                        subcategory={subcategory}
                        setSubcategory={setSubcategory}
                        level={level}
                        setLevel={setLevel}
                    />

                    <button
                        className={buttonClass}
                        onClick={onSearch}
                        disabled={deckSearch.isPending}
                    >
                        {deckSearch.isPending ? 'Loading…' : 'Search'}
                    </button>

                    <DeckListPager
                        mode="byData"
                        deckList={deckList}
                        perPage={10}
                        showPremiumBadge={true}
                    />
                </div>
            </MainContainer>
        </Layout>
    )
}
