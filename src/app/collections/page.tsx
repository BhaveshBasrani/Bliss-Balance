'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SkuCard } from '@/components/SkuCard';
import { SearchModal } from '@/components/SearchModal';
import { BrandLoadingScreen } from '@/components/BrandLoadingScreen';
import { getStoredSKUs, fetchCloudSKUs } from '@/lib/dataStore';
import { FootwearSKU, ColorVariant } from '@/lib/types';
import { ArrowUpDown, SlidersHorizontal, X, ChevronUp, Check, RotateCcw, Flame } from 'lucide-react';

function CollectionsContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const filterParam = searchParams.get('filter');

  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(24);

  // Filter & Sort States
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(catParam ? [catParam] : []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'trending' | 'bestsellers' | 'new' | 'price-high-low' | 'price-low-high'>('trending');

  // UI Drawer / Dropdown States
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const allCategories = [
    'Slippers',
    'Flip-Flops',
    'Slides',
    'Sandals',
    'Kolhapuri & Puneri Chappal',
    'Clogs',
    'Casual Shoes',
    'Sneakers',
    'Loafers',
    'Formal Footwear',
    'Flats',
    'Heels',
  ];

  const allSizes = ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const safeSkus = Array.isArray(skus) ? skus : [];
  const extractedColors = Array.from(
    new Set(
      safeSkus.flatMap((sku: FootwearSKU) => (sku?.colorVariants || []).map((cv: ColorVariant) => (cv?.name || '').trim())).filter(Boolean)
    )
  );
  const allColors = extractedColors.length > 0
    ? extractedColors
    : ['Navy', 'Black', 'Brown', 'Beige', 'White', 'Olive', 'Red', 'Tan', 'Grey'];

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
    if (catParam) setSelectedCategories([catParam]);
  }, [catParam]);

  // Lock body scroll when filter drawer is open
  useEffect(() => {
    if (isFilterDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterDrawerOpen]);

  // Filter Logic
  let filtered = skus.filter((sku) => {
    // Gender Filter
    if (selectedGenders.length > 0) {
      const match = selectedGenders.some(g => {
        if (g === 'Kids') {
          return sku.gender === 'Kids' || sku.gender === 'Unisex' || sku.category.toLowerCase().includes('kids');
        }
        return sku.gender === g || sku.gender === 'Unisex';
      });
      if (!match) return false;
    }

    // Category Filter
    if (selectedCategories.length > 0) {
      const match = selectedCategories.some(c => sku.category.toLowerCase() === c.toLowerCase());
      if (!match) return false;
    }

    // Size Filter
    if (selectedSizes.length > 0) {
      const match = selectedSizes.some(sz => {
        const fullSize = sz.startsWith('UK') ? sz : `UK ${sz}`;
        return sku.sizes && sku.sizes.includes(fullSize);
      });
      if (!match) return false;
    }

    // Color Filter
    if (selectedColors.length > 0) {
      const match = selectedColors.some(clr => {
        const hasColor = (sku.colorVariants || []).some((cv: ColorVariant) => (cv.name || '').toLowerCase().includes(clr.toLowerCase()));
        return hasColor || sku.title.toLowerCase().includes(clr.toLowerCase());
      });
      if (!match) return false;
    }

    if (filterParam === 'new' && !sku.isNewArrival) {
      return false;
    }

    return true;
  });

  // Sort Logic
  if (sortOption === 'bestsellers') {
    filtered = [...filtered].sort((a, b) => {
      const aBest = a.isBestseller ? 1 : 0;
      const bBest = b.isBestseller ? 1 : 0;
      if (bBest !== aBest) return bBest - aBest;
      const aRating = a.rating || 5.0;
      const bRating = b.rating || 5.0;
      if (bRating !== aRating) return bRating - aRating;
      return (b.reviewCount || 0) - (a.reviewCount || 0);
    });
  } else if (sortOption === 'new') {
    filtered = [...filtered].sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
  } else if (sortOption === 'price-high-low') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortOption === 'price-low-high') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  }

  const activeFilterCount = selectedGenders.length + selectedCategories.length + selectedSizes.length + selectedColors.length;

  const resetAllFilters = () => {
    setSelectedGenders([]);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  if (loading) {
    return <BrandLoadingScreen message="FEEL THE BLISS • LOADING CATALOG..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white font-mono select-none">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 w-full">
        
        {/* Page Header */}
        <div className="space-y-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <span className="text-[10px] font-mono font-black tracking-widest text-red-600 uppercase">
            BLISS BALANCE CATALOG
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white uppercase tracking-tighter">
            ALL <span className="text-red-600">FOOTWEAR</span>
          </h1>
        </div>

        {/* ULTRA-SLEEK MINIMALIST TOP FILTER & SORT BAR (Matching Comet/Nike Reference) */}
        <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-800 font-mono text-xs">
          
          {/* Left: Active Product Count */}
          <div className="text-neutral-500 font-bold uppercase tracking-wider">
            {filtered.length} {filtered.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
          </div>

          {/* Right Actions: Sort By & Filters Buttons */}
          <div className="flex items-center gap-6 relative">
            
            {/* SORT BY DROPDOWN TRIGGER */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-2 font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 hover:text-red-600 transition-colors py-1"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort By</span>
              </button>

              {/* SORT DROPDOWN POPUP MENU (Screenshot 4) */}
              {isSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsSortDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-40 py-2 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => { setSortOption('bestsellers'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'bestsellers' ? 'text-red-600 font-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600" /> Bestsellers
                      </span>
                      {sortOption === 'bestsellers' && <Check className="w-3.5 h-3.5 text-red-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortOption('trending'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'trending' ? 'text-red-600 font-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span>Trending</span>
                      {sortOption === 'trending' && <Check className="w-3.5 h-3.5 text-red-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortOption('new'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'new' ? 'text-red-600 font-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span>New</span>
                      {sortOption === 'new' && <Check className="w-3.5 h-3.5 text-red-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortOption('price-high-low'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'price-high-low' ? 'text-red-600 font-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span>Price High → Low</span>
                      {sortOption === 'price-high-low' && <Check className="w-3.5 h-3.5 text-red-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortOption('price-low-high'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-3 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'price-low-high' ? 'text-red-600 font-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span>Price Low → High</span>
                      {sortOption === 'price-low-high' && <Check className="w-3.5 h-3.5 text-red-600" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* FILTERS DRAWER TRIGGER */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-2 font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 hover:text-red-600 transition-colors py-1"
            >
              <span>Filters</span>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-black flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Footwear Product Grid (2 columns on mobile, 4 columns on desktop) */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 animate-pulse">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3 sm:p-4 space-y-3">
                <div className="aspect-square w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-4">
            <p className="text-sm text-neutral-500 font-mono font-bold uppercase">
              NO FOOTWEAR MATCHES YOUR SELECTED FILTERS
            </p>
            <button
              onClick={resetAllFilters}
              className="px-6 py-3 rounded-xl bg-red-600 text-white font-mono font-black text-xs uppercase tracking-widest hover:bg-neutral-950 transition-all border border-red-600 shadow-sm"
            >
              CLEAR ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
              {filtered.slice(0, visibleCount).map((sku) => (
                <SkuCard key={sku.id} sku={sku} />
              ))}
            </div>

            {filtered.length > visibleCount && (
              <div className="text-center pt-4 pb-8">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="px-8 py-3.5 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-black font-mono font-black text-xs uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-md"
                >
                  LOAD MORE PRODUCTS ({filtered.length - visibleCount} REMAINING)
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* SLIDE-OVER FILTERS DRAWER (Matching Comet/Luxury Footwear Reference Screenshots 2 & 3) */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-mono select-none">
          {/* Dark Overlay Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsFilterDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white dark:bg-neutral-950 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 border-l border-neutral-200 dark:border-neutral-800">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                    FILTERS
                  </h3>
                  <span className="text-xs text-neutral-400 font-bold">
                    {filtered.length} products
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-2 rounded-xl text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body (Scrollable Sections) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* SIZE (UK) GRID SELECTOR (Matching Screenshot 3) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    <span>SIZE (UK)</span>
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {allSizes.map((sz) => {
                      const isSelected = selectedSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSizes(selectedSizes.filter(s => s !== sz));
                            } else {
                              setSelectedSizes([...selectedSizes, sz]);
                            }
                          }}
                          className={`py-3 text-xs font-mono font-bold border transition-all text-center rounded-lg ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-black font-black shadow-xs'
                              : 'border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                          }`}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CATEGORY / TYPE CHECKBOXES */}
                <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    <span>Type</span>
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                    {allCategories.map((cat) => {
                      const count = skus.filter(s => s.category.toLowerCase() === cat.toLowerCase()).length;
                      const isChecked = selectedCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-red-600 transition-colors py-0.5"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedCategories(selectedCategories.filter(c => c !== cat));
                                } else {
                                  setSelectedCategories([...selectedCategories, cat]);
                                }
                              }}
                              className="w-4 h-4 rounded-md accent-red-600 border-neutral-300"
                            />
                            <span>{cat}</span>
                          </div>
                          <span className="text-neutral-400 text-[11px]">({count})</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* GENDER CHECKBOXES */}
                <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    <span>Gender</span>
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="space-y-2.5">
                    {['Men', 'Women', 'Kids', 'Unisex'].map((g) => {
                      const isChecked = selectedGenders.includes(g);
                      return (
                        <label
                          key={g}
                          className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-red-600 transition-colors py-0.5"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (isChecked) {
                                  setSelectedGenders(selectedGenders.filter(item => item !== g));
                                } else {
                                  setSelectedGenders([...selectedGenders, g]);
                                }
                              }}
                              className="w-4 h-4 rounded-md accent-red-600 border-neutral-300"
                            />
                            <span>{g}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* COLOR CHECKBOXES */}
                <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    <span>Color</span>
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {allColors.map((clr) => {
                      const isChecked = selectedColors.includes(clr);
                      return (
                        <label
                          key={clr}
                          className="flex items-center gap-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-red-600 transition-colors py-0.5"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setSelectedColors(selectedColors.filter(c => c !== clr));
                              } else {
                                setSelectedColors([...selectedColors, clr]);
                              }
                            }}
                            className="w-4 h-4 rounded-md accent-red-600 border-neutral-300"
                          />
                          <span>{clr}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions (Matching Screenshot 3: Underlined REMOVE ALL link & bold APPLY button) */}
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 underline hover:text-red-600 transition-colors"
                >
                  REMOVE ALL
                </button>

                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-3 bg-red-600 hover:bg-neutral-950 text-white font-mono font-black text-xs uppercase tracking-widest transition-all text-center rounded-xl shadow-md"
                >
                  APPLY
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

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
