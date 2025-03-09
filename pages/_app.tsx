import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

// Demo account credentials
const DEMO_EMAIL = 'demo@apstatshub.com';
const DEMO_PASSWORD = 'apstatsdemo123';

// Function to ensure demo account exists
async function ensureDemoAccountExists() {
  console.log('Checking if demo account exists...');
  
  try {
    // First check if we can connect to Supabase
    const { error: testError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('Cannot connect to Supabase:', testError);
      return;
    }
    
    // We won't try to create the demo account on app startup anymore
    // This will be handled when the user clicks the demo account button
    console.log('Demo account will be created when needed');
    return;
  } catch (error) {
    console.error('Error in demo account setup:', error);
  }
}

function isSupabaseAvailable() {
  try {
    return typeof supabase.auth !== 'undefined' && 
           typeof supabase.from === 'function' && 
           typeof supabase.auth.signInWithPassword === 'function';
  } catch (error) {
    console.error('Supabase availability check failed:', error);
    return false;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [supabaseAvailable, setSupabaseAvailable] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check Supabase availability on mount
  useEffect(() => {
    if (!isMounted) return;
    
    const checkSupabase = async () => {
      const available = isSupabaseAvailable();
      console.log('Supabase available:', available);
      setSupabaseAvailable(available);
      
      if (available) {
        try {
          await ensureDemoAccountExists();
        } catch (error) {
          console.error('Failed to set up demo account:', error);
        }
      }
    };
    
    checkSupabase();
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    
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
  }, [router, isMounted]);

  // Render the app with or without AuthProvider based on Supabase availability
  const renderApp = () => {
    // During SSR, render without AuthProvider
    if (!isMounted) {
      return (
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      );
    }
    
    // On client-side, use AuthProvider if Supabase is available
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