//components/Layout/Layout.tsx:
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { useUserContext } from '@contexts/UserContext';
import { HeaderLink, HamburgerMenu } from './'
import useAuth from '@/MyCustomHooks/useAuth';

const siteTitle = 'Obgames'
const headerAttrs = {
  className: 'bg-blue-600 text-white flex justify-between px-4'
}
const footerAttrs = headerAttrs
const headerBox = {
  className: 'flex flex-row items-center mx-4'
}


export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const locale = router.locale ?? 'ja';
  const { signOut } = useAuth();
  const { userData } = useUserContext();

  return (
    // <div key={user ? 'loggedIn' : 'loggedOut'} className='min-h-screen grid grid-rows-[auto_1fr_auto] gap-3'>
    <div key={userData.loginStatus === true ? 'loggedIn' : 'loggedOut'} className='min-h-screen flex flex-col'>
      <Head>
        <link rel='icon' href='/favicon.ico' />
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1.0, user-scalable=1.0, minimum-scale=1.0, maximum-scale=1.0'
        />
        <meta property='og:image' content='/images/logoIcon.png' />
        <meta name='og:title' content={siteTitle} />
        <meta name='title' content='OBGames' />
        <meta name='description' content='A typing practice site where you can study at the same time' />
      </Head>
      <header {...headerAttrs}>
        <div {...headerBox}>
          <Image src='/images/logoIcon.png' height={32} width={32} alt='img' />
          <HeaderLink href='/' text='TypingNLearning' addClass='text-xl font-bold mr-4' />
        </div>
        <div {...headerBox}>
          <Image priority src='/images/profile.png' height={32} width={32} alt='img' />
        </div>

        <div {...headerBox}>
          {userData.loginStatus === true ? (
            < HeaderLink href='/payment/payment' text='Subscribe!' addClass='outline outline-white outline-2 font-bold' />
          ) : (
            <HeaderLink href='/account/signin' text='SignIn!' addClass='outline outline-white outline-2 font-bold' />
          )}
          <HamburgerMenu userData={userData} signOut={() => signOut()} />

        </div>
      </header>
      <main className="flex-grow">{children}</main>
      <footer {...footerAttrs}>
        <div {...headerBox}>
          <HeaderLink href='/' text='&copy; 2025 OBros.' />
        </div>
        {/* <div {...headerBox}>
          <Image priority src='/images/profile.png' height={32} width={32} alt='img' />
        </div> */}
      </footer>
    </div>
  )
}
