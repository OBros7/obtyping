'use client'
import React, { useEffect, useMemo } from 'react'
import { MySelect } from '@/Basics'
import { getCategoriesSubcategoriesLevels } from '@/MyLib/UtilsAPITyping'
import { useQuery } from '@tanstack/react-query'
import { showError } from 'utils/toast'
import { ApiError } from '@/MyLib/apiError'

const minibox = 'flex flex-row justify-center items-center'
const formRowClass = 'flex flex-row items-center justify-start space-x-2'

interface Props {
  category: string
  setCategory: React.Dispatch<React.SetStateAction<string>>
  subcategory: string
  setSubcategory: React.Dispatch<React.SetStateAction<string>>
  level: string
  setLevel: React.Dispatch<React.SetStateAction<string>>
  classParent?: string
}

export default function FormatCategory(props: Props) {
  const { category, setCategory, subcategory, setSubcategory, level, setLevel, classParent = minibox } = props

  // 1) 取得（常にトップレベルで呼ぶ）
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['catSubcatLevels'],
    queryFn: getCategoriesSubcategoriesLevels,
    retry: 2,
    throwOnError: false,
  })

  // 2) エラートースト（Hook 自体は無条件で呼ぶ）
  useEffect(() => {
    if (isError && error) {
      const err = error as ApiError
      showError(`${err.message} (status ${err.status ?? '??'})`)
    }
  }, [isError, error])

  // 3) メモ化（Hook 自体は無条件で呼ぶ）
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

  // 4) 選択値の補正（Hook 自体は無条件で呼ぶ）
  useEffect(() => {
    if (!categories.length) return
    if (category === '' || !categories.includes(category)) {
      setCategory(categories[0])
    }
  }, [categories, category, setCategory])

  useEffect(() => {
    if (!subcategoryList.length) return
    if (subcategory === '' || !subcategoryList.includes(subcategory)) {
      setSubcategory(subcategoryList[0])
    }
  }, [subcategoryList, subcategory, setSubcategory])

  useEffect(() => {
    if (!levelList.length) return
    if (level === '' || !levelList.includes(level)) {
      setLevel(levelList[0])
    }
  }, [levelList, level, setLevel])

  // 5) レンダー時にだけローディング分岐
  if (isLoading) {
    return <div className={classParent}>Loading...</div>
  }

  return (
    <div className="flex flex-col space-y-4 py-2">
      <div className={formRowClass}>
        Category:
        <MySelect state={category} setState={setCategory} optionValues={categories} />
      </div>

      <div className={formRowClass}>
        Subcategory:
        <MySelect state={subcategory} setState={setSubcategory} optionValues={subcategoryList} />
      </div>

      <div className={formRowClass}>
        Level:
        <MySelect state={level} setState={setLevel} optionValues={levelList} />
      </div>
    </div>
  )
}
