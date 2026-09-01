'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { getStoredSettings, DEFAULT_SITE_SETTINGS } from '@/lib/dataStore';
import { MediaSettings } from '@/lib/types';

export const EditorialCategoryGrid: React.FC = () => {
  const [media, setMedia] = useState<MediaSettings>(() => {
    return getStoredSettings()?.media || DEFAULT_SITE_SETTINGS.media || {};
  });

  useEffect(() => {
    const handleUpdate = () => {
      const s = getStoredSettings();
      if (s?.media) setMedia(s.media);
    };
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);

  const categoryTiles = [
    {
      id: 'tile-sneakers',
      title: 'MEN SNEAKERS',
      subtitle: 'High-Traction Street Grip & Cushioned EVA Soles',
      image: media.mensSneakersImage || '/collections/mens-casual-sneakers.jpg',
      link: '/collections/casual-shoes',
    },
    {
      id: 'tile-slides',
      title: 'MEN SLIDES & SANDALS',
      subtitle: 'High-Density Memory Foam & Wave Contoured Footbed',
      image: media.mensSlidesImage || '/collections/mens-slides-sandals.jpg',
      link: '/collections/slides',
    },
    {
      id: 'tile-womens-sandals',
      title: 'WOMEN ERGONOMIC SANDALS',
      subtitle: 'Anatomical Arch Support & Cloud Pressure Relief',
      image: media.womensSandalsImage || '/collections/womens-sandals-flats.jpg',
      link: '/collections/sandals',
    },
    {
      id: 'tile-womens-clogs',
      title: 'WOMEN CLOGS & SNEAKERS',
      subtitle: 'Ultralight All-Weather Waterproof Cushion Foam',
      image: media.womensClogsImage || '/collections/womens-clogs-sneakers.jpg',
      link: '/collections/clogs',
    },
  ];

  return (
    <section className="py-14 sm:py-24 bg-[#0A0A0A] border-b border-neutral-800 relative select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#E60000] uppercase">
                Curated Silhouettes
              </span>
              <h2 className="font-heading text-2xl sm:text-5xl font-black uppercase tracking-tight text-white">
                Shop By Silhouette
              </h2>
            </div>
            <Link href="/collections" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors">
              Full Lineup <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* 2×2 Modular Joined Grid */}
        <div className="grid grid-cols-2 gap-px bg-neutral-800 border border-neutral-800 shadow-sm overflow-hidden">
          {categoryTiles.map((tile, index) => (
            <ScrollReveal key={tile.id} direction="up" delay={index * 0.07}>
              <Link
                href={tile.link}
                className="group relative block aspect-[4/3] sm:aspect-[16/10] bg-neutral-950 overflow-hidden"
              >
                {/* Image */}
                <img
                  src={tile.image}
                  alt={tile.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-75 group-hover:brightness-90"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Bottom Bar */}
                <div className="absolute inset-x-3 bottom-3 sm:inset-x-6 sm:bottom-6 z-10 flex items-end justify-between gap-2 text-white">
                  <div className="min-w-0 pr-1">
                    <h3 className="font-heading text-xs sm:text-2xl font-black uppercase tracking-tight leading-tight group-hover:text-[#E60000] transition-colors duration-300 truncate">
                      {tile.title}
                    </h3>
                    <p className="hidden sm:block text-xs text-neutral-400 font-medium mt-1 truncate">{tile.subtitle}</p>
                  </div>
                  <div className="w-6 h-6 sm:w-9 sm:h-9 bg-white/10 border border-white/20 group-hover:bg-[#E60000] group-hover:border-transparent flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-white group-hover:text-white stroke-[2.5]" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
