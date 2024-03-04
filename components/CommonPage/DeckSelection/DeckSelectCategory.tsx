import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { SearchBox, DeckListButton } from './'
import {

    getDeckListByCategory,
    getDeckListBySearch,
    ReceivedDeck,

} from '@/MyLib/UtilsAPITyping'


const parentClass = 'flex flex-col items-center justify-center p-4 rounded-md'

const buttonClass = 'btn-primary rounded-md m-4 mt-8'

export default function DeckSelectCategory() {
    const [searchType, setSearchType] = useState<'category' | 'text'>('category')
    const [category, setCategory] = useState('')
    const [subcategory, setSubcategory] = useState('')
    const [level, setLevel] = useState('')
    const [nSelect, setNSelect] = useState(10)
    const [orderBy, setOrderBy] = useState('title')
    const [deckList, setDeckList] = useState<ReceivedDeck[]>([])

    const searchOnClick = async () => {
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
        console.log(resJSON)
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
                    <button className={buttonClass} onClick={searchOnClick}> Search </button>
                    <DeckListButton deckList={deckList} />
                </div>
            </MainContainer>
        </Layout>
    )
}
