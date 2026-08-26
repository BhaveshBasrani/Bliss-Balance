'use client';

import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { PressMarquee } from '@/components/PressMarquee';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { NewsletterModal } from '@/components/NewsletterModal';
import { ProductSlider } from '@/components/ProductSlider';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BestsellerSection } from '@/components/BestsellerSection';
import { BrandLoadingScreen } from '@/components/BrandLoadingScreen';
import { LookbookSection } from '@/components/LookbookSection';
import { EditorialShowcase } from '@/components/EditorialShowcase';
import { EditorialCategoryGrid } from '@/components/EditorialCategoryGrid';
import { PressReviewSection } from '@/components/PressReviewSection';
import { SocialFeedSection } from '@/components/SocialFeedSection';
import { ElectricTicker } from '@/components/ElectricTicker';
import { getStoredSKUs, getStoredSettings, DEFAULT_SITE_SETTINGS, INITIAL_SKUS } from '@/lib/dataStore';
import { FootwearSKU, SiteSettings } from '@/lib/types';
import { ArrowRight, Plus, Flame } from 'lucide-react';
import Link from 'next/link';

interface HomePageClientProps {
  initialSkus?: FootwearSKU[];
  initialSettings?: SiteSettings;
}

export default function HomePageClient({ initialSkus, initialSettings }: HomePageClientProps) {
  const [skus, setSkus] = useState<FootwearSKU[]>(initialSkus && initialSkus.length > 0 ? initialSkus : INITIAL_SKUS);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || DEFAULT_SITE_SETTINGS);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'All' | 'Men' | 'Women'>('All');
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // ONLY fallback to local storage if the server completely failed to provide data.
    if (!initialSkus || initialSkus.length === 0) {
      const local = getStoredSKUs();
      if (local && local.length > 0) setSkus(local);
    }
    
    if (!initialSettings) {
      setSettings(getStoredSettings());
    }


    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 650);

    // Removed aggressive client-side fetchCloudSKUs and fetchCloudSettings.
    // The server handles fetching and caches via ISR (revalidate = 7200) to massively reduce Supabase egress.

    const loadData = () => {
      const updated = getStoredSKUs();
      if (updated && updated.length > 0) setSkus(updated);
    };

    const loadSettings = () => {
      setSettings(getStoredSettings());
    };

    window.addEventListener('skus-updated', loadData);
    window.addEventListener('settings-updated', loadSettings);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('skus-updated', loadData);
      window.removeEventListener('settings-updated', loadSettings);
    };
  }, []);

  const displayedSkus = skus.filter(s => {
    if (!s) return false;
    if (selectedTab === 'All') return true;
    const g = (s.gender || '').toLowerCase();
    const target = selectedTab.toLowerCase();
    return g === target || g === 'unisex';
  });

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-clip bg-[#FAFAF8] dark:bg-[#0A0A0A] text-brand-black dark:text-white transition-colors duration-300 select-none relative font-body">
      {/* Brand Splash Screen Intro Overlay */}
      {showSplash && (
        <div className="fixed inset-0 z-[99999] pointer-events-none transition-opacity duration-300">
          <BrandLoadingScreen message="FEEL THE BLISS • INITIALIZING STORE..." />
        </div>
      )}

      {/* Top Infinite Marquee Ticker */}
      <AnnouncementBar announcementText={settings.announcementText} />

      {/* Header Navbar */}
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1">
        {/* 1. Full-Bleed Editorial Hero Banner */}
        <HeroSection settings={settings} />

        {/* 2. High-Voltage Slogan Marquee (Comet / Gully Labs Style) */}
        <ElectricTicker />

        {/* 3. FEATURED SNEAKER & FOOTWEAR DROPS SLIDER */}
        <section className="py-16 sm:py-28 bg-white dark:bg-[#0E0E0E] border-b border-neutral-200/60 dark:border-neutral-800/60 transition-colors relative select-none">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-8 sm:space-y-14">
            
            {/* Header & Gender Filter Tabs */}
            <ScrollReveal direction="up">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-brand-stone uppercase flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> New Season Releases
                  </span>
                  <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-black dark:text-white">
                    Featured Drops
                  </h2>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto flex-wrap">
                  {/* Gender Filter Tabs */}
                  <div className="flex items-center gap-px bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
                    {(['All', 'Men', 'Women'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-5 py-2.5 text-xs font-heading font-black uppercase tracking-wider transition-all duration-200 ${
                          selectedTab === tab
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'text-brand-stone hover:text-brand-black dark:hover:text-white hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-brand-black dark:text-white hover:text-red-600 dark:hover:text-red-500 transition-colors"
                  >
                    <span>View All ({displayedSkus.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Product Slider Track */}
            {displayedSkus.length === 0 ? (
              <div className="text-center py-16 bg-[#F4F2EE] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <p className="text-brand-stone text-xs font-medium uppercase">
                  No products in this category yet
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-brand-black text-white font-semibold text-xs uppercase"
                >
                  <Plus className="w-4 h-4" /> Add First Footwear
                </Link>
              </div>
            ) : (
              <ScrollReveal direction="up">
                <ProductSlider skus={displayedSkus} title="" subtitle="" />
              </ScrollReveal>
            )}

          </div>
        </section>

        {/* 4. MID-ROLL 3D SNEAKER STACK SHOWCASE */}
        <EditorialShowcase />

        {/* 5. INTERACTIVE "SHOP THE LOOK" / LOOKBOOK WITH HOTSPOTS */}
        <LookbookSection />

        {/* 6. BEST SELLERS CURATED CAROUSEL */}
        <BestsellerSection skus={skus} />

        {/* 7. 2x2 DARK EDITORIAL CATEGORY TILES (COMET STYLE) */}
        <EditorialCategoryGrid />

        {/* 8. "WHAT THEY'RE SAYING?" LUXURY ON-FOOT REVIEW & PRESS LOGOS */}
        <PressReviewSection />

        {/* 9. "SHOP THE FEED" UGC SOCIAL REELS */}
        <SocialFeedSection />

        {/* 10. THE BLISS PROMISE — compact horizontal strip instead of repeated card grid */}
        <section className="py-12 sm:py-20 bg-white dark:bg-[#0E0E0E] border-b border-neutral-200/60 dark:border-neutral-800/60 select-none">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-neutral-200/70 dark:divide-neutral-800">
              {[
                { stat: '180g', label: 'Featherlight build per pair' },
                { stat: '7-Day', label: 'Easy no-questions returns' },
                { stat: '4.9★', label: 'Avg rating across all styles' },
                { stat: '100%', label: 'Non-toxic skin-safe materials' },
              ].map((item, i) => (
                <div key={i} className="px-4 sm:px-8 py-6 text-center first:pl-0 last:pr-0">
                  <p className="font-heading text-2xl sm:text-3xl font-black text-brand-black dark:text-white tracking-tight">{item.stat}</p>
                  <p className="text-xs text-brand-stone font-medium mt-1 leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. PARTNERS MARQUEE STRIP */}
        <PressMarquee />

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={skus} />
      <NewsletterModal initialOpenDelayMs={3500} />
    </div>
  );
}
