import React from 'react'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import { MyInputNumber, MySelect } from '@/Basics'
import { FormatCategory } from './'

const visibilityOptions = Object.keys(visibility2int)
const langOptions = Object.keys(lang2int)
const minibox = 'flex flex-row  justify-center items-center'
const getTypeList = [
    'get_textlist/basic',
    'get_textlist/selective',
    'get_textlist/private',
    'get_textlist_by_category',
    'get_textlist_by_deck',
    'get_textlist_by_level'
]


interface DeckGetterProps {
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
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
    nSelect: number
    setNSelect: React.Dispatch<React.SetStateAction<number>>
    classParent?: string
}


export default function TextGetter({
    title,
    setTitle,
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
    nSelect,
    setNSelect,
    classParent = minibox,
}: DeckGetterProps) {
    return (
        <div className='flex flex-col w-full p-4 m-4 outline outline-blue-200'>

            <div className={minibox}>
                Number of Select:
                <MyInputNumber
                    state={nSelect}
                    setState={setNSelect}
                    min={1}
                    max={100}
                    step={1}
                    defaultState={10}
                />
            </div>

            <div className={minibox}>
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
            </div>
            <FormatCategory
                category={category}
                setCategory={setCategory}
                subcategory={subcategory}
                setSubcategory={setSubcategory}
                level={level}
                setLevel={setLevel}
            />
        </div>

    )
}
