'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8 rounded-none border-2 border-black dark:border-white shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]',
    md: 'w-8 h-8 sm:w-10 sm:h-10 rounded-none border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]',
    lg: 'w-12 h-12 sm:w-14 sm:h-14 rounded-none border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 rounded-none border-3 border-black dark:border-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]',
  }[size];

  const imgDimensions = {
    sm: 'w-5 h-5 sm:w-6 sm:h-6',
    md: 'w-6 h-6 sm:w-7 sm:h-7',
    lg: 'w-8 h-8 sm:w-10 sm:h-10',
    xl: 'w-14 h-14 sm:w-18 sm:h-18',
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
