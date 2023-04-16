import React from 'react'
import { langDict } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'


export default function Setting() {
    return (
        <Layout>
            <MainContainer>
                <div>Setting</div>
            </MainContainer>
        </Layout>
    )
}
