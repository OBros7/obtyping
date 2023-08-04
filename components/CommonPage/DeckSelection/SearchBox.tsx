import React from 'react'
import { FormatCategory } from './'


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
    return (
        <div>
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
