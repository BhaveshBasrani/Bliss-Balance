'use client';

import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { SkuCard } from '@/components/SkuCard';
import { ProductSlider } from '@/components/ProductSlider';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { IntroLoader } from '@/components/IntroLoader';
import { getStoredSKUs, getStoredSettings, fetchCloudSKUs, fetchCloudSettings, INITIAL_COLLECTIONS, DEFAULT_SITE_SETTINGS } from '@/lib/dataStore';
import { FootwearSKU, SiteSettings } from '@/lib/types';
import { ArrowRight, Zap, Plus } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'All' | 'Men' | 'Women'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const local = getStoredSKUs();
      setSkus(local);
      if (local && local.length > 0) {
        setLoading(false);
      }
    };

    loadData();
    setSettings(getStoredSettings());

    // Live Dynamic Cloud Fetch from Google Sheets
    fetchCloudSKUs().then(cloudSkus => {
      setSkus(cloudSkus);
      setLoading(false);
    }).catch(() => setLoading(false));

    fetchCloudSettings().then(cloudSettings => setSettings(cloudSettings));

    window.addEventListener('skus-updated', loadData);
    return () => window.removeEventListener('skus-updated', loadData);
  }, []);

  const displayedSkus = skus.filter(s => {
    if (selectedTab === 'All') return true;
    return s.gender === selectedTab || s.gender === 'Unisex';
  });

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300">
      {/* Comet Pitch Black Intro Loader */}
      <IntroLoader />

      {/* Top Infinite Marquee Ticker */}
      <AnnouncementBar announcementText={settings.announcementText} />

      {/* Header Navbar */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">
        {/* Full-Bleed Editorial Hero Banner */}
        <HeroSection settings={settings} />

        {/* 1. FOOTWEAR SHOWCASE (SHIFTED UP DIRECLY BELOW HERO) */}
        <section className="py-14 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Brutalist Header & Gender Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-red-600 uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> OFFICIAL DROPS
                </span>
                <h2 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tighter text-neutral-950 dark:text-white">
                  FEATURED <span className="text-red-600">FOOTWEAR</span>
                </h2>
              </div>

              {/* Minimal Brutalist Gender Tabs */}
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                {(['All', 'Men', 'Women'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                      selectedTab === tab
                        ? 'bg-red-600 text-white shadow-md'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid Stage */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 space-y-4">
                    <div className="aspect-square w-full rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                    <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  </div>
                ))}
              </div>
            ) : displayedSkus.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900/40 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-3">
                <p className="text-neutral-500 text-xs font-bold uppercase">
                  NO PRODUCTS ADDED YET
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" /> ADD FIRST FOOTWEAR
                </Link>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Standard Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayedSkus.slice(0, 4).map((sku) => (
                    <SkuCard key={sku.id} sku={sku} />
                  ))}
                </div>

                {/* ONE8 STYLE HORIZONTAL SLIDER WITH PROGRESS TRACK & ARROWS (IMAGE 1) */}
                {displayedSkus.length > 4 && (
                  <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
                    <ProductSlider
                      skus={displayedSkus.slice(4)}
                      title="EXPLORE TRENDING DROPS"
                      subtitle="SLIDER SHOWCASE • FEEL THE BLISS"
                    />
                  </div>
                )}
              </div>
            )}

            {/* View Catalog Action */}
            <div className="text-center pt-4">
              <Link
                href="/collections"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-black font-black text-xs uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-lg"
              >
                <span>VIEW FULL CATALOG ({skus.length} PRODUCTS)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* 2. EXPLORE COLLECTIONS (SHIFTED DOWN BELOW FOOTWEAR SHOWCASE) */}
        <CategoryGrid collections={INITIAL_COLLECTIONS} />

        {/* BRUTALIST BRAND QUOTE TICKER */}
        <section className="bg-red-600 text-white py-8 border-y border-red-700 overflow-hidden font-mono uppercase font-black tracking-widest text-lg sm:text-2xl text-center">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-4">
            <span>⚡ GOOD FOOTWEAR WILL TAKE YOU TO GOOD PLACES • FEEL THE BLISS ⚡</span>
          </div>
        </section>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={skus} />
    </div>
  );
}
