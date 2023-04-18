import React, { useState } from 'react'
import { langDict, LoginForm, SignupForm } from '.'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'
import { useAuth0 } from '@auth0/auth0-react';

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { useSession, signIn, signOut } from 'next-auth/react'

const boxClass = 'outline outline-2 rounded m-4 p-4'
const signinButtonClass = 'btn-third'
const switchButtonClass = 'btn-primary'

export default function Signin() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const [newUser, setNewUser] = useState(false)
  const { loginWithRedirect } = useAuth0();


  return (
    <Layout>
      <MainContainer>
        <div className={boxClass}>
          OAuth (recommended) <button onClick={() => signIn()} className={signinButtonClass}>Sign in</button>
          <button onClick={() => loginWithRedirect({})}>Log In with Google</button>
        </div>
        <div className={boxClass}>

          {newUser ? (
            <>
              <button onClick={() => setNewUser(!newUser)} className={switchButtonClass}>I have my account</button>
              <SignupForm btnClass={signinButtonClass} /></>
          ) : (
            <>
              <button onClick={() => setNewUser(!newUser)} className={switchButtonClass}>I am a New User!</button>
              <LoginForm btnClass={signinButtonClass} /></>
          )
          }

        </div>


      </MainContainer>
    </Layout >
  )
}