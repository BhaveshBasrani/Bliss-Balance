'use client';

import React from 'react';
import { Footprints } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      
      {/* Background Subtle Red Graphic Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Emblem Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 text-xs font-mono font-bold tracking-widest uppercase shadow-xs">
          <Footprints className="w-4 h-4 text-red-600" />
          <span>OUR FOOTWEAR PHILOSOPHY</span>
        </div>

        {/* Impact Quote */}
        <blockquote className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight max-w-4xl mx-auto text-neutral-950 dark:text-white">
          "WE BELIEVE FOOTWEAR IS MORE THAN SOMETHING YOU WEAR — IT IS SOMETHING YOU <span className="text-red-600">EXPERIENCE WITH EVERY STEP.</span>"
        </blockquote>

        {/* Paragraph */}
        <p className="font-body text-neutral-600 dark:text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          At Bliss Balance, our goal is to create footwear that brings together comfort, confidence and contemporary style, helping you move through everyday life with ease — from relaxed days at home to work, travel, shopping and casual outings.
        </p>

        {/* Sign-off Tagline */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 max-w-xs mx-auto">
          <span className="block font-heading text-2xl font-black text-neutral-950 dark:text-white tracking-widest uppercase">
            BLISS BALANCE
          </span>
          <span className="block font-mono text-xs text-red-600 font-bold uppercase tracking-widest mt-0.5">
            Walk in Bliss. Live in Balance.
          </span>
        </div>

      </div>
    </section>
  );
};
