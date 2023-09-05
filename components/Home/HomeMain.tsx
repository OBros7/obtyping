import React from 'react'
import { AppCard, langDict } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'
import Image from 'next/image'
// import manImage from './man.png'
// import womanImage from './woman.png'
// import background from './background.png'
import { CSSProperties } from 'react'

// const cssProperties = {
//   '--image-url': `url(${background})`
// }

export default function HomeMain() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  const categoryBoxClass = 'p-4 flex flex-row flex-wrap justify-center'
  const categoryTitleClass = 'mb-4 text-blue-500 text-4xl font-bold'
  const appBoxClass = 'flex flex-row flex-wrap justify-center'
  const tbDefault = ''

  return (
    <Layout>
      <MainContainer addClass='p-4'>

        {/* <div className={appBoxClass}> */}
        {/* <AppCard
          href='./typing/defaulttyping'
          title={translater.startNow}
          description='大地へ：あとで大きめのボタンに変更'
          thumbnail={tbDefault}
        ></AppCard> */}
        {/* <Image src={background} alt="woan" width={300} height={300} /> */}
        {/* <div className="flex flex-row flex-wrap justify-center" style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover' }}></div> */}
        <div className="flex flex-row flex-wrap justify-center">
          <button
            className="m-20 bg-blue-500 hover:bg-blue-700 text-white text-4xl font-bold py-4 px-16 my-16 rounded bg-center bg-cover"
          >
            {translater.startNow}
          </button>
          {/* <Image src={manImage} alt="man" width={300} height={300} /> */}
        </div>
        {/* </div> */}


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