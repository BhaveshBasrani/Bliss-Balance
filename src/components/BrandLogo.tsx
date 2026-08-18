'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-10 h-10 rounded-none border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]',
    md: 'w-12 h-12 rounded-none border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
    lg: 'w-16 h-16 rounded-none border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
    xl: 'w-28 h-28 rounded-none border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]',
  }[size];

  const imgDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-22 h-22',
  }[size];

  return (
    <div className={`relative bg-red-600 flex items-center justify-center overflow-hidden shrink-0 ${dimensions} ${className}`}>
      <img
        src="/Logo.svg"
        alt="Bliss Balance Emblem"
        className={`object-contain filter brightness-0 invert scale-110 ${imgDimensions}`}
      />
    </div>
  );
};
