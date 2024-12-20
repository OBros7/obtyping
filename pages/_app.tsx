import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
// import { Global } from '@/Global';
import { UserProvider } from '@contexts/UserContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Elements stripe={stripePromise}>
        {/* <Global> */}
        < UserProvider>
          <Component {...pageProps} />
          {/* </Global> */}
        </UserProvider>
      </Elements>
    </SessionProvider>
  );
}
