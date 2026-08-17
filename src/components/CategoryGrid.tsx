'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';
import { CollectionItem } from '@/lib/types';

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
    <section className="py-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase">
              EXPLORE FOOTWEAR COLLECTIONS
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              BUILT FOR <span className="text-red-600">EVERY STEP</span>
            </h2>
          </div>

          {/* Gender Filter Tabs (ALL COLLECTIONS | MEN | WOMEN | KIDS) */}
          <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-x-auto no-scrollbar">
            {(['All', 'Men', 'Women', 'Kids'] as const).map((gender) => (
              <button
                key={gender}
                onClick={() => setActiveGender(gender)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                  activeGender === gender
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                }`}
              >
                {gender === 'All' ? 'ALL COLLECTIONS' : gender}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
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
              <div className="p-5 pt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                    {item.gender}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">CATEGORY SPEC</span>
                </div>

                <h3 className="font-heading text-2xl font-bold text-neutral-950 dark:text-white uppercase tracking-wide group-hover:text-red-600 transition-colors">
                  {item.title}
                </h3>

                <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-3">
                  <Link
                    href={`/collections?cat=${encodeURIComponent(item.title)}`}
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-500 group/link"
                  >
                    <span>EXPLORE COLLECTION</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
