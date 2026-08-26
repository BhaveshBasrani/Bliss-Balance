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
    <section className="py-16 sm:py-28 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
      
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-10 sm:space-y-14">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest border border-black">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>CUSTOMER CHOICE RANKINGS</span>
              </div>
              <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Our Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-lg font-medium">
                The most sought-after orthopedic slippers, cushioned slides, and daily silhouettes trusted by thousands across India.
              </p>
            </div>

            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black font-heading font-black text-xs uppercase tracking-widest hover:bg-[#E5FF00] hover:text-black hover:border-black transition-all duration-200 border-2 border-black dark:border-white self-start sm:self-auto"
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
