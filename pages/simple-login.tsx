import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { FaUser, FaArrowLeft, FaSignInAlt } from 'react-icons/fa';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

export default function SimpleLogin() {
  const router = useRouter();
  const { login, isLoading: authLoading, isAuthenticated } = useSimpleAuth();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router, isMounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setMessage({ type: 'error', text: 'Please enter a username' });
      return;
    }
    
    // Username validation - only allow alphanumeric characters and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setMessage({ 
        type: 'error', 
        text: 'Username can only contain letters, numbers, and underscores' 
      });
      return;
    }
    
    setMessage(null);
    setIsLoading(true);
    setDebugInfo('Authenticating...');
    
    try {
      // Use the login function from our context
      const { error } = await login(username);
      
      if (error) {
        console.error('Login error:', error);
        setMessage({ type: 'error', text: error.message || 'Authentication failed' });
        setDebugInfo(`Login error: ${error.message || 'Unknown error'}`);
        setIsLoading(false);
        return;
      }
      
      // Authentication successful
      setMessage({ type: 'success', text: 'Authentication successful!' });
      setDebugInfo('Authentication successful!');
      
      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error: any) {
      console.error('Authentication error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'An unexpected error occurred' 
      });
      setDebugInfo(`Unexpected error: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestUser = async () => {
    // Generate a test username
    const testUsername = `test_${Date.now()}`;
    setUsername(testUsername);
    
    // Submit the form
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent);
  };

  // Don't render anything during SSR
  if (!isMounted) {
    return (
      <Layout title="Simple Login - AP Statistics Hub">
        <div className="max-w-md mx-auto">
          <div className="mac-window p-6">
            <p className="text-center">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <Layout title="Simple Login - AP Statistics Hub">
        <div className="max-w-md mx-auto">
          <div className="mac-window p-6">
            <p className="text-center">Loading authentication...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Simple Login - AP Statistics Hub">
      <div className="max-w-md mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 className="text-2xl font-bold mb-0 flex items-center mac-header p-2">
            <span className="text-mac-white">Simple Username Login</span>
          </h1>
        </div>
        
        <div className="mac-window p-6">
          <p className="mb-6 text-gray-600">
            Enter a username to track your progress. If this is your first time, a new account will be created for you automatically.
          </p>
          
          {message && (
            <div className={`p-3 mb-4 rounded ${
              message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mac-input pl-10 w-full"
                  placeholder="Enter your username"
                  disabled={isLoading}
                  autoComplete="username"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Username can only contain letters, numbers, and underscores.
              </p>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <button
                type="submit"
                className="mac-button flex items-center justify-center w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <FaSignInAlt className="mr-2" />
                    Sign In / Create Account
                  </>
                )}
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
              
              <div className="flex space-x-2">
                <button
                  onClick={handleTestUser}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs"
                  disabled={isLoading}
                >
                  Create Test User
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      setMessage(null);
                      setDebugInfo('Checking constraint...');
                      const response = await fetch('/api/auth/check-constraint');
                      const data = await response.json();
                      setDebugInfo(JSON.stringify(data, null, 2));
                      
                      if (data.constraintExists) {
                        setMessage({
                          type: 'error',
                          text: 'Foreign key constraint exists. Please follow the instructions to remove it.'
                        });
                      } else {
                        setMessage({
                          type: 'success',
                          text: 'No foreign key constraint found. You can create users directly.'
                        });
                      }
                    } catch (error: any) {
                      console.error('Error checking constraint:', error);
                      setMessage({
                        type: 'error',
                        text: error.message || 'Failed to check constraint'
                      });
                      setDebugInfo(error.message || 'Failed to check constraint');
                    }
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs"
                  disabled={isLoading}
                >
                  Check Constraint
                </button>
              </div>
            </div>
            
            {debugInfo && (
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