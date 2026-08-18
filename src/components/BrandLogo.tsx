'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-9 h-9 sm:w-10 sm:h-10',
    md: 'w-11 h-11 sm:w-13 sm:h-13',
    lg: 'w-16 h-16 sm:w-18 sm:h-18',
    xl: 'w-26 h-26 sm:w-30 sm:h-30',
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
