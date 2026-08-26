'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SkuCard } from '@/components/SkuCard';
import { SearchModal } from '@/components/SearchModal';
import { BrandLoadingScreen } from '@/components/BrandLoadingScreen';
import { getStoredSKUs, fetchCloudSKUs } from '@/lib/dataStore';
import { FootwearSKU, ColorVariant } from '@/lib/types';
import { ArrowUpDown, SlidersHorizontal, X, ChevronUp, Check, RotateCcw, Flame } from 'lucide-react';

export interface CollectionsClientProps {
  initialCategory?: string;
  initialGender?: string;
  initialFilter?: string;
  customTitle?: string;
  customBadge?: string;
}

export function CollectionsClient({
  initialCategory,
  initialGender,
  initialFilter,
  customTitle,
  customBadge,
}: CollectionsClientProps) {
  const searchParams = useSearchParams();
  const catParam = initialCategory || searchParams?.get('cat') || undefined;
  const filterParam = initialFilter || searchParams?.get('filter') || undefined;

  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(24);

  // Filter & Sort States
  const [selectedGenders, setSelectedGenders] = useState<string[]>(initialGender ? [initialGender] : []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(catParam ? [catParam] : []);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'trending' | 'bestsellers' | 'new' | 'price-high-low' | 'price-low-high'>(
    filterParam === 'bestseller' ? 'bestsellers' : filterParam === 'new' ? 'new' : 'trending'
  );

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

  useEffect(() => {
    if (initialGender) setSelectedGenders([initialGender]);
  }, [initialGender]);

  // Filtering Logic
  let filtered = safeSkus.filter((sku: FootwearSKU) => {
    if (!sku) return false;

    if (selectedGenders.length > 0) {
      const gMatch = selectedGenders.some(
        g => g.toLowerCase() === (sku.gender || '').toLowerCase() || (sku.gender || '').toLowerCase() === 'unisex'
      );
      if (!gMatch) return false;
    }

    if (selectedCategories.length > 0) {
      const cMatch = selectedCategories.some(
        c => c.toLowerCase() === (sku.category || '').toLowerCase()
      );
      if (!cMatch) return false;
    }

    if (selectedSizes.length > 0) {
      const sMatch = selectedSizes.some(sz => {
        const skuSizes = sku.sizes || [];
        return skuSizes.some((s: string) => s.toLowerCase().includes(sz.toLowerCase()));
      });
      if (!sMatch) return false;
    }

    if (selectedColors.length > 0) {
      const match = selectedColors.some(clr => {
        const hasColor = (sku.colorVariants || []).some((cv: ColorVariant) => (cv.name || '').toLowerCase().includes(clr.toLowerCase()));
        return hasColor || sku.title.toLowerCase().includes(clr.toLowerCase());
      });
      if (!match) return false;
    }

    if (filterParam === 'bestseller') {
      const hasBestsellers = skus.some(s => s.isBestseller);
      if (hasBestsellers && !sku.isBestseller) {
        return false;
      }
    }

    if (filterParam === 'new') {
      const hasNewArrivals = skus.some(s => s.isNewArrival);
      if (hasNewArrivals && !sku.isNewArrival) {
        return false;
      }
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

  const pageTitle = customTitle || (selectedCategories.length === 1 ? selectedCategories[0] : 'ALL FOOTWEAR');
  const badgeText = customBadge || 'BLISS BALANCE CATALOG';

  if (loading) {
    return <BrandLoadingScreen message="FEEL THE BLISS • LOADING CATALOG..." />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#FAFAF8] dark:bg-[#0A0A0A] text-neutral-900 dark:text-white font-mono select-none">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-[1400px] mx-auto px-5 sm:px-8 py-8 space-y-6 w-full">
        
        {/* Page Header */}
        <div className="space-y-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <span className="text-[10px] font-mono font-black tracking-widest text-neutral-400 uppercase">
            {badgeText}
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
            {pageTitle}
          </h1>
        </div>

        {/* TOP FILTER & SORT BAR */}
        <div className="flex items-center justify-between py-3 border-b border-neutral-200 dark:border-neutral-800 font-mono text-xs">
          
          {/* Active Count */}
          <div className="text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
            {filtered.length} {filtered.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
          </div>

          {/* Sort By & Filters Buttons */}
          <div className="flex items-center gap-6 relative">
            
            {/* SORT BY DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center gap-2 font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors py-1"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort By</span>
              </button>

              {/* SORT DROPDOWN POPUP */}
              {isSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsSortDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-neutral-900 border-2 border-black dark:border-white shadow-2xl z-40 py-2 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => { setSortOption('bestsellers'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'bestsellers' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5" /> Bestsellers
                      </span>
                      {sortOption === 'bestsellers' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortOption('trending'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'trending' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span>Trending</span>
                      {sortOption === 'trending' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortOption('new'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'new' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span>New Launches</span>
                      {sortOption === 'new' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortOption('price-high-low'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'price-high-low' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span>Price High → Low</span>
                      {sortOption === 'price-high-low' && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setSortOption('price-low-high'); setIsSortDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-between ${sortOption === 'price-low-high' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-700 dark:text-neutral-300'}`}
                    >
                      <span>Price Low → High</span>
                      {sortOption === 'price-low-high' && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* FILTERS DRAWER TRIGGER BUTTON */}
            <button
              type="button"
              onClick={() => setIsFilterDrawerOpen(true)}
              className="flex items-center gap-2 font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors py-1"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-black text-white dark:bg-white dark:text-black text-[9px] font-black px-1.5 py-0.5 leading-none">
                  {activeFilterCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* ACTIVE FILTER TAGS */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Active:
            </span>
            {selectedCategories.map(cat => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}
                  className="hover:opacity-60"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedGenders.map(g => (
              <span
                key={g}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase"
              >
                {g}
                <button
                  type="button"
                  onClick={() => setSelectedGenders(selectedGenders.filter(item => item !== g))}
                  className="hover:opacity-60"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedSizes.map(sz => (
              <span
                key={sz}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase"
              >
                UK {sz}
                <button
                  type="button"
                  onClick={() => setSelectedSizes(selectedSizes.filter(s => s !== sz))}
                  className="hover:opacity-60"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedColors.map(clr => (
              <span
                key={clr}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase"
              >
                {clr}
                <button
                  type="button"
                  onClick={() => setSelectedColors(selectedColors.filter(c => c !== clr))}
                  className="hover:opacity-60"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[10px] font-mono font-bold text-neutral-500 hover:text-black dark:hover:text-white uppercase tracking-wider ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        )}

        {/* MAIN CATALOG GRID */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-[#101010] border border-neutral-200 dark:border-neutral-800 space-y-4">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              NO FOOTWEAR MATCHES SELECTED FILTERS
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-6 py-3 bg-black hover:bg-[#E5FF00] hover:text-black text-white font-mono font-black text-xs uppercase tracking-widest transition-all border border-black"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.slice(0, visibleCount).map((sku) => (
                <SkuCard key={sku.id} sku={sku} />
              ))}
            </div>

            {/* Pagination */}
            {visibleCount < filtered.length && (
              <div className="text-center pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setVisibleCount(prev => prev + 24)}
                  className="px-8 py-3.5 bg-black hover:bg-[#E5FF00] hover:text-black text-white font-heading font-black text-xs uppercase tracking-widest transition-all border-2 border-black dark:border-white shadow-md"
                >
                  SHOW MORE ({filtered.length - visibleCount} REMAINING)
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* FILTER DRAWER MODAL */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsFilterDrawerOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-neutral-950 border-l-2 border-black dark:border-neutral-700 shadow-2xl flex flex-col font-mono">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h2 className="font-heading text-xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                    FILTERS
                  </h2>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">
                    {filtered.length} products available
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-2 border border-neutral-300 dark:border-neutral-700 hover:bg-black hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* SIZE GRID */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    <span>Size (UK)</span>
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
                          className={`py-2.5 text-xs font-black tracking-wider transition-all border ${
                            isSelected
                              ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm'
                              : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:border-black'
                          }`}
                        >
                          UK {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* CATEGORIES CHECKBOXES */}
                <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                    <span>Category</span>
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="space-y-2">
                    {allCategories.map((cat) => {
                      const count = skus.filter(s => s.category.toLowerCase() === cat.toLowerCase()).length;
                      const isChecked = selectedCategories.includes(cat);
                      return (
                        <label
                          key={cat}
                          className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-black dark:hover:text-white transition-colors py-0.5"
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
                              className="w-4 h-4 accent-black dark:accent-white border-neutral-300"
                            />
                            <span>{cat}</span>
                          </div>
                          <span className="text-neutral-400 text-[10px]">({count})</span>
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
                  <div className="space-y-2">
                    {['Men', 'Women', 'Kids', 'Unisex'].map((g) => {
                      const isChecked = selectedGenders.includes(g);
                      return (
                        <label
                          key={g}
                          className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-black dark:hover:text-white transition-colors py-0.5"
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
                              className="w-4 h-4 accent-black dark:accent-white border-neutral-300"
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
                          className="flex items-center gap-2.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-black dark:hover:text-white transition-colors py-0.5"
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
                            className="w-4 h-4 accent-black dark:accent-white border-neutral-300"
                          />
                          <span>{clr}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white underline transition-colors"
                >
                  RESET ALL
                </button>

                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="flex-1 py-3 bg-black hover:bg-[#E5FF00] hover:text-black text-white font-mono font-black text-xs uppercase tracking-widest transition-all text-center border-2 border-black dark:border-white shadow-md"
                >
                  APPLY FILTERS
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
