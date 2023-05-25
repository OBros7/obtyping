import React, { useEffect, useState } from 'react'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { getDeckListByUser, setQueryParams } from '@/MyLib/UtilsAPI'
import { MyInputNumber, MySelect } from '@/Basics'
import { FormatCategory } from './'

const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(lang2int)
const classParDivDefault = 'search-container'
const classChildDivDefault = 'minibox'

interface TextGetterProps {
    userID: number
    url: string
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
}: TextGetterProps) {
    const [msg, setMsg] = useState('')
    const [deckTitle, setDeckTitle] = useState('')
    const [deckData, setDeckData] = useState([])

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
        const deckID = deckData.filter((deck: any) => deck.title === deckTitle)[0].deck_id

        // set query parameters
        const data = setQueryParams(
            url,
            userID,
            lang1,
            lang2,
            category,
            subcategory,
            level,
            nSelect,
            orderBy,
            deckID,
        )

        let arrayQueryString = '';

        // handle non-array parameters as before
        const queryString = Object.keys(data)
            .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key as keyof typeof data])}`)
            .join('&');

        // combine both parts of the query string
        const fullQueryString = `${queryString}${arrayQueryString}`;
        console.log('URL', url)
        console.log('Full', fullQueryString)

        // send get request
        console.log(`${url}?${fullQueryString}`)
        const res = await fetch(`${url}?${fullQueryString}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const resJSON = await res.json()
        console.log(resJSON)
        setReturnedData(resJSON)

        setMsg('Done')
    }
    return (
        <div className={classParDiv}>

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
            <div className={classChildDiv}>
                Deck:
                <MySelect
                    state={deckTitle}
                    setState={setDeckTitle}
                    optionValues={deckData.map((deck: any) => deck.title)}
                />
            </div>
            <div className={classChildDiv}>
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
