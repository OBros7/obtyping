// components/FormatCategory.tsx
'use client'
import React, { use, useEffect, useMemo, useState } from 'react'
import { MySelect } from '@/Basics'
import { getCategoriesSubcategoriesLevels } from '@/MyLib/UtilsAPITyping'
import { useQuery } from '@tanstack/react-query'
import { showError } from 'utils/toast'
import { ApiError } from '@/MyLib/apiError'

const minibox = 'flex flex-row justify-center items-center'
const formRowClass = 'flex flex-row items-center justify-start space-x-2'

type LangCode = 'en' | 'ja'

interface Props {
  category: string | null
  setCategory: React.Dispatch<React.SetStateAction<string | null>>
  subcategory: string | null
  setSubcategory: React.Dispatch<React.SetStateAction<string | null>>
  level: string | null
  setLevel: React.Dispatch<React.SetStateAction<string | null>>
  classParent?: string
}

export default function FormatCategory(props: Props) {
  const { category, setCategory, subcategory, setSubcategory, level, setLevel, classParent = minibox } = props
  const [lang, setLang] = useState<LangCode>('en')

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['catSubcatLevels', lang],
    queryFn: () => getCategoriesSubcategoriesLevels(lang),
    retry: 2,
    throwOnError: false,
  })

  useEffect(() => {
    if (isError && error) {
      const err = error as ApiError
      showError(`${err.message} (status ${err.status ?? '??'})`)
    }
  }, [isError, error])

  const categories = useMemo<string[]>(
    () => (data ? Object.keys(data.cat_subcat) : []),
    [data]
  )
  const levelList = useMemo<string[]>(
    () => (data?.levels ?? []),
    [data]
  )
  const subcategoryList = useMemo<string[]>(
    () => (data && category ? (data.cat_subcat[category] ?? []) : []),
    [data, category]
  )

  // 補正：null をユーザーの明示的選択として尊重し、null の場合は何もしない
  useEffect(() => {
    if (!categories.length) return
    if (category !== null && (category === '' || !categories.includes(category))) {
      setCategory(categories[0] ?? null)
    }
  }, [categories, category, setCategory])

  useEffect(() => {
    if (!subcategoryList.length) return
    if (subcategory !== null && (subcategory === '' || !subcategoryList.includes(subcategory))) {
      setSubcategory(subcategoryList[0] ?? null)
    }
  }, [subcategoryList, subcategory, setSubcategory])

  useEffect(() => {
    if (!levelList.length) return
    if (level !== null && (level === '' || !levelList.includes(level))) {
      setLevel(levelList[0] ?? null)
    }
  }, [levelList, level, setLevel])

  if (isLoading) return <div className={classParent}>Loading...</div>

  // console.log('categories:', categories)
  // console.log('subcategoryList:', subcategoryList)
  // console.log('levelList:', levelList)

  const nullSelect = 'none'
  // 先頭に null（未指定）を追加。表示テキストは '(Any)' など任意で。
  const catValues: (string | null)[] = [...categories, null]
  const catTexts = [...categories, nullSelect]

  const subcatValues: (string | null)[] = [...subcategoryList, null]
  const subcatTexts = [...subcategoryList, nullSelect]

  const lvlValues: (string | null)[] = [...levelList, null]
  const lvlTexts = [...levelList, nullSelect]

  return (
    <div className="flex flex-col space-y-4 py-2">
      <div className={formRowClass}>
        Language:
        <MySelect
          state={lang}
          setState={setLang}
          optionValues={['en', 'ja']}
          optionTexts={['English', 'Japanese']}
        />
      </div>
      <div className={formRowClass}>
        Category:
        <MySelect state={category} setState={setCategory} optionValues={catValues} optionTexts={catTexts} />
      </div>

      <div className={formRowClass}>
        Subcategory:
        <MySelect state={subcategory} setState={setSubcategory} optionValues={subcatValues} optionTexts={subcatTexts} />
      </div>

      <div className={formRowClass}>
        Level:
        <MySelect state={level} setState={setLevel} optionValues={lvlValues} optionTexts={lvlTexts} />
      </div>


    </div>
  )
}
