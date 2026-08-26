'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Flame, ShieldCheck, Zap } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const EditorialShowcase: React.FC = () => {
  return (
    <section className="py-16 sm:py-28 bg-[#F5F3EE] dark:bg-[#0D0D0D] border-b border-neutral-200/60 dark:border-neutral-800/60 relative overflow-hidden select-none">
      
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/8 dark:bg-blue-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch bg-white dark:bg-[#141414] border border-neutral-200/80 dark:border-neutral-800 shadow-2xl">
          
          {/* Left: Brand Manifesto & Dual CTAs */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 space-y-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-neutral-200/60 dark:border-neutral-800">
            <ScrollReveal direction="up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                THE BLISS ARCHIVE &bull; LIMITED DROPS
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-neutral-950 dark:text-white leading-[1.0]">
                FOOTWEAR MADE FOR INDIAN STREETS.
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-lg">
                Re-engineered with orthopedic arch alignment and high-density EVA bounce soles for dependable grip, zero fatigue, and effortless movement.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25}>
              <div className="flex items-center gap-4 flex-wrap text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <Zap className="w-3.5 h-3.5 text-amber-500" /> High-Bounce EVA
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Anti-Skid Wave Grip
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="flex items-center gap-3 flex-wrap pt-2">
                <Link
                  href="/men"
                  className="px-8 py-4 bg-[#E5FF00] hover:bg-[#d6f000] text-black font-heading font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 border-2 border-black"
                >
                  SHOP MEN <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/women"
                  className="px-8 py-4 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-heading font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2 border-2 border-black dark:border-white"
                >
                  SHOP WOMEN <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Sneaker Stack Image */}
          <div className="lg:col-span-6 relative min-h-[340px] sm:min-h-[480px] bg-gradient-to-b from-[#F2EFE9] to-[#E5E0D5] dark:from-[#1A1A1A] dark:to-[#0F0F0F] flex items-center justify-center p-8 overflow-hidden">
            <ScrollReveal direction="up" delay={0.15}>
              <img
                src="/editorial/sneaker-stack.jpg"
                alt="Bliss Balance Sneaker Stack"
                loading="lazy"
                className="w-full h-full object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-700 ease-out max-h-[420px]"
              />
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
};
