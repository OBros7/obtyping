import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { SearchBox, DeckListButton } from './'
import {

    getDeckListByCategory,
    getDeckListBySearch,
    ReceivedDeck,

} from '@/MyLib/UtilsAPITyping'


export default function DeckSelectCategory() {
    const [searchType, setSearchType] = useState<'category' | 'text'>('category')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [level, setLevel] = useState('')
    const [nSelect, setNSelect] = useState(10)
    const [orderBy, setOrderBy] = useState('title')
    const [deckList, setDeckList] = useState<ReceivedDeck[]>([])

    const onClick = async () => {
        // send get request
        let resJSON
        let userID = 1
        if (searchType === 'category') {
            resJSON = await getDeckListByCategory(
                userID,
                category,
                subcategory,
                level,
                nSelect,
                orderBy,
            )
        } else if (searchType === 'text') {
            resJSON = await getDeckListBySearch(
                userID,
                'search_text',
                nSelect,
                orderBy,
            )
        } else {
            console.log('url not found')
            return
        }

        setDeckList(resJSON)
    }


    return (
        <Layout>
            <MainContainer addClass='p-4'>
                <SearchBox
                    category={category}
                    setCategory={setCategory}
                    subcategory={subcategory}
                    setSubcategory={setSubcategory}
                    level={level}
                    setLevel={setLevel}
                />
                <DeckListButton deckList={deckList} />
            </MainContainer>
        </Layout>
    )
}
