'use client';

import React from 'react';

interface BrandTitleTextProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const BrandTitleText: React.FC<BrandTitleTextProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const textSizes = {
    sm: 'text-xs sm:text-lg font-black',
    md: 'text-sm sm:text-2xl font-black',
    lg: 'text-xl sm:text-4xl font-black',
    xl: 'text-3xl sm:text-6xl font-black',
  }[size];

  return (
    <div className={`flex flex-col select-none items-start justify-center leading-none ${className}`}>
      {/* High-Legibility Clean BLISS BALANCE Title */}
      <div className={`font-heading uppercase flex items-center whitespace-nowrap tracking-tight ${textSizes}`}>
        <span className="text-neutral-950 dark:text-white mr-1 sm:mr-1.5 font-black">BLISS</span>
        <span className="text-red-600 tracking-tight font-black">BALANCE</span>
      </div>

      {showSubtitle && (
        <span className="hidden sm:block text-[9px] sm:text-[10px] font-mono font-black tracking-[0.3em] text-neutral-500 uppercase mt-1">
          FEEL THE BLISS
        </span>
      )}
    </div>
  );
};
