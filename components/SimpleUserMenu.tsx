import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { FaUser, FaSignOutAlt, FaUserCircle, FaSignInAlt } from 'react-icons/fa';

export default function SimpleUserMenu() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useSimpleAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const handleSignOut = () => {
    setIsOpen(false);
    logout();
    router.push('/simple-login');
  };

  const handleSignIn = () => {
    setIsOpen(false);
    router.push('/simple-login');
  };

  // If user is not logged in, show sign in button
  if (!isAuthenticated || !user) {
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
        <div className="flex items-center">
          <FaUserCircle size={24} className="text-gray-600 dark:text-gray-300 mr-2" />
          <span className="text-sm font-medium">{user.username}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-sm text-gray-700 dark:text-gray-200">
              {user.name || user.username}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user.username}
            </div>
          </div>

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