'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SkuCard } from '@/components/SkuCard';
import { SearchModal } from '@/components/SearchModal';
import { getStoredSKUs, fetchCloudSKUs } from '@/lib/dataStore';
import { FootwearSKU } from '@/lib/types';
import { Filter, Ruler, Palette, Layers, RefreshCw } from 'lucide-react';

function CollectionsContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const filterParam = searchParams.get('filter');

  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || 'All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');

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

  const allSizes = ['All', 'UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
  const allColors = ['All', 'Navy', 'Black', 'Brown', 'Beige', 'White', 'Olive', 'Red'];

  useEffect(() => {
    setSkus(getStoredSKUs());
    fetchCloudSKUs().then(cloudSkus => setSkus(cloudSkus));
  }, []);

  useEffect(() => {
    if (catParam) setSelectedCategory(catParam);
  }, [catParam]);

  const filtered = skus.filter((sku) => {
    // Gender Filter
    if (selectedGender !== 'All' && sku.gender !== selectedGender && sku.gender !== 'Unisex') {
      return false;
    }
    // Category Filter
    if (selectedCategory !== 'All' && sku.category !== selectedCategory) {
      return false;
    }
    // Size Filter
    if (selectedSize !== 'All') {
      if (!sku.sizes || !sku.sizes.includes(selectedSize)) {
        return false;
      }
    }
    // Color Filter
    if (selectedColor !== 'All') {
      if (!sku.colorVariants || !sku.colorVariants.some(cv => cv.name.toLowerCase().includes(selectedColor.toLowerCase()))) {
        return false;
      }
    }
    // New Arrivals Filter
    if (filterParam === 'new' && !sku.isNewArrival) {
      return false;
    }
    return true;
  });

  const resetAllFilters = () => {
    setSelectedGender('All');
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedColor('All');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8 font-mono">
        
        {/* Header Banner */}
        <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-8">
          <span className="text-xs font-bold tracking-widest text-red-600 uppercase flex items-center gap-1.5">
            <Filter className="w-4 h-4" /> OFFICIAL FOOTWEAR CATALOG
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase text-neutral-950 dark:text-white">
            ALL <span className="text-red-600">COLLECTIONS</span>
          </h1>
          <p className="font-body text-neutral-600 dark:text-neutral-400 text-sm max-w-2xl">
            Explore our complete lineup of cushioned slippers, flip-flops, slides, sandals, clogs, casual shoes, sneakers, loafers, flats, and heels. Filter by gender, category, size, and color.
          </p>
        </div>

        {/* Dynamic Multi-Filter System (Gender, Category, Size, Color) */}
        <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900/60 p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Gender Filters */}
            <div className="flex items-center gap-2 bg-white dark:bg-black p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
              {(['All', 'Men', 'Women'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedGender === g
                      ? 'bg-red-600 text-white shadow-md'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 font-bold">
                Showing {filtered.length} Items
              </span>

              {(selectedGender !== 'All' || selectedCategory !== 'All' || selectedSize !== 'All' || selectedColor !== 'All') && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-red-600 hover:text-red-500 font-bold uppercase underline underline-offset-4 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> RESET FILTERS
                </button>
              )}
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-red-600" /> CATEGORY:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-white dark:bg-black text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter Pills */}
          <div className="space-y-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <Ruler className="w-3.5 h-3.5 text-red-600" /> SIZE:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    selectedSize === size
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-red-600 shadow-md'
                      : 'bg-white dark:bg-black text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Filter Pills */}
          <div className="space-y-1 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-red-600" /> COLOR:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {allColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                    selectedColor === color
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-red-600 shadow-md'
                      : 'bg-white dark:bg-black text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900/40 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3">
            <p className="font-mono text-neutral-500 text-sm">
              No products found matching your active filter criteria.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-red-500 transition-all"
            >
              CLEAR ALL FILTERS
            </button>
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
