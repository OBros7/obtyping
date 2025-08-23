import React, { useEffect, useMemo, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { langDict, DeckListButton } from './'
import { useTranslation } from '@/MyCustomHooks'
import { getDeckListBasic, ReceivedDeck } from '@/MyLib/UtilsAPITyping'

export default function DeckSelectBasic() {
    // 翻訳オブジェクトは未使用なので locale だけ取り出す
    const [, locale] = useTranslation(langDict) as [{ [K in keyof typeof langDict]: string }, string]

    const [lang1, setLang1] = useState(locale)
    const [nSelect, setNSelect] = useState(10)
    const [orderBy, setOrderBy] = useState('title')
    const [deckList, setDeckList] = useState<ReceivedDeck[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // locale が変わったら lang1 を同期
    useEffect(() => {
        setLang1(locale)
    }, [locale])

    // 依存をまとめて安定化
    const query = useMemo(() => ({ lang1, nSelect, orderBy }), [lang1, nSelect, orderBy])

    useEffect(() => {
        let cancelled = false
            ; (async () => {
                setLoading(true)
                setError(null)
                try {
                    const res = await getDeckListBasic(query.lang1, query.nSelect, query.orderBy)
                    if (!cancelled) setDeckList(res)
                } catch (e: any) {
                    if (!cancelled) setError(e?.message ?? 'Failed to load deck list')
                } finally {
                    if (!cancelled) setLoading(false)
                }
            })()
        return () => {
            cancelled = true
        }
    }, [query])

    return (
        <Layout>
            <MainContainer addClass="p-4">
                {loading && <p>Loading…</p>}
                {error && <p className="text-red-600">Error: {error}</p>}
                {!loading && !error && <DeckListButton deckList={deckList} />}
            </MainContainer>
        </Layout>
    )
}
