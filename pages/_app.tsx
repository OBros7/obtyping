import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@contexts/UserContext";
import ReactQueryProvider from "@contexts/ReactQueryProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ReactQueryProvider>
  );
}