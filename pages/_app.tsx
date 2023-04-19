import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Global } from '@/Global';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// import { Auth0Provider } from '@auth0/auth0-react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? ''
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Elements stripe={stripePromise}>
          <Global>
            <Component {...pageProps} />
          </Global>
        </Elements>
      </GoogleOAuthProvider>
      {/* </Auth0Provider> */}
    </SessionProvider>
  );
}
