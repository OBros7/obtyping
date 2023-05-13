import React from 'react'
import { MySelect, MyTextbox } from '@/Basics'
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
    lang: string
    setLang: React.Dispatch<React.SetStateAction<string>>
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    text: string
    setText: React.Dispatch<React.SetStateAction<string>>
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    deck: string
    setDeck: React.Dispatch<React.SetStateAction<string>>
    isPublic: boolean
    setIsPublic: React.Dispatch<React.SetStateAction<boolean>>
    classParent?: string
}

export default function FormatText({
    lang,
    setLang,
    title,
    setTitle,
    text,
    setText,
    category,
    setCategory,
    deck,
    setDeck,
    isPublic,
    setIsPublic,
    classParent = classParDiv,
}: FormatTextProps) {
    return (
        <div className={classParent}>
            <div className={minibox}>
                Language:
                <MySelect
                    state={lang}
                    setState={setLang}
                    optionValues={langOptions}
                />
            </div>
            <div className={minibox}>
                Title:
                <MyTextbox
                    state={title}
                    setState={setTitle}
                />
            </div>
            <div className={minibox}>
                Text:
                <MyTextbox

                    state={text}
                    setState={setText}
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
                Public:
                <MySelect
                    state={isPublic}
                    setState={setIsPublic}
                    optionValues={['true', 'false']}
                />
            </div>
        </div>
    )
}
