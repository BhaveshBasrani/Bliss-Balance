'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SkuCard } from '@/components/SkuCard';
import { SearchModal } from '@/components/SearchModal';
import { getStoredSKUs, fetchCloudSKUs } from '@/lib/dataStore';
import { FootwearSKU } from '@/lib/types';

export default function MenPage() {
  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const menCategories = [
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
  ];

  useEffect(() => {
    const loadSkus = () => {
      const local = getStoredSKUs().filter(s => s.gender === 'Men' || s.gender === 'Unisex');
      setSkus(local);
      if (local && local.length > 0) {
        setLoading(false);
      }
    };

    loadSkus();

    fetchCloudSKUs().then(cloudSkus => {
      setSkus(cloudSkus.filter(s => s.gender === 'Men' || s.gender === 'Unisex'));
      setLoading(false);
    }).catch(() => setLoading(false));

    window.addEventListener('skus-updated', loadSkus);
    return () => window.removeEventListener('skus-updated', loadSkus);
  }, []);

  const filtered = selectedCategory === 'All'
    ? skus
    : skus.filter(s => s.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white font-mono select-none">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 font-mono">
        
        {/* Header Banner */}
        <div className="space-y-3 border-b-2 border-neutral-900 dark:border-neutral-800 pb-8">
          <span className="text-xs font-black tracking-widest text-red-600 uppercase block">
            BLISS BALANCE • MEN'S FOOTWEAR COLLECTION
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tighter text-neutral-950 dark:text-white">
            MEN'S <span className="text-red-600">FOOTWEAR</span>
          </h1>
          <p className="font-mono text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm max-w-2xl font-bold">
            Slippers, Flip-Flops, Slides, Sandals, Clogs, Casual Shoes, Sneakers, Loafers & Formal Footwear. Built for soft comfort, lightweight feel, and dependable anti-skid grip.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {menCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-none text-xs font-black uppercase tracking-wider transition-all border-2 ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white border-red-600 shadow-md'
                  : 'bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 border-neutral-900 dark:border-neutral-800 hover:border-red-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid with Loading Skeleton Stage */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-800 p-4 space-y-4">
                <div className="aspect-square w-full rounded-none bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-950 rounded-none border-2 border-neutral-900 dark:border-neutral-800 space-y-3">
            <p className="font-mono text-neutral-500 text-xs font-black uppercase">
              No products listed under Men's {selectedCategory} yet.
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
