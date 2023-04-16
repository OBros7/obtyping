import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { GlobalContext } from 'context/GlobalContext'
import { HeaderLink } from './'
import { HamburgerMenu } from './'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { locale } = useRouter()
  // const { data: session } = useSession()
  const { session, paymentStatus } = useContext(GlobalContext)
  console.log('paymentStatus', paymentStatus)
  const siteTitle = 'Obgames'
  const headerAttrs = {
    className: 'bg-blue-600 text-white flex justify-around',
  }
  const footerAttrs = headerAttrs
  const headerBox = {
    className: 'flex flex-row items-center',
  }

  return (
    <div className='min-h-screen grid grid-rows-[auto_1fr_auto] gap-3'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, user-scalable=1.0, minimum-scale=1.0, maximum-scale=1.0'
        />
        <meta property='og:image' content='/images/profile.png' />
        <meta name='og:title' content={siteTitle} />
        <meta name='title' content='OBGames' />
        <meta name='description' content='Brain Games, Typing Games and Web Tools' />
      </Head>
      <header {...headerAttrs}>
        <div {...headerBox}>
          <HeaderLink href='/' text='Home' />
        </div>
        <div {...headerBox}>
          <Image priority src='/images/profile.png' height={32} width={32} alt='img' />
        </div>
        <div {...headerBox}>
          {session && session.user ? (
            // <HeaderLink href='/account/register' text='Logout' />
            <button onClick={() => signOut()}>Sign out: </button>
          ) : (
            <button onClick={() => signIn()}>Sign in</button>
            // <>
            //   <HeaderLink href='/account/register' text='Login' />
            //   <HeaderLink href='/account/register' text='Register' addClass='outline outline-white outline-2' />
            // </>
          )}
          <div {...headerBox}>
            <HamburgerMenu />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer {...footerAttrs}>
        <div {...headerBox}>
          <HeaderLink href='/' text='&copy; 2022 OBros.' />
        </div>
        <div {...headerBox}>
          <Image priority src='/images/profile.png' height={32} width={32} alt='img' />
        </div>
      </footer>
    </div>
  )
}
