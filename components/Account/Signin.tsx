import React, { useEffect, useState } from 'react';
import { GoogleLogin, langDict, LoginForm, SignupForm } from '.';
import { Layout, MainContainer } from '@/Layout';
import { useTranslation } from '@/MyCustomHooks';
import TabSwitcher from './TabSwitcher';

const signinButtonClass = 'btn-third';

export default function Signin() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string,];
  const [newUser, setNewUser] = useState(false);

  return (
    <Layout>
      <MainContainer>
        <div className='flex justify-center items-center'>
          <div className="flex outline outline-2 rounded my-8">
            <div className='border-r border-gray-300 outline-2 p-4'>
              <GoogleLogin />
            </div>
            <div className=' rounded m-4 p-4'>
              <TabSwitcher text1='Login' text2='Signup' isSwitch={newUser} setIsSwitch={setNewUser} />
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
