import React, { useState } from 'react'
import { FormatCategory } from './'
import { MySelect, MyTextbox } from '@/Basics'

const searchBoxClass = 'flex flex-col items-center justify-center p-4 bg-blue-100 rounded-md w-5/6'
interface SearchBoxProps {
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    subcategory: string
    setSubcategory: React.Dispatch<React.SetStateAction<string>>
    level: string
    setLevel: React.Dispatch<React.SetStateAction<string>>
    classParent?: string
}


export default function SearchBox(
    { category,
        setCategory,
        subcategory,
        setSubcategory,
        level,
        setLevel, }: SearchBoxProps

) {
    const [searchType, setSearchType] = useState<'category' | 'text'>('category')
    const [searchText, setSearchText] = useState('')



    return (
        <div className={searchBoxClass}>
            <MySelect
                state={searchType}
                setState={setSearchType}
                optionValues={['category', 'text']}
                optionTexts={['Search by Category', 'Search by Text']}
            />
            {searchType === 'category' ?
                <FormatCategory
                    category={category}
                    setCategory={setCategory}
                    subcategory={subcategory}
                    setSubcategory={setSubcategory}
                    level={level}
                    setLevel={setLevel}
                /> :
                <MyTextbox
                    state={searchText}
                    setState={setSearchText}
                />
            }


        </div>
    )
}
