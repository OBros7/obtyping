import React, { useEffect, useState } from 'react'
import { MySelect, MyTextbox, MyTextarea } from '@/Basics'
import { visibility2int, lang2int } from '@/MyLib/Mapper'
import {
    ICategory,
    ISubcategory,
    subcategoryJsonJa,
    levelListJa,
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
    // const [categoryIDList, setCategoryIDList] = useState<number[]>([])
    // const [subcategoryIDList, setSubcategoryIDList] = useState<number[]>([])
    // const [levelIDList, setLevelIDList] = useState<number[]>([])
    const [categoryList, setCategoryList] = useState<string[]>([])
    const [subcategoryList, setSubcategoryList] = useState<string[]>([])
    const [levelList, setLevelList] = useState<string[]>([])


    useEffect(() => {
        let _categoryIDs
        let _categoryList
        let _levelIDs
        let _levelList
        if (locale === 'ja') {
            // _categoryIDs = subcategoryJsonJa.categories.map((category: ICategory) => category.id)
            _categoryList = subcategoryJsonJa.categories.map((category: ICategory) => category.name)
            // _levelIDs = levelListJa.map(level => level.id)
            _levelList = levelListJa.map(level => level.name)

        } else {
            // _categoryIDs = subcategoryJsonEn.categories.map((category: ICategory) => category.id)
            _categoryList = subcategoryJsonEn.categories.map((category: ICategory) => category.name)
            // _levelIDs = levelListEn.map(level => level.id)
            _levelList = levelListEn.map(level => level.name)
        }
        // setCategoryIDList(_categoryIDs)
        setCategoryList(_categoryList)
        // setLevelIDList(_levelIDs)
        setLevelList(_levelList)
    }, [locale])

    useEffect(() => {
        let _subcategoryIDList = [-1]
        let _subcategoryList = ['Choose a subcategory']
        if (locale === 'ja') {
            const selectedCategory = subcategoryJsonJa.categories.find(cat => cat.name === category);
            if (selectedCategory) {
                // _subcategoryIDList = selectedCategory.subcategories.map((subcategory: ISubcategory) => subcategory.id);
                _subcategoryList = selectedCategory.subcategories.map((subcategory: ISubcategory) => subcategory.name);
            }
        } else {
            const selectedCategory = subcategoryJsonEn.categories.find(cat => cat.name === category);
            if (selectedCategory) {
                // _subcategoryIDList = selectedCategory.subcategories.map((subcategory: ISubcategory) => subcategory.id);
                _subcategoryList = selectedCategory.subcategories.map((subcategory: ISubcategory) => subcategory.name);
            }
        }
        // setSubcategoryIDList(_subcategoryIDList);
        setSubcategoryList(_subcategoryList);
    }, [category]);

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
