'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  // Desktop Hero Image: Uses custom admin URL if valid http link, else /hero-banner.png
  const desktopHeroBg = (settings.heroImageUrl && settings.heroImageUrl.startsWith('http'))
    ? settings.heroImageUrl
    : '/hero-banner.png';

  // Mobile Hero Image: Dedicated mobile banner asset /hero-banner-mobile.png
  const mobileHeroBg = '/hero-banner-mobile.png';

  return (
    <section className="relative w-full min-h-[520px] sm:min-h-[620px] lg:min-h-[700px] flex flex-col justify-between sm:justify-center bg-neutral-950 text-white overflow-hidden py-6 sm:py-16 transition-all">
      
      {/* Desktop Hero Image (Hidden on Mobile) */}
      <img
        src={desktopHeroBg}
        alt="Bliss Balance Footwear Hero Desktop"
        className="hidden sm:block absolute inset-0 w-full h-full object-cover object-right lg:object-center transition-all duration-700 hover:scale-102"
      />

      {/* Mobile Hero Image (Visible on Mobile) */}
      <img
        src={mobileHeroBg}
        alt="Bliss Balance Footwear Hero Mobile"
        className="sm:hidden absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
      />

      {/* Sleek Minimalist Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none sm:hidden" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent pointer-events-none hidden sm:block" />

      {/* Hero Content Container (Top Text & Bottom Buttons) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-between sm:block h-full flex-1 sm:flex-none">
        
        {/* Top Text Block: Sits in the top black empty space on Mobile */}
        <div className="space-y-2.5 sm:space-y-6 pt-2 sm:pt-0">
          
          {/* Category Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-xs font-mono font-bold tracking-widest uppercase shadow-md">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
            <span>EVERYDAY FOOTWEAR • MADE IN INDIA</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="font-heading text-2xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.0] sm:leading-[0.98] max-w-2xl [text-shadow:_0_2px_12px_rgb(0_0_0_/_90%)]">
            BUILT FOR THE ONES <br />
            <span className="text-red-500 italic font-serif">BALANCING</span> LIFE.
          </h1>

          {/* Subtitle */}
          <p className="font-body text-neutral-300 text-xs sm:text-sm max-w-md leading-relaxed font-normal [text-shadow:_0_1px_8px_rgb(0_0_0_/_90%)]">
            {settings.heroSubheadline || 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.'}
          </p>

        </div>

        {/* Bottom Action Buttons Block: Leaves shoes completely open in the middle! */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 pt-6 sm:pt-6 font-mono">
          <Link
            href="/men"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-[#E50914] hover:bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>SHOP MEN</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/women"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/30 hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span>SHOP WOMEN</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>

    </section>
  );
};
