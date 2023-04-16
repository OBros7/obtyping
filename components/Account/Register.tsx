import React from 'react'
import { langDict } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export default function Register() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

  return (
    <Layout>
      <MainContainer>
        <div>Regsiter</div>
      </MainContainer>
    </Layout>
  )
}
