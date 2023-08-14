import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { MySelect } from '@/Basics'
import {
    DeckListButton,


} from './'
import {
    ReceivedDeck,
    getDeckListByUser,
} from '@/MyLib/UtilsAPITyping'



const mainClass = 'flex flex-col items-center justify-center space-y-4'
const saveButtonClass = 'btn-second '

export default function DeckSelectCustom() {
    const [deckList, setDeckList] = useState<ReceivedDeck[]>([])
    const [pageType, setPageType] = useState<'NewDeck' | 'YourDeck'>('YourDeck')


    useEffect(() => {
        const userID = 1
        const fetchDeckList = async () => {
            let resJSON = await getDeckListByUser(userID)
            setDeckList(resJSON)
            // return resJSON; // or set it in a state variable.
        }
        fetchDeckList()
        // setDeckList(resJSON)
    }, [])

    return (
        <Layout>
            <MainContainer addClass='p-4'>
                <div className={mainClass}>
                    <MySelect
                        state={pageType}
                        setState={setPageType}
                        optionValues={['YourDeck', 'NewDeck']}
                        optionTexts={['Your Original Deck', 'Create New Deck']}
                    />
                    {
                        pageType === 'NewDeck' ?
                            deckList.length === 0 ? <p> You have not created your own decks yet. </p> :
                                <>
                                    <p>Text Creation: 大地が作ったテキスト入力するボックス</p>
                                    <button className={saveButtonClass}>保存する</button>
                                </>
                            :
                            pageType === 'YourDeck' ?
                                <DeckListButton deckList={deckList} /> :
                                null
                    }
                </div>

            </MainContainer>
        </Layout>
    )
}
