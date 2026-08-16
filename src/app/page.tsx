'use client';

import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { KeyFeatures } from '@/components/KeyFeatures';
import { CategoryGrid } from '@/components/CategoryGrid';
import { SkuCard } from '@/components/SkuCard';
import { PhilosophySection } from '@/components/PhilosophySection';
import { BenefitsSection } from '@/components/BenefitsSection';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { IntroLoader } from '@/components/IntroLoader';
import { getStoredSKUs, getStoredSettings, INITIAL_COLLECTIONS, DEFAULT_SITE_SETTINGS } from '@/lib/dataStore';
import { FootwearSKU, SiteSettings } from '@/lib/types';
import { ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [skus, setSkus] = useState<FootwearSKU[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'All' | 'Men' | 'Women'>('All');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSkus(getStoredSKUs());
    setSettings(getStoredSettings());
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

        {/* Footwear Collections Grid */}
        <CategoryGrid collections={INITIAL_COLLECTIONS} />

        {/* Featured Products Section */}
        <section className="py-16 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header & Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase">
                  NEW ARRIVALS • EVERYDAY FOOTWEAR
                </span>
                <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                  FEATURED <span className="text-red-600">FOOTWEAR</span>
                </h2>
              </div>

              {/* Gender Filter Tabs */}
              <div className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-900 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                {(['All', 'Men', 'Women'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 rounded-lg font-mono text-xs font-bold uppercase tracking-wider transition-all ${
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

            {/* Product Cards Grid */}
            {!mounted || displayedSkus.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900/60 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-4 max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-2xl font-bold uppercase text-neutral-950 dark:text-white">
                  NO PRODUCTS ADDED YET
                </h3>
                <p className="font-mono text-xs text-neutral-500 max-w-md mx-auto">
                  Add footwear products, title, price, and Amazon/Myntra buy links in the Admin Control Panel.
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-md hover:bg-red-500 transition-all"
                >
                  Go to Admin Panel (/admin)
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayedSkus.map((sku) => (
                  <SkuCard key={sku.id} sku={sku} />
                ))}
              </div>
            )}

            {/* View All Button */}
            <div className="mt-12 text-center">
              <Link
                href="/collections"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-neutral-950 dark:bg-neutral-900 text-white font-mono font-extrabold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-md"
              >
                <span>EXPLORE ALL COLLECTIONS</span>
                <ArrowRight className="w-4 h-4 text-red-500" />
              </Link>
            </div>

          </div>
        </section>

        {/* Brand Key Differentiators */}
        <KeyFeatures />

        {/* Delivery & Service Benefit Pillars */}
        <BenefitsSection />

        {/* Brand Philosophy Quote */}
        <PhilosophySection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        skus={skus}
      />
    </div>
  );
}
