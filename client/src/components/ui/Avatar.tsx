import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const isDefaultOrEmpty = !src || src.includes('sample.jpg');
  const firstLetter = name ? name.charAt(0).toUpperCase() : '?';

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-24 h-24 text-3xl md:w-32 md:h-32 md:text-5xl',
  };

  if (!isDefaultOrEmpty) {
    return (
      <img 
        src={src} 
        alt={name || 'Avatar'} 
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`} 
      />
    );
  }

  return (
    <div className={`rounded-full flex items-center justify-center font-bold bg-orange-500 text-white shadow-sm ${sizeClasses[size]} ${className}`}>
      {firstLetter}
    </div>
  );
};
