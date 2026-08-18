'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-8 h-8 sm:w-9 sm:h-9',
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  }[size];

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${dimensions} ${className}`}>
      <img
        src="/Logo.svg"
        alt="Bliss Balance Emblem"
        className="w-full h-full object-contain filter brightness-0 dark:invert transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-115 group-hover:-rotate-3"
      />
    </div>
  );
};
