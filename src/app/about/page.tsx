'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { BrandLogo } from '@/components/BrandLogo';
import { Feather, HeartPulse, ShieldCheck, Footprints } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white font-mono select-none">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 space-y-16 py-12">
        
        {/* Header Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          <BrandLogo size="lg" className="mx-auto rounded-none border border-black shadow-sm" />
          <div className="space-y-2">
            <span className="text-xs font-black tracking-widest text-red-600 uppercase block">
              ABOUT BLISS BALANCE
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tighter text-neutral-950 dark:text-white max-w-4xl mx-auto">
              WALK IN BLISS. <span className="text-red-600">LIVE IN BALANCE.</span>
            </h1>
          </div>
          <p className="font-mono text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-bold">
            Bliss Balance is a modern footwear brand created for people who believe everyday footwear should feel as good as it looks. We combine comfort, contemporary style, lightweight construction, and dependable grip to create footwear made for everyday life.
          </p>
        </section>

        {/* 4 Brand Pillars */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-none bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-800 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="w-12 h-12 rounded-none bg-red-600 text-white flex items-center justify-center border border-black">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-black uppercase text-neutral-950 dark:text-white">
                SOFT COMFORT
              </h3>
              <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold">
                Cushioned footbeds designed for all-day ease from home to casual daily outings.
              </p>
            </div>

            <div className="p-6 rounded-none bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-800 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="w-12 h-12 rounded-none bg-red-600 text-white flex items-center justify-center border border-black">
                <Feather className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-black uppercase text-neutral-950 dark:text-white">
                FEATHERWEIGHT
              </h3>
              <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold">
                Ultra-lightweight materials engineered to keep every step light and effortless.
              </p>
            </div>

            <div className="p-6 rounded-none bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-800 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="w-12 h-12 rounded-none bg-red-600 text-white flex items-center justify-center border border-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-black uppercase text-neutral-950 dark:text-white">
                ANTI-SKID GRIP
              </h3>
              <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold">
                Textured outsole patterns providing confident traction on all everyday surfaces.
              </p>
            </div>

            <div className="p-6 rounded-none bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-800 space-y-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="w-12 h-12 rounded-none bg-red-600 text-white flex items-center justify-center border border-black">
                <Footprints className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-black uppercase text-neutral-950 dark:text-white">
                VERSATILE STYLE
              </h3>
              <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold">
                Modern clean silhouettes that pair seamlessly with casual, work, and travel wear.
              </p>
            </div>

          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-4xl mx-auto px-4 text-center">
          <div className="p-10 rounded-none bg-black text-white border-2 border-neutral-900 dark:border-neutral-100 space-y-4 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]">
            <h3 className="font-heading text-3xl font-black uppercase tracking-tight">
              EXPLORE OUR FOOTWEAR COLLECTION
            </h3>
            <p className="font-mono text-xs text-neutral-300 max-w-lg mx-auto font-bold">
              Find your perfect pair of slippers, slides, sandals, clogs, or casual shoes on Amazon and Flipkart.
            </p>
            <Link
              href="/collections"
              className="inline-block px-8 py-3.5 rounded-none bg-red-600 hover:bg-white hover:text-black text-white font-mono text-xs font-black uppercase tracking-widest transition-all border-2 border-red-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              SHOP ALL FOOTWEAR
            </Link>
          </div>
        </section>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={[]} />
    </div>
  );
}
