import React, { useEffect, useMemo } from 'react'
import { MySelect } from '@/Basics'
import {
    ICategory,
    ISubcategory,
    subcategoryJsonJa,
    levelListJa,
    subcategoryJsonEn,
    levelListEn,
} from '@/MyLib/UtilsTyping'
import { useRouter } from 'next/router'

const minibox = 'flex flex-col justify-center items-center'

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
    classParent = minibox,
}: FormatCategoryProps) {
    const { locale } = useRouter()

    // ---- 派生リストは useMemo で安定化 ----
    const categories = useMemo<string[]>(() => {
        const src = locale === 'ja' ? subcategoryJsonJa : subcategoryJsonEn
        return src.categories.map((c: ICategory) => c.name)
    }, [locale])

    const levelList = useMemo<string[]>(() => {
        const src = locale === 'ja' ? levelListJa : levelListEn
        return src.map((l) => l.name)
    }, [locale])

    const subcategoryList = useMemo<string[]>(() => {
        const catSrc = locale === 'ja' ? subcategoryJsonJa : subcategoryJsonEn
        const selected = catSrc.categories.find((c: ICategory) => c.name === category)
        if (!selected) return ['Choose a subcategory'] // カテゴリ未選択時はプレースホルダーを表示
        const list = selected.subcategories.map((s: ISubcategory) => s.name)
        return list.length ? list : ['Choose a subcategory']
    }, [locale, category])

    // ---- 選択値の整合性を保つ（空/不整合なら先頭に補正）----
    useEffect(() => {
        if (!categories.length) return
        if (category === '' || !categories.includes(category)) {
            setCategory(categories[0])
        }
    }, [categories, category, setCategory])

    useEffect(() => {
        if (!subcategoryList.length) return
        // 先頭がプレースホルダーなら自動補正はしない（空のまま）
        const first = subcategoryList[0]
        if (subcategory === '' || !subcategoryList.includes(subcategory)) {
            if (first !== 'Choose a subcategory') setSubcategory(first)
        }
    }, [subcategoryList, subcategory, setSubcategory])

    useEffect(() => {
        if (!levelList.length) return
        if (level === '' || !levelList.includes(level)) {
            setLevel(levelList[0])
        }
    }, [levelList, level, setLevel])

    return (
        <div className={classParent}>
            <div className="flex items-center justify-center space-x-4">
                category:
                <MySelect state={category} setState={setCategory} optionValues={categories} />
                <div className="text-xl pr-4">/</div>
                subcategory:
                <MySelect state={subcategory} setState={setSubcategory} optionValues={subcategoryList} />
            </div>
            <div className="flex items-center justify-center space-x-4">
                Level:
                <MySelect state={level} setState={setLevel} optionValues={levelList} />
            </div>
        </div>
    )
}
