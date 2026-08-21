'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { CollectionItem } from '@/lib/types';
import { ScrollReveal } from './ScrollReveal';

interface CategoryGridProps {
  collections: CollectionItem[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ collections }) => {
  const [activeGender, setActiveGender] = useState<'All' | 'Men' | 'Women' | 'Kids'>('All');

  const filteredCollections = collections.filter(col => {
    if (activeGender === 'All') return true;
    if (activeGender === 'Kids') {
      return col.gender === 'Kids' || col.gender === 'Unisex' || col.title.toLowerCase().includes('kids');
    }
    return col.gender === activeGender;
  });

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAF8] dark:bg-[#0A0A0A] transition-colors select-none">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-medium tracking-[0.25em] text-brand-stone uppercase block font-body">
                Curated Silhouettes
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-brand-black dark:text-white tracking-tight uppercase">
                Explore by Category
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 p-1.5 rounded-full border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
              {(['All', 'Men', 'Women', 'Kids'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setActiveGender(gender)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full font-body text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                    activeGender === gender
                      ? 'bg-brand-black text-white dark:bg-white dark:text-black shadow-sm'
                      : 'text-brand-stone hover:text-brand-black dark:hover:text-white'
                  }`}
                >
                  {gender === 'All' ? 'All Silhouettes' : gender}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Collections Lookbook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCollections.map((item, idx) => (
            <ScrollReveal key={item.id} direction="up" delay={idx * 0.05}>
              <Link
                href={`/collections/${item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="group relative rounded-3xl overflow-hidden bg-neutral-900 block aspect-[4/3] sm:aspect-[16/11] transition-all duration-500 shadow-sm hover:shadow-2xl"
              >
                {/* Background Image with Cinematic Hover Zoom */}
                <img
                  src={item.imageUrl || '/og-image.jpg'}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108"
                />

                {/* Dark Editorial Gradient Overlay Removed */}

                {/* Top Pill Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3.5 py-1 rounded-full bg-white/90 dark:bg-black/80 text-brand-black dark:text-white text-[10px] font-bold uppercase tracking-widest backdrop-blur-md shadow-xs">
                    {item.gender}
                  </span>
                </div>

                {/* Bottom Content Overlaid on Card */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-10 space-y-2 flex items-end justify-between">
                  <div className="space-y-1 max-w-[80%]">
                    <h3 className="font-heading text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight group-hover:text-red-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/70 font-medium line-clamp-1">
                      {item.description}
                    </p>
                  </div>

                  {/* Circular Action Button */}
                  <div className="w-10 h-10 rounded-full bg-white text-brand-black flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-brand-red group-hover:text-white shrink-0">
                    <ArrowUpRight className="w-5 h-5" />
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
