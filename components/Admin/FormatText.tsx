import React, { useEffect } from 'react'
import { MySelect, MyTextbox, MyTextarea } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'

const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(lang2int)
const minibox = 'flex flex-row  justify-center items-center'
const classParDiv = 'flex flex-col p-4 m-4 outline outline-blue-200'

const categoryList = [
    'None',
    'category1',
    'category2',
    'category3',
    'category4',
    'category5',
]
const deckList = [
    'None',
    'deck1',
    'deck2',
    'deck3',
    'deck4',
    'deck5',
]

interface FormatTextProps {
    lang1: string
    setLang1: React.Dispatch<React.SetStateAction<string>>
    lang2: string
    setLang2: React.Dispatch<React.SetStateAction<string>>
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    text1: string
    setText1: React.Dispatch<React.SetStateAction<string>>
    text2: string
    setText2: React.Dispatch<React.SetStateAction<string>>
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    deck: string
    setDeck: React.Dispatch<React.SetStateAction<string>>
    // isPublic: boolean
    // setIsPublic: React.Dispatch<React.SetStateAction<boolean>>
    classParent?: string
}

export default function FormatText({
    lang1,
    setLang1,
    lang2,
    setLang2,
    title,
    setTitle,
    text1,
    setText1,
    text2,
    setText2,
    category,
    setCategory,
    deck,
    setDeck,
    // isPublic,
    // setIsPublic,
    classParent = classParDiv,
}: FormatTextProps) {
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

            <div className={minibox}>
                Translation?
                <MySelect
                    state={isLangLearn}
                    setState={setIsLangLearn}
                    optionValues={['true', 'false']}
                />
            </div>


            {isLangLearn ?
                <>
                    <div className={minibox}>
                        Language:
                        <MySelect
                            state={lang1}
                            setState={setLang1}
                            optionValues={langOptions}
                        />
                        Second Language
                        <MySelect
                            state={lang2}
                            setState={setLang2}
                            optionValues={langOptions}
                        />
                    </div>
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
                        Language:
                        <MySelect
                            state={lang1}
                            setState={setLang1}
                            optionValues={langOptions}
                        />
                    </div>
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


        </div>
    )
}
