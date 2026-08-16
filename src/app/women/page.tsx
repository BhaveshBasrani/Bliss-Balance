'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SkuCard } from '@/components/SkuCard';
import { SearchModal } from '@/components/SearchModal';
import { getStoredSKUs } from '@/lib/dataStore';
import { FootwearSKU } from '@/lib/types';
import Link from 'next/link';

export default function WomenPage() {
  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const womenCategories = [
    'All',
    'Slippers',
    'Flip-Flops',
    'Slides',
    'Sandals',
    'Flats',
    'Casual Shoes',
    'Sneakers',
    'Clogs',
    'Heels',
  ];

  useEffect(() => {
    setSkus(getStoredSKUs().filter(s => s.gender === 'Women' || s.gender === 'Unisex'));
  }, []);

  const filtered = selectedCategory === 'All'
    ? skus
    : skus.filter(s => s.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Page Banner Header */}
        <div className="space-y-3 border-b border-neutral-800 pb-8">
          <span className="text-xs font-mono font-bold tracking-widest text-red-500 uppercase">
            BLISS BALANCE • WOMEN'S FOOTWEAR COLLECTION
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase">
            WOMEN'S <span className="text-red-500">FOOTWEAR</span>
          </h1>
          <p className="font-body text-neutral-400 text-sm max-w-2xl">
            Slippers, Flip-Flops, Slides, Sandals, Flats, Casual Shoes, Sneakers, Clogs & Heels. Thoughtfully designed with cushioned footbeds, supportive contours, and effortless style.
          </p>
        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {womenCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : 'bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SKU Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 space-y-3">
            <p className="font-mono text-neutral-400 text-sm">
              No SKUs listed under Women's {selectedCategory} yet.
            </p>
            <Link
              href="/admin"
              className="inline-block px-4 py-2 rounded-xl bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider"
            >
              Add Women's SKUs in Admin Panel
            </Link>
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
