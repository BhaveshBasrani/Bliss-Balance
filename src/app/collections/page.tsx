'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SkuCard } from '@/components/SkuCard';
import { SearchModal } from '@/components/SearchModal';
import { CategoryGrid } from '@/components/CategoryGrid';
import { getStoredSKUs, INITIAL_COLLECTIONS } from '@/lib/dataStore';
import { FootwearSKU } from '@/lib/types';

export default function CollectionsPage() {
  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women'>('All');

  useEffect(() => {
    setSkus(getStoredSKUs());
  }, []);

  const filteredSkus = selectedGender === 'All'
    ? skus
    : skus.filter(s => s.gender === selectedGender || s.gender === 'Unisex');

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 space-y-12 py-10">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase">
            COMPLETE FOOTWEAR LINEUP
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
            ALL FOOTWEAR <span className="text-red-600">COLLECTIONS</span>
          </h1>
          <p className="font-body text-neutral-600 dark:text-neutral-400 text-sm max-w-2xl">
            Explore our complete lineup of cushioned slippers, flip-flops, slides, sandals, clogs, sneakers, loafers, and formal footwear.
          </p>
        </div>

        {/* Category Banners Grid */}
        <CategoryGrid collections={INITIAL_COLLECTIONS} />

        {/* Products Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <h2 className="font-heading text-3xl font-black uppercase text-neutral-950 dark:text-white">
              ALL FOOTWEAR <span className="text-red-600">PRODUCTS</span> ({filteredSkus.length})
            </h2>

            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {(['All', 'Men', 'Women'] as const).map((gender) => (
                <button
                  key={gender}
                  onClick={() => setSelectedGender(gender)}
                  className={`px-4 py-1.5 rounded-lg font-mono text-xs font-bold uppercase transition-all ${
                    selectedGender === gender
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950'
                  }`}
                >
                  {gender}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSkus.map((sku) => (
              <SkuCard key={sku.id} sku={sku} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={skus} />
    </div>
  );
}
