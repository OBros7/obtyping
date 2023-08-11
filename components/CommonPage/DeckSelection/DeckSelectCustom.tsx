import React, { useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { MySelect } from '@/Basics'
import { DeckListButton } from './'
import { ReceivedDeck } from '@/MyLib/UtilsAPITyping'

export default function DeckSelectCustom() {
    const [deckList, setDeckList] = useState<ReceivedDeck[]>([])
    const [pageType, setPageType] = useState<'NewDeck' | 'YourDeck'>('YourDeck')

    return (
        <Layout>
            <MainContainer addClass='p-4'>
                <MySelect
                    state={pageType}
                    setState={setPageType}
                    optionValues={['YourDeck', 'NewDeck']}
                    optionTexts={['Your Original Deck', 'Create New Deck']}
                />
                {
                    pageType === 'NewDeck' ?
                        deckList.length === 0 ? <p> You have not created your own decks yet. </p> :
                            <DeckListButton deckList={deckList} /> :
                        pageType === 'YourDeck' ?
                            <p> Your Deck </p> :
                            null
                }
            </MainContainer>
        </Layout>
    )
}
