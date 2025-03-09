import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabaseClient';
import LoadingIndicator from '@/components/LoadingIndicator';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { FaExclamationTriangle, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    // This page is loaded after email verification
    // The hash fragment will contain the access token and refresh token
    const handleCallback = async () => {
      try {
        // The supabase client will automatically handle the hash fragment
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          setError(error.message);
          setIsProcessing(false);
          return;
        }
        
        if (data.session) {
          // Success! We have a session
          setSuccess(true);
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          // No session found, redirect to login
          router.push('/login');
        }
      } catch (err) {
        console.error('Unexpected error during auth callback:', err);
        setError('An unexpected error occurred during authentication');
        setIsProcessing(false);
      }
    };

    handleCallback();
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
  
  if (success) {
    return (
      <Layout title="Authentication Successful">
        <div className="max-w-md mx-auto">
          <div className="mac-window p-4 mb-6">
            <h1 className="text-2xl font-bold mb-0 flex items-center mac-header p-2">
              <FaCheckCircle className="mr-2 text-mac-white" /> 
              <span className="text-mac-white">Authentication Successful</span>
            </h1>
          </div>
          
          <div className="mac-window p-6">
            <p className="mb-4 text-green-600">Your account has been verified successfully!</p>
            <p className="mb-6">
              You will be redirected to the homepage shortly...
            </p>
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