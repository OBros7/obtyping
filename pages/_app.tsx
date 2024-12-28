import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import type { AppProps } from 'next/app';
// import { Global } from '@/Global';
import { UserProvider } from '@contexts/UserContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Stripe の公開可能キーを環境変数から取得
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// AppProps を拡張して pageProps に session を追加
interface MyAppProps extends AppProps {
  pageProps: AppProps['pageProps'] & {
    session?: Session;
  };
}

export default function App({ Component, pageProps }: MyAppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Elements stripe={stripePromise}>
        {/* <Global> */}
        <UserProvider>
          <Component {...pageProps} />
          {/* </Global> */}
        </UserProvider>
      </Elements>
    </SessionProvider>
  );
}
