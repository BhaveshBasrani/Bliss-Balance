'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-10 h-10 sm:w-11 sm:h-11',
    md: 'w-13 h-13 sm:w-15 sm:h-15',
    lg: 'w-18 h-18 sm:w-20 sm:h-20',
    xl: 'w-28 h-28 sm:w-32 sm:h-32',
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
