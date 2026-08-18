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
  const [selectedGender, setSelectedGender] = useState<'All' | 'Men' | 'Women' | 'Kids'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>(catParam || 'All');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [loading, setLoading] = useState(true);

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
    const loadSkus = () => {
      const local = getStoredSKUs();
      setSkus(local);
      if (local && local.length > 0) setLoading(false);
    };

    loadSkus();

    fetchCloudSKUs().then(cloudSkus => {
      setSkus(cloudSkus);
      setLoading(false);
    }).catch(() => setLoading(false));

    window.addEventListener('skus-updated', loadSkus);
    return () => window.removeEventListener('skus-updated', loadSkus);
  }, []);

  useEffect(() => {
    if (catParam) setSelectedCategory(catParam);
  }, [catParam]);

  const filtered = skus.filter((sku) => {
    if (selectedGender !== 'All') {
      if (selectedGender === 'Kids') {
        if (sku.gender !== 'Kids' && sku.gender !== 'Unisex' && !sku.category.toLowerCase().includes('kids')) {
          return false;
        }
      } else if (sku.gender !== selectedGender && sku.gender !== 'Unisex') {
        return false;
      }
    }

    if (selectedCategory !== 'All' && sku.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }

    if (selectedSize !== 'All' && sku.sizes && !sku.sizes.includes(selectedSize)) {
      return false;
    }

    if (selectedColor !== 'All') {
      const hasColor = (sku.colorVariants || []).some(cv => cv.name.toLowerCase().includes(selectedColor.toLowerCase()));
      if (!hasColor && !sku.title.toLowerCase().includes(selectedColor.toLowerCase())) {
        return false;
      }
    }

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
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white font-mono select-none">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full">
        
        {/* Page Header */}
        <div className="space-y-3 border-b-2 border-neutral-900 dark:border-neutral-800 pb-6">
          <span className="text-xs font-black tracking-widest text-red-600 uppercase flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> OFFICIAL CATALOG
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-black text-neutral-950 dark:text-white uppercase tracking-tighter">
            ALL <span className="text-red-600">COLLECTIONS</span>
          </h1>
          <p className="font-mono text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm max-w-2xl font-bold">
            Explore our complete lineup of cushioned slippers, flip-flops, slides, sandals, clogs, casual shoes, sneakers, loafers, flats, and heels. Filter by gender, category, size, and color.
          </p>
        </div>

        {/* Dynamic Multi-Filter System (Gender, Category, Size, Color) */}
        <div className="space-y-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Gender Filters */}
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-x-auto no-scrollbar">
              {(['All', 'Men', 'Women', 'Kids'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
                    selectedGender === g
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                  }`}
                >
                  {g === 'All' ? 'ALL COLLECTIONS' : g}
                </button>
              ))}
            </div>

            {/* Reset Filters Button */}
            {(selectedGender !== 'All' || selectedCategory !== 'All' || selectedSize !== 'All' || selectedColor !== 'All') && (
              <button
                onClick={resetAllFilters}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-900 dark:text-white text-xs font-black uppercase transition-all duration-200 flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" /> RESET ALL FILTERS
              </button>
            )}

          </div>

          {/* Category Filter Pills */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-widest flex items-center gap-1">
              <Layers className="w-3 h-3 text-red-600" /> CATEGORY
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-neutral-50 dark:bg-black text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-red-600/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Size & Color Multi-Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            {/* Size Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-widest flex items-center gap-1">
                <Ruler className="w-3 h-3 text-red-600" /> SIZE (UK)
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {allSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all duration-200 border ${
                      selectedSize === sz
                        ? 'bg-neutral-950 dark:bg-white text-white dark:text-black border-neutral-950 dark:border-white shadow-sm'
                        : 'bg-neutral-50 dark:bg-black text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-neutral-500'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase text-neutral-400 tracking-widest flex items-center gap-1">
                <Palette className="w-3 h-3 text-red-600" /> COLOR
              </label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {allColors.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase transition-all duration-200 border ${
                      selectedColor === col
                        ? 'bg-red-600 text-white border-red-600 shadow-sm'
                        : 'bg-neutral-50 dark:bg-black text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:border-red-600/60'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <span>SHOWING {filtered.length} PRODUCTS</span>
          {(selectedGender !== 'All' || selectedCategory !== 'All' || selectedSize !== 'All' || selectedColor !== 'All') && (
            <span className="text-red-600">FILTERS APPLIED</span>
          )}
        </div>

        {/* Footwear Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-800 p-4 space-y-4">
                <div className="aspect-square w-full rounded-none bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-950 rounded-none border-2 border-neutral-900 dark:border-neutral-800 space-y-4">
            <p className="text-sm text-neutral-500 font-black uppercase">
              NO FOOTWEAR MATCHES YOUR SELECTED FILTERS
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 rounded-none bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-neutral-950 transition-all border border-black"
            >
              CLEAR FILTERS
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
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CollectionsContent />
    </Suspense>
  );
}
