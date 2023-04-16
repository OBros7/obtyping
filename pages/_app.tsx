import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Global } from '@/Global';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Auth0Provider } from '@auth0/auth0-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Auth0Provider
        domain={process.env.AUTH0_DOMAIN!}
        clientId={process.env.AUTH0_CLIENT_ID!}
        authorizationParams={{
          redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
        }}
      >
        <Elements stripe={stripePromise}>
          <Global>
            <Component {...pageProps} />
          </Global>
        </Elements>
      </Auth0Provider>
    </SessionProvider>
  );
}
