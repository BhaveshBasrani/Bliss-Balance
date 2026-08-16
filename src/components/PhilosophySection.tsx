'use client';

import React from 'react';
import { Sparkles, Shield, Footprints } from 'lucide-react';

export const PhilosophySection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-black via-neutral-950 to-black dark:from-black dark:via-neutral-950 dark:to-black light:from-slate-900 light:via-slate-800 light:to-slate-900 text-white border-b border-neutral-800 dark:border-neutral-800 light:border-slate-800">
      {/* Background Graphic Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Emblem Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-mono font-bold tracking-widest uppercase shadow-lg">
          <Footprints className="w-4 h-4 text-red-500" />
          OUR FOOTWEAR PHILOSOPHY
        </div>

        {/* Big Impact Quote */}
        <blockquote className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight max-w-4xl mx-auto">
          "WE BELIEVE FOOTWEAR IS MORE THAN SOMETHING YOU WEAR — IT IS SOMETHING YOU <span className="text-red-500 drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]">EXPERIENCE WITH EVERY STEP.</span>"
        </blockquote>

        {/* Narrative Paragraph */}
        <p className="font-body text-neutral-300 dark:text-neutral-300 light:text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          At Bliss Balance, our goal is to create footwear that brings together comfort, confidence and contemporary style, helping you move through everyday life with ease — from relaxed days at home to work, travel, shopping and casual outings.
        </p>

        {/* Sign-off Tagline */}
        <div className="pt-6 border-t border-neutral-800/80 max-w-xs mx-auto">
          <span className="block font-heading text-2xl font-black text-white tracking-widest uppercase">
            BLISS BALANCE
          </span>
          <span className="block font-mono text-xs text-red-500 font-bold uppercase tracking-widest mt-0.5">
            Walk in Bliss. Live in Balance.
          </span>
        </div>

      </div>
    </section>
  );
};
