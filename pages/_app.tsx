import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

// Check if Supabase is properly initialized
const isSupabaseAvailable = () => {
  try {
    // Try to access a method on the supabase client
    return typeof supabase.auth !== 'undefined';
  } catch (error) {
    console.error('Supabase client initialization error:', error);
    return false;
  }
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [supabaseAvailable] = useState(isSupabaseAvailable());

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Render the app with or without AuthProvider based on Supabase availability
  const renderApp = () => {
    if (supabaseAvailable) {
      return (
        <AuthProvider>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </AuthProvider>
      );
    } else {
      // Fallback when Supabase is not available
      return (
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      );
    }
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {renderApp()}
    </>
  );
} 