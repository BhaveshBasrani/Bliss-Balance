'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SkuCard } from '@/components/SkuCard';
import { SearchModal } from '@/components/SearchModal';
import { getStoredSKUs, fetchCloudSKUs } from '@/lib/dataStore';
import { FootwearSKU } from '@/lib/types';

function CollectionsContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const filterParam = searchParams.get('filter');

  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || 'All');

  const allCategories = [
    'All',
    'Slippers',
    'Flip-Flops',
    'Slides',
    'Sandals',
    'Clogs',
    'Casual Shoes',
    'Sneakers',
    'Loafers',
    'Formal Footwear',
    'Flats',
    'Heels',
  ];

  useEffect(() => {
    setSkus(getStoredSKUs());
    fetchCloudSKUs().then(cloudSkus => setSkus(cloudSkus));
  }, []);

  useEffect(() => {
    if (catParam) setSelectedCategory(catParam);
  }, [catParam]);

  const filtered = skus.filter((sku) => {
    if (selectedGender !== 'All' && sku.gender !== selectedGender && sku.gender !== 'Unisex') {
      return false;
    }
    if (selectedCategory !== 'All' && sku.category !== selectedCategory) {
      return false;
    }
    if (filterParam === 'new' && !sku.isNewArrival) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Header Banner */}
        <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase">
            BLISS BALANCE • OFFICIAL FOOTWEAR CATALOG
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase text-neutral-950 dark:text-white">
            ALL <span className="text-red-600">COLLECTIONS</span>
          </h1>
          <p className="font-body text-neutral-600 dark:text-neutral-400 text-sm max-w-2xl">
            Explore our complete lineup of cushioned slippers, flip-flops, slides, sandals, clogs, casual shoes, sneakers, loafers, flats, and heels.
          </p>
        </div>

        {/* Gender & Category Controls */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Gender Filters */}
            <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {(['All', 'Men', 'Women'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedGender === g
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <span className="font-mono text-xs text-neutral-500 font-bold">
              Showing {filtered.length} Items
            </span>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white border-red-500 shadow-md'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <p className="font-mono text-neutral-500 text-sm">
              No products found matching your active filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((sku) => (
              <SkuCard key={sku.id} sku={sku} />
            ))}
          </div>
        )}

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={skus} />
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center font-mono text-xs text-neutral-500">
        LOADING COLLECTIONS...
      </div>
    }>
      <CollectionsContent />
    </Suspense>
  );
}
