import React, { useEffect, useState } from 'react';
// import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { langDict, LoginForm, SignupForm } from '.';
import { Layout, MainContainer } from '@/Layout';
import { useTranslation } from '@/MyCustomHooks';

const boxClass = 'outline outline-2 rounded m-4 p-4';
const signinButtonClass = 'btn-third';
const switchButtonClass = 'btn-primary';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? ''
const fastAPIURL = process.env.FASTAPI_URL



async function handleGoogleAuthSuccess(response: CredentialResponse) {
  try {
    const result = await fetch(fastAPIURL + '/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id_token: response.credential }),
    });

    const data = await result.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}



export default function Signin() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string,];
  const [newUser, setNewUser] = useState(false);


  useEffect(() => {
    console.log('GOOGLE_CLIENT_ID', GOOGLE_CLIENT_ID)// empty string
    console.log('fastAPIURL', fastAPIURL)// properly set
  }, [])

  return (
    <Layout>
      <MainContainer>
        <div className={boxClass}>
          Recommended: Login with Google account:{' '}
          <GoogleLogin
            onSuccess={handleGoogleAuthSuccess}
            onError={() => {
              console.log('Login Failed');
            }}
          />;
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
