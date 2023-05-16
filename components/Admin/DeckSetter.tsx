import React, { useState } from 'react'
import { MySelect, MyTextbox } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import {
    categoryListJa,
    subcategoryJsonJa,
    levelListJa,
    categoryListEn,
    subcategoryJsonEn,
    levelListEn,
    checkLanguage,
} from '@/MyLib/UtilsTyping'
import { FormatCategory } from './'

const langOptions = Object.keys(lang2int)
const minibox = 'flex flex-row  justify-center items-center'
const classParDiv = 'flex flex-col p-4 m-4 outline outline-blue-200'

interface DeckSetterProps {
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
    classParent?: string
}

export default function DeckSetter({
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
    classParent = classParDiv,
}: DeckSetterProps) {
    const [isLangLearn, setIsLangLearn] = useState(false)
    return (
        <div className={classParent}>
            <div className={minibox}>
                Title:
                <MyTextbox
                    state={title}
                    setState={setTitle}
                />
            </div>
            <div className={minibox}>
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
            <div className={minibox}>
                Language 1:
                <MySelect
                    state={lang1}
                    setState={setLang1}
                    optionValues={langOptions}
                />
            </div>
            <div className={minibox}>
                Translation ?
                <MySelect
                    state={isLangLearn}
                    setState={setIsLangLearn}
                    optionValues={['true', 'false']}
                />
            </div>
            {isLangLearn ?

                <div className={minibox}>
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





        </div >
    )
}
