import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaUserCircle, FaSignInAlt, FaSync } from 'react-icons/fa';
import PixelAvatar from './PixelAvatar';
import { supabase } from '@/utils/supabaseClient';

export default function UserMenu() {
  const router = useRouter();
  const { user, profile, session, signOut, isSupabaseAvailable } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Log auth state for debugging
  useEffect(() => {
    if (isMounted) {
      console.log('UserMenu auth state:', { 
        hasUser: !!user, 
        hasProfile: !!profile,
        hasSession: !!session,
        userEmail: user?.email,
        profileName: profile?.display_name
      });
    }
  }, [user, profile, session, isMounted]);

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    // Force reload to ensure clean state
    window.location.href = '/';
  };
  
  const handleSignIn = () => {
    setIsOpen(false);
    router.push('/login');
  };
  
  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      // Check current session
      const { data: beforeData } = await supabase.auth.getSession();
      console.log('Session before refresh:', !!beforeData.session);
      
      // Try to refresh the session
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
      } else {
        console.log('Session refreshed:', !!data.session);
      }
      
      // Force reload to ensure UI is updated
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // During SSR/SSG, return a simple placeholder
  if (!isMounted) {
    return (
      <div className="flex items-center space-x-2 mac-button py-1 px-3 bg-gray-200 text-gray-800">
        <span className="hidden md:inline-block mr-2">Sign In</span>
        <FaSignInAlt className="w-5 h-5" />
      </div>
    );
  }

  // If Supabase is not available, render a simple sign-in button
  if (!isSupabaseAvailable) {
    return (
      <button 
        onClick={handleSignIn}
        className="flex items-center space-x-2 mac-button py-1 px-3 bg-gray-200 text-gray-800"
      >
        <span className="hidden md:inline-block mr-2">Sign In</span>
        <FaSignInAlt className="w-5 h-5" />
      </button>
    );
  }

  // If we're already on the login page, don't show the sign-in option
  const isLoginPage = router.pathname === '/login';
  
  // If not signed in and on login page, show a disabled button
  if (!session && isLoginPage) {
    return (
      <div className="flex items-center space-x-2 mac-button py-1 px-3 bg-gray-200 text-gray-800 opacity-50">
        <span className="hidden md:inline-block mr-2">Sign In</span>
        <FaSignInAlt className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 mac-button py-1 px-3 bg-gray-200 text-gray-800"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {session && user ? (
          <>
            <span className="hidden md:inline-block mr-2">{profile?.display_name || user.email}</span>
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {profile?.avatar_data ? (
                <PixelAvatar 
                  avatarData={profile.avatar_data} 
                  size={32} 
                />
              ) : (
                <FaUserCircle className="w-full h-full text-gray-600" />
              )}
            </div>
          </>
        ) : (
          <>
            <span className="hidden md:inline-block mr-2">Sign In</span>
            <FaSignInAlt className="w-5 h-5" />
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 mac-window p-2">
          {session && user ? (
            <>
              <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                <div className="font-bold">{profile?.display_name || 'User'}</div>
                <div className="text-xs truncate">{user.email}</div>
              </div>
              <Link href="/profile">
                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
                  <FaUser className="mr-2" /> Profile
                </a>
              </Link>
              <button
                onClick={handleRefreshSession}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
                disabled={isRefreshing}
              >
                <FaSync className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> 
                {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
              </button>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Sign out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignIn}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
            >
              <FaSignInAlt className="mr-2" /> Sign in
            </button>
          )}
        </div>
      )}
    </div>
  );
} 