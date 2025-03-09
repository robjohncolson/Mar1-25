import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { FaEnvelope, FaArrowLeft, FaLock, FaUserPlus, FaBug } from 'react-icons/fa';
import { supabase } from '@/utils/supabaseClient';

export default function Login() {
  const router = useRouter();
  const { signIn, signUp, isLoading, isSupabaseAvailable } = useAuth();
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
        info.push(`Supabase Available: ${isSupabaseAvailable}`);
        
        if (isSupabaseAvailable) {
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
              
              // Check if we have the correct storage key
              const hasAuthToken = supabaseKeys.includes('sb-apstats-auth');
              info.push(`Has Correct Auth Token: ${hasAuthToken ? 'Yes' : 'No'}`);
            } else {
              info.push('No Supabase Storage Keys Found');
            }
          }
          
          // Check cookies
          const hasCookies = typeof document !== 'undefined' && document.cookie;
          if (hasCookies) {
            const cookies = document.cookie.split(';').map(c => c.trim());
            const authCookies = cookies.filter(c => c.startsWith('sb-') || c.includes('auth'));
            info.push(`Auth Cookies: ${authCookies.length > 0 ? authCookies.join(', ') : 'None'}`);
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
  }, [isSupabaseAvailable, isMounted]);
  
  useEffect(() => {
    if (!isMounted) return;
    
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
        console.log('Signing up with:', email);
        
        // Create new account
        const { error, user } = await signUp(email, password);
        
        if (error) {
          console.error('Sign up error:', error);
          
          // Check for rate limiting
          if (error.message && error.message.includes('rate')) {
            setMessage({ 
              type: 'error', 
              text: 'Too many signup attempts. Please wait a moment and try again.' 
            });
            return;
          }
          
          setMessage({ type: 'error', text: error.message || 'Failed to create account' });
        } else {
          console.log('Sign up successful, user:', user?.email);
          setMessage({ 
            type: 'success', 
            text: 'Account created successfully! You are now signed in.' 
          });
          
          // Verify session after signup
          const { data } = await supabase.auth.getSession();
          console.log('Session after signup:', !!data.session);
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      } else {
        console.log('Signing in with:', email);
        // Sign in with email and password
        const { error } = await signIn(email, password);
        
        if (error) {
          console.error('Sign in error:', error);
          
          // Check for rate limiting
          if (error.message && error.message.includes('rate')) {
            setMessage({ 
              type: 'error', 
              text: 'Too many login attempts. Please wait a moment and try again.' 
            });
            return;
          }
          
          // Provide a more helpful message for invalid credentials
          if (error.message && error.message.includes('Invalid login credentials')) {
            setMessage({ 
              type: 'error', 
              text: 'Invalid email or password. Please check your credentials and try again.' 
            });
          } else {
            setMessage({ type: 'error', text: error.message || 'Failed to sign in' });
          }
        } else {
          console.log('Sign in successful, redirecting...');
          
          // Verify session after signin
          const { data } = await supabase.auth.getSession();
          console.log('Session after signin:', !!data.session);
          
          // Redirect to home page
          router.push('/');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      
      // Check for rate limiting
      if (error.message && error.message.includes('rate')) {
        setMessage({ 
          type: 'error', 
          text: 'Too many authentication attempts. Please wait a moment and try again.' 
        });
        return;
      }
      
      setMessage({ type: 'error', text: error?.message || 'An unexpected error occurred' });
    }
  };

  // During SSR/SSG, return a simple login page without auth functionality
  if (!isMounted) {
    return (
      <Layout title="AP Statistics Hub - Login">
        <div className="max-w-md mx-auto">
          <div className="mac-window p-4 mb-6">
            <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
              <FaEnvelope className="mr-2 text-mac-white" /> 
              <span className="text-mac-white">Sign In</span>
            </h1>
            <div className="mt-4">
              <Link href="/">
                <a className="mac-button inline-flex items-center">
                  <FaArrowLeft className="mr-2" /> Back to Home
                </a>
              </Link>
            </div>
          </div>
          
          <div className="mac-window p-6">
            <h2 className="text-xl font-bold mb-4">Loading authentication...</h2>
            <p className="mb-6 text-gray-600">
              Please wait while we initialize the authentication system.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // If Supabase is not available, show a message
  if (!isSupabaseAvailable) {
    return (
      <Layout title="AP Statistics Hub - Login">
        <div className="max-w-md mx-auto">
          <div className="mac-window p-6">
            <h2 className="text-xl font-bold mb-4">Authentication Unavailable</h2>
            <p className="mb-6 text-gray-600">
              The authentication service is currently unavailable. Please try again later or contact the administrator.
            </p>
            <Link href="/">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Home
              </a>
            </Link>
            
            {debugInfo && (
              <div className="mt-6 p-3 bg-gray-100 text-xs font-mono">
                <h3 className="font-bold mb-2">Debug Information:</h3>
                <pre className="whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

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
          <div className="mt-4 flex justify-between">
            <Link href="/">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Home
              </a>
            </Link>
            
            <button 
              onClick={() => setShowDebug(!showDebug)} 
              className="mac-button inline-flex items-center"
            >
              <FaBug className="mr-2" /> {showDebug ? 'Hide Debug' : 'Show Debug'}
            </button>
          </div>
          
          {showDebug && debugInfo && (
            <div className="mt-4 p-3 bg-gray-100 text-xs font-mono">
              <h3 className="font-bold mb-2">Debug Information:</h3>
              <pre className="whitespace-pre-wrap">{debugInfo}</pre>
            </div>
          )}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <button
              type="submit"
              className="mac-button w-full py-2 text-center mb-4"
              disabled={isLoading}
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
                disabled={isLoading}
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