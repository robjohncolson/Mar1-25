import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
    
    const { error } = await signIn(email);
    
    if (error) {
      console.error('Error signing in:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to sign in' });
    } else {
      setMessage({ 
        type: 'success', 
        text: 'Check your email for a magic link to sign in!' 
      });
      setEmail('');
    }
  };

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
          <h2 className="text-xl font-bold mb-4">Sign in with Magic Link</h2>
          
          <p className="mb-6 text-gray-600">
            Enter your email address below and we'll send you a magic link to sign in instantly - no password needed!
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
            
            <button
              type="submit"
              className="mac-button w-full py-2 text-center"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 