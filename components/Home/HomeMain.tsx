import React from 'react'
import { AppCard, langDict, MenuCard, PreparationCard } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'
import Image from 'next/image'
import Link from 'next/link';

export default function HomeMain() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const categoryBoxClass = 'p-4 flex flex-col flex-wrap text-center'
  const categoryTitleClass = 'mb-4 text-blue-500 text-4xl font-bold'
  const appBoxClass = 'flex flex-row flex-wrap justify-center'
  const tbDefault = ''
  const trialUrl = '/typing/typing?deckid=-4&minutes=1';

  return (
    <Layout>
      <div className="bg-[url('/images/heroImage.png')] w-screen h-[50vh] bg-center bg-cover flex items-center justify-center relative">
        <div className="flex flex-row flex-wrap justify-center">
          <button
            className="m-20 bg-blue-500 hover:bg-blue-700 text-white text-4xl font-bold py-6 px-16 rounded bg-center bg-cover">
            <Link href={trialUrl}>
              <a>{translater.startNow}</a>
            </Link>
          </button>
        </div>
      </div>

      <MainContainer addClass='p-4'>

        <div className={categoryBoxClass} >
          <h1 className="mb-4 my-8 text-blue-800 text-6xl font-bold">{translater.catchCopy}</h1>
          <div className="mt-2 text-2xl">{translater.conceptExplanation_1}</div>
          <div className="mt-2 text-2xl">{translater.conceptExplanation_2}</div>
        </div>

        <div className={categoryBoxClass} >
          <h1 className={categoryTitleClass}>{translater.selectTyping}</h1>
        </div>

        <div className={appBoxClass}>
          <PreparationCard isReady={false} onclickMessage="この機能は現在開発中です。">
            <AppCard
              href='./typing/basic_typing'
              title={translater.basicTypingTitle}
              description={translater.basicTypingDescription}
              thumbnail={<Image
                src="/images/basicIcon.png"
                alt="Basic Icon"
                width={60}
                height={60}
              />}
              bgcolor='bg-green-400'
              recomendedFor={translater.recomendedFixedPhrase}
            ></AppCard>
          </PreparationCard>
          <PreparationCard isReady={false} onclickMessage="この機能は現在開発中です。">
            <AppCard
              href='./typing/custom_typing'
              title={translater.customTypingTitle}
              description={translater.customTypingDescription}
              thumbnail={<Image
                src="/images/gearIcon.png"
                alt="Basic Icon"
                width={60}
                height={60}
              />}
              bgcolor='bg-yellow-400'
              recomendedFor={translater.recomendedFixedPhrase}
            ></AppCard>
          </PreparationCard>
          {/* <PreparationCard isReady={false} onclickMessage="この機能は現在開発中です。"> */}
          <AppCard
            href='./typing/category_typing'
            title={translater.categoryTypingTitle}
            description={translater.categoryTypingDescription}
            thumbnail={<Image
              src="/images/brainIcon.png"
              alt="Basic Icon"
              width={60}
              height={60}
            />}
            bgcolor='bg-red-400'
            recomendedFor={translater.recomendedFixedPhrase}
          ></AppCard>
          {/* </PreparationCard> */}
        </div>
      </MainContainer>
    </Layout>
  )
}