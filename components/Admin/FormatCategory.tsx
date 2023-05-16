import React, { useEffect, useState } from 'react'
import { MySelect, MyTextbox, MyTextarea } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import {
    categoryListJa,
    subcategoryJsonJa,
    levelListJa,
    categoryListEn,
    subcategoryJsonEn,
    levelListEn,
} from '@/MyLib/UtilsTyping'
import { useRouter } from 'next/router'


const minibox = 'flex flex-row  justify-center items-center'

interface FormatCategoryProps {
    category: string
    setCategory: React.Dispatch<React.SetStateAction<string>>
    subcategory: string
    setSubcategory: React.Dispatch<React.SetStateAction<string>>
    level: string
    setLevel: React.Dispatch<React.SetStateAction<string>>
    classParent?: string
}


export default function FormatCategory({
    category,
    setCategory,
    subcategory,
    setSubcategory,
    level,
    setLevel,
    classParent = minibox
}: FormatCategoryProps) {
    const { locale } = useRouter()
    const [categoryList, setCategoryList] = useState<string[]>([])
    const [subcategoryList, setSubcategoryList] = useState<string[]>([])
    const [levelList, setLevelList] = useState<string[]>([])


    useEffect(() => {
        if (locale === 'ja') {
            setCategoryList(categoryListJa)
            setLevelList(levelListJa)
        } else {
            setCategoryList(categoryListEn)
            setLevelList(levelListEn)
        }
    }, [locale])

    useEffect(() => {
        if (locale === 'ja') {
            if (category in subcategoryJsonJa) {
                setSubcategoryList(subcategoryJsonJa[category])
            }
        } else {
            if (category in subcategoryJsonEn) {
                setSubcategoryList(subcategoryJsonEn[category])
            }
        }
    }, [category])

    return (
        <div className={classParent}>
            category:
            <MySelect
                state={category}
                setState={setCategory}
                optionValues={categoryList}
            />
            subcategory:
            <MySelect
                state={subcategory}
                setState={setSubcategory}
                optionValues={subcategoryList}
            />
            Level:
            <MySelect
                state={level}
                setState={setLevel}
                optionValues={levelList}
            />
        </div>
    )
}
