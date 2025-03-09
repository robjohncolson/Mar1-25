import React from 'react';

type PixelAvatarProps = {
  avatarData: {
    resolution: number;
    colors: string[];
    last_edited?: string | null;
  };
  size?: number;
  className?: string;
};

export default function PixelAvatar({ avatarData, size = 64, className = '' }: PixelAvatarProps) {
  const { resolution, colors } = avatarData;
  
  // Default to a single blue pixel if no valid data
  const pixelSize = size / (resolution || 1);
  const pixelColors = colors && colors.length === resolution * resolution 
    ? colors 
    : Array(resolution * resolution).fill('#3498db');
  
  return (
    <div 
      className={`pixel-avatar ${className}`}
      style={{ 
        width: size, 
        height: size, 
        display: 'grid',
        gridTemplateColumns: `repeat(${resolution}, 1fr)`,
        gridTemplateRows: `repeat(${resolution}, 1fr)`,
        backgroundColor: '#f0f0f0',
      }}
    >
      {pixelColors.map((color, index) => (
        <div
          key={index}
          style={{
            backgroundColor: color,
            width: '100%',
            height: '100%',
          }}
        />
      ))}
    </div>
  );
} 