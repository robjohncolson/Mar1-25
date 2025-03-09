import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/utils/supabaseClient';
import PixelAvatar from '@/components/PixelAvatar';
import { FaUser, FaArrowLeft, FaSave, FaPalette } from 'react-icons/fa';
import Link from 'next/link';

// Available colors for the avatar editor
const COLORS = [
  '#e74c3c', // Red
  '#e67e22', // Orange
  '#f1c40f', // Yellow
  '#2ecc71', // Green
  '#1abc9c', // Teal
  '#3498db', // Blue
  '#9b59b6', // Purple
  '#34495e', // Dark Blue
  '#95a5a6', // Gray
  '#ecf0f1', // Light Gray
  '#ffffff', // White
  '#000000', // Black
];

export default function Profile() {
  const router = useRouter();
  const { user, profile, refreshProfile, isLoading } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [avatarData, setAvatarData] = useState<{
    resolution: number;
    colors: string[];
    last_edited: string | null;
  }>({
    resolution: 1,
    colors: ['#3498db'],
    last_edited: null,
  });
  const [selectedColor, setSelectedColor] = useState('#3498db');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // Load profile data
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      if (profile.avatar_data) {
        setAvatarData(profile.avatar_data);
      }
    }
  }, [profile]);

  // Calculate max resolution based on stars count
  const getMaxResolution = (starsCount: number) => {
    if (starsCount >= 256) return 16;
    if (starsCount >= 196) return 14;
    if (starsCount >= 144) return 12;
    if (starsCount >= 100) return 10;
    if (starsCount >= 64) return 8;
    if (starsCount >= 36) return 6;
    if (starsCount >= 25) return 5;
    if (starsCount >= 16) return 4;
    if (starsCount >= 9) return 3;
    if (starsCount >= 4) return 2;
    return 1;
  };

  // Handle resolution change
  const handleResolutionChange = (newResolution: number) => {
    if (!profile) return;
    
    const maxResolution = getMaxResolution(profile.stars_count);
    if (newResolution > maxResolution) return;
    
    // Create a new colors array with the appropriate size
    let newColors: string[];
    
    if (newResolution <= avatarData.resolution) {
      // Downsizing: take a subset of the current colors
      newColors = [];
      for (let y = 0; y < newResolution; y++) {
        for (let x = 0; x < newResolution; x++) {
          const index = y * avatarData.resolution + x;
          if (index < avatarData.colors.length) {
            newColors.push(avatarData.colors[index]);
          } else {
            newColors.push('#3498db');
          }
        }
      }
    } else {
      // Upsizing: expand the current colors and fill with the selected color
      newColors = Array(newResolution * newResolution).fill(selectedColor);
      
      // Copy existing colors to the center of the new grid
      const offset = Math.floor((newResolution - avatarData.resolution) / 2);
      for (let y = 0; y < avatarData.resolution; y++) {
        for (let x = 0; x < avatarData.resolution; x++) {
          const oldIndex = y * avatarData.resolution + x;
          const newIndex = (y + offset) * newResolution + (x + offset);
          if (oldIndex < avatarData.colors.length && newIndex < newColors.length) {
            newColors[newIndex] = avatarData.colors[oldIndex];
          }
        }
      }
    }
    
    setAvatarData({
      resolution: newResolution,
      colors: newColors,
      last_edited: new Date().toISOString(),
    });
  };

  // Handle pixel click in the editor
  const handlePixelClick = (index: number) => {
    const newColors = [...avatarData.colors];
    newColors[index] = selectedColor;
    
    setAvatarData({
      ...avatarData,
      colors: newColors,
      last_edited: new Date().toISOString(),
    });
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      const result = await updateUserProfile(user.id, {
        display_name: displayName,
        avatar_data: avatarData,
        updated_at: new Date().toISOString(),
      });
      
      if (result) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        refreshProfile();
      } else {
        setMessage({ type: 'error', text: 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'An error occurred while updating your profile' });
    } finally {
      setIsSaving(false);
    }
  };

  // If loading or not logged in, show loading state
  if (isLoading || !user || !profile) {
    return (
      <Layout title="AP Statistics Hub - Profile">
        <div className="max-w-4xl mx-auto">
          <div className="mac-window p-4 mb-6">
            <h1 className="text-3xl font-bold mb-0 flex items-center mac-header p-2">
              <FaUser className="mr-2 text-mac-white" /> 
              <span className="text-mac-white">Profile</span>
            </h1>
          </div>
          
          <div className="mac-window p-6">
            <p className="text-center">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const maxResolution = getMaxResolution(profile.stars_count);
  const nextResolution = avatarData.resolution < maxResolution ? avatarData.resolution + 1 : null;
  const nextResolutionStars = nextResolution === 2 ? 4 : 
                             nextResolution === 3 ? 9 :
                             nextResolution === 4 ? 16 :
                             nextResolution === 5 ? 25 :
                             nextResolution === 6 ? 36 :
                             nextResolution === 8 ? 64 :
                             nextResolution === 10 ? 100 :
                             nextResolution === 12 ? 144 :
                             nextResolution === 14 ? 196 :
                             nextResolution === 16 ? 256 : null;

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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={user.email || ''}
                disabled
                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Progress
              </label>
              <div className="p-3 bg-gray-100 rounded">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Stars Collected</span>
                  <span className="text-sm font-medium">{profile.stars_count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (profile.stars_count / 256) * 100)}%` }}
                  ></div>
                </div>
                {nextResolution && nextResolutionStars && (
                  <p className="text-xs text-gray-500 mt-2">
                    Collect {nextResolutionStars - profile.stars_count} more stars to unlock {nextResolution}x{nextResolution} avatar resolution!
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="mac-button w-full py-2 text-center flex items-center justify-center"
            >
              <FaSave className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
          
          {/* Avatar Editor */}
          <div className="mac-window p-6">
            <h2 className="text-xl font-bold mb-4 mac-header p-2 text-mac-white">Pixel Avatar</h2>
            
            <div className="flex flex-col items-center mb-6">
              <div className="mb-4 border-4 border-gray-200 p-2">
                <PixelAvatar avatarData={avatarData} size={200} />
              </div>
              
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16].map((res) => {
                    const isAvailable = res <= maxResolution;
                    return (
                      <button
                        key={res}
                        onClick={() => isAvailable && handleResolutionChange(res)}
                        disabled={!isAvailable}
                        className={`px-3 py-1 rounded text-sm ${
                          res === avatarData.resolution
                            ? 'bg-blue-500 text-white'
                            : isAvailable
                            ? 'bg-gray-200 hover:bg-gray-300'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {res}x{res}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <div className="w-full mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaPalette className="inline mr-1" /> Color Palette
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full ${
                        selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Pixel Editor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pixel Editor
              </label>
              <div 
                className="border-2 border-gray-300 p-1"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${avatarData.resolution}, 1fr)`,
                  gridTemplateRows: `repeat(${avatarData.resolution}, 1fr)`,
                  gap: '2px',
                  width: '100%',
                  aspectRatio: '1',
                }}
              >
                {avatarData.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handlePixelClick(index)}
                    className="w-full h-full hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: color }}
                    aria-label={`Edit pixel ${index}`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Click on a pixel to change its color
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 