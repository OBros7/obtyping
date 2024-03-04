import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import langDict from './langDict'
import { useTranslation } from '@/MyCustomHooks'
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
    const [deckName, setDeckName] = useState('');
    const [description, setDescription] = useState('');
    const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]


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
                                    <div className="flex items-center space-x-2">
                                        <p>{translater.newDecName}</p>
                                        <input
                                            type="text"
                                            value={deckName}
                                            onChange={(e) => setDeckName(e.target.value)}
                                            className="input-text border-2 border-black w-48"
                                        />
                                    </div>
                                    <p>{translater.descriptionTextArea}</p>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-96 h-48 border-2 border-black"
                                        style={{ width: '600px' }}
                                    />
                                    <div className="flex flex-col items-center space-y-2">
                                        <button
                                            disabled={!deckName || !description}
                                            className={`${saveButtonClass} ${!deckName || !description ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {translater.save}
                                        </button>
                                    </div>
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
