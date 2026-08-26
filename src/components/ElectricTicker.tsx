'use client';

import React from 'react';
import { Zap, Sparkles } from 'lucide-react';

const TICKER_ITEMS = [
  'FEATHERLIGHT CUSHIONING',
  'DOCTOR APPROVED FOAM',
  '100% HAND CRAFTED IN INDIA',
  'ARCH SUPPORT CONTOURING',
  'STREETWEAR SILHOUETTES',
  'FAST ALL-INDIA SHIPPING',
  '7-DAY EFFORTLESS RETURNS',
  'DESIGNED FOR INDIAN ROADS',
];

export const ElectricTicker: React.FC = () => {
  return (
    <section className="w-full bg-[#E60000] text-white border-y-2 border-black py-3.5 sm:py-4 overflow-hidden select-none relative z-20">
      <div className="flex w-max animate-marquee">
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 sm:gap-8 mx-4 sm:mx-6 shrink-0">
            <span className="font-heading font-black text-xs sm:text-sm uppercase tracking-widest text-white">
              {item}
            </span>
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-current shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
};
