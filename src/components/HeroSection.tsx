'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[700px] max-h-[820px] flex items-center justify-start bg-neutral-950 text-white overflow-hidden py-12 lg:py-16">
      
      {/* Hero Banner Background Image */}
      {settings.heroImageUrl && settings.heroImageUrl.trim() !== '' ? (
        <img
          src={settings.heroImageUrl}
          alt="Bliss Balance Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black" />
      )}

      {/* Dark Overlay for Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 pointer-events-none" />

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        
        {/* Category Subtitle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold tracking-widest uppercase">
          <span>EVERYDAY FOOTWEAR • MADE IN INDIA</span>
        </div>

        {/* Editorial Headline */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[0.95] max-w-4xl drop-shadow-lg">
          BUILT FOR THE ONES <br />
          <span className="text-red-500 italic font-serif">BALANCING</span> LIFE.
        </h1>

        {/* Subtitle */}
        <p className="font-body text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed">
          {settings.heroSubheadline || 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href="/men"
            className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-heading font-extrabold text-xs uppercase tracking-widest shadow-lg transition-all duration-300"
          >
            <span>SHOP MEN</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/women"
            className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white hover:text-black text-white font-heading font-extrabold text-xs uppercase tracking-widest transition-all duration-300"
          >
            <span>SHOP WOMEN</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

      </div>

    </section>
  );
};
