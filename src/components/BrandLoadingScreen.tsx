'use client';

import React from 'react';
import { BrandLogo } from './BrandLogo';

interface BrandLoadingScreenProps {
  message?: string;
}

export const BrandLoadingScreen: React.FC<BrandLoadingScreenProps> = ({
  message = 'FEEL THE BLISS',
}) => {
  return (
    <div className="fixed inset-0 z-[99999] bg-black text-white flex flex-col items-center justify-center p-6 font-mono select-none overflow-hidden animate-in fade-in duration-300">
      
      {/* Pure Black Stage with Flickering White Icon Emblem */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 text-center">
        
        {/* Center Flickering Pure White Logo */}
        <div className="relative p-2 flex items-center justify-center">
          <img
            src="/icon.svg"
            alt="Bliss Balance Emblem"
            className="w-24 h-24 sm:w-32 sm:h-32 object-contain filter brightness-0 invert animate-flicker"
          />
        </div>

        {/* Minimalist White Brand Name & Status */}
        <div className="space-y-2">
          <h1 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-[0.3em] text-white">
            BLISS BALANCE
          </h1>
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.3em] block animate-pulse">
            {message}
          </span>
        </div>

      </div>

    </div>
  );
};
