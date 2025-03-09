import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useNextAuth } from '@/contexts/NextAuthContext';
import { FaEnvelope, FaArrowLeft, FaLock, FaUserPlus, FaBug } from 'react-icons/fa';
import { supabase } from '@/utils/supabaseClient';

export default function Login() {
  const router = useRouter();
  const { signInWithCredentials, signUpWithCredentials, isLoading } = useNextAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Check for error query param
  const { error } = router.query;
  
  // Check Supabase connection on mount
  useEffect(() => {
    if (!isMounted) return;
    
    const checkSupabase = async () => {
      try {
        const info = [];
        info.push(`Supabase Available: true`);
        
        // Test Supabase connection
        const { error: testError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        info.push(`DB Connection: ${testError ? 'Failed' : 'Success'}`);
        if (testError) info.push(`Error: ${testError.message}`);
        
        // Test auth
        const { data, error: authError } = await supabase.auth.getSession();
        info.push(`Auth Connection: ${authError ? 'Failed' : 'Success'}`);
        if (authError) info.push(`Error: ${authError.message}`);
        
        info.push(`Session: ${data.session ? 'Active' : 'None'}`);
        if (data.session) {
          info.push(`User: ${data.session.user.email}`);
          info.push(`Expires: ${new Date(data.session.expires_at! * 1000).toLocaleString()}`);
        }
        
        // Check local storage for auth token
        const hasLocalStorage = typeof window !== 'undefined' && window.localStorage;
        if (hasLocalStorage) {
          const supabaseKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('sb-') || key.includes('supabase')
          );
          
          if (supabaseKeys.length > 0) {
            info.push(`Supabase Storage Keys: ${supabaseKeys.join(', ')}`);
          } else {
            info.push('No Supabase Storage Keys Found');
          }
        }
        
        setDebugInfo(info.join('\n'));
      } catch (error: any) {
        setDebugInfo(`Error checking Supabase: ${error?.message || 'Unknown error'}`);
      }
    };
    
    checkSupabase();
    
    // Refresh debug info every 5 seconds
    const interval = setInterval(checkSupabase, 5000);
    
    return () => clearInterval(interval);
  }, [isMounted]);
  
  useEffect(() => {
    if (!isMounted) return;
    
    if (error && typeof error === 'string') {
      setMessage({ type: 'error', text: error });
      
      // Clear the error from the URL
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [error, isMounted]);

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
    
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }
    
    setMessage(null);
    
    try {
      if (isSignUp) {
        // Create new account
        const { error, user } = await signUpWithCredentials(email, password);
        
        if (error) {
          setMessage({ type: 'error', text: error.message || 'Failed to create account' });
        } else {
          // Check if email confirmation is needed
          if (user && !user.email_confirmed_at) {
            setMessage({ 
              type: 'success', 
              text: 'Account created! Please check your email to verify your account before signing in.' 
            });
          } else {
            setMessage({ 
              type: 'success', 
              text: 'Account created successfully! You are now signed in.' 
            });
            
            // Redirect to home page after a short delay
            setTimeout(() => {
              router.push('/');
            }, 1500);
          }
        }
      } else {
        // Sign in with email and password
        const { error } = await signInWithCredentials(email, password);
        
        if (error) {
          if (error.message && error.message.includes('Email not confirmed')) {
            setMessage({ 
              type: 'error', 
              text: 'Please verify your email address before signing in. Check your inbox for a verification link.' 
            });
          } else {
            setMessage({ type: 'error', text: error.message || 'Failed to sign in' });
          }
        } else {
          setMessage({ type: 'success', text: 'Signed in successfully!' });
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error?.message || 'An unexpected error occurred' 
      });
    }
  };

  return (
    <Layout title="AP Statistics Hub - Login">
      <div className="max-w-md mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 className="text-2xl font-bold mb-0 flex items-center mac-header p-2">
            <span className="text-mac-white">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </span>
          </h1>
        </div>
        
        <div className="mac-window p-6">
          {message && (
            <div className={`p-3 mb-4 rounded ${
              message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mac-input pl-10 w-full"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mac-input pl-10 w-full"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <button
                type="submit"
                className="mac-button flex items-center justify-center w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : isSignUp ? (
                  <>
                    <FaUserPlus className="mr-2" />
                    Create Account
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <Link href="/">
                <a className="text-gray-600 hover:text-gray-900 flex items-center">
                  <FaArrowLeft className="mr-2" /> Back to Home
                </a>
              </Link>
              
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-gray-500 hover:text-gray-700 flex items-center text-sm"
              >
                <FaBug className="mr-1" /> {showDebug ? 'Hide Debug' : 'Debug Info'}
              </button>
            </div>
            
            {showDebug && debugInfo && (
              <div className="mt-4 p-3 bg-gray-100 text-xs font-mono">
                <h3 className="font-bold mb-2">Debug Information:</h3>
                <pre className="whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 