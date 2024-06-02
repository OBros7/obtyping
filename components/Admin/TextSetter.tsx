import React, { useEffect, useState } from 'react'
import { MySelect, MyTextbox, MyTextarea, MyInputNumber } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import {
    PostTextOnly,
    PostTextDeck,
    getDeckListByUser,
    createTextOnly,
    createTextDeck,
} from '@/MyLib/UtilsAPITyping'
import { checkLanguage } from '@/MyLib/UtilsTyping'
import { FormatCategory } from '@/CommonPage/DeckSelection'

const langOptions = Object.keys(lang2int)

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'
const classParDivDefault = 'flex flex-col items-start space-y-4 w-full'
const classChildDivDefault = 'w-full'

interface TextSetterProps {
    userID: number
    visibilityInt: number
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    visibility: string
    visibilityOptions: string[]
    setVisibility: React.Dispatch<React.SetStateAction<string>>
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
    visibility,
    setVisibility,
    visibilityOptions,
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
    const [deckID, setDeckID] = useState(-1)
    const [deckTitle, setDeckTitle] = useState('')
    const [deckDescription, setDeckDescription] = useState('')
    const [deckData, setDeckData] = useState([])

    useEffect(() => {
        const fetchDeckData = async () => {
            let _deckData = await getDeckListByUser(userID);
            const nullDeck = { deck_id: -1, title: 'New Deck', description: '' }
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

        if (deckID === -1 && deckTitle === '') {
            setMsg('Please fill in the deck title')
            return
        }

        // set language
        const lang1 = checkLanguage(text1)
        console.log(lang1, lang2int(lang1))

        const lang1_int = lang2int(lang1) as number
        let lang2_int: number | null = null
        if (text2 !== '') {
            const lang2 = checkLanguage(text2)
            lang2_int = lang2int(lang2)
        }
        console.log(lang1, lang1_int)


        let json: any
        if (deckID === -1) {// create new deck and text
            const data: PostTextDeck = {
                user_id: userID,
                // about text
                title: title,
                text11: text1,
                text12: null,
                text21: text2,
                text22: null,
                // about deck
                deck_title: deckTitle,
                deck_description: deckDescription,
                lang1_int: lang1_int,
                lang2_int: lang2_int,
                category: category,
                subcategory: subcategory,
                level: level,
                visibility_int: visibilityInt,
                shuffle: false,

            }
            json = await createTextDeck(data)

        } else {// create new text and add it to an existing deck
            const data: PostTextOnly = {
                user_id: userID,
                title: title,
                text11: text1,
                text12: null,
                text21: text2,
                text22: null,
                visibility_int: visibilityInt,
                deck_id: deckID,
            }
            json = await createTextOnly(data)
        }

        console.log('Returned json: ', json)
        setMsg(JSON.stringify(json))
    }

    return (
        <div className={classParDiv}>
            <div className={classChildDiv}>
                Deck:
                <MySelect
                    state={deckID}
                    setState={setDeckID}
                    optionValues={deckData.map((deck: any) => deck.deck_id)}
                    optionTexts={deckData.map((deck: any) => deck.title)}
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
                Text Title:
                <MyTextbox
                    state={title}
                    setState={setTitle}
                    textboxClass='text-box w-3/4 ml-2'
                />
            </div>

            <div className={classChildDiv}>
                Visibility:
                <MySelect
                    state={visibility}
                    setState={setVisibility}
                    optionValues={visibilityOptions}
                />
            </div>

            <div className={classChildDiv}>
                Translation:
                <MySelect
                    state={isLangLearn}
                    setState={setIsLangLearn}
                    optionValues={['true', 'false']}
                />
            </div>
            {isLangLearn ?
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

            {/* {deckID === -1 ? */}
            <>

                <FormatCategory
                    category={category}
                    setCategory={setCategory}
                    subcategory={subcategory}
                    setSubcategory={setSubcategory}
                    level={level}
                    setLevel={setLevel}
                />
            </>
            {/* :
                null
            } */}
            <div className={`${classChildDiv} flex item-center justify-center py-6`}>
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
