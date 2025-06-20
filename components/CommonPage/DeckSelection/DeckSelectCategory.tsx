// components/DeckSelectCategory.tsx
'use client'
import React, { useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { SearchBox, DeckListButton } from './'
import { getDeckListByCategory, ReceivedDeck } from '@/MyLib/UtilsAPITyping'
import ContentLoader from 'react-content-loader'
import { useMutation } from '@tanstack/react-query'
import { showError } from 'utils/toast'
import { ApiError } from '@/MyLib/apiError'

const parentClass = 'flex flex-col items-center justify-center p-4 rounded-md'
const buttonClass = 'btn-primary rounded-md m-4 mt-8'

export default function DeckSelectCategory() {
    /* -------- 検索条件（フォーム状態） -------- */
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [level, setLevel] = useState('')
    const [nSelect, setNSelect] = useState(10)
    const [orderBy, setOrderBy] = useState('title')

    /* -------- 検索結果 -------- */
    const [deckList, setDeckList] = useState<ReceivedDeck[]>([])

    /* -------- React Query mutation -------- */
    const deckSearch = useMutation({
        // 1. 叩きたい API を mutationFn に
        mutationFn: (p: {
            category: string
            subcategory: string
            level: string
            nSelect: number
            orderBy: string
        }) =>
            getDeckListByCategory(
                p.category,
                p.subcategory,
                p.level,
                p.nSelect,
                p.orderBy,
            ),

        // 2. 成功時はステートに結果をセット
        onSuccess: (data) => setDeckList(data),

        // 3. 失敗時はトースト表示
        onError: (e) => {
            const err = e as unknown
            if (err instanceof ApiError)
                showError(`${err.message} (status ${err.status ?? '??'})`)
            else showError('通信に失敗しました')
        },
    })

    /* -------- ボタンを押したら mutate() -------- */
    // const onSearch = () =>
    //     deckSearch.mutate({ category, subcategory, level, nSelect, orderBy })

    const onSearch = async () => {
        try {
            deckSearch.mutate({ category, subcategory, level, nSelect, orderBy })
        } catch (e) {
            // ここに来るとしたら mutateAsync を使っているか provider が無い
            console.error('unhandled!!!', e)
        }
    }
    /* -------- Skeleton コンポーネント -------- */
    //   const Skeleton = () => (
    //     <div className='flex flex-col items-center justify-center p-4 rounded-md'>
    //       <ContentLoader
    //         speed={2}
    //         width={400}
    //         height={160}
    //         viewBox='0 0 400 160'
    //         backgroundColor='#f3f3f3'
    //         foregroundColor='#ecebeb'
    //       >
    //         <rect x='0' y='0' rx='3' ry='3' width='400' height='10' />
    //         <rect x='0' y='20' rx='3' ry='3' width='400' height='10' />
    //         <rect x='0' y='40' rx='3' ry='3' width='400' height='10' />
    //       </ContentLoader>
    //     </div>
    //   )

    return (
        <Layout>
            <MainContainer addClass='p-4'>
                <div className={parentClass}>
                    {/* 入力フォーム */}
                    <SearchBox
                        category={category}
                        setCategory={setCategory}
                        subcategory={subcategory}
                        setSubcategory={setSubcategory}
                        level={level}
                        setLevel={setLevel}
                    />

                    {/* 検索ボタン */}
                    <button
                        className={buttonClass}
                        onClick={onSearch}
                        disabled={deckSearch.isPending}
                    >
                        {deckSearch.isPending ? 'Loading…' : 'Search'}
                    </button>

                    <DeckListButton deckList={deckList} />
                </div>
            </MainContainer>
        </Layout>
    )
}
