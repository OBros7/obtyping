// contexts/ReactQueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // React18 の StrictMode でもインスタンスが 1 回だけ作られるよう useState
  const [client] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={client}>
      {children}
      <ToastContainer position="top-right" autoClose={5000} />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}