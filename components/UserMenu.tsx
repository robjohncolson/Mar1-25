import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaUserCircle, FaSignInAlt } from 'react-icons/fa';
import PixelAvatar from './PixelAvatar';

export default function UserMenu() {
  const { user, profile, signOut, isSupabaseAvailable } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    await signOut();
    setIsOpen(false);
  };

  // If Supabase is not available, render a simple sign-in button
  if (!isSupabaseAvailable) {
    return (
      <Link href="/login">
        <a className="flex items-center space-x-2 mac-button py-1 px-3 bg-gray-200 text-gray-800">
          <span className="hidden md:inline-block">Sign In</span>
          <FaSignInAlt className="w-5 h-5" />
        </a>
      </Link>
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
        {user && profile ? (
          <>
            <span className="hidden md:inline-block mr-2">{profile.display_name || user.email}</span>
            <div className="w-8 h-8 rounded-full overflow-hidden">
              {profile.avatar_data ? (
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
          {user ? (
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
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Sign out
              </button>
            </>
          ) : (
            <Link href="/login">
              <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center">
                <FaSignInAlt className="mr-2" /> Sign in
              </a>
            </Link>
          )}
        </div>
      )}
    </div>
  );
} 