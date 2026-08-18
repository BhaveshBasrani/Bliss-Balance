'use client';

import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { SkuCard } from '@/components/SkuCard';
import { ProductSlider } from '@/components/ProductSlider';
import { PressMarquee } from '@/components/PressMarquee';
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
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white transition-colors duration-300 select-none">
      {/* Comet Pitch Black Intro Loader */}
      <IntroLoader />

      {/* Top Infinite Marquee Ticker */}
      <AnnouncementBar announcementText={settings.announcementText} />

      {/* Header Navbar */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">
        {/* Full-Bleed Editorial Hero Banner */}
        <HeroSection settings={settings} />

        {/* 1. FOOTWEAR SHOWCASE */}
        <section className="py-16 bg-white dark:bg-black border-b-2 border-neutral-900 dark:border-neutral-800 font-mono">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Brutalist Header & Gender Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b-2 border-neutral-900 dark:border-neutral-800 pb-6">
              <div>
                <span className="text-xs font-black tracking-widest text-red-600 uppercase flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5" /> OFFICIAL DROPS
                </span>
                <h2 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tighter text-neutral-950 dark:text-white">
                  FEATURED <span className="text-red-600">FOOTWEAR</span>
                </h2>
              </div>

              {/* Minimal Brutalist Gender Tabs */}
              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 p-1.5 rounded-none border-2 border-neutral-900 dark:border-neutral-700">
                {(['All', 'Men', 'Women'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-5 py-2 rounded-none text-xs font-black uppercase tracking-widest transition-all border ${
                      selectedTab === tab
                        ? 'bg-red-600 text-white border-red-600 shadow-md'
                        : 'text-neutral-700 dark:text-neutral-300 border-transparent hover:border-neutral-900 dark:hover:border-neutral-100'
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
                  <div key={idx} className="rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-800 p-4 space-y-4">
                    <div className="aspect-square w-full rounded-none bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                    <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                    <div className="h-4 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                  </div>
                ))}
              </div>
            ) : displayedSkus.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-950 rounded-none border-2 border-neutral-900 dark:border-neutral-800 space-y-4">
                <p className="text-neutral-500 text-xs font-black uppercase">
                  NO PRODUCTS ADDED YET
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-red-600 text-white font-black text-xs uppercase border-2 border-red-600"
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

                {/* ONE8 STYLE HORIZONTAL SLIDER WITH PROGRESS TRACK & ARROWS */}
                {displayedSkus.length > 4 && (
                  <div className="pt-6 border-t-2 border-neutral-900 dark:border-neutral-800">
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
                className="inline-flex items-center gap-3 px-9 py-4 rounded-none bg-black text-white dark:bg-white dark:text-black font-black text-xs uppercase tracking-widest border-2 border-neutral-900 dark:border-white hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-lg"
              >
                <span>VIEW FULL CATALOG ({skus.length} PRODUCTS)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* 2. EXPLORE COLLECTIONS */}
        <CategoryGrid collections={INITIAL_COLLECTIONS} />

        {/* 3. AS APPRECIATED ON PRESS MARQUEE (COMET STYLE) */}
        <PressMarquee />

        {/* SUPREME HIGH-FASHION EDITORIAL MARQUEE STRIP */}
        <section className="bg-red-600 text-white py-6 border-y-2 border-neutral-900 dark:border-neutral-800 font-mono uppercase font-black tracking-[0.2em] text-xs sm:text-base text-center select-none shadow-md overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-1.5">
            <span>ENGINEERED FOR EVERYDAY BALANCE • PREMIUM CUSHIONED FOOTWEAR</span>
            <span className="text-white/95">CRAFTED IN INDIA</span>
          </div>
        </section>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={skus} />
    </div>
  );
}
