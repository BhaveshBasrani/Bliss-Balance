'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';
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
    <section className="py-20 sm:py-28 bg-white dark:bg-black border-b border-neutral-100 dark:border-neutral-900 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Filter Tabs */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 font-mono">
            <div className="space-y-2">
              <span className="text-[11px] font-black tracking-[0.25em] text-red-600 uppercase block">
                EXPLORE FOOTWEAR COLLECTIONS
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
                BUILT FOR <span className="text-red-600">EVERY STEP</span>
              </h2>
            </div>

            {/* Gender Filter Tabs */}
            <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 p-1.5 rounded-none border border-neutral-200 dark:border-neutral-800 overflow-x-auto no-scrollbar">
              {(['All', 'Men', 'Women', 'Kids'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setActiveGender(gender)}
                  className={`whitespace-nowrap px-4 py-2 rounded-none font-mono text-xs font-black uppercase tracking-wider transition-all ${
                    activeGender === gender
                      ? 'bg-red-600 text-white'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-red-600'
                  }`}
                >
                  {gender === 'All' ? 'ALL COLLECTIONS' : gender}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Collections Cards Grid - Compact 2-Column Mobile Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {filteredCollections.map((item, idx) => (
            <ScrollReveal key={item.id} direction="up" delay={idx * 0.05}>
              <div className="group relative rounded-xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 hover:border-red-600 dark:hover:border-red-500 transition-all duration-300 flex flex-col justify-between h-full">
                {/* Compact Category Image Banner */}
                <div className="p-1.5 sm:p-2.5">
                  <ImagePlaceholder
                    dimensions={item.imageDimensions || "800 x 600 px (4:3)"}
                    aspectRatio="aspect-[16/10] sm:aspect-[16/9]"
                    label={`${item.title} BANNER`}
                    imageUrl={item.imageUrl}
                  />
                </div>

                {/* Card Content */}
                <div className="p-2.5 sm:p-4 pt-1 space-y-1.5 sm:space-y-2.5 font-mono flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest bg-red-600 text-white px-1.5 py-0.5">
                        {item.gender}
                      </span>
                      <span className="hidden sm:inline text-[9px] font-bold text-neutral-400">COLLECTION</span>
                    </div>

                    <h3 className="font-heading text-xs sm:text-xl font-black text-neutral-950 dark:text-white uppercase tracking-tight group-hover:text-red-600 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="hidden sm:block font-body text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-1.5 sm:pt-2.5 border-t border-neutral-200/60 dark:border-neutral-800/60 mt-auto">
                    <Link
                      href={`/collections?cat=${encodeURIComponent(item.title)}`}
                      className="inline-flex items-center gap-1 sm:gap-2 font-mono text-[10px] sm:text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-500 group/link"
                    >
                      <span className="truncate">EXPLORE</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover/link:translate-x-1 shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
