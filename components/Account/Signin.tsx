import React, { useEffect, useState } from 'react';
import { GoogleLogin, langDict, LoginForm, SignupForm } from '.';
import { Layout, MainContainer } from '@/Layout';
import { useTranslation } from '@/MyCustomHooks';
import TabSwitcher from './TabSwitcher';

const boxClass = 'outline outline-2 rounded m-4 p-4';
const signinButtonClass = 'btn-third';
const switchButtonClass = 'btn-primary';

// import { useSession, signIn, signOut } from 'next-auth/react'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? ''
const fastAPIURL = process.env.FASTAPI_URL

const url = process.env.FASTAPI_URL + '/api/users/oauth_google';

export default function Signin() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string,];
  const [newUser, setNewUser] = useState(false);

  console.log('url: ', url)

  return (
    <Layout>
      <MainContainer>
        <div className='flex justify-center items-center'>
          <div className="flex outline outline-2 rounded my-8">
            <div className='border-r border-gray-300 outline-2 p-4'>
              <GoogleLogin />
            </div>
            <div className=' rounded m-4 p-4'>
              <TabSwitcher text1='Login' text2='Signin' isSwitch={newUser} setIsSwitch={setNewUser} />
              {newUser ? (
                <>
                  <SignupForm btnClass={signinButtonClass} />
                </>
              ) : (
                <>
                  <LoginForm btnClass={signinButtonClass} />
                </>
              )}
            </div>
          </div>
        </div>
      </MainContainer>
    </Layout>
  );
}
