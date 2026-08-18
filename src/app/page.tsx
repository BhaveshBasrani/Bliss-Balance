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
import { ScrollReveal } from '@/components/ScrollReveal';
import { getStoredSKUs, getStoredSettings, fetchCloudSKUs, fetchCloudSettings, INITIAL_COLLECTIONS, DEFAULT_SITE_SETTINGS } from '@/lib/dataStore';
import { FootwearSKU, SiteSettings } from '@/lib/types';
import { ArrowRight, Zap, Plus, Cloud, ShieldCheck, Feather, Award, Star, CheckCircle } from 'lucide-react';
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

        {/* LIVE TRUST METRICS COUNTER BAR */}
        <section className="bg-neutral-100 dark:bg-neutral-950 border-b-2 border-neutral-900 dark:border-neutral-800 py-6 font-mono text-xs font-black uppercase">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <ScrollReveal direction="up" delay={0.05}>
              <div className="p-3 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="block text-xl font-heading font-black text-red-600">10,000+</span>
                <span className="text-[10px] text-neutral-500 font-bold">PAIRS DELIVERED ACROSS INDIA</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.1}>
              <div className="p-3 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="block text-xl font-heading font-black text-amber-500 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" /> 4.9 / 5.0
                </span>
                <span className="text-[10px] text-neutral-500 font-bold">PATRON SATISFACTION RATING</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.15}>
              <div className="p-3 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="block text-xl font-heading font-black text-emerald-600">7 DAYS</span>
                <span className="text-[10px] text-neutral-500 font-bold">HASSLE-FREE EASY RETURNS</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="p-3 bg-white dark:bg-black border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="block text-xl font-heading font-black text-neutral-950 dark:text-white">100%</span>
                <span className="text-[10px] text-neutral-500 font-bold">ORIGINAL CRAFTSMANSHIP</span>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 1. FOOTWEAR SHOWCASE */}
        <section className="relative py-16 bg-white dark:bg-black border-b-2 border-neutral-900 dark:border-neutral-800 font-mono overflow-hidden">
          
          {/* Subtle Background Brand Watermark Imprint */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.04] dark:opacity-[0.08] select-none">
            <span className="font-heading font-black text-[15rem] lg:text-[22rem] tracking-tighter uppercase text-black dark:text-white leading-none whitespace-nowrap">
              BLISS
            </span>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Brutalist Header & Gender Tabs */}
            <ScrollReveal direction="up">
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
            </ScrollReveal>

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
                {/* Standard Responsive Grid with ScrollReveal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayedSkus.slice(0, 4).map((sku, idx) => (
                    <ScrollReveal key={sku.id} direction="up" delay={idx * 0.1}>
                      <SkuCard sku={sku} />
                    </ScrollReveal>
                  ))}
                </div>

                {/* ONE8 STYLE HORIZONTAL SLIDER WITH PROGRESS TRACK & ARROWS */}
                {displayedSkus.length > 4 && (
                  <ScrollReveal direction="up">
                    <div className="pt-6 border-t-2 border-neutral-900 dark:border-neutral-800">
                      <ProductSlider
                        skus={displayedSkus.slice(4)}
                        title="EXPLORE TRENDING DROPS"
                        subtitle="SLIDER SHOWCASE • FEEL THE BLISS"
                      />
                    </div>
                  </ScrollReveal>
                )}
              </div>
            )}

            {/* View Catalog Action */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center pt-4">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-3 px-9 py-4 rounded-none bg-black text-white dark:bg-white dark:text-black font-black text-xs uppercase tracking-widest border-2 border-neutral-900 dark:border-white hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span>VIEW FULL CATALOG ({skus.length} PRODUCTS)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* 2. EXPLORE COLLECTIONS */}
        <CategoryGrid collections={INITIAL_COLLECTIONS} />

        {/* 3. "WHY BLISS BALANCE" 4-PILLAR INTERACTIVE NEO-BRUTALIST BENTO GRID */}
        <section className="relative py-16 bg-neutral-50 dark:bg-neutral-950 border-b-2 border-neutral-900 dark:border-neutral-800 font-mono overflow-hidden">
          
          {/* Faint Watermark Imprint */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.04] dark:opacity-[0.08] select-none">
            <span className="font-heading font-black text-[15rem] lg:text-[22rem] tracking-tighter uppercase text-black dark:text-white leading-none whitespace-nowrap">
              BALANCE
            </span>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <ScrollReveal direction="up">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <span className="text-xs font-black text-red-600 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> THE BLISS STANDARDS
                </span>
                <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                  ENGINEERED FOR <span className="text-red-600">EVERYDAY BALANCE</span>
                </h2>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <ScrollReveal direction="up" delay={0.1}>
                <div className="p-6 rounded-none bg-white dark:bg-black border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-none bg-red-600 text-white flex items-center justify-center border border-black shadow-sm">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white">
                    CLOUD COMFORT SOLE
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold">
                    Dual-density EVA memory cushioning designed to absorb impact and relieve heel pressure for 12+ hour all-day standing comfort.
                  </p>
                </div>
              </ScrollReveal>

              {/* Card 2 */}
              <ScrollReveal direction="up" delay={0.2}>
                <div className="p-6 rounded-none bg-white dark:bg-black border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-none bg-black text-white dark:bg-white dark:text-black flex items-center justify-center border border-black shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white">
                    ANTI-SKID DEPENDABILITY
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold">
                    Engineered anti-slip wave tread outsoles providing maximum friction and stable traction on wet tiles, polished stone, and asphalt.
                  </p>
                </div>
              </ScrollReveal>

              {/* Card 3 */}
              <ScrollReveal direction="up" delay={0.3}>
                <div className="p-6 rounded-none bg-white dark:bg-black border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-none bg-red-600 text-white flex items-center justify-center border border-black shadow-sm">
                    <Feather className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white">
                    FEATHERLIGHT BUILD
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold">
                    Ultralight construction weighing under 180 grams per footwear item for an effortless, weightless walking experience.
                  </p>
                </div>
              </ScrollReveal>

              {/* Card 4 */}
              <ScrollReveal direction="up" delay={0.4}>
                <div className="p-6 rounded-none bg-white dark:bg-black border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] space-y-4 hover:-translate-y-1 transition-transform">
                  <div className="w-12 h-12 rounded-none bg-black text-white dark:bg-white dark:text-black flex items-center justify-center border border-black shadow-sm">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white">
                    CRAFTED IN INDIA
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold">
                    Designed, engineered, and manufactured in India with premium grade non-toxic materials built to withstand daily Indian conditions.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 4. AS APPRECIATED ON PRESS MARQUEE (COMET STYLE) */}
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
