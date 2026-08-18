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
    <section className="py-16 bg-white dark:bg-black border-b-2 border-neutral-900 dark:border-neutral-800 transition-colors select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Filter Tabs */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 font-mono">
            <div>
              <span className="text-xs font-black tracking-widest text-red-600 uppercase block mb-1">
                EXPLORE FOOTWEAR COLLECTIONS
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black text-neutral-950 dark:text-white uppercase tracking-tighter">
                BUILT FOR <span className="text-red-600">EVERY STEP</span>
              </h2>
            </div>

            {/* Gender Filter Tabs (ALL COLLECTIONS | MEN | WOMEN | KIDS) */}
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 p-1.5 rounded-none border-2 border-neutral-900 dark:border-neutral-700 overflow-x-auto no-scrollbar">
              {(['All', 'Men', 'Women', 'Kids'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setActiveGender(gender)}
                  className={`whitespace-nowrap px-4 py-2 rounded-none font-mono text-xs font-black uppercase tracking-wider transition-all border ${
                    activeGender === gender
                      ? 'bg-red-600 text-white border-red-600 shadow-md'
                      : 'text-neutral-700 dark:text-neutral-300 border-transparent hover:border-neutral-900 dark:hover:border-neutral-100'
                  }`}
                >
                  {gender === 'All' ? 'ALL COLLECTIONS' : gender}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Collections Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((item, idx) => (
            <ScrollReveal key={item.id} direction="up" delay={idx * 0.1}>
              <div className="group relative rounded-none overflow-hidden bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-700 hover:border-red-600 dark:hover:border-red-500 transition-all duration-200 flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1">
                {/* Category Image Spec Banner */}
                <div className="p-3">
                  <ImagePlaceholder
                    dimensions={item.imageDimensions || "800 x 600 px (4:3 Horizontal)"}
                    aspectRatio="aspect-[4/3]"
                    label={`${item.title} BANNER`}
                    imageUrl={item.imageUrl}
                  />
                </div>

                {/* Card Content */}
                <div className="p-5 pt-1 space-y-3 font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-2 py-0.5 border border-black">
                      {item.gender}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400">COLLECTION SPEC</span>
                  </div>

                  <h3 className="font-heading text-2xl font-black text-neutral-950 dark:text-white uppercase tracking-tight group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 font-bold">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <Link
                      href={`/collections?cat=${encodeURIComponent(item.title)}`}
                      className="inline-flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-500 group/link"
                    >
                      <span>EXPLORE COLLECTION</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
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
