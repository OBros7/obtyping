import React, { useEffect, useState } from 'react'
import { MySelect, MyTextbox, MyTextarea } from '@/Basics'
import { useRouter } from 'next/router'
import { getCategoriesSubcategoriesLevels } from '@/MyLib/UtilsAPITyping'

const fastAPIURL = process.env.FASTAPI_URL + '/api/typing/'
const minibox = 'flex flex-row justify-center items-center'

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
    const [categories, setCategories] = useState<string[]>([])
    const [subcategoryList, setSubcategoryList] = useState<string[]>([])
    const [levelList, setLevelList] = useState<string[]>([])
    const [requestedData, setRequestedData] = useState<{
        cat_subcat: { [key: string]: string[] },
        levels: string[]
    }>({ cat_subcat: {}, levels: [] })

    useEffect(() => {

        getCategoriesSubcategoriesLevels().then(data => {
            setRequestedData(data)
            setCategories(Object.keys(data.cat_subcat))
            setLevelList(data.levels)
            console.log(data)
        })

    }, [])

    useEffect(() => {
        if (requestedData.cat_subcat) {
            const _subcategoryList = requestedData.cat_subcat[category] || []
            setSubcategoryList(_subcategoryList)
        }
    }, [category, requestedData])



    return (
        <div className={classParent}>
            category:
            <MySelect
                state={category}
                setState={setCategory}
                optionValues={categories}
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
