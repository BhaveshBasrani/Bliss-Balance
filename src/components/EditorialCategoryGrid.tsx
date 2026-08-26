'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface CategoryTile {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const CATEGORY_TILES: CategoryTile[] = [
  { id: 'tile-sneakers', title: 'STREET SNEAKERS', subtitle: 'High-Traction Grip & Breathable Uppers', image: '/editorial/cat-sneakers.jpg', link: '/collections/sneakers' },
  { id: 'tile-slides', title: 'LUXURY SLIDES', subtitle: 'High-Density Memory Foam Cushioning', image: '/editorial/cat-slides.jpg', link: '/collections/slides' },
  { id: 'tile-sandals', title: 'ORTHO SANDALS', subtitle: 'Anatomical Arch Support & Posture Alignment', image: '/editorial/cat-sandals.jpg', link: '/collections/sandals' },
  { id: 'tile-clogs', title: 'WATERPROOF CLOGS', subtitle: 'Ultralight Ergonomic All-Weather Foam', image: '/editorial/cat-clogs.jpg', link: '/collections/clogs' },
];

export const EditorialCategoryGrid: React.FC = () => {
  return (
    <section className="py-14 sm:py-24 bg-[#0A0A0A] border-b border-neutral-800 relative select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-neutral-500 uppercase">
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
          {CATEGORY_TILES.map((tile, index) => (
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
                    <h3 className="font-heading text-xs sm:text-2xl font-black uppercase tracking-tight leading-tight group-hover:text-[#E5FF00] transition-colors duration-300 truncate">
                      {tile.title}
                    </h3>
                    <p className="hidden sm:block text-xs text-neutral-400 font-medium mt-1 truncate">{tile.subtitle}</p>
                  </div>
                  <div className="w-6 h-6 sm:w-9 sm:h-9 bg-white/10 border border-white/20 group-hover:bg-[#E5FF00] group-hover:border-transparent flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0">
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-white group-hover:text-black stroke-[2.5]" />
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
