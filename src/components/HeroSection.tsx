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
    <section className="relative w-full bg-black text-white select-none border-b-2 border-neutral-900">
      
      {/* DESKTOP HERO LAYOUT (Hidden on Mobile) */}
      <div className="hidden sm:block relative w-full min-h-[640px] lg:min-h-[720px] flex items-center overflow-hidden py-16">
        <img
          src={desktopHeroBg}
          alt="Bliss Balance Footwear Hero Desktop"
          className="absolute inset-0 w-full h-full object-cover object-right lg:object-center transition-all duration-700 hover:scale-101"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent pointer-events-none w-full max-w-3xl" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-lg lg:max-w-xl space-y-5">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-xs border border-red-600/80 text-white text-xs font-mono font-black tracking-widest uppercase">
              <span>FEEL THE BLISS • MADE IN INDIA</span>
            </div>

            <h1 className="font-heading text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-[0.95] [text-shadow:_0_2px_12px_rgb(0_0_0_/_95%)]">
              BUILT FOR THE ONES <br />
              <span className="text-red-600 italic font-serif">BALANCING</span> LIFE.
            </h1>

            <p className="font-mono text-neutral-300 text-sm leading-relaxed font-bold max-w-md">
              {settings.heroSubheadline || 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.'}
            </p>

            <div className="flex flex-row gap-3.5 pt-4 font-mono">
              <Link
                href="/men"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-red-600 hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest border border-red-600 transition-all duration-200"
              >
                <span>SHOP MEN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/women"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-lg bg-black border border-white hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest transition-all duration-200"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="pt-4 flex items-center gap-4 text-[10px] font-mono font-black uppercase text-neutral-300 tracking-wider">
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-red-600" />
                <span>FREE EXPRESS SHIPPING</span>
              </div>
              <div className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                <span>7-DAY EASY RETURNS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE HERO LAYOUT */}
      <div className="sm:hidden flex flex-col w-full bg-black">
        
        {/* Top: Clean Unobstructed Mobile Shoe Image */}
        <div className="relative w-full h-[280px] overflow-hidden bg-neutral-900">
          <img
            src={mobileHeroBg}
            alt="Bliss Balance Footwear Hero Mobile"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </div>

        {/* Bottom: Text & Buttons */}
        <div className="p-6 space-y-4 font-mono bg-black relative z-10">
          
          <div className="inline-flex items-center px-3 py-1 rounded-none bg-black border border-red-600 text-white text-[9px] font-mono font-black tracking-widest uppercase">
            <span>EVERYDAY FOOTWEAR • MADE IN INDIA</span>
          </div>

          <h1 className="font-heading text-3xl font-black uppercase tracking-tighter text-white leading-tight">
            BUILT FOR THE ONES <br />
            <span className="text-red-600 italic font-serif">BALANCING</span> LIFE.
          </h1>

          <p className="font-mono text-neutral-300 text-xs leading-relaxed font-bold">
            {settings.heroSubheadline || 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.'}
          </p>

          <div className="flex flex-row gap-2.5 pt-2">
            <Link
              href="/men"
              className="group flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-none bg-red-600 text-white font-black text-xs uppercase tracking-widest border border-red-600"
            >
              <span>SHOP MEN</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/women"
              className="group flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-none bg-black border border-white text-white font-black text-xs uppercase tracking-widest"
            >
              <span>SHOP WOMEN</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="pt-2 flex items-center justify-between text-[9px] font-mono font-black uppercase text-neutral-400 tracking-wider border-t border-neutral-800 pt-3">
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-red-600" />
              <span>FREE EXPRESS SHIPPING</span>
            </div>
            <div className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-red-600" />
              <span>7-DAY EASY RETURNS</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
