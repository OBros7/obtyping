import React from 'react'
import { AppCard, langDict } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'

export default function HomeMain() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const categoryBoxClass = 'p-4 flex flex-row flex-wrap justify-center'
  const categoryTitleClass = 'mb-4 text-blue-500 text-4xl font-bold'
  const appBoxClass = 'flex flex-row flex-wrap justify-center'
  const tbDefault = ''

  return (
    <Layout>
      <MainContainer addClass='p-4'>

        <div className={appBoxClass}>
          <AppCard
            href='./typing/defaulttyping'
            title={translater.startNow}
            description='大地へ：あとで大きめのボタンに変更'
            thumbnail={tbDefault}
          ></AppCard>
        </div>


        <div className={categoryBoxClass}>
          <h1 className={categoryTitleClass}>{translater.selectTyping}</h1>
        </div>

        <div className={appBoxClass}>
          <AppCard
            href='./typing/defaulttyping'
            title={translater.basicTypingTitle}
            description={translater.basicTypingDescription}
            thumbnail={tbDefault}
          ></AppCard>
          <AppCard
            href='./typing/customtyping'
            title={translater.customTypingTitle}
            description={translater.customTypingDescription}
            thumbnail={tbDefault}
          ></AppCard>
          <AppCard
            title={translater.categoryTypingTitle}
            description={translater.categoryTypingDescription}
            thumbnail={tbDefault}
          ></AppCard>

        </div>


      </MainContainer>
    </Layout>
  )
}