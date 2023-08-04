import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { langDict, DeckSelectBasic, DeckSelectCustom, DeckSelectCategory } from './'
import { useAuth, useTranslation } from '@/MyCustomHooks'
import { MySelect } from '@/Basics'

import {
    getDeckListByUser,
    getDeckListBasic,
    getDeckListSelective,
    getDeckListPrivate,
    getDeckListByCategory,
    getDeckListBySearch,
} from '@/MyLib/UtilsAPITyping'


interface DeckSelectionProps {
    typingType: 'basic' | 'custom' | 'category'
}


interface DeckCardProps {
    deckTitle: string
    deckDescription: string
}

interface DeckListProps {
    deckList: DeckCardProps[]
}


export default function DeckSelection() {
    const { user, signedOut, setSignedOut, signOut } = useAuth();
    const [deckList, setDeckList] = useState<DeckCardProps>([])
    const [translater, locale] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
    const [url, setUrl] = useState('get_decklist_basic')
    const [userID, setUserID] = useState<number | null>(null)
    const [lang1, setLang1] = useState(locale)
    const [lang2, setLang2] = useState('')
    const [nSelect, setNSelect] = useState(10)
    const [orderBy, setOrderBy] = useState('date')

    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [level, setLevel] = useState('')
    const [typingType, setTypingType] = useState<'basic' | 'custom' | 'category'>('basic')




    useEffect(() => {
        setUserID(user ? user.user_id : null)
        console.log(locale)
        let resJSON
        // if (url.includes('get_decklist_by_user')) {
        //     resJSON = await getDeckListByUser(userID)
        // } else if (url.includes('get_decklist_basic')) {
        //     resJSON = await getDeckListBasic(
        //         lang1,
        //         lang2,
        //         nSelect,
        //         orderBy,
        //     )
        // } else if (url.includes('get_decklist_selective')) {
        //     resJSON = await getDeckListSelective(
        //         userID,
        //         lang1,
        //         nSelect,
        //         orderBy,
        //     )
        // } else if (url.includes('get_decklist_private')) {
        //     resJSON = await getDeckListPrivate(
        //         userID,
        //         nSelect,
        //         orderBy,
        //     )
        // } else if (url.includes('get_decklist_by_category')) {
        //     resJSON = await getDeckListByCategory(
        //         userID,
        //         category,
        //         subcategory,
        //         level,
        //         nSelect,
        //         orderBy,
        //     )
        // } else if (url.includes('get_decklist_by_search')) {
        //     resJSON = await getDeckListBySearch(
        //         userID,
        //         'search_text',
        //         nSelect,
        //         orderBy,
        //     )
        // } else {
        //     console.log('url not found')
        //     return
        // }


    }, [])


    return (
        <Layout>
            <MainContainer addClass='p-4'>
                <MySelect
                    state={typingType}
                    setState={setTypingType}
                    optionValues={['basic', 'custom', 'category']}
                />
                {typingType === 'basic' ? (
                    <DeckSelectBasic />
                ) : typingType === 'custom' ? (
                    <DeckSelectCustom />
                ) : typingType === 'category' ? (
                    <DeckSelectCategory />
                ) : null}
            </MainContainer>
        </Layout>
    )
}
