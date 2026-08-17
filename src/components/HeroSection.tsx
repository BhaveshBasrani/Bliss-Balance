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

  // Mobile Hero Image: Dedicated vertical mobile banner /hero-banner-mobile.png
  const mobileHeroBg = '/hero-banner-mobile.png';

  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[680px] flex items-center justify-start bg-neutral-950 text-white overflow-hidden py-10 sm:py-14 lg:py-16 transition-all">
      
      {/* Desktop Hero Image (Hidden on Mobile) */}
      <img
        src={desktopHeroBg}
        alt="Bliss Balance Streetwear Footwear Hero Desktop"
        className="hidden sm:block absolute inset-0 w-full h-full object-cover object-right lg:object-center transition-all duration-700 hover:scale-102"
      />

      {/* Mobile Hero Image (Vertical Mobile Banner - Visible on Mobile) */}
      <img
        src={mobileHeroBg}
        alt="Bliss Balance Streetwear Footwear Hero Mobile"
        className="sm:hidden absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
      />

      {/* Soft Vignette Overlay: Preserves 100% Studio Lighting while keeping Text Ultra Crisp */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-4 sm:space-y-6">
        
        {/* Category Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>EVERYDAY FOOTWEAR • MADE IN INDIA</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[0.98] max-w-2xl [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)]">
          BUILT FOR THE ONES <br />
          <span className="text-red-500 italic font-serif">BALANCING</span> LIFE.
        </h1>

        {/* Subtitle */}
        <p className="font-body text-neutral-200 text-xs sm:text-sm max-w-md leading-relaxed font-medium [text-shadow:_0_1px_5px_rgb(0_0_0_/_80%)]">
          {settings.heroSubheadline || 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 w-full sm:w-auto font-mono">
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
