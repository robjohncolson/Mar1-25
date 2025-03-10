import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { setAvatarColors } from '@/utils/supabaseClient';

type PixelAvatarProps = {
  avatarData: {
    resolution: number;
    colors: string[];
    last_edited?: string | null;
  };
  size?: number;
  className?: string;
  editable?: boolean;
  onColorChange?: (index: number, color: string) => void;
};

export default function PixelAvatar({ 
  avatarData, 
  size = 64, 
  className = '',
  editable = false,
  onColorChange
}: PixelAvatarProps) {
  const { user, refreshProfile } = useAuth();
  const { resolution, colors } = avatarData;
  const [selectedColor, setSelectedColor] = useState('#808080');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Default to a single gray pixel if no valid data
  const pixelSize = size / (resolution || 1);
  const pixelColors = colors && colors.length === resolution * resolution 
    ? colors 
    : Array(resolution * resolution).fill('#808080');
  
  // Available colors for the color picker
  const availableColors = [
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

  // Handle pixel click in editable mode
  const handlePixelClick = async (index: number) => {
    if (!editable || isUpdating) return;
    
    // Create a new colors array with the selected color at the clicked index
    const newColors = [...pixelColors];
    newColors[index] = selectedColor;
    
    setIsUpdating(true);
    
    try {
      // If onColorChange is provided, use it (for SimpleAuth)
      if (onColorChange) {
        onColorChange(index, selectedColor);
        setIsUpdating(false);
        return;
      }
      
      // Otherwise use Supabase (for regular Auth)
      if (user) {
        await setAvatarColors(user.id, newColors);
        refreshProfile();
      }
    } catch (error) {
      console.error('Error updating avatar colors:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className={`pixel-avatar-container ${className}`}>
      <div 
        className={`pixel-avatar ${isUpdating ? 'opacity-50' : ''}`}
        style={{ 
          width: size, 
          height: size, 
          display: 'grid',
          gridTemplateColumns: `repeat(${resolution}, 1fr)`,
          gridTemplateRows: `repeat(${resolution}, 1fr)`,
          backgroundColor: '#f0f0f0',
          gap: '1px',
        }}
      >
        {pixelColors.map((color, index) => (
          <div
            key={index}
            onClick={() => handlePixelClick(index)}
            style={{
              backgroundColor: color,
              width: '100%',
              height: '100%',
              cursor: editable ? 'pointer' : 'default',
            }}
            className={editable ? 'hover:opacity-80 transition-opacity' : ''}
          />
        ))}
      </div>
      
      {editable && (
        <div className="color-picker mt-3">
          <div className="flex flex-wrap gap-1 justify-center">
            {availableColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-full ${
                  selectedColor === color ? 'ring-2 ring-blue-500 ring-offset-1' : ''
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          <p className="text-xs text-center mt-1">
            Selected: <span style={{ color: selectedColor }}>{selectedColor}</span>
          </p>
        </div>
      )}
    </div>
  );
} 