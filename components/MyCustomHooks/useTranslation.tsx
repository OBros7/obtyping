import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

/*
Add i18n next.config.js:
https://btj0.com/blog/react/nextjs-i18n/
https://zenn.dev/steelydylan/articles/nextjs-with-i18n
official 
https://nextjs-ja-translation-docs.vercel.app/docs/advanced-features/i18n-routing
*/

export default function useTranslation(langDictjson: object) {
  const { locale } = useRouter()
  const [langDict, setLangDict] = useState<{ [key in keyof typeof langDictjson]: string }>({})
  // const langDict = useRef<{ [key in keyof typeof langDictjson]: string }>({})

  useEffect(() => {
    // use useEffect to prevent this from being executed at every rendering
    type langDictKeys = keyof typeof langDictjson
    let _langDict: { [key in langDictKeys]: string } = {}
    for (const key in langDictjson) {
      _langDict[key as langDictKeys] = langDictjson[key as langDictKeys][locale as string]
    }
    setLangDict(_langDict)
    // langDict.current = _langDict
  }, [locale])

  return [langDict, locale]
  // return [langDict.current, locale]
}
