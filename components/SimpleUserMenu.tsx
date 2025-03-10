import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import { FaUser, FaSignOutAlt, FaUserCircle, FaSignInAlt, FaStar } from 'react-icons/fa';
import PixelAvatar from './PixelAvatar';

export default function SimpleUserMenu() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useSimpleAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [avatarData, setAvatarData] = useState({
    resolution: 1,
    colors: ['#808080'],
    last_edited: null as string | null
  });
  const [starCount, setStarCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load avatar data from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      try {
        const storedAvatarData = localStorage.getItem(`avatar_data_${user.id}`);
        if (storedAvatarData) {
          setAvatarData(JSON.parse(storedAvatarData));
        }
        
        const storedStarCount = localStorage.getItem(`star_count_${user.id}`);
        if (storedStarCount) {
          setStarCount(parseInt(storedStarCount, 10));
        }
      } catch (error) {
        console.error('Error loading avatar data:', error);
      }
    }
  }, [isAuthenticated, user]);

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

  // Handle avatar color change
  const handleAvatarColorChange = (index: number, color: string) => {
    if (!user) return;
    
    const newColors = [...avatarData.colors];
    newColors[index] = color;
    
    const newAvatarData = {
      ...avatarData,
      colors: newColors,
      last_edited: new Date().toISOString()
    };
    
    setAvatarData(newAvatarData);
    
    // Save to localStorage
    localStorage.setItem(`avatar_data_${user.id}`, JSON.stringify(newAvatarData));
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
        className="flex items-center text-sm focus:outline-none"
        aria-haspopup="true"
      >
        <PixelAvatar
          avatarData={avatarData}
          size={32}
          className="rounded-full"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-sm text-gray-700 dark:text-gray-200">
              {user.name || user.username}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              @{user.username}
            </div>
            <div className="text-xs text-yellow-500 mt-1 flex items-center">
              <FaStar className="mr-1" /> {starCount} star{starCount !== 1 ? 's' : ''}
            </div>
          </div>

          <Link href="/simple-profile">
            <a className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <FaUser className="inline mr-2" /> Profile
            </a>
          </Link>

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