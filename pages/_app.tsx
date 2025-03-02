import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  // Add dark mode detection
  useEffect(() => {
    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      if (
        localStorage.theme === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default MyApp; 