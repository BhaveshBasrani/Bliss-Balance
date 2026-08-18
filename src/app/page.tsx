'use client';

import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { SkuCard } from '@/components/SkuCard';
import { PressMarquee } from '@/components/PressMarquee';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { ProductSlider } from '@/components/ProductSlider';
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
                <span className="block text-xl font-heading font-black text-red-600">1,00,000+</span>
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

        {/* 1. FEATURED FOOTWEAR DROPS GRID */}
        <section className="py-20 sm:py-28 bg-white dark:bg-black border-b border-neutral-100 dark:border-neutral-900 transition-colors relative select-none">
          
          {/* Background Subtle Watermark */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] dark:opacity-[0.06] select-none">
            <span className="font-heading font-black text-[15rem] lg:text-[22rem] tracking-tighter uppercase text-black dark:text-white leading-none whitespace-nowrap">
              BLISS
            </span>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Header & Gender Tabs */}
            <ScrollReveal direction="up">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                <div className="space-y-1">
                  <span className="text-[11px] font-black tracking-[0.25em] text-red-600 uppercase flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> OFFICIAL DROPS
                  </span>
                  <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                    FEATURED <span className="text-red-600">FOOTWEAR</span>
                  </h2>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
                  {/* Gender Filter Tabs */}
                  <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 p-1.5 rounded-none border border-neutral-200 dark:border-neutral-800">
                    {(['All', 'Men', 'Women'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-4 py-1.5 rounded-none text-[11px] font-black uppercase tracking-widest transition-all ${
                          selectedTab === tab
                            ? 'bg-red-600 text-white'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-red-600'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Top Right VIEW ALL Link matching user screenshot */}
                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-red-600 hover:text-neutral-950 dark:hover:text-white transition-colors"
                  >
                    <span>VIEW ALL</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Compact Horizontal Product Slider */}
            {loading ? (
              <div className="flex gap-6 overflow-hidden animate-pulse">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="w-[260px] shrink-0 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-4 space-y-4">
                    <div className="aspect-square w-full rounded-none bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-4 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                    <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                  </div>
                ))}
              </div>
            ) : displayedSkus.length === 0 ? (
              <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-950 rounded-none border border-neutral-200 dark:border-neutral-800 space-y-4">
                <p className="text-neutral-500 text-xs font-black uppercase">
                  NO PRODUCTS ADDED YET
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-none bg-red-600 text-white font-black text-xs uppercase border border-red-600"
                >
                  <Plus className="w-4 h-4" /> ADD FIRST FOOTWEAR
                </Link>
              </div>
            ) : (
              <ScrollReveal direction="up">
                <ProductSlider skus={displayedSkus} title="" subtitle="" />
              </ScrollReveal>
            )}

            {/* Minimal Compact View Catalog Button */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="text-center pt-2">
                <Link
                  href="/collections"
                  className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-none bg-neutral-950 text-white dark:bg-white dark:text-black font-black text-[11px] uppercase tracking-widest border border-neutral-900 dark:border-white hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-sm"
                >
                  <span>VIEW FULL CATALOG ({skus.length} PRODUCTS)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[11px] font-black text-red-600 uppercase tracking-[0.25em] flex items-center justify-center gap-1.5">
                <CheckCircle className="w-4 h-4" /> THE BLISS STANDARDS
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                ENGINEERED FOR <span className="text-red-600">EVERYDAY BALANCE</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Card 1 */}
              <div className="p-6 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 space-y-4 font-mono">
                <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center">
                  <Cloud className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                  CLOUD COMFORT SOLE
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Dual-density EVA memory cushioning designed to absorb impact and relieve heel pressure for 12+ hour all-day standing comfort.
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 space-y-4 font-mono">
                <div className="w-10 h-10 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                  ANTI-SKID DEPENDABILITY
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Engineered anti-slip wave tread outsoles providing maximum friction and stable traction on wet tiles, polished stone, and asphalt.
                </p>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 space-y-4 font-mono">
                <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center">
                  <Feather className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                  FEATHERLIGHT BUILD
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Ultralight construction weighing under 180 grams per footwear item for an effortless, weightless walking experience.
                </p>
              </div>

              {/* Card 4 */}
              <div className="p-6 rounded-xl bg-neutral-50/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 space-y-4 font-mono">
                <div className="w-10 h-10 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                  CRAFTED IN INDIA
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Designed, engineered, and manufactured in India with premium grade non-toxic materials built to withstand daily Indian conditions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. AS APPRECIATED ON PRESS MARQUEE (COMET STYLE) */}
        <PressMarquee />

        {/* EDITORIAL MARQUEE STRIP */}
        <section className="bg-red-600 text-white py-6 border-y border-neutral-900 dark:border-neutral-800 font-mono uppercase font-black tracking-[0.2em] text-xs sm:text-base text-center select-none overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-1.5">
            <span>10 MILLION+ HAPPY CUSTOMERS • ENGINEERED FOR EVERYDAY BALANCE</span>
            <span className="text-white/95">CRAFTED IN INDIA</span>
          </div>
        </section>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={skus} />
    </div>
  );
}
