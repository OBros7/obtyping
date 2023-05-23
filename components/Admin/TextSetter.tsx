import React, { useEffect, useState } from 'react'
import { MySelect, MyTextbox, MyTextarea } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { PostText, getDeckListByUser } from '@/MyLib/UtilsAPI'
import { checkLanguage } from '@/MyLib/UtilsTyping'

import { FormatCategory } from './'

const langOptions = Object.keys(lang2int)

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'
const classParDivDefault = 'search-container'
const classChildDivDefault = 'minibox'

interface TextSetterProps {
    userID: number
    visibilityInt: number
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    text1: string
    setText1: React.Dispatch<React.SetStateAction<string>>
    text2: string
    setText2: React.Dispatch<React.SetStateAction<string>>
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    subcategory: string
    setSubcategory: React.Dispatch<React.SetStateAction<string>>
    level: string
    setLevel: React.Dispatch<React.SetStateAction<string>>
    deck: string
    setDeck: React.Dispatch<React.SetStateAction<string>>
    classParDiv?: string
    classChildDiv?: string
}

export default function TextSetter({
    userID,
    visibilityInt,
    title,
    setTitle,
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
    deck,
    setDeck,
    classParDiv = classParDivDefault,
    classChildDiv = classChildDivDefault,
}: TextSetterProps) {
    const [isLangLearn, setIsLangLearn] = useState(false)
    const [msg, setMsg] = useState('')
    const [deckTitle, setDeckTitle] = useState('')
    const [deckData, setDeckData] = useState([])

    useEffect(() => {
        const fetchDeckData = async () => {
            let _deckData = await getDeckListByUser(userID);
            const nullDeck = { deck_id: -1, title: 'Select a deck', description: '' }
            _deckData.unshift(nullDeck)
            setDeckData(_deckData);
            console.log(_deckData)
        }
        fetchDeckData();
    }, [userID]);


    const onClick = async () => {
        // check if title and text1 are filled
        if (title === '' || text1 === '') {
            setMsg('Please fill in the title and text1')
            return
        }

        // set language
        const lang1 = checkLanguage(text1)
        const lang1_int = lang2int[lang1] as number
        let lang2_int: number | null = null
        if (text2 !== '') {
            const lang2 = checkLanguage(text2)
            lang2_int = lang2int[lang2]
        }

        const data: PostText = {
            user_id: userID,
            title: title,
            text11: text1,
            text12: null,
            text21: text2,
            text22: null,
            category: category,
            subcategory: subcategory,
            level: level,
            lang1_int: lang1_int,
            lang2_int: lang2_int,
            visibility_int: visibilityInt,
            shuffle: false,
        }

        if (deckTitle != 'Select a deck') {
            data['deck_id'] = deckData.filter((deck: any) => deck.title === deckTitle)[0]['deck_id']
        }
        const url = `${fastAPIURL}create_text`
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
        setMsg(JSON.stringify(json))

    }




    return (
        <div className={classParDiv}>
            <div className={classChildDiv}>
                Title:
                <MyTextbox
                    state={title}
                    setState={setTitle}
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
                Translation ?
                <MySelect
                    state={isLangLearn}
                    setState={setIsLangLearn}
                    optionValues={['true', 'false']}
                />
            </div>
            {isLangLearn ?
                <>

                    <div className={classChildDiv}>
                        Text1:
                        <MyTextarea
                            state={text1}
                            setState={setText1}
                            textareaClass='text-box h-96 w-full'
                        />
                    </div>
                    <div className={classChildDiv}>
                        Text2:
                        <MyTextarea
                            state={text2}
                            setState={setText2}
                            textareaClass='text-box h-96 w-full'
                        />
                    </div>
                </>

                :
                <>

                    <div className={classChildDiv}>
                        Text:
                        <MyTextarea
                            state={text1}
                            setState={setText1}
                            textareaClass='text-box h-96 w-full'
                        />
                    </div>
                </>
            }
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





        </div >
    )
}
