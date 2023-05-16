import React, { useState } from 'react'
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
    subcategory: string
    setSubcategory: React.Dispatch<React.SetStateAction<string>>
    level: string
    setLevel: React.Dispatch<React.SetStateAction<string>>
    nSelect: number
    setNSelect: React.Dispatch<React.SetStateAction<number>>
    classParent?: string
}

export default function DeckGetter(
    {
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
    }: DeckGetterProps

) {
    // const [lang1, setLang1] = useState(langOptions[0])
    // const [lang2, setLang2] = useState(langOptions[-1])
    // const [typingData, setTypingData] = useState<{ [key: string]: any }>({});
    // const [getType, setGetType] = useState(getTypeList[0])
    // const [nSelect, setNSelect] = useState(10)
    // const [category, setCategory] = useState('')
    // const [subcategory, setSubcategory] = useState('')
    // const [level, setLevel] = useState('')

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

            {/* <div className={minibox}>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                    onClick={getData}
                >
                    Get Data
                </button>
            </div> */}

        </div>

    )
}
