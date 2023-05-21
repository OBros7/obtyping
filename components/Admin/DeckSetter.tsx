import React, { useState } from 'react'
import { MySelect, MyTextbox } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { FormatCategory } from './'

const langOptions = Object.keys(lang2int)

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'

const classParDivDefault = 'search-container'
const classChildDivDefault = 'minibox'


interface DeckSetterProps {
    userID: number
    visibilityInt: number
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    description: string
    setDescription: React.Dispatch<React.SetStateAction<string>>
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
    classParDiv?: string
    classChildDiv?: string
}

export default function DeckSetter({
    userID,
    visibilityInt,
    title,
    setTitle,
    description,
    setDescription,
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
    classParDiv = classParDivDefault,
    classChildDiv = classChildDivDefault,
}: DeckSetterProps) {
    const [isLangLearn, setIsLangLearn] = useState(false)
    const [msg, setMsg] = useState('')

    const onClick = async () => {
        // check if title and text1 are filled
        if (title === '') {
            setMsg('Please fill in the title')
            return
        }


        const lang1_int = lang2int[lang1]
        let lang2_int: number | null = null
        if (!isLangLearn) {
            lang2_int = lang2int[lang2]
        }

        const data = {
            user_id: userID,
            title: title,
            description: description,
            category: category,
            subcategory: subcategory,
            level: level,
            lang1_int: lang1_int,
            lang2_int: lang2_int,
            visibility_int: visibilityInt,
        }
        const url = `${fastAPIURL}create_deck`
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
            <div className={classChildDiv}>
                Description:
                <MyTextbox
                    state={description}
                    setState={setDescription}
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
                Language 1:
                <MySelect
                    state={lang1}
                    setState={setLang1}
                    optionValues={langOptions}
                />
            </div>
            <div className={classChildDiv}>
                Translation ?
                <MySelect
                    state={isLangLearn}
                    setState={setIsLangLearn}
                    optionValues={['true', 'false']}
                />
            </div>
            {isLangLearn ?

                <div className={classChildDiv}>
                    Language 2:
                    <MySelect
                        state={lang2}
                        setState={setLang2}
                        optionValues={langOptions}
                    />
                </div>
                :

                null
            }


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
