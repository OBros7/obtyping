import React, { useState } from 'react'
import { MyInputNumber, MySelect, MyTextbox } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { FormatText, FormatDeck } from './'


const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'

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
    // common states between text and deck 
    const [userID, setUserID] = useState(1)
    const [title, setTitle] = useState('')
    const [lang1, setLang1] = useState(langOptions[0])
    const [lang2, setLang2] = useState(langOptions[-1])
    const [visibility, setVisibility] = useState(visibilityOptions[0])

    // text states
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')
    const [deck1, setDeck1] = useState('')

    // deck states
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    // const [isPublic1, setIsPublic1] = useState(false)

    // other states
    const [dataType, setDataType] = useState('text')
    const [setType, setSetType] = useState(setTypeList[0])
    const [msg, setMsg] = useState('')

    const setData = async () => {
        let data
        let url = ''
        if (dataType === 'text') {
            data = {
                user_id: userID,
                title: title,
                text11: text1,
                text12: null,
                text21: null,
                text22: null,
                // category: category,
                // deck1: deck1,
                lang1_int: lang2int[lang1],
                lang2_int: lang2int[lang2],
                visibility_int: visibility2int[visibility],
                ordered: true,
            }
            url = `${fastAPIURL}create_text`
        } else if (dataType === 'deck') {
            data = {
                user_id: userID,
                title: title,
                description: description,
                lang1_int: lang2int[lang1],
                lang2_int: lang2int[lang2],
                visibility_int: visibility2int[visibility],
            }
            url = `${fastAPIURL}create_deck`
        } else {
            setMsg('Invalid dataType')
        }


        // post data to url
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            mode: 'cors',
        })
        const json = await res.json()
        console.log('Returned json: ', json)
        setMsg(json.toString())
    }

    return (
        <>
            <div className='flex flex-col w-full p-4 m-4 outline outline-blue-200'>
                <div className={minibox}>
                    Data Type:
                    <MySelect
                        state={dataType}
                        setState={setDataType}
                        optionValues={dataTypeList}
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
            </div>
            <div className='flex flex-col w-full p-2 outline outline-blue-200'>
                {dataType === 'text' ?
                    <FormatText
                        lang1={lang1}
                        setLang1={setLang1}
                        lang2={lang2}
                        setLang2={setLang2}
                        title={title}
                        setTitle={setTitle}
                        text1={text1}
                        setText1={setText1}
                        text2={text2}
                        setText2={setText2}
                        category={category}
                        setCategory={setCategory}
                        deck={deck1}
                        setDeck={setDeck1}
                    // isPublic={isPublic1}
                    // setIsPublic={setIsPublic1}
                    />
                    :
                    <FormatDeck
                        lang1={lang1}
                        setLang1={setLang1}
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        category={category}
                        setCategory={setCategory}
                        // isPublic={isPublic1}
                        // setIsPublic={setIsPublic1}
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
                    {msg}
                </div>

            </div>
        </>
    )
}
