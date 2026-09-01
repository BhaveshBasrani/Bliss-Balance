'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { getStoredSettings, DEFAULT_SITE_SETTINGS } from '@/lib/dataStore';
import { MediaSettings } from '@/lib/types';

export const ShopByGenderSections: React.FC = () => {
  const [media, setMedia] = useState<MediaSettings>(() => {
    return getStoredSettings()?.media || DEFAULT_SITE_SETTINGS.media || {};
  });

  useEffect(() => {
    const handleSettingsUpdate = () => {
      const s = getStoredSettings();
      if (s?.media) setMedia(s.media);
    };
    window.addEventListener('settings-updated', handleSettingsUpdate);
    return () => window.removeEventListener('settings-updated', handleSettingsUpdate);
  }, []);

  return (
    <div className="space-y-0">
      
      {/* ── 1. SHOP MEN SECTION ────────────────────────────────────────── */}
      <section className="py-14 sm:py-24 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">
          
          <ScrollReveal direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#E60000] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Men&apos;s Collection
                </span>
                <h2 className="font-heading text-2xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                  Shop Men
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-lg font-medium">
                  High-traction sneakers, pressure-relief slides, and doctor-approved ortho slippers built for daily movement.
                </p>
              </div>

              <Link
                href="/men"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black font-heading font-black text-xs uppercase tracking-widest hover:bg-[#E60000] hover:text-white transition-all duration-200 border-2 border-black dark:border-white self-start sm:self-auto"
              >
                <span>View All Men&apos;s</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* 3-Column Men Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            
            {/* Tile 1: Casual Sneakers */}
            <ScrollReveal direction="up" delay={0.05}>
              <Link
                href="/collections/casual-shoes"
                className="group relative block aspect-[4/5] bg-neutral-950 overflow-hidden"
              >
                <img
                  src={media.mensSneakersImage || '/collections/mens-casual-sneakers.jpg'}
                  alt="Men Casual Sneakers"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-80 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-3 text-white">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#E60000] tracking-widest block font-bold">Footwear Drop</span>
                    <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight group-hover:text-[#E60000] transition-colors">
                      Street Sneakers
                    </h3>
                  </div>
                  <div className="w-8 h-8 bg-white text-black group-hover:bg-[#E60000] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Tile 2: Slides & Sandals */}
            <ScrollReveal direction="up" delay={0.1}>
              <Link
                href="/collections/slides"
                className="group relative block aspect-[4/5] bg-neutral-950 overflow-hidden"
              >
                <img
                  src={media.mensSlidesImage || '/collections/mens-slides-sandals.jpg'}
                  alt="Men Slides and Sandals"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-80 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-3 text-white">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#E60000] tracking-widest block font-bold">Memory Foam</span>
                    <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight group-hover:text-[#E60000] transition-colors">
                      Slides & Sandals
                    </h3>
                  </div>
                  <div className="w-8 h-8 bg-white text-black group-hover:bg-[#E60000] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Tile 3: Ortho Slippers */}
            <ScrollReveal direction="up" delay={0.15}>
              <Link
                href="/collections/slippers"
                className="group relative block aspect-[4/5] bg-neutral-950 overflow-hidden"
              >
                <img
                  src={media.mensSlippersImage || '/collections/mens-slippers.jpg'}
                  alt="Men Ortho Slippers"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-80 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-3 text-white">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#E60000] tracking-widest block font-bold">Doctor Approved</span>
                    <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight group-hover:text-[#E60000] transition-colors">
                      Ortho Slippers
                    </h3>
                  </div>
                  <div className="w-8 h-8 bg-white text-black group-hover:bg-[#E60000] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

          </div>

        </div>
      </section>

      {/* ── 2. SHOP WOMEN SECTION ──────────────────────────────────────── */}
      <section className="py-14 sm:py-24 bg-[#FAFAF8] dark:bg-[#0E0E0E] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">
          
          <ScrollReveal direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#E60000] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Women&apos;s Collection
                </span>
                <h2 className="font-heading text-2xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                  Shop Women
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-lg font-medium">
                  Anatomical arch support sandals, waterproof clogs, and ultra-plush daily slippers with cloud cushioning.
                </p>
              </div>

              <Link
                href="/women"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black font-heading font-black text-xs uppercase tracking-widest hover:bg-[#E60000] hover:text-white transition-all duration-200 border-2 border-black dark:border-white self-start sm:self-auto"
              >
                <span>View All Women&apos;s</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* 3-Column Women Collection Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            
            {/* Tile 1: Sandals & Flats */}
            <ScrollReveal direction="up" delay={0.05}>
              <Link
                href="/collections/sandals"
                className="group relative block aspect-[4/5] bg-neutral-950 overflow-hidden"
              >
                <img
                  src={media.womensSandalsImage || '/collections/womens-sandals-flats.jpg'}
                  alt="Women Sandals and Flats"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-80 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-3 text-white">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#E60000] tracking-widest block font-bold">Ergonomic Arch</span>
                    <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight group-hover:text-[#E60000] transition-colors">
                      Sandals & Flats
                    </h3>
                  </div>
                  <div className="w-8 h-8 bg-white text-black group-hover:bg-[#E60000] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Tile 2: Clogs & Sneakers */}
            <ScrollReveal direction="up" delay={0.1}>
              <Link
                href="/collections/clogs"
                className="group relative block aspect-[4/5] bg-neutral-950 overflow-hidden"
              >
                <img
                  src={media.womensClogsImage || '/collections/womens-clogs-sneakers.jpg'}
                  alt="Women Clogs and Sneakers"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-80 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-3 text-white">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#E60000] tracking-widest block font-bold">Waterproof Foam</span>
                    <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight group-hover:text-[#E60000] transition-colors">
                      Clogs & Sneakers
                    </h3>
                  </div>
                  <div className="w-8 h-8 bg-white text-black group-hover:bg-[#E60000] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

            {/* Tile 3: Slippers & Slides */}
            <ScrollReveal direction="up" delay={0.15}>
              <Link
                href="/collections/slides"
                className="group relative block aspect-[4/5] bg-neutral-950 overflow-hidden"
              >
                <img
                  src={media.womensSlippersImage || '/collections/womens-slippers-slides.jpg'}
                  alt="Women Slippers and Slides"
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-80 group-hover:brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-3 text-white">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#E60000] tracking-widest block font-bold">Cloud Comfort</span>
                    <h3 className="font-heading text-lg sm:text-xl font-black uppercase tracking-tight group-hover:text-[#E60000] transition-colors">
                      Slippers & Slides
                    </h3>
                  </div>
                  <div className="w-8 h-8 bg-white text-black group-hover:bg-[#E60000] group-hover:text-white flex items-center justify-center transition-all shrink-0">
                    <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>

          </div>

        </div>
      </section>

    </div>
  );
};
