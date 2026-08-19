'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disableFlicker?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '', disableFlicker = true }) => {
  const dimensions = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-16 h-16 sm:w-24 sm:h-24',
    xl: 'w-28 h-28 sm:w-36 sm:h-36',
  }[size];

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${dimensions} ${className}`}>
      {/* Bliss Balance Official Icon SVG */}
      <img
        src="/icon.svg"
        alt="Bliss Balance Emblem"
        className={`w-full h-full object-contain filter brightness-0 dark:invert transition-all duration-300 ${
          disableFlicker ? '' : 'animate-flicker'
        }`}
      />
    </div>
  );
};
