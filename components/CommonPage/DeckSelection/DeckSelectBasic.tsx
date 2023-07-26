import React, { useEffect, useState } from 'react'
import { Layout, MainContainer } from '@/Layout'
import { langDict } from './'
import { useAuth, useTranslation } from '@/MyCustomHooks'
import {
    getDeckListBasic,
    ReceivedDeck,
} from '@/MyLib/UtilsAPITyping'





export default function DeckSelectBasic() {
    const [translater, locale] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
    const [lang1, setLang1] = useState(locale)
    const [lang2, setLang2] = useState('')
    const [nSelect, setNSelect] = useState(10)
    const [orderBy, setOrderBy] = useState('title')
    const [deckList, setDeckList] = useState<ReceivedDeck[]>([])




    useEffect(() => {
        const fetchDeckList = async () => {
            let resJSON = await getDeckListBasic(
                lang1,
                nSelect,
                orderBy,
            )
            setDeckList(resJSON)
            // return resJSON; // or set it in a state variable.
        }
        const resJSON = fetchDeckList()


        // setDeckList(resJSON)
    }, [])


    return (
        <Layout>
            <MainContainer addClass='p-4'>
                {/* show all deckList using loop*/}

                {deckList.map(deck => (
                    <div key={deck.deck_id}>
                        <h2>{deck.title}</h2>
                        <p>{deck.description}</p>
                    </div>
                ))}

            </MainContainer>
        </Layout>
    )
}
