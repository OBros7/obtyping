import React, { useState } from 'react'
import { MyInputNumber, MySelect } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing'

const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(lang2int)
const minibox = 'flex flex-row  justify-center items-center'

const getTypeList = [
    'get_textlist/basic',
    'get_textlist/selective',
    'get_textlist/private',
    'get_textlist_by_category',
    'get_textlist_by_deck',
    'get_textlist_by_level'
]


export default function TypingGetter() {
    const [visibility, setVisibility] = useState(visibilityOptions[0])
    const [lang1, setLang1] = useState(langOptions[0])
    const [lang2, setLang2] = useState(langOptions[-1])
    const [typingData, setTypingData] = useState<{ [key: string]: any }>({});
    const [userID, setUserID] = useState(1)
    const [getType, setGetType] = useState(getTypeList[0])
    const [nSelect, setNSelect] = useState(10)
    const [category, setCategory] = useState('None')
    const [subcategory, setSubcategory] = useState('None')
    const [level, setLevel] = useState(0)
    const getData = async () => {
        if (lang1 === lang2 || lang1 === 'None') {
            console.log(`Invalid: lang1=${lang1}, lang2=${lang2}`)
            return
        }
        const visibility_int = visibility2int[visibility]
        const lang1_int = lang2int[lang1]
        const lang2_int = lang2int[lang2]


        const url = `${fastAPIURL}/${getType}`
        const data = {
            user_id: userID,
            deck_id: deck_id,
            n_select: nSelect,
            lang1_int: lang1_int,
            lang2_int: lang2_int,
            visibility_int: visibility_int,
            category: category,
            subcategory: subcategory,
            level: level,
        }

        // get requested data
        const res = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        const returnedData = await res.json()
        setTypingData(returnedData)
    }




    return (
        <>
            <div className='flex flex-col w-full p-4 m-4 outline outline-blue-200'>
                <div className={minibox}>
                    URL:
                    <MySelect
                        state={getType}
                        setState={setGetType}
                        optionValues={getTypeList}
                    />
                </div>

                <div className={minibox}>
                    User ID:
                    <MyInputNumber
                        state={userID}
                        setState={setUserID}
                        min={1}
                        max={100}
                        step={1}
                        defaultState={1}
                    />
                </div>
                <div className={minibox}>
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
                <div className={minibox}>
                    Visibility:
                    <MySelect
                        state={visibility}
                        setState={setVisibility}
                        optionValues={visibilityOptions}
                    />
                </div>
                <div className={minibox}>
                    Language 1:
                    <MySelect
                        state={lang1}
                        setState={setLang1}
                        optionValues={langOptions}
                    />
                </div>
                <div className={minibox}>
                    Language 2:
                    <MySelect
                        state={lang2}
                        setState={setLang2}
                        optionValues={langOptions}
                    />
                </div>
                <div className={minibox}>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={getData}
                    >
                        Get Data
                    </button>
                </div>
                <div className={minibox}>
                    category:
                    <MySelect
                        state={category}
                        setState={setCategory}
                        optionValues={categoryList}
                    />
                </div>
                <div className={minibox}>
                    Deck:
                    <MySelect
                        state={deck}
                        setState={setDeck}
                        optionValues={deckList}
                    />
                </div>
            </div>
            <div className='flex flex-col w-full p-4 outline outline-red-200'>
                {typingData && Object.keys(typingData).map((key) => {
                    return (
                        <div className={minibox}>
                            {key}: {typingData[key]}
                        </div>
                    )
                }
                )}
            </div>
        </>
    )
}
