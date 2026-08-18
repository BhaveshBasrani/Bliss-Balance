'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, Star, Award, TrendingUp } from 'lucide-react';
import { FootwearSKU } from '@/lib/types';
import { SkuCard } from './SkuCard';
import { ScrollReveal } from './ScrollReveal';

interface BestsellerSectionProps {
  skus: FootwearSKU[];
}

export const BestsellerSection: React.FC<BestsellerSectionProps> = ({ skus }) => {
  const safeSkus = Array.isArray(skus) ? skus : [];
  // Filter bestsellers (isBestseller flag or top rated/reviewed)
  const bestsellers = safeSkus.filter((sku) => sku?.isBestseller || (sku?.rating && sku.rating >= 4.5)).slice(0, 4);
  const displayed = bestsellers.length > 0 ? bestsellers : safeSkus.slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-neutral-50/70 dark:bg-neutral-950/70 border-b border-neutral-200 dark:border-neutral-800 relative select-none font-mono">
      
      {/* Background Subtle Typography Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.025] dark:opacity-[0.05] select-none">
        <span className="font-heading font-black text-[14rem] lg:text-[22rem] tracking-tighter uppercase text-black dark:text-white leading-none whitespace-nowrap">
          BESTSELLERS
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-black tracking-[0.25em] text-red-600 uppercase flex items-center gap-2">
                <Flame className="w-4 h-4 fill-red-600 text-red-600 animate-pulse" /> MOST WANTED • TOP RATED
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                OUR <span className="text-red-600">BEST SELLERS</span>
              </h2>
              <p className="text-xs font-mono text-neutral-500 font-bold max-w-xl">
                The most loved, ultra-cushioned footwear styles trusted by over 1,00,000+ happy customers across India.
              </p>
            </div>

            <Link
              href="/collections?filter=bestseller"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-950 transition-all shadow-md self-start sm:self-auto border border-red-600"
            >
              <span>EXPLORE ALL BESTSELLERS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Product Grid (2 columns on mobile, 4 columns on desktop) */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {displayed.map((sku, idx) => (
              <div key={sku.id} className="relative group">
                
                {/* Ranking Tag */}
                <div className="absolute top-3 left-3 z-20 bg-red-600 text-white font-mono text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>#{idx + 1} BESTSELLER</span>
                </div>

                <SkuCard sku={sku} />
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Bestsellers Highlight Banner */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="p-8 sm:p-12 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-3 max-w-xl text-center md:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-[10px] font-mono font-black uppercase tracking-widest">
                <Award className="w-3.5 h-3.5" /> #1 RATED CUSHIONED FOOTWEAR
              </div>
              <h3 className="font-heading text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight">
                EXPERIENCE THE <span className="text-red-600">ULTRA-CUSHIONED</span> BLISS
              </h3>
              <p className="text-xs font-mono text-neutral-400 font-bold leading-relaxed">
                Anti-skid wave traction outsoles, dual-density EVA memory foam, and lightweight ergonomic arch support designed for daily Indian walking conditions.
              </p>
            </div>

            <div className="shrink-0 z-10 w-full md:w-auto text-center">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-4 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-lg border border-white"
              >
                <span>SHOP BESTSELLERS NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
