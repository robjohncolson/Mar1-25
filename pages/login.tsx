import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { FaEnvelope, FaArrowLeft, FaLock, FaUserPlus, FaUserAlt } from 'react-icons/fa';
import { supabase } from '@/utils/supabaseClient';

// Demo account credentials
const DEMO_EMAIL = 'demo@apstatshub.com';
const DEMO_PASSWORD = 'apstatsdemo123';

export default function Login() {
  const router = useRouter();
  const { signIn, signUp, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  // Check for error query param
  const { error } = router.query;
  
  useEffect(() => {
    if (error && typeof error === 'string') {
      setMessage({ type: 'error', text: error });
    }
    
    // Check for hash error parameters in the URL (from redirects)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const hashError = hashParams.get('error');
    const hashErrorDescription = hashParams.get('error_description');
    
    if (hashError) {
      let errorMessage = 'Authentication failed';
      
      if (hashErrorDescription) {
        errorMessage = hashErrorDescription.replace(/\+/g, ' ');
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
      
      // Clean up the URL
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    if (!password.trim()) {
      setMessage({ type: 'error', text: 'Please enter your password' });
      return;
    }
    
    setMessage(null);
    
    try {
      let result;
      
      if (isSignUp) {
        // Sign up with email and password
        result = await signUp(email, password);
      } else {
        // Sign in with email and password
        result = await signIn(email, password);
      }
      
      const { error } = result;
      
      if (error) {
        console.error('Authentication error:', error);
        setMessage({ type: 'error', text: error.message || 'Authentication failed' });
      } else {
        if (isSignUp) {
          setMessage({ 
            type: 'success', 
            text: 'Account created successfully! You are now signed in.' 
          });
        }
        // Redirect to home page
        router.push('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    }
  };

  // Handle demo account login
  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setMessage(null);
    
    try {
      // Use the signIn method from AuthContext
      const { error } = await signIn(DEMO_EMAIL, DEMO_PASSWORD);
      
      if (error) {
        // If demo account doesn't exist, create it
        if (error.message && error.message.includes('Invalid login credentials')) {
          // Try to create the demo account
          const { error: signUpError } = await supabase.auth.signUp({
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD,
          });
          
          if (signUpError) {
            throw signUpError;
          }
          
          // Try signing in again
          const { error: retryError } = await signIn(DEMO_EMAIL, DEMO_PASSWORD);
          
          if (retryError) {
            throw retryError;
          }
        } else {
          throw error;
        }
      }
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Demo login error:', error);
      setMessage({ 
        type: 'error', 
        text: 'Could not access demo account. Please try again or create your own account.' 
      });
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <Layout title={`AP Statistics Hub - ${isSignUp ? 'Sign Up' : 'Login'}`}>
      <div className="max-w-md mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
            {isSignUp ? (
              <>
                <FaUserPlus className="mr-2 text-mac-white" /> 
                <span className="text-mac-white">Create Account</span>
              </>
            ) : (
              <>
                <FaEnvelope className="mr-2 text-mac-white" /> 
                <span className="text-mac-white">Sign In</span>
              </>
            )}
          </h1>
          <div className="mt-4">
            <Link href="/">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Home
              </a>
            </Link>
          </div>
        </div>
        
        <div className="mac-window p-6 mb-6">
          <button
            onClick={handleDemoLogin}
            disabled={isDemoLoading || isLoading}
            className="mac-button w-full py-3 text-center bg-green-600 hover:bg-green-700 text-white flex items-center justify-center"
          >
            <FaUserAlt className="mr-2" />
            {isDemoLoading ? 'Accessing Demo...' : 'Use Demo Account (Instant Access)'}
          </button>
          
          <p className="text-sm text-center mt-2 text-gray-600">
            No sign up required! Click above to instantly access all features.
          </p>
        </div>
        
        <div className="mac-window p-6">
          <h2 className="text-xl font-bold mb-4">
            {isSignUp ? 'Create a new account' : 'Sign in to your account'}
          </h2>
          
          <p className="mb-6 text-gray-600">
            {isSignUp 
              ? 'Create an account to track your progress and customize your experience.' 
              : 'Sign in to track your progress and access your personalized content.'}
          </p>
          
          {message && (
            <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
                disabled={isLoading || isDemoLoading}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your password"
                disabled={isLoading || isDemoLoading}
              />
            </div>
            
            <button
              type="submit"
              className="mac-button w-full py-2 text-center mb-4"
              disabled={isLoading || isDemoLoading}
            >
              {isLoading 
                ? 'Processing...' 
                : isSignUp 
                  ? 'Create Account' 
                  : 'Sign In'}
            </button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline"
                disabled={isLoading || isDemoLoading}
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : 'Need an account? Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
} 