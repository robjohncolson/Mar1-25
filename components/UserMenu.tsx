import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaUserCircle, FaSignInAlt, FaSync } from 'react-icons/fa';
import PixelAvatar from './PixelAvatar';
import { supabase } from '@/utils/supabaseClient';

export default function UserMenu() {
  const router = useRouter();
  const { user, profile, session, signOut } = useAuth();
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

  // Close menu when clicking outside
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
    router.push('/');
  };

  const handleSignIn = () => {
    setIsOpen(false);
    router.push('/login');
  };

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
      } else {
        console.log('Session refreshed successfully');
      }
    } catch (error) {
      console.error('Unexpected error refreshing session:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Don't render anything during SSR
  if (!isMounted) {
    return null;
  }

  // If user is not logged in, show sign in button
  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        className="flex items-center text-sm px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <FaSignInAlt className="mr-2" />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {profile ? (
          <PixelAvatar
            avatarData={{
              resolution: profile.avatar_data?.resolution || 2,
              colors: profile.avatar_data?.colors || ['#3498db']
            }}
            size={32}
            className="rounded-full"
          />
        ) : (
          <FaUserCircle size={24} className="text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-sm text-gray-700 dark:text-gray-200">
              {profile?.display_name || user.email?.split('@')[0] || 'User'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </div>
          </div>

          <Link href="/profile">
            <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaUser className="inline mr-2" /> Profile
            </a>
          </Link>

          <button
            onClick={handleRefreshSession}
            disabled={isRefreshing}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <FaSync className={`inline mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> 
            {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
          </button>

          <button
            onClick={handleSignOut}
            className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaSignOutAlt className="inline mr-2" /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
} 