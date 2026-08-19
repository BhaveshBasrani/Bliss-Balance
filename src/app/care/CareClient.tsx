'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { Sparkles, RefreshCw, ShieldCheck, Droplet, Sun } from 'lucide-react';

export function CareClient() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full">
        
        {/* Header */}
        <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-8 text-center sm:text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase">
            FOOTWEAR CARE & RETURNS
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black uppercase text-neutral-950 dark:text-white">
            CARE GUIDE & <span className="text-red-600">EXCHANGES</span>
          </h1>
          <p className="font-body text-neutral-600 dark:text-neutral-400 text-sm max-w-2xl">
            Learn how to maintain your Bliss Balance slippers, slides, sandals, clogs, and shoes for maximum durability and comfort.
          </p>
        </div>

        {/* Footwear Care Instructions */}
        <div className="space-y-6">
          <h2 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600" />
            CARE & CLEANING TIPS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body text-xs">
            <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold uppercase text-neutral-950 dark:text-white">
                GENTLE WASHING
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Wipe clean using a soft damp cloth or mild soapy water. Avoid harsh chemical detergents or abrasive scrubbing pads.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold uppercase text-neutral-950 dark:text-white">
                AIR DRY IN SHADE
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Allow footwear to air dry naturally in a cool shaded area. Do not expose EVA footbeds to direct scorching sunlight or heat guns.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold uppercase text-neutral-950 dark:text-white">
                STORAGE CARE
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Store in a well-ventilated dry place away from extreme dampness to preserve sole texture and footbed elasticity.
              </p>
            </div>
          </div>
        </div>

        {/* Returns & Exchanges Policy */}
        <div className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
          <h2 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-red-600" />
            7-DAY HASSLE-FREE RETURNS & EXCHANGES
          </h2>
          <p className="font-body text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            All Bliss Balance footwear purchased via Amazon or Flipkart comes with marketplace-backed 7-day easy returns and size replacement guarantees. If your footwear does not fit perfectly, simply initiate an exchange or return directly on Amazon or Flipkart for instant processing.
          </p>
        </div>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={[]} />
    </div>
  );
}
export default CareClient;
