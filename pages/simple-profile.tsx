import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';
import PixelAvatar from '@/components/PixelAvatar';
import { FaUser, FaArrowLeft, FaSave, FaStar } from 'react-icons/fa';
import Link from 'next/link';

export default function SimpleProfile() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSimpleAuth();
  const [displayName, setDisplayName] = useState('');
  const [avatarData, setAvatarData] = useState({
    resolution: 1,
    colors: ['#808080'],
    last_edited: null as string | null
  });
  const [starCount, setStarCount] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after component mounts (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      router.push('/simple-login');
    }
  }, [isAuthenticated, isLoading, router, isMounted]);

  // Load data from localStorage
  useEffect(() => {
    if (isMounted && user) {
      // Load display name
      setDisplayName(user.name || user.username);
      
      // Load avatar data
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
  }, [user, isMounted]);

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

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      // Save display name to localStorage
      localStorage.setItem(`display_name_${user.id}`, displayName);
      
      // Save avatar data to localStorage
      localStorage.setItem(`avatar_data_${user.id}`, JSON.stringify(avatarData));
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
    } finally {
      setIsSaving(false);
    }
  };

  // Simulate earning a star
  const handleEarnStar = () => {
    if (!user) return;
    
    const newStarCount = starCount + 1;
    setStarCount(newStarCount);
    
    // Save to localStorage
    localStorage.setItem(`star_count_${user.id}`, newStarCount.toString());
    
    // Update avatar resolution based on star count
    let newResolution = 1;
    let newColors = [...avatarData.colors];
    
    if (newStarCount >= 9) {
      newResolution = 3;
      if (avatarData.resolution !== 3) {
        newColors = Array(9).fill('#808080');
      }
    } else if (newStarCount >= 4) {
      newResolution = 4;
      if (avatarData.resolution !== 4) {
        newColors = Array(16).fill('#808080');
      }
    }
    
    if (newResolution !== avatarData.resolution) {
      const newAvatarData = {
        ...avatarData,
        resolution: newResolution,
        colors: newColors,
        last_edited: new Date().toISOString()
      };
      
      setAvatarData(newAvatarData);
      
      // Save to localStorage
      localStorage.setItem(`avatar_data_${user.id}`, JSON.stringify(newAvatarData));
    }
    
    setMessage({ type: 'success', text: 'You earned a star!' });
  };

  // During SSR/SSG, return a simple placeholder
  if (!isMounted) {
    return (
      <Layout title="AP Statistics Hub - Profile">
        <div className="max-w-4xl mx-auto">
          <div className="mac-window p-4 mb-6">
            <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
              <FaUser className="mr-2 text-mac-white" /> 
              <span className="text-mac-white">Profile</span>
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
            <p className="text-center">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If loading or not logged in, show loading state
  if (isLoading || !isAuthenticated || !user) {
    return (
      <Layout title="AP Statistics Hub - Profile">
        <div className="max-w-4xl mx-auto">
          <div className="mac-window p-4 mb-6">
            <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
              <FaUser className="mr-2 text-mac-white" /> 
              <span className="text-mac-white">Profile</span>
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
            <p className="text-center">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="AP Statistics Hub - Profile">
      <div className="max-w-4xl mx-auto">
        <div className="mac-window p-4 mb-6">
          <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
            <FaUser className="mr-2 text-mac-white" /> 
            <span className="text-mac-white">Profile</span>
          </h1>
          <div className="mt-4">
            <Link href="/">
              <a className="mac-button inline-flex items-center">
                <FaArrowLeft className="mr-2" /> Back to Home
              </a>
            </Link>
          </div>
        </div>
        
        {message && (
          <div className={`mac-window p-3 mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Info */}
          <div className="mac-window p-6">
            <h2 className="text-xl font-bold mb-4 mac-header p-2 text-mac-white">Profile Information</h2>
            
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={user.username}
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your display name"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress
              </label>
              <div className="p-3 bg-gray-100 rounded">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Stars Collected</span>
                  <span className="text-sm font-medium">{starCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (starCount / 10) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="mac-button py-2 px-4 text-center flex items-center justify-center"
              >
                <FaSave className="mr-2" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
              
              <button
                onClick={handleEarnStar}
                className="mac-button py-2 px-4 text-center flex items-center justify-center"
              >
                <FaStar className="mr-2" />
                Earn a Star
              </button>
            </div>
          </div>
          
          {/* Avatar Editor */}
          <div className="mac-window p-6">
            <h2 className="text-xl font-bold mb-4 mac-header p-2 text-mac-white">Pixel Avatar</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="mb-4 border-4 border-gray-200 p-2">
                <PixelAvatar 
                  avatarData={avatarData} 
                  size={200} 
                  editable={starCount >= 1}
                  onColorChange={handleAvatarColorChange}
                />
              </div>
              
              <div className="w-full">
                <div className="bg-gray-100 p-3 rounded mb-4">
                  <h3 className="font-medium mb-2">Avatar Progress</h3>
                  <p className="text-sm mb-2">
                    Your avatar evolves as you earn gold stars by completing content:
                  </p>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    <li className={starCount >= 0 ? 'font-medium' : ''}>
                      0 stars: 1×1 pixel (gray, non-customizable)
                    </li>
                    <li className={starCount >= 1 ? 'font-medium' : ''}>
                      1 star: 1×1 pixel (customizable color)
                    </li>
                    <li className={starCount >= 4 ? 'font-medium' : ''}>
                      4 stars: 4×4 pixel grid (16 pixels, fully customizable)
                    </li>
                    <li className={starCount >= 9 ? 'font-medium' : ''}>
                      9 stars: 3×3 pixel grid (9 pixels, fully customizable)
                    </li>
                  </ul>
                </div>
                
                {starCount < 1 && (
                  <div className="bg-yellow-100 p-3 rounded text-sm">
                    <p>Complete content to earn stars and unlock avatar customization!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 