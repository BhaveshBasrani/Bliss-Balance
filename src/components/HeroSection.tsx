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

  // Auto-play interval timer (6 seconds)
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
      className="relative w-full bg-brand-black text-white select-none overflow-hidden touch-pan-y"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hero Container */}
      <div className="relative w-full flex flex-col sm:block sm:min-h-[600px] lg:min-h-[85vh] overflow-hidden">
        
        {/* Background Image */}
        <div className="relative w-full h-[280px] sm:absolute sm:inset-0 sm:h-full overflow-hidden bg-neutral-900">
          <picture>
            <source media="(max-width: 639px)" srcSet={mobileBg} />
            <img
              key={`hero-bg-${currentIndex}`}
              src={desktopBg}
              alt={activeSlide.titleText || 'Bliss Balance Footwear Hero'}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover object-center sm:object-right lg:object-center transition-all duration-1000 animate-fade-in"
            />
          </picture>
          {/* Gradient overlays removed as requested */}

          {/* Mobile slide dots */}
          {slides.length > 1 && (
            <div className="sm:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-[3px] rounded-full transition-all duration-500 ${
                    currentIndex === idx ? 'w-8 bg-white' : 'w-3 bg-white/30'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content Block */}
        <div className="relative z-20 max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-8 w-full sm:h-full sm:min-h-[600px] lg:min-h-[85vh] flex items-center py-6 sm:py-16">
          <div className="max-w-lg lg:max-w-xl space-y-4 sm:space-y-7">
            
            {/* Subtle badge */}
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-[10px] sm:text-[11px] font-body font-medium tracking-wider uppercase">
              {activeSlide.badgeText || 'Crafted in India'}
            </div>

            {/* Hero Title */}
            <h1 className="font-heading text-[1.65rem] sm:text-[2.75rem] lg:text-[3.5rem] font-black uppercase tracking-tight text-white leading-[1.12] sm:leading-[1.05]">
              {activeSlide.titleText || 'Step Into Perfect Balance.'}
            </h1>

            {/* Subtitle */}
            <p className="font-body text-white/70 text-[13px] sm:text-base leading-relaxed max-w-md">
              {activeSlide.subheadlineText || settings.heroSubheadline || 'Comfort-engineered footwear designed for everyday Indian life. Lightweight, anti-skid, and effortlessly stylish.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href={activeSlide.ctaLink || '/men'}
                className="group inline-flex items-center justify-center gap-1.5 px-5 py-3 sm:px-8 sm:py-4 rounded-full bg-white text-brand-black font-body font-bold text-[11px] sm:text-sm uppercase tracking-wider hover:bg-brand-red hover:text-white transition-all duration-300 text-center"
              >
                <span>{activeSlide.ctaText || 'Shop Men'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href={activeSlide.ctaLink2 || '/women'}
                className="group inline-flex items-center justify-center gap-1.5 px-5 py-3 sm:px-8 sm:py-4 rounded-full bg-transparent text-white font-body font-bold text-[11px] sm:text-sm uppercase tracking-wider border border-white/30 hover:bg-white hover:text-brand-black transition-all duration-300 text-center"
              >
                <span>{activeSlide.ctaText2 || 'Shop Women'}</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>

        {/* Desktop Carousel Controls */}
        {slides.length > 1 && (
          <div className="hidden sm:block">
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide progress line */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-[2px] rounded-full transition-all duration-500 ${
                    currentIndex === idx ? 'w-10 bg-white' : 'w-4 bg-white/30 hover:bg-white/60'
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
