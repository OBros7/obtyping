import React, { useEffect, useState } from 'react';
import ToggleButton from './ToggleButton'
import { langDict } from './'
import { Layout, MainContainer } from '@/Layout'
import { useTranslation } from '@/MyCustomHooks'
import { useUserContext } from '@contexts/UserContext';

/* 
Please modify the following code:
Show login status and subscription status based on the following userData structure:
- userName: string;
- loginStatus: boolean;
- subscriptionStatus: boolean;
*/


export default function Setting() {
    const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string]

    const [isKeyboardAndHands, setIsKeyboardAndHands] = useState<boolean>();
    const [isHardMode, setIsHardMode] = useState<boolean>();
    const [isEnglishDisplay, setIsEnglishDisplay] = useState<boolean>();
    const { userData } = useUserContext();

    useEffect(() => {
        if (localStorage.getItem('isKeyboardAndHands')) {
            setIsKeyboardAndHands(localStorage.getItem('isKeyboardAndHands') === 'true' ? true : false)
        } else {
            localStorage.setItem('isKeyboardAndHands', JSON.stringify(true))
            setIsKeyboardAndHands(true)
        }

        if (localStorage.getItem('isHardMode')) {
            setIsHardMode(localStorage.getItem('isHardMode') === 'true' ? true : false)
        } else {
            localStorage.setItem('isHardMode', JSON.stringify(true))
            setIsHardMode(true)
        }

        if (localStorage.getItem('isEnglishDisplay')) {
            setIsEnglishDisplay(localStorage.getItem('isEnglishDisplay') === 'true' ? true : false)
        } else {
            localStorage.setItem('isEnglishDisplay', JSON.stringify(true))
            setIsEnglishDisplay(true)
        }
    }, [])

    // const handleClick = () => {
    //     setIsKeyboardAndHands(!isKeyboardAndHands); // Switch the state between true and false
    //     localStorage.setItem('isKeyboardAndHands', JSON.stringify(!isKeyboardAndHands))
    // };

    return (
        <Layout>
            <MainContainer>
                <div className="headline p-4 text-4xl font-bold">{translater.settingTitle}</div>
                <div className="headline p-4 pl-8 text-3xl font-bold">{translater.typingSetting}</div>
                <div className="pl-16 pu-2 text-2xl flex flex-col">
                    <div className='py-4'>{translater.degreeOfDifficulty}
                        <ToggleButton
                            flag={isHardMode}
                            text1="HARD"
                            text2="NORMAL"
                            color="red"
                            localStorageKey='isHardMode'
                            setFlag={setIsHardMode}
                        />
                    </div>
                    <div className='py-4 pr-4'>{translater.keyboardDisplay}
                        <ToggleButton
                            flag={isKeyboardAndHands}
                            text1="ON"
                            text2="OFF"
                            color="blue"
                            localStorageKey='isKeyboardAndHands'
                            setFlag={setIsKeyboardAndHands}
                        />
                    </div>
                    <div className='py-4 pr-4'>{translater.englishDisplay}
                        <ToggleButton
                            flag={isEnglishDisplay}
                            text1="English"
                            text2="Japanese"
                            color="blue"
                            localStorageKey='isEnglishDisplay'
                            setFlag={setIsEnglishDisplay}
                        />
                    </div>
                </div>
                <div className="headline p-4 pl-8 text-3xl font-bold">{translater.memberInformation}</div>
                <div className="pl-16 pu-2 text-2xl flex flex-col">
                    <div className='py-4'>{translater.loginStatus} : {userData?.loginStatus ? 'Logged in' : 'Logged out'}</div>
                    <div className='py-4'>{translater.mailAddress} : {userData?.userName || 'N/A'}</div>
                    <div className='py-4'>{translater.plan} : {userData?.subscriptionStatus ? 'Premium member' : 'Free member'}</div>
                    {userData?.loginStatus === true ?
                        // if user is logged in, show the button to go to payment page: href='/payment/payment'
                        <button className="btn-second mt-4"
                            onClick={() => window.location.href = '/payment/payment'}>
                            Manage Subscription
                        </button>
                        : null
                    }
                </div>
            </MainContainer>
        </Layout>
    )
}
