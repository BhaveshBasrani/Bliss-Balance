'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, RotateCcw } from 'lucide-react';
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
    <section className="relative w-full min-h-[480px] sm:min-h-[640px] lg:min-h-[720px] flex flex-col justify-end sm:justify-center bg-black text-white overflow-hidden py-6 sm:py-16 border-b-2 border-neutral-900 select-none">
      
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

      {/* High-Legibility Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40 pointer-events-none sm:hidden" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent pointer-events-none hidden sm:block w-full max-w-3xl" />

      {/* Hero Main Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-end sm:flex-row items-start sm:items-center h-full">
        
        {/* Left Column: Editorial Copy & CTAs */}
        <div className="max-w-lg lg:max-w-xl space-y-3.5 sm:space-y-5">
          
          {/* Category Badge */}
          <div className="inline-flex items-center px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-none bg-black border-2 border-red-600 text-white text-[9px] sm:text-xs font-mono font-black tracking-widest uppercase shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
            <span>EVERYDAY FOOTWEAR • MADE IN INDIA</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-heading text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-tight sm:leading-[0.95] [text-shadow:_0_2px_12px_rgb(0_0_0_/_95%)]">
            BUILT FOR THE ONES <br />
            <span className="text-red-600 italic font-serif">BALANCING</span> LIFE.
          </h1>

          {/* Subtitle */}
          <p className="font-mono text-neutral-300 text-[11px] sm:text-sm leading-relaxed font-bold max-w-md [text-shadow:_0_1px_8px_rgb(0_0_0_/_95%)]">
            {settings.heroSubheadline || 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.'}
          </p>

          {/* Action Buttons Block - Side by Side on Mobile */}
          <div className="flex flex-row gap-2.5 sm:gap-3.5 pt-2 sm:pt-4 font-mono">
            <Link
              href="/men"
              className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-none bg-red-600 hover:bg-white hover:text-black text-white font-black text-[11px] sm:text-xs uppercase tracking-widest border-2 border-red-600 transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <span>SHOP MEN</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/women"
              className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 rounded-none bg-black border-2 border-white hover:bg-white hover:text-black text-white font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-200 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
            >
              <span>SHOP WOMEN</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Quick Assurance Tags Bar */}
          <div className="pt-2 sm:pt-4 flex items-center gap-3 sm:gap-4 text-[9px] sm:text-[10px] font-mono font-black uppercase text-neutral-300 tracking-wider">
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600" />
              <span>FREE EXPRESS SHIPPING</span>
            </div>
            <div className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600" />
              <span>7-DAY EASY RETURNS</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
