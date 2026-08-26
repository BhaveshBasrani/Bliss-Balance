'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
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
    <section className="py-14 sm:py-24 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest border border-black dark:border-white">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>CUSTOMER CHOICE RANKINGS</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Our Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-lg font-medium">
                The most sought-after orthopedic slippers, cushioned slides, and daily silhouettes.
              </p>
            </div>

            <Link
              href="/collections"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-black text-white dark:bg-white dark:text-black font-heading font-black text-[11px] sm:text-xs uppercase tracking-widest hover:bg-[#E60000] hover:text-white hover:border-[#E60000] transition-all duration-200 border-2 border-black dark:border-white self-start sm:self-auto"
            >
              <span>Explore All Bestsellers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Joined Contiguous 4-Card Modular Grid */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
            {displayed.map((sku, idx) => (
              <SkuCard key={sku.id} sku={sku} bestsellerRank={idx + 1} />
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
