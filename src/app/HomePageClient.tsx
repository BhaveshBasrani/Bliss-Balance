'use client';

import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { PressMarquee } from '@/components/PressMarquee';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { ProductSlider } from '@/components/ProductSlider';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BestsellerSection } from '@/components/BestsellerSection';
import { BrandLoadingScreen } from '@/components/BrandLoadingScreen';
import { getStoredSKUs, getStoredSettings, fetchCloudSKUs, fetchCloudSettings, getStoredReviews, INITIAL_COLLECTIONS, DEFAULT_SITE_SETTINGS, INITIAL_SKUS } from '@/lib/dataStore';
import { FootwearSKU, SiteSettings, ProductReview } from '@/lib/types';
import { ArrowRight, Plus, Cloud, ShieldCheck, Feather, Award, Star, CheckCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface HomePageClientProps {
  initialSkus?: FootwearSKU[];
  initialSettings?: SiteSettings;
}

export default function HomePageClient({ initialSkus, initialSettings }: HomePageClientProps) {
  const [skus, setSkus] = useState<FootwearSKU[]>(initialSkus && initialSkus.length > 0 ? initialSkus : INITIAL_SKUS);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings || DEFAULT_SITE_SETTINGS);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
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

    setReviews(getStoredReviews());

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

    const loadReviews = () => {
      setReviews(getStoredReviews());
    };

    window.addEventListener('skus-updated', loadData);
    window.addEventListener('settings-updated', loadSettings);
    window.addEventListener('reviews-updated', loadReviews);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('skus-updated', loadData);
      window.removeEventListener('settings-updated', loadSettings);
      window.removeEventListener('reviews-updated', loadReviews);
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
        {/* Full-Bleed Editorial Hero Banner */}
        <HeroSection settings={settings} />

        {/* 1. FEATURED FOOTWEAR DROPS SLIDER SECTION */}
        <section className="py-12 sm:py-28 bg-white dark:bg-[#0E0E0E] border-b border-neutral-200/60 dark:border-neutral-800/60 transition-colors relative select-none">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-8 sm:space-y-16">
            
            {/* Header & Gender Tabs */}
            <ScrollReveal direction="up">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-[11px] font-medium tracking-[0.25em] text-brand-stone uppercase block font-body">
                    Official Drops
                  </span>
                  <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-black dark:text-white">
                    Featured Drops
                  </h2>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
                  {/* Gender Filter Tabs */}
                  <div className="flex items-center gap-1.5 bg-[#F4F2EE] dark:bg-neutral-900 p-1.5 rounded-full border border-neutral-200/60 dark:border-neutral-800">
                    {(['All', 'Men', 'Women'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setSelectedTab(tab)}
                        className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          selectedTab === tab
                            ? 'bg-brand-black text-white dark:bg-white dark:text-black shadow-xs'
                            : 'text-brand-stone hover:text-brand-black dark:hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <Link
                    href="/collections"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-black dark:text-white hover:text-brand-red dark:hover:text-brand-red transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Product Slider Track */}
            {displayedSkus.length === 0 ? (
              <div className="text-center py-16 bg-[#F4F2EE] dark:bg-neutral-950 rounded-3xl border border-neutral-200 dark:border-neutral-800 space-y-4">
                <p className="text-brand-stone text-xs font-medium uppercase">
                  No products in this category yet
                </p>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-black text-white font-semibold text-xs uppercase"
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

        {/* 2. EXPLORE COLLECTIONS GRID */}
        <CategoryGrid collections={INITIAL_COLLECTIONS} />

        {/* 3. BEST SELLERS SHOWCASE */}
        <BestsellerSection skus={skus} />

        {/* 4. THE BLISS STANDARDS / BRAND CRAFTSMANSHIP */}
        <section className="py-12 sm:py-32 bg-[#FAFAF8] dark:bg-[#0A0A0A] border-b border-neutral-200/60 dark:border-neutral-800/60 transition-colors relative select-none">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-12 sm:space-y-20">
            
            <div className="max-w-2xl space-y-3">
              <span className="text-[11px] font-medium tracking-[0.25em] text-brand-stone uppercase block font-body">
                The Bliss Standards
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-black dark:text-white leading-tight">
                Engineered for everyday balance.
              </h2>
              <p className="text-base text-brand-stone leading-relaxed font-medium">
                Every silhouette is thoughtfully engineered to combine orthopedic posture alignment, featherlight cushioning, and high-traction durability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              
              {/* Feature 01 */}
              <div className="p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200/70 dark:border-neutral-800/80 space-y-6 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F2EE] dark:bg-[#1C1C1C] flex items-center justify-center group-hover:bg-brand-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    <Cloud className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-black text-brand-stone font-heading">01</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-brand-black dark:text-white uppercase tracking-tight">
                    Cloud Comfort Sole
                  </h3>
                  <p className="text-sm text-brand-stone leading-relaxed">
                    Dual-density EVA bounce cushioning absorbs shock on every step, relieving pressure on heels and knees.
                  </p>
                </div>
              </div>

              {/* Feature 02 */}
              <div className="p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200/70 dark:border-neutral-800/80 space-y-6 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F2EE] dark:bg-[#1C1C1C] flex items-center justify-center group-hover:bg-brand-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-black text-brand-stone font-heading">02</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-brand-black dark:text-white uppercase tracking-tight">
                    Anti-Skid Wave Grip
                  </h3>
                  <p className="text-sm text-brand-stone leading-relaxed">
                    Engineered wave tread outsoles deliver maximum friction and stable footing on wet marble, tiles, and pavement.
                  </p>
                </div>
              </div>

              {/* Feature 03 */}
              <div className="p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200/70 dark:border-neutral-800/80 space-y-6 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F2EE] dark:bg-[#1C1C1C] flex items-center justify-center group-hover:bg-brand-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    <Feather className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-black text-brand-stone font-heading">03</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-brand-black dark:text-white uppercase tracking-tight">
                    Featherlight Build
                  </h3>
                  <p className="text-sm text-brand-stone leading-relaxed">
                    Ultralight construction weighing under 180 grams per shoe for an effortless, weightless all-day stride.
                  </p>
                </div>
              </div>

              {/* Feature 04 */}
              <div className="p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200/70 dark:border-neutral-800/80 space-y-6 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F2EE] dark:bg-[#1C1C1C] flex items-center justify-center group-hover:bg-brand-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-black text-brand-stone font-heading">04</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-bold text-brand-black dark:text-white uppercase tracking-tight">
                    Crafted in India
                  </h3>
                  <p className="text-sm text-brand-stone leading-relaxed">
                    Hand-finished and manufactured in India using non-toxic, skin-friendly materials built for daily endurance.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 5. VERIFIED PATRON REVIEWS SHOWCASE */}
        {reviews.length > 0 && (
          <section className="py-20 sm:py-28 bg-white dark:bg-[#0E0E0E] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-12 sm:space-y-16">
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[11px] font-medium tracking-[0.25em] text-brand-stone uppercase flex items-center gap-1.5 font-body">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Verified Customer Reviews
                  </span>
                  <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-brand-black dark:text-white">
                    Loved Across India
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-brand-stone">
                  <span className="px-4 py-2 rounded-full bg-[#F4F2EE] dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-brand-black dark:text-white shadow-xs">
                    ★ {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)} / 5.0 Rating ({reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.slice(0, 6).map((rev) => (
                  <div
                    key={rev.id}
                    className="p-8 rounded-3xl bg-[#FAFAF8] dark:bg-[#141414] border border-neutral-200/80 dark:border-neutral-800 space-y-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex text-amber-400 gap-1">
                          {[...Array(Math.max(1, Math.min(5, rev.rating)))].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                        {rev.verified && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200/60 dark:border-emerald-900/40">
                            <CheckCircle className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>

                      {rev.headline && (
                        <p className="font-heading text-base font-bold text-brand-black dark:text-white line-clamp-1">
                          {rev.headline}
                        </p>
                      )}

                      <p className="text-sm text-brand-stone leading-relaxed line-clamp-4">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                    </div>

                    <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-brand-black dark:text-white uppercase tracking-wider">{rev.authorName}</span>
                      <span className="text-[11px] text-brand-stone font-medium">{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. PARTNERS MARQUEE STRIP */}
        <PressMarquee />

        {/* 7. SEARCH ENGINE & AI KNOWLEDGE GRAPH AUTHORITY SECTION */}
        <section className="py-16 bg-[#FAFAF8] dark:bg-[#0A0A0A] border-t border-neutral-200/60 dark:border-neutral-800/60 text-brand-stone text-xs">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-8">
            <div className="space-y-3">
              <h2 className="font-heading text-base sm:text-lg font-black text-brand-black dark:text-white tracking-tight uppercase">
                Bliss Balance® — Official Online Footwear Store India
              </h2>
              <p className="leading-relaxed font-normal max-w-4xl text-sm">
                Bliss Balance (blissbalance.co) is a modern Indian footwear brand headquartered in Abids, Hyderabad. Engineered for all-day comfort, posture alignment, and anti-skid safety, Bliss Balance designs and manufactures doctor-recommended orthopedic slippers, cushioned slides, comfort sandals, waterproof clogs, and streetwear sneakers built for daily Indian conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60">
              <div className="space-y-2">
                <h3 className="font-heading text-xs font-bold text-brand-black dark:text-white uppercase tracking-wider">
                  Doctor & Ortho Slippers
                </h3>
                <p className="text-xs leading-relaxed text-brand-stone">
                  Engineered with bounce-back EVA footbeds and anatomical arch contouring to alleviate foot fatigue and heel pressure.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-xs font-bold text-brand-black dark:text-white uppercase tracking-wider">
                  Comfort Sandals & Slides
                </h3>
                <p className="text-xs leading-relaxed text-brand-stone">
                  Featuring adjustable straps, waterproof lightweight build, and handcrafted comfort chappals re-engineered with modern cushioning.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-xs font-bold text-brand-black dark:text-white uppercase tracking-wider">
                  Everyday Sneakers & Clogs
                </h3>
                <p className="text-xs leading-relaxed text-brand-stone">
                  Built for active living with breathable uppers, high-traction anti-skid wave outsoles, and durable shock absorption.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={skus} />
    </div>
  );
}
