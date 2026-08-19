'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, RotateCcw, ChevronLeft, ChevronRight, ShieldCheck, Flame } from 'lucide-react';
import { SiteSettings, HeroSlide } from '@/lib/types';
import { DEFAULT_HERO_SLIDES } from '@/lib/dataStore';

interface HeroSectionProps {
  settings: SiteSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings }) => {
  const slides: HeroSlide[] = (settings?.heroSlides && Array.isArray(settings.heroSlides) && settings.heroSlides.length > 0)
    ? settings.heroSlides
    : DEFAULT_HERO_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play interval timer (5 seconds)
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[currentIndex] || slides[0];

  const desktopBg = activeSlide.desktopImageUrl || settings.heroImageUrl || '/hero-banner.png';
  const mobileBg = activeSlide.mobileImageUrl || settings.heroMobileImageUrl || '/hero-banner-mobile.png';

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full bg-black text-white select-none border-b-2 border-neutral-900 overflow-hidden">
      {/* Unified Responsive Hero Carousel Container */}
      <div className="relative w-full flex flex-col sm:block min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] overflow-hidden">
        
        {/* Background Images with picture element for responsive resolution without DOM text duplication */}
        <div className="relative w-full h-[280px] sm:absolute sm:inset-0 sm:h-full overflow-hidden bg-neutral-900">
          <picture>
            <source media="(max-width: 639px)" srcSet={mobileBg} />
            <img
              key={`hero-bg-${currentIndex}`}
              src={desktopBg}
              alt={activeSlide.titleText || 'Bliss Balance Footwear Hero'}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover object-center sm:object-right lg:object-center transition-all duration-700 animate-in fade-in sm:zoom-in-95"
            />
          </picture>
          {/* Gradients */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/95 via-black/65 to-transparent pointer-events-none w-full max-w-3xl" />
          <div className="sm:hidden absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />

          {/* Mobile slide indicator dots */}
          {slides.length > 1 && (
            <div className="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-6 bg-red-600' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Single Unified Content Block */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full sm:h-full sm:min-h-[640px] lg:min-h-[720px] flex items-center py-6 sm:py-16">
          <div className="max-w-lg lg:max-w-xl space-y-4 sm:space-y-5 font-mono">
            
            {/* Dynamic Badge */}
            <div className="inline-flex items-center px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-black/85 backdrop-blur-xs border border-red-600/80 text-white text-[9px] sm:text-xs font-mono font-black tracking-widest uppercase">
              <span>{activeSlide.badgeText || 'FEEL THE BLISS • MADE IN INDIA'}</span>
            </div>

            {/* Dynamic Title - Single H1 Tag */}
            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-tight sm:leading-[0.95] sm:[text-shadow:_0_2px_12px_rgb(0_0_0_/_95%)]">
              {activeSlide.titleText || 'BLISS BALANCE® — BUILT FOR THE ONES BALANCING LIFE.'}
            </h1>

            {/* Dynamic Subheadline */}
            <p className="font-mono text-neutral-300 text-xs sm:text-sm leading-relaxed font-bold max-w-md">
              {activeSlide.subheadlineText || settings.heroSubheadline || 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.'}
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-row gap-2.5 sm:gap-3.5 pt-2 sm:pt-4 font-mono">
              <Link
                href={activeSlide.ctaLink || '/men'}
                className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 px-4 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-red-600 hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest border border-red-600 transition-all duration-200 shadow-md"
              >
                <span>{activeSlide.ctaText || 'EXPLORE MEN'}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/women"
                className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 sm:gap-3 px-4 py-3.5 sm:px-8 sm:py-4 rounded-xl bg-black/80 hover:bg-white hover:text-black text-white font-black text-xs uppercase tracking-widest border border-neutral-700 hover:border-white transition-all duration-200 backdrop-blur-xs"
              >
                <span>EXPLORE WOMEN</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Micro Feature Highlights */}
            <div className="pt-2 sm:pt-4 flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs font-mono font-bold text-neutral-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>100% ORIGINAL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>FREE DELIVERY</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span>ANTI-SKID SOLES</span>
              </div>
            </div>

          </div>
        </div>

        {/* Desktop Carousel Controls (Arrows + Dots) */}
        {slides.length > 1 && (
          <div className="hidden sm:block">
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-all border border-neutral-800"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-all border border-neutral-800"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-8 bg-red-600' : 'w-2 bg-white/40 hover:bg-white'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
