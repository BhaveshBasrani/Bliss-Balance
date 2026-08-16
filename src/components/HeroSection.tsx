'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Feather, ShieldCheck, HeartPulse } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white pt-8 pb-16 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      
      {/* Background Red Graphic Backdrop (Comet / Image 2 style) */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-red-600/10 dark:bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Main Content Block */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Bold Headline */}
            <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] uppercase text-neutral-950 dark:text-white">
              <span className="block">WALK IN</span>
              <span className="block text-red-600">BLISS.</span>
              <span className="block">LIVE IN</span>
              <span className="block text-neutral-800 dark:text-neutral-200">BALANCE.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl font-body text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
              {settings.heroSubheadline || 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/men"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-extrabold text-xs uppercase tracking-widest shadow-md transition-all duration-300"
              >
                <span>SHOP MEN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/women"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-neutral-900 dark:bg-neutral-900 text-white font-mono font-extrabold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300"
              >
                <span>SHOP WOMEN</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-red-500" />
              </Link>
            </div>

            {/* Core Differentiators List */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-4 font-mono">
              <div>
                <span className="block font-heading text-xl font-bold text-neutral-900 dark:text-white">COMFORT</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase">Soft Cushioning</span>
              </div>
              <div>
                <span className="block font-heading text-xl font-bold text-neutral-900 dark:text-white">FEATHER</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase">Lightweight Feel</span>
              </div>
              <div>
                <span className="block font-heading text-xl font-bold text-neutral-900 dark:text-white">GRIP</span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase">Anti-Skid Outsoles</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Banner (Image 2 style) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="relative rounded-2xl overflow-hidden p-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl">
              {/* Exact Spec Image Placeholder Container */}
              <ImagePlaceholder
                dimensions={settings.heroImageDimensions || "1200 x 600 px (2:1 Banner)"}
                aspectRatio="aspect-[16/10]"
                label="HERO BANNER MAIN PHOTO"
                imageUrl={settings.heroImageUrl}
              />
            </div>

            {/* 3 Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-900 dark:text-white">COMFORT FIRST</span>
                  <HeartPulse className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 leading-tight">
                  Soft cushioning. All-day comfort.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-900 dark:text-white">LIGHTWEIGHT</span>
                  <Feather className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 leading-tight">
                  Easy steps. All day long.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-900 dark:text-white">RELIABLE GRIP</span>
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 leading-tight">
                  Textured anti-skid outsoles.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
