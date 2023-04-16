import React, { useState } from 'react'
import { langDict, LoginForm, RegisterForm } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Register() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]
  const [newUser, setNewUser] = useState(false)


  return (
    <Layout>
      <MainContainer>
        <div className='outline outline-2 m-4'>
          OAuth (recommended) <button onClick={() => signIn()} className='btn-primary'>Sign in</button>
          {/* <button onClick={() => loginWithRedirect({})}>Log In with Google</button> */}
        </div>
        <div className='outline outline-2 m-4'>

          {newUser ? (
            <>
              <button onClick={() => setNewUser(!newUser)} className='btn-primary'>I have my account</button>
              <RegisterForm /></>
          ) : (
            <>
              <button onClick={() => setNewUser(!newUser)} className='btn-primary'>New User</button>
              <LoginForm /></>
          )
          }

        </div>


      </MainContainer>
    </Layout >
  )
}