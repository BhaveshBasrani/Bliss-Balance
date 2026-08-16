'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Grid } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';
import { CollectionItem } from '@/lib/types';

interface CategoryGridProps {
  collections: CollectionItem[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ collections }) => {
  const [activeGender, setActiveGender] = useState<'All' | 'Men' | 'Women'>('All');

  const filteredCollections = collections.filter(col => {
    if (activeGender === 'All') return true;
    return col.gender === activeGender || col.gender === 'Unisex';
  });

  return (
    <section className="py-16 bg-neutral-950 dark:bg-neutral-950 light:bg-slate-50 border-b border-neutral-800 dark:border-neutral-800 light:border-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase">
              EXPLORE FOOTWEAR COLLECTIONS
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white dark:text-white light:text-slate-950 uppercase tracking-tight">
              BUILT FOR <span className="text-red-500">EVERY STEP</span>
            </h2>
          </div>

          {/* Gender Filter Tabs */}
          <div className="flex items-center gap-2 bg-neutral-900 dark:bg-neutral-900 light:bg-slate-200 p-1.5 rounded-xl border border-neutral-800 dark:border-neutral-800 light:border-slate-300">
            {(['All', 'Men', 'Women'] as const).map((gender) => (
              <button
                key={gender}
                onClick={() => setActiveGender(gender)}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                  activeGender === gender
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-neutral-400 dark:text-neutral-400 light:text-slate-700 hover:text-white'
                }`}
              >
                {gender === 'All' ? 'ALL COLLECTIONS' : gender}
              </button>
            ))}
          </div>
        </div>

        {/* Collections Horizontal Scroll on Mobile / Grid on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCollections.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-black dark:bg-black light:bg-white border border-neutral-800 dark:border-neutral-800 light:border-slate-200 hover:border-red-500 transition-all duration-300 shadow-lg flex flex-col justify-between"
            >
              {/* Category Image Placeholder (600 x 800 px) */}
              <div className="p-3">
                <ImagePlaceholder
                  dimensions={item.imageDimensions || "600 x 800 px (3:4 Portrait)"}
                  aspectRatio="aspect-[4/3]"
                  label={`${item.title} BANNER`}
                  imageUrl={item.imageUrl}
                />
              </div>

              {/* Card Footer Info */}
              <div className="p-5 pt-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-500 bg-red-950/60 light:bg-red-100 px-2 py-0.5 rounded border border-red-500/30">
                    {item.gender}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">CATEGORY SPEC</span>
                </div>

                <h3 className="font-heading text-2xl font-bold text-white dark:text-white light:text-slate-950 uppercase tracking-wide group-hover:text-red-500 transition-colors">
                  {item.title}
                </h3>

                <p className="font-body text-xs text-neutral-400 dark:text-neutral-400 light:text-slate-600 line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-3">
                  <Link
                    href={`/collections?cat=${encodeURIComponent(item.title)}`}
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 group/link"
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
