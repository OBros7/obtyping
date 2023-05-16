import React, { useState } from 'react'
import { TypingGetter, TypingSetter } from '@/Admin'
import { Layout, MainContainer } from '@/Layout';
import { MyInputNumber, MySelect } from '@/Basics'


const dataTypeList = ['text', 'deck']
const minibox = 'flex flex-row  justify-center items-center'

export default function TypingData() {
    const [isGetter, setIsGetter] = useState(false)
    const [dataType, setDataType] = useState('text')
    const [userID, setUserID] = useState(1)

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
                    <MySelect
                        state={dataType}
                        setState={setDataType}
                        optionValues={dataTypeList}
                    />
                    <div className={minibox}>
                        User ID:
                        <MyInputNumber
                            state={userID}
                            setState={setUserID}
                            min={1}
                            max={100}
                            step={1}
                            defaultState={1}
                        />
                    </div>
                    {isGetter ? <TypingGetter /> : <TypingSetter />}
                </div>

            </MainContainer>
        </Layout>
    )
}
