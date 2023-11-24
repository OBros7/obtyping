import React, { useEffect, useState } from 'react';
import { GoogleLogin, langDict, LoginForm, SignupForm } from '.';
import { Layout, MainContainer } from '@/Layout';
import { useTranslation } from '@/MyCustomHooks';

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
        <div className={boxClass}>
          <GoogleLogin />
        </div>
        <div className={boxClass}>
          {newUser ? (
            <>
              <button
                onClick={() => setNewUser(!newUser)}
                className={switchButtonClass}
              >
                I have my account
              </button>
              <SignupForm btnClass={signinButtonClass} />
            </>
          ) : (
            <>
              <button
                onClick={() => setNewUser(!newUser)}
                className={switchButtonClass}
              >
                I am a New User!
              </button>
              <LoginForm btnClass={signinButtonClass} />
            </>
          )}
        </div>
      </MainContainer>
    </Layout>
  );
}
