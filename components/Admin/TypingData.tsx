import React, { useState } from 'react'
import { TypingGetter, TypingSetter } from '@/Admin'
import { Layout, MainContainer } from '@/Layout';
import { MyInputNumber, MySelect } from '@/Basics'
export default function TypingData() {
    const [isGetter, setIsGetter] = useState(false)


    return (
        <Layout>
            <MainContainer>
                {/* put items in center */}
                <div className='flex flex-col items-center'>
                    {/* <button onClick={() => setIsGetter(!isGetter)} className='btn-primary m-4'>
                        {isGetter ? 'Getter' : 'Setter'}
                    </button> */}
                    <MySelect
                        state={isGetter}
                        setState={setIsGetter}
                        optionValues={[true, false]}
                        optionTexts={['Get', 'Create']}
                    />
                    {isGetter ? <TypingGetter /> : <TypingSetter />}
                </div>

            </MainContainer>
        </Layout>
    )
}
