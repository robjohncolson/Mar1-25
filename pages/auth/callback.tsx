import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import LoadingIndicator from '@/components/LoadingIndicator';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // Check for hash error parameters in the URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashError = hashParams.get('error');
    const hashErrorDescription = hashParams.get('error_description');
    
    if (hashError) {
      let errorMessage = 'Authentication failed';
      
      if (hashErrorDescription) {
        errorMessage = hashErrorDescription.replace(/\+/g, ' ');
      }
      
      setError(errorMessage);
      setIsProcessing(false);
      return;
    }

    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          setError(error.message);
          setIsProcessing(false);
        } else {
          // Redirect to home page or dashboard
          router.push('/');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred during authentication');
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (error) {
    return (
      <Layout title="Authentication Error">
        <div className="max-w-md mx-auto">
          <div className="mac-window p-4 mb-6">
            <h1 className="text-2xl font-bold mb-0 flex items-center mac-header p-2">
              <FaExclamationTriangle className="mr-2 text-mac-white" /> 
              <span className="text-mac-white">Authentication Error</span>
            </h1>
          </div>
          
          <div className="mac-window p-6">
            <p className="mb-4 text-red-600">{error}</p>
            <p className="mb-6">
              The authentication link may have expired or is invalid. Please try signing in again.
            </p>
            
            <Link href="/login">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Login
              </a>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <LoadingIndicator message="Completing authentication..." />
    </div>
  );
} 