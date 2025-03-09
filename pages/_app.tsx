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
    // Check if demo account already exists
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD
    });
    
    if (signInError) {
      // If demo account doesn't exist, create it
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('Demo account does not exist. Creating...');
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
        });
        
        if (signUpError) {
          console.error('Error creating demo account:', signUpError);
          return;
        }
        
        console.log('Demo account created successfully!');
        
        // Set up profile for demo account
        if (data?.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              display_name: 'Demo User',
              avatar_data: {
                resolution: 2,
                colors: ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f'],
                last_edited: new Date().toISOString()
              },
              stars_count: 10, // Give demo account some stars to start with
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (profileError) {
            console.error('Error setting up demo profile:', profileError);
          } else {
            console.log('Demo profile set up successfully!');
          }
        }
      } else {
        console.error('Error checking demo account:', signInError);
      }
    } else {
      console.log('Demo account already exists!');
    }
  } catch (error) {
    console.error('Error in demo account setup:', error);
  }
}

function isSupabaseAvailable() {
  try {
    return typeof supabase.auth !== 'undefined' && typeof supabase.from === 'function';
  } catch (error) {
    return false;
  }
}

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

  useEffect(() => {
    // Only run in production environment and when Supabase is available
    if (process.env.NODE_ENV === 'production' && isSupabaseAvailable()) {
      ensureDemoAccountExists();
    }
  }, []);

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