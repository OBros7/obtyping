import React, { useState } from 'react'
import { MyInputNumber, MySelect, MyTextbox } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { FormatText, FormatDeck } from './'


const fastAPIURL = process.env.FASTAPI_URL + '/api/typing'

const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(lang2int)
const minibox = 'flex flex-row  justify-center items-center'


const setTypeList = [
    'set_text',
    'set_category',
    'set_deck',
]

const dataTypeList = [
    'text',
    'deck'
]

export default function TypingSetter() {
    const [visibility, setVisibility] = useState(visibilityOptions[0])
    const [lang1, setLang1] = useState(langOptions[0])
    const [title1, setTitle1] = useState('')
    const [text1, setText1] = useState('')
    const [category, setCategory] = useState('')
    const [deck1, setDeck1] = useState('')
    const [isPublic1, setIsPublic1] = useState(false)
    const [dataType, setDataType] = useState('text')

    const [lang2, setLang2] = useState(langOptions[-1])
    const [typingData, setTypingData] = useState<{ [key: string]: any }>({});
    const [userID, setUserID] = useState(1)
    const [setType, setSetType] = useState(setTypeList[0])

    const setData = async () => {
        if (lang1 === lang2 || lang1 === 'None') {
            console.log(`Invalid: lang1=${lang1}, lang2=${lang2}`)
            return
        }
        const visibility_int = visibility2int[visibility]
        const lang1_int = lang2int[lang1]
        const lang2_int = lang2int[lang2]

        let url = ''
        if (setType === 'get_text') {
            url = `${fastAPIURL}/${setType}`
        } else if (setType === 'get_random_text') {
            if (lang2_int === -1) {
                url = `${fastAPIURL}/${setType}/${visibility_int}/${lang1_int}`
            } else {
                url = `${fastAPIURL}/${setType}/${visibility_int}/${lang1_int}/${lang2_int}`
            }
        }

        const res = await fetch(url)
        const data = await res.json()
        setTypingData(data)
    }




    return (
        <>
            <div className='flex flex-col p-4 m-4 outline outline-blue-200'>
                <div className={minibox}>
                    Data Type:
                    <MySelect
                        state={dataType}
                        setState={setDataType}
                        optionValues={dataTypeList}
                    />
                </div>
                <div className={minibox}>
                    URL:
                    <MySelect
                        state={setType}
                        setState={setSetType}
                        optionValues={setTypeList}
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
                    Visibility:
                    <MySelect
                        state={visibility}
                        setState={setVisibility}
                        optionValues={visibilityOptions}
                    />
                </div>
                {/* <div className={minibox}>
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
                </div> */}

            </div>
            <div className='flex flex-col p-4 outline outline-red-200'>
                {dataType === 'text' ?
                    <FormatText
                        lang={lang1}
                        setLang={setLang1}
                        title={title1}
                        setTitle={setTitle1}
                        text={text1}
                        setText={setText1}
                        category={category}
                        setCategory={setCategory}
                        deck={deck1}
                        setDeck={setDeck1}
                        isPublic={isPublic1}
                        setIsPublic={setIsPublic1}
                    />
                    :
                    <FormatDeck
                        lang1={lang1}
                        setLang1={setLang1}
                        title={title1}
                        setTitle={setTitle1}
                        description={text1}
                        setDescription={setText1}
                        category={category}
                        setCategory={setCategory}
                        isPublic={isPublic1}
                        setIsPublic={setIsPublic1}
                        lang2={lang2}
                        setLang2={setLang2} />
                }



                <div className={minibox}>
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                        onClick={setData}
                    >
                        Create Data
                    </button>
                </div>
            </div>
        </>
    )
}
