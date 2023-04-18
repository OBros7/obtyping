import React, { useState } from 'react';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import { langDict, LoginForm, SignupForm } from '.';
import { Layout, MainContainer } from '@/Layout';
import { useTranslation } from '@/MyCustomHooks';

const boxClass = 'outline outline-2 rounded m-4 p-4';
const signinButtonClass = 'btn-third';
const switchButtonClass = 'btn-primary';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? ''

interface GoogleLoginError {
  error: string;
  details?: string;
}


export default function Signin() {
  const [translater] = useTranslation(langDict) as [{ [key in keyof typeof langDict]: string }, string,];
  const [newUser, setNewUser] = useState(false);

  const handleGoogleLoginSuccess = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    if ('tokenId' in response) {
      console.log(response);
      // Handle the login success, e.g., send the token to your backend for validation and user creation
    }
  };

  const handleGoogleLoginFailure = (error: GoogleLoginError) => {
    console.log(error);
    // Handle the login failure, e.g., show an error message
  };

  console.log('GOOGLE_CLIENT_ID', GOOGLE_CLIENT_ID)

  return (
    <Layout>
      <MainContainer>
        <div className={boxClass}>
          Recommended: Login with Google account:{' '}
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Log In with Google"
            onSuccess={handleGoogleLoginSuccess}
            onFailure={handleGoogleLoginFailure}
            className={signinButtonClass}
          />
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
