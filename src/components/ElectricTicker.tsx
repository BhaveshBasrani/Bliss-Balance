'use client';

import React from 'react';
import { Sparkles, Zap, Flame, Shield, Star, Asterisk } from 'lucide-react';

export const ElectricTicker: React.FC = () => {
  const tickerItems = [
    'FEEL THE BLISS',
    'BALANCING LIFE',
    'ZERO COMPROMISE',
    'BUILT FOR INDIAN STREETS',
    'ORTHOPEDIC ARCH ALIGNMENT',
    'ALL-DAY MEMORY FOAM',
    'HIGH-TRACTION ANTI-SKID',
    'EASY 7-DAY REPLACEMENTS',
  ];

  return (
    <section className="w-full bg-[#E5FF00] text-black border-y-2 border-black py-4 overflow-hidden select-none relative z-20">
      <div className="flex w-max animate-marquee font-heading font-black text-sm sm:text-base tracking-wider uppercase items-center">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 shrink-0">
            <span>{item}</span>
            <span className="w-2.5 h-2.5 bg-black rotate-45 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
};
