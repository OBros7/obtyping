import React, { useEffect } from 'react'
import { MySelect, MyTextbox } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { checkLanguage } from '@/MyLib/UtilsTyping'

import { set } from 'react-hook-form'

const langOptions = Object.keys(lang2int)
const minibox = 'flex flex-row  justify-center items-center'
const classParDiv = 'flex flex-col p-4 m-4 outline outline-blue-200'

const categoryList = [
    'None',
    'category1',
    'category2',
]

interface FormatDeckProps {
    lang1: string
    setLang1: React.Dispatch<React.SetStateAction<string>>
    lang2: string
    setLang2: React.Dispatch<React.SetStateAction<string>>
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    description: string
    setDescription: React.Dispatch<React.SetStateAction<string>>
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    // isPublic: boolean
    // setIsPublic: React.Dispatch<React.SetStateAction<boolean>>
    classParent?: string
}


export default function FormatDeck({
    lang1,
    setLang1,
    lang2,
    setLang2,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    // isPublic,
    // setIsPublic,
    classParent = classParDiv,
}: FormatDeckProps
) {
    const [isLangLearn, setIsLangLearn] = React.useState(false)

    useEffect(() => {
        if (!isLangLearn) {
            setLang2('None')
        }
    }, [isLangLearn])

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
            <div className={minibox}>
                Category:
                <MySelect
                    state={category}
                    setState={setCategory}
                    optionValues={categoryList}
                />
            </div>
            {/* <div className={minibox}>
                is Public:
                <MySelect
                    state={isPublic}
                    setState={setIsPublic}
                    optionValues={['true', 'false']}
                />
            </div> */}
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
