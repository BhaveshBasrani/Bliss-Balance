'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStartX(null);
  };

  const activeSlide = slides[currentIndex] || slides[0];
  const desktopBg = activeSlide.desktopImageUrl || settings.heroImageUrl || '/hero-banner.png';
  const mobileBg = activeSlide.mobileImageUrl || settings.heroMobileImageUrl || '/hero-banner-mobile.png';

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section 
      className="relative w-full bg-black text-white select-none overflow-hidden touch-pan-y border-b border-neutral-800"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full min-h-[480px] sm:min-h-[580px] lg:min-h-0 lg:aspect-video flex flex-col justify-end sm:justify-center overflow-hidden">
        
        {/* Background Banner */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-950">
          <picture>
            <source media="(max-width: 639px)" srcSet={mobileBg} />
            <img
              key={`hero-bg-${currentIndex}`}
              src={desktopBg}
              alt={activeSlide.titleText || 'Bliss Balance Footwear Hero'}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover object-center transition-all duration-1000 animate-fade-in"
            />
          </picture>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/80 sm:via-black/30 sm:to-transparent" />

          {/* Mobile slide ticks */}
          {slides.length > 1 && (
            <div className="sm:hidden absolute top-4 right-4 z-20 flex items-center gap-1">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 transition-all duration-300 ${
                    currentIndex === idx ? 'w-6 bg-[#E5FF00]' : 'w-2 bg-white/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Block */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-4 sm:px-8 w-full pt-12 pb-10 sm:py-20">
          <div className="max-w-lg lg:max-w-2xl space-y-3 sm:space-y-6">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 bg-black/80 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-xs font-mono font-bold tracking-widest uppercase">
              {activeSlide.badgeText || 'CRAFTED IN INDIA • 2026 ARCHIVE'}
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08]">
              {activeSlide.titleText || 'STEP INTO PERFECT BALANCE.'}
            </h1>

            {/* Subhead */}
            <p className="font-body text-neutral-300 text-xs sm:text-base leading-relaxed max-w-md font-medium line-clamp-2 sm:line-clamp-none">
              {activeSlide.subheadlineText || settings.heroSubheadline || 'Comfort-engineered orthopedic footwear and cushioned silhouettes designed for everyday movement.'}
            </p>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-3 pt-2">
              <Link
                href={activeSlide.ctaLink || '/men'}
                className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-3 sm:px-9 sm:py-4 bg-[#E5FF00] text-black font-heading font-black text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest hover:bg-white hover:text-black transition-all duration-200 border-2 border-black text-center"
              >
                <span>{activeSlide.ctaText || 'SHOP MEN'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={activeSlide.ctaLink2 || '/women'}
                className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-3 sm:px-9 sm:py-4 bg-black text-white font-heading font-black text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest border-2 border-white hover:bg-white hover:text-black transition-all duration-200 text-center"
              >
                <span>{activeSlide.ctaText2 || 'SHOP WOMEN'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>

        {/* Desktop Controls */}
        {slides.length > 1 && (
          <div className="hidden sm:block">
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/60 hover:bg-black text-white border border-white/20 backdrop-blur-sm transition-all"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/60 hover:bg-black text-white border border-white/20 backdrop-blur-sm transition-all"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Progress line */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 transition-all duration-300 ${
                    currentIndex === idx ? 'w-10 bg-[#E5FF00]' : 'w-4 bg-white/30 hover:bg-white/60'
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
