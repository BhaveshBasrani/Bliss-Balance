'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const desktopHeroBg = (settings.heroImageUrl && settings.heroImageUrl.startsWith('http'))
    ? settings.heroImageUrl
    : '/hero-banner.png';

  const mobileHeroBg = '/hero-banner-mobile.png';

  return (
    <section className="relative w-full min-h-[520px] sm:min-h-[620px] lg:min-h-[680px] flex flex-col justify-between sm:justify-center bg-black text-white overflow-hidden py-8 sm:py-16 border-b-2 border-neutral-900 select-none">
      
      {/* Desktop Hero Image (Hidden on Mobile) */}
      <img
        src={desktopHeroBg}
        alt="Bliss Balance Footwear Hero Desktop"
        className="hidden sm:block absolute inset-0 w-full h-full object-cover object-right lg:object-center transition-all duration-700 hover:scale-101"
      />

      {/* Mobile Hero Image (Visible on Mobile) */}
      <img
        src={mobileHeroBg}
        alt="Bliss Balance Footwear Hero Mobile"
        className="sm:hidden absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
      />

      {/* Sleek Gradient Overlay to ensure crisp contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-black/95 pointer-events-none sm:hidden" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent pointer-events-none hidden sm:block w-full max-w-3xl" />

      {/* Hero Content Container - Constrained to Left Column */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between sm:block h-full flex-1 sm:flex-none">
        
        <div className="max-w-lg lg:max-w-xl space-y-4 sm:space-y-5 pt-2 sm:pt-0">
          
          {/* Category Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-none bg-black/90 border-2 border-red-600 text-white text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>EVERYDAY FOOTWEAR • MADE IN INDIA</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-[0.95] [text-shadow:_0_2px_12px_rgb(0_0_0_/_95%)]">
            BUILT FOR THE ONES <br />
            <span className="text-red-600 italic font-serif">BALANCING</span> LIFE.
          </h1>

          {/* Subtitle */}
          <p className="font-mono text-neutral-300 text-xs sm:text-sm leading-relaxed font-bold max-w-md [text-shadow:_0_1px_8px_rgb(0_0_0_/_95%)]">
            {settings.heroSubheadline || 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.'}
          </p>

          {/* Action Buttons Block */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 font-mono">
            <Link
              href="/men"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-none bg-red-600 hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest border-2 border-red-600 transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <span>SHOP MEN</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/women"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-none bg-black/90 border-2 border-white hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            >
              <span>SHOP WOMEN</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

        </div>

      </div>

    </section>
  );
};
