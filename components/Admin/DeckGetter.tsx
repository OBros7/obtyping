import React, { useState } from 'react'
// import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { visibility2int, _lang2int } from '@/MyLib/Mapper'
import { MyInputNumber, MySelect, MyTextbox } from '@/Basics'
// import { FormatCategory } from './'
import { FormatCategory } from '@/CommonPage/DeckSelection'
import {
    getDeckListByUser,
    getDeckListBasic,
    getDeckListSelective,
    getDeckListPrivate,
    getDeckListByCategory,
    getDeckListBySearch,
    getDeckListByDeck,
} from '@/MyLib/UtilsAPITyping'

const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(_lang2int)
// const classParDivDefault = 'search-container'
// const classChildDivDefault = 'minibox'
const classParDivDefault = 'flex flex-col items-start space-y-4 w-full'
const classChildDivDefault = 'w-full'


interface DeckGetterProps {
    url: string
    userID: number
    lang1: string
    setLang1: React.Dispatch<React.SetStateAction<string>>
    lang2: string
    setLang2: React.Dispatch<React.SetStateAction<string>>
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    description: string
    setDescription: React.Dispatch<React.SetStateAction<string>>
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    subcategory: string
    setSubcategory: React.Dispatch<React.SetStateAction<string>>
    level: string
    setLevel: React.Dispatch<React.SetStateAction<string>>
    nSelect: number
    setNSelect: React.Dispatch<React.SetStateAction<number>>
    setReturnedData: React.Dispatch<React.SetStateAction<any>>
    orderBy: string
    classParDiv?: string
    classChildDiv?: string
}

export default function DeckGetter(
    {
        url,
        userID,
        lang1,
        setLang1,
        lang2,
        setLang2,
        category,
        setCategory,
        subcategory,
        setSubcategory,
        level,
        setLevel,
        nSelect,
        setNSelect,
        setReturnedData,
        orderBy,
        classParDiv = classParDivDefault,
        classChildDiv = classChildDivDefault,
    }: DeckGetterProps

) {
    const [msg, setMsg] = useState('')
    const [newDeckTitle, setNewDeckTitle] = useState('')
    const [deckDescription, setDeckDescription] = useState('')


    const onClick = async () => {
        console.log(url)
        // send get request
        let resJSON
        if (url.includes('get_decklist_by_user')) {
            resJSON = await getDeckListByUser(userID)
        } else if (url.includes('get_decklist_basic')) {
            resJSON = await getDeckListBasic(
                lang1,
                nSelect,
                orderBy,
            )
        } else if (url.includes('get_decklist_selective')) {
            resJSON = await getDeckListSelective(
                userID,
                lang1,
                nSelect,
                orderBy,
            )
        } else if (url.includes('get_decklist_private')) {
            resJSON = await getDeckListPrivate(
                userID,
                nSelect,
                orderBy,
            )
        } else if (url.includes('get_decklist_by_category')) {
            resJSON = await getDeckListByCategory(
                userID,
                category,
                subcategory,
                level,
                nSelect,
                orderBy,
            )
        } else if (url.includes('get_decklist_by_search')) {
            resJSON = await getDeckListBySearch(
                userID,
                'search_text',
                nSelect,
                orderBy,
            )
            // } else if (url.includes('get_decklist_by_deck')) {
            //     resJSON = await getDeckListByDeck(
            //         userID,
            //         // 'search_text',
            //         // nSelect,
            //         // orderBy,
            //     )
        } else {
            console.log('url not found')
            return
        }

        console.log(resJSON)
        setReturnedData(resJSON)
        setMsg('Done')
    }

    return (
        <div className={classParDiv}>
            <div className={classChildDiv}>
                New Deck Title:
                <MyTextbox
                    state={newDeckTitle}
                    setState={setNewDeckTitle}
                />
            </div>

            <div className={classChildDiv}>
                Deck Description:
                <MyTextbox
                    state={deckDescription}
                    setState={setDeckDescription}
                />
            </div>

            <div className={classChildDiv}>
                Number of Select:
                <MyInputNumber
                    state={nSelect}
                    setState={setNSelect}
                    min={1}
                    max={100}
                    step={1}
                    defaultState={10}
                />
            </div>

            <div className={classChildDiv}>
                Language 1:
                <MySelect
                    state={lang1}
                    setState={setLang1}
                    optionValues={langOptions}
                />
            </div>
            <div className={classChildDiv}>
                Language 2:
                <MySelect
                    state={lang2}
                    setState={setLang2}
                    optionValues={langOptions}
                />
            </div>
            <FormatCategory
                category={category}
                setCategory={setCategory}
                subcategory={subcategory}
                setSubcategory={setSubcategory}
                level={level}
                setLevel={setLevel}
            />
            <div className={`${classChildDiv} flex item-center justify-center py-6`}>
                <button
                    onClick={onClick}
                    className="btn-primary"
                >
                    Submit
                </button>{msg}
            </div>


        </div>

    )
}
