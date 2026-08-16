'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
  }[size];

  const imgDimensions = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  }[size];

  return (
    <div className={`relative bg-[#E50914] flex items-center justify-center shadow-md overflow-hidden ${dimensions} ${className}`}>
      <img
        src="/Logo.svg"
        alt="Bliss Balance Logo"
        className={`object-contain filter brightness-0 invert ${imgDimensions}`}
      />
    </div>
  );
};
