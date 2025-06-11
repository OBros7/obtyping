import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
// import { Global } from '@/Global';
import { UserProvider } from "@contexts/UserContext";
import ReactQueryProvider from "@contexts/ReactQueryProvider";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Stripe の公開可能キーを環境変数から取得
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <Global>
    <ReactQueryProvider>
      <Elements stripe={stripePromise}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </Elements>
    </ReactQueryProvider>
    // </Global>
  );
}