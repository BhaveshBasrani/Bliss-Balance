'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Trophy, Sparkles } from 'lucide-react';
import { FootwearSKU } from '@/lib/types';
import { SkuCard } from './SkuCard';
import { ScrollReveal } from './ScrollReveal';

interface BestsellerSectionProps {
  skus: FootwearSKU[];
}

export const BestsellerSection: React.FC<BestsellerSectionProps> = ({ skus }) => {
  const safeSkus = Array.isArray(skus) ? skus : [];
  const bestsellers = safeSkus.filter((sku) => sku?.isBestseller || (sku?.rating && sku.rating >= 4.5)).slice(0, 4);
  const displayed = bestsellers.length > 0 ? bestsellers : safeSkus.slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-white dark:bg-black border-y border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
      
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200/60 dark:border-red-900/40 text-brand-red text-[11px] font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 fill-brand-red" />
                <span>Ranked by Customer Choice</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-black dark:text-white">
                Our Best Sellers
              </h2>
              <p className="text-sm text-brand-stone max-w-lg font-medium">
                The most sought-after orthopedic slippers, cushioned slides, and daily silhouettes trusted by thousands across India.
              </p>
            </div>

            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand-black dark:bg-white text-white dark:text-black font-body font-bold text-xs uppercase tracking-wider hover:bg-brand-red hover:text-white dark:hover:bg-brand-red dark:hover:text-white transition-all duration-300 shadow-sm self-start sm:self-auto"
            >
              <span>Explore All Bestsellers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Product Grid */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayed.map((sku, idx) => (
              <SkuCard key={sku.id} sku={sku} bestsellerRank={idx + 1} />
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
