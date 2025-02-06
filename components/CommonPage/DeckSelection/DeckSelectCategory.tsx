import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { SearchBox, DeckListButton } from './'
import {
    getDeckListByCategory,
    getDeckListBySearch,
    ReceivedDeck,
} from '@/MyLib/UtilsAPITyping'
import ContentLoader from 'react-content-loader'

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

    const SkeltonDeckSelectCategory = () => {
        return (
            <div className='flex flex-col items-center justify-center p-4 rounded-md'>
                <ContentLoader
                    speed={2}
                    width={400}
                    height={160}
                    viewBox='0 0 400 160'
                    backgroundColor='#f3f3f3'
                    foregroundColor='#ecebeb'
                >
                    <rect x='0' y='0' rx='3' ry='3' width='400' height='10' />
                    <rect x='0' y='20' rx='3' ry='3' width='400' height='10' />
                    <rect x='0' y='40' rx='3' ry='3' width='400' height='10' />
                </ContentLoader>
            </div>
        )
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
