'use client'
import React, { useEffect, useState } from 'react'
import { MySelect } from '@/Basics'
import { useRouter } from 'next/router'
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
  const { locale } = useRouter() // （いまは未使用）

  /* ---------- React Query で API 取得 ---------- */
  // 新 (v5 スタイル)
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['catSubcatLevels'],
    queryFn: getCategoriesSubcategoriesLevels,
    retry: 2,                    // retry は残っています
    throwOnError: false,         // (デフォルト false) そのまま error に入る
  });

  // エラーになったら副作用でトースト
  useEffect(() => {
    if (isError && error) {
      const err = error as ApiError;
      showError(`${err.message} (status ${err.status ?? '??'})`);
      console.log('失敗')
    }
  }, [isError, error]);

  /* ---------- 取得後にサブカテゴリを更新 ---------- */
  const categories = data ? Object.keys(data.cat_subcat) : []
  const levelList = data?.levels ?? []
  const subcategoryList = data ? data.cat_subcat[category] ?? [] : []

  // category が変わったら subcategory リストをリセット
  useEffect(() => { props.setSubcategory('') }, [category])

  /* ---------- ローディング表示 ---------- */
  if (isLoading) {
    return (
      <div className={classParent}>
        {/* Skeleton だけ表示 */}
        Loading...
      </div>
    )
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
