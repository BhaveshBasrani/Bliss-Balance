'use client';

import React from 'react';
import { BrandLogo } from './BrandLogo';

interface BrandLoadingScreenProps {
  message?: string;
}

export const BrandLoadingScreen: React.FC<BrandLoadingScreenProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-brand-warm dark:bg-black transition-opacity duration-500">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="animate-brand-pulse">
          <BrandLogo size="lg" />
        </div>
        <div className="w-8 h-[1px] bg-brand-red/40" />
        {message && (
          <p className="text-[10px] font-body tracking-[0.2em] uppercase text-brand-stone font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
