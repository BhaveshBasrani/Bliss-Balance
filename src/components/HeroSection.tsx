'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Feather, ShieldCheck, HeartPulse, Sparkles } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
  onImageUploaded?: (base64Url: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onImageUploaded }) => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white pt-10 pb-20 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      
      {/* High-Impact Ambient Red Circle Backdrop Graphic */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[650px] bg-red-600/10 dark:bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Bold Typography & Action Call-to-Actions */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 text-xs font-mono font-bold tracking-widest uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>CRAFTED FOR EVERYDAY LIFE</span>
            </div>

            {/* Massive Bold Headline */}
            <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.92] uppercase text-neutral-950 dark:text-white">
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
                className="group relative inline-flex items-center justify-center gap-3 px-9 py-4.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono font-extrabold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>EXPLORE MEN'S COLLECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/women"
                className="group inline-flex items-center justify-center gap-3 px-9 py-4.5 rounded-2xl bg-neutral-950 dark:bg-neutral-900 text-white font-mono font-extrabold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300 shadow-md"
              >
                <span>EXPLORE WOMEN'S COLLECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-red-500" />
              </Link>
            </div>

            {/* Highlight Metric Badges */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-3 gap-6 font-mono">
              <div>
                <span className="block font-heading text-2xl font-black text-neutral-950 dark:text-white">COMFORT</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Soft Cushioning</span>
              </div>
              <div>
                <span className="block font-heading text-2xl font-black text-neutral-950 dark:text-white">FEATHER</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Lightweight Feel</span>
              </div>
              <div>
                <span className="block font-heading text-2xl font-black text-neutral-950 dark:text-white">GRIP</span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase font-semibold">Anti-Skid Stability</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Container & Floating Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Hero Main Photo Container */}
            <div className="relative rounded-3xl overflow-hidden p-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
              <ImagePlaceholder
                dimensions={settings.heroImageDimensions || "1200 x 600 px (2:1 Banner)"}
                aspectRatio="aspect-[16/10]"
                label="HERO LANDING PIC"
                imageUrl={settings.heroImageUrl}
                onImageUploaded={onImageUploaded}
              />
            </div>

            {/* 3 Key Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              
              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-950 dark:text-white">COMFORT FIRST</span>
                  <HeartPulse className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 leading-tight">
                  Soft cushioning. All-day comfort.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-950 dark:text-white">LIGHTWEIGHT</span>
                  <Feather className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 leading-tight">
                  Easy steps. All day long.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono font-bold uppercase text-neutral-950 dark:text-white">RELIABLE GRIP</span>
                  <ShieldCheck className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 leading-tight">
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
