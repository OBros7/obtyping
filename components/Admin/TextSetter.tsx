import React, { useState } from 'react'
import { MySelect, MyTextbox, MyTextarea } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { checkLanguage } from '@/MyLib/UtilsTyping'

import { FormatCategory } from './'

const langOptions = Object.keys(lang2int)
const minibox = 'flex flex-row  justify-center items-center'
const classParDiv = 'flex flex-col p-4 m-4 outline outline-blue-200'

interface TextSetterProps {
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
    classParent?: string
}

export default function TextSetter({
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
    classParent = classParDiv,
}: TextSetterProps) {
    const [isLangLearn, setIsLangLearn] = useState(false)


    const onClick = () => {
        const checkLang1 = checkLanguage(text1)
        const checkLang2 = checkLanguage(text2)
        console.log(checkLang1, checkLang2)
    }


    return (
        <div className={classParent}>
            <div className={minibox}>
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

            <div className={minibox}>
                Translation ?
                <MySelect
                    state={isLangLearn}
                    setState={setIsLangLearn}
                    optionValues={['true', 'false']}
                />
            </div>
            {isLangLearn ?
                <>

                    <div className={minibox}>
                        Text1:
                        <MyTextarea
                            state={text1}
                            setState={setText1}
                            textareaClass='text-box h-96 w-full'
                        />
                    </div>
                    <div className={minibox}>
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

                    <div className={minibox}>
                        Text:
                        <MyTextarea
                            state={text1}
                            setState={setText1}
                            textareaClass='text-box h-96 w-full'
                        />
                    </div>
                </>
            }
            <div className={minibox}>
                Deck:
                <MySelect
                    state={deck}
                    setState={setDeck}
                    optionValues={['1', '2', '3', '4', '5']}
                />
            </div>
            <div className={minibox}>
                <button
                    onClick={onClick}
                    className="btn-primary"
                >
                    Submit
                </button>
            </div>





        </div >
    )
}
