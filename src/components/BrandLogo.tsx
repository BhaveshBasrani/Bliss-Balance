'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
    xl: 'w-24 h-24 rounded-3xl',
  }[size];

  const imgDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-22 h-22',
  }[size];

  return (
    <div className={`relative bg-[#E50914] flex items-center justify-center shadow-sm overflow-hidden shrink-0 ${dimensions} ${className}`}>
      <img
        src="/Logo.svg"
        alt="Bliss Balance Emblem"
        className={`object-contain filter brightness-0 invert scale-110 ${imgDimensions}`}
      />
    </div>
  );
};
