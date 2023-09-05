import React, { useEffect, useState } from 'react';
import ToggleButton from './ToggleButton'
import { langDict } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'


export default function Setting() {
    const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

    const [isKeyboardAndHands, setIsKeyboardAndHands] = useState<boolean>();

    useEffect(() => {
        if (localStorage.getItem('isKeyboardAndHands')) {
            setIsKeyboardAndHands(localStorage.getItem('isKeyboardAndHands') === 'true' ? true : false)
        } else {
            localStorage.setItem('isKeyboardAndHands', JSON.stringify(true))
            setIsKeyboardAndHands(true)
        }
    }, [])

    const handleClick = () => {
        setIsKeyboardAndHands(!isKeyboardAndHands); // Switch the state between true and false
        localStorage.setItem('isKeyboardAndHands', JSON.stringify(!isKeyboardAndHands))
    };

    return (
        <Layout>
            <MainContainer>
                <div className="headline p-4 text-4xl font-bold">{translater.settingTitle}</div>
                <div className="headline p-4 pl-8 text-3xl font-bold">{translater.memberInformation}</div>
                <div className="pl-16 pu-2 text-2xl flex flex-col">
                    <div className='py-4'>{translater.loginStatus} : login</div>
                    <div className='py-4'>{translater.mailAddress} : ***@gmail.com</div>
                    <div className='py-4'>{translater.plan} : free member</div>
                </div>
                <div className="headline p-4 pl-8 text-3xl font-bold">{translater.typingSetting}</div>
                <div className="pl-16 pu-2 text-2xl flex flex-col">
                    <div className='py-4'>{translater.degreeOfDifficulty} : normal</div>
                    <div className='py-4 pr-4'>{translater.keyboardDisplay}
                        <ToggleButton
                            flag={isKeyboardAndHands}
                            text1="ON"
                            text2="OFF"
                            color="blue"
                            toggleFlag={handleClick}
                        />
                    </div>
                </div>

            </MainContainer>
        </Layout>
    )
}
