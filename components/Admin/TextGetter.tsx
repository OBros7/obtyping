import React, { useEffect, useState } from 'react'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { getDeckListByUser, getTextListByDeck } from '@/MyLib/UtilsAPITyping'
import { MyInputNumber, MySelect, MyTextbox, MyTextarea } from '@/Basics'
// import { FormatCategory } from './'
import { FormatCategory } from '@/CommonPage/DeckSelection'

import { get } from 'http'

const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(lang2int)
// const classParDivDefault = 'search-container'
const classParDivDefault = 'flex flex-col items-start space-y-4 w-full'
const classChildDivDefault = 'w-full'

interface Deck {
    deck_id: number
    title: string
    description: string
}

interface TextGetterProps {
    userID: number
    url: string
    title?: string | undefined
    setTitle?: React.Dispatch<React.SetStateAction<string>> | undefined
    visibility?: string | undefined
    visibilityOptions?: string[] | undefined
    setVisibility?: React.Dispatch<React.SetStateAction<string>> | undefined
    text1?: string | undefined
    setText1?: React.Dispatch<React.SetStateAction<string>> | undefined
    text2?: string | undefined
    setText2?: React.Dispatch<React.SetStateAction<string>> | undefined
    lang1: string
    setLang1: React.Dispatch<React.SetStateAction<string>>
    lang2: string
    setLang2: React.Dispatch<React.SetStateAction<string>>
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


export default function TextGetter({
    userID,
    url,
    title,
    setTitle,
    visibility,
    setVisibility,
    visibilityOptions,
    lang1,
    setLang1,
    lang2,
    setLang2,
    text1,
    setText1,
    text2,
    setText2,
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
}: TextGetterProps) {
    const [msg, setMsg] = useState('')
    const [deckTitle, setDeckTitle] = useState('')
    const [deckData, setDeckData] = useState<Deck[]>([])

    useEffect(() => {
        const fetchDeckData = async () => {
            const _deckData = await getDeckListByUser(userID);
            setDeckData(_deckData);
            console.log(_deckData)
        }
        fetchDeckData();
    }, [userID]);

    const onClick = async () => {
        // get deckID from deckTitle
        const filteredDecks = deckData.filter((deck: any) => deck.title === deckTitle);
        if (filteredDecks.length > 0) {
            const deckID = filteredDecks[0].deck_id;
            console.log(deckID)
            const resJSON = await getTextListByDeck(
                deckID,
                nSelect,
                orderBy,
            )

            console.log(resJSON)
            setReturnedData(resJSON)
            setMsg('Done')
        } else {
            setMsg('Deck not found')
        }
    }
    return (
        <div className={classParDiv}>

            {/* <div className={classChildDiv}>
                Number of Select:
                <MyInputNumber
                    state={nSelect}
                    setState={setNSelect}
                    min={1}
                    max={100}
                    step={1}
                    defaultState={10}
                />
            </div> */}

            <div className={classChildDiv}>
                Deck:
                <MySelect
                    state={deckTitle}
                    setState={setDeckTitle}
                    optionValues={deckData.map((deck: any) => deck.title)}
                />
            </div>

            {title !== undefined && setTitle !== undefined ?
                <div className={classChildDiv}>
                    Title:
                    <MyTextbox
                        state={title}
                        setState={setTitle}
                        textboxClass='text-box w-3/4 ml-2'
                    />
                </div>
                : null}

            {visibility !== undefined && setVisibility !== undefined && visibilityOptions !== undefined ?
                <div className={classChildDiv}>
                    Visibility:
                    <MySelect
                        state={visibility}
                        setState={setVisibility}
                        optionValues={visibilityOptions}
                    />
                </div>
                : null}

            {text1 !== undefined && setText1 !== undefined && text2 !== undefined && setText2 !== undefined ?
                <>
                    <div className={`${classChildDiv} flex-grow`}>
                        Text1:
                        <MyTextarea
                            state={text1}
                            setState={setText1}
                            textareaClass='text-box h-48 w-full'
                        />
                    </div>
                    <div className={classChildDiv}>
                        Text2:
                        <MyTextarea
                            state={text2}
                            setState={setText2}
                            textareaClass='text-box h-48 w-full'
                        />
                    </div>
                </>
                : null}

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
            {/* <div className={classChildDiv}>
                Deck:
                <MySelect
                    state={deckTitle}
                    setState={setDeckTitle}
                    optionValues={deckData.map((deck: any) => deck.title)}
                />
            </div> */}
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
