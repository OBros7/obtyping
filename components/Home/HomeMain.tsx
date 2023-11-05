import React from 'react'
import { AppCard, langDict, MenuCard } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'
import Image from 'next/image'

export default function HomeMain() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const categoryBoxClass = 'p-4 flex flex-row flex-wrap justify-center'
  const categoryTitleClass = 'mb-4 text-blue-500 text-4xl font-bold'
  const appBoxClass = 'flex flex-row flex-wrap justify-center'
  const tbDefault = ''

  return (
    <Layout>
      <div className="bg-[url('/images/man.png')] w-screen h-[50vh] bg-center bg-cover flex items-center justify-center" >
        <div className="flex flex-row flex-wrap justify-center">
          <button
            className="m-20 bg-blue-500 hover:bg-blue-700 text-white text-4xl font-bold py-4 px-16  rounded bg-center bg-cover">
            {translater.startNow}
          </button>
        </div>
      </div>

      <MainContainer addClass='p-4'>

        <div className={categoryBoxClass} >
          <h1 className="mb-4 my-8 text-blue-800 text-6xl font-bold">{translater.catchCopy}</h1>
          <div className="mt-2 text-2xl">{translater.conceptExplanation}</div>
        </div>

        <div className={categoryBoxClass} >
          <h1 className={categoryTitleClass}>{translater.selectTyping}</h1>
        </div>

        <div className={appBoxClass}>

          <AppCard
            href='./admin/test/basicdeckselection'
            title={translater.basicTypingTitle}
            description={translater.basicTypingDescription}
            thumbnail={tbDefault}
            bgcolor='bg-green-400'
            recomendedFor={translater.recomendedFixedPhrase}
          ></AppCard>
          <AppCard
            href='./admin/test/customdeckselection'
            title={translater.customTypingTitle}
            description={translater.customTypingDescription}
            thumbnail={tbDefault}
            bgcolor='bg-yellow-400'
            recomendedFor={translater.recomendedFixedPhrase}
          ></AppCard>
          <AppCard
            href='./admin/test/categorydeckselection'
            title={translater.categoryTypingTitle}
            description={translater.categoryTypingDescription}
            thumbnail={tbDefault}
            bgcolor='bg-red-400'
            recomendedFor={translater.recomendedFixedPhrase}
          ></AppCard>

        </div>


      </MainContainer>
    </Layout>
  )
}