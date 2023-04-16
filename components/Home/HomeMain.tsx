import React from 'react'
import { AppCard, langDict } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'

export default function HomeMain() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const categoryBoxClass = 'p-4 rounded-lg'
  const categoryTitleClass = 'mb-4 text-blue-500 text-4xl font-bold'
  const appBoxClass = 'flex flex-row flex-wrap justify-around md:justify-start'
  const tbDefault = ''

  return (
    <Layout>
      <MainContainer addClass='p-4'>


        <div className={categoryBoxClass}>
          <h1 className={categoryTitleClass}>{translater.Typing}</h1>
          <div className={appBoxClass}>
            <AppCard
              href='./typing/defaulttyping'
              title={translater.Typing}
              description='description'
              thumbnail={tbDefault}
            ></AppCard>
            <AppCard
              href='./typing/customtyping'
              title='long long long long long title1'
              description='description'
              thumbnail={tbDefault}
            ></AppCard>
            <AppCard
              title='title1'
              description='long long long long long long long long long long long long description'
              thumbnail={tbDefault}
            ></AppCard>
            <AppCard
              title='long long long long title1'
              description='long long long logn long long long long long long long long long long description'
              thumbnail={tbDefault}
            ></AppCard>
          </div>
        </div>


      </MainContainer>
    </Layout>
  )
}
