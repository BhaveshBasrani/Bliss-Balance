'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SkuCard } from './SkuCard';
import { FootwearSKU } from '@/lib/types';

interface ProductSliderProps {
  skus: FootwearSKU[];
  title?: string;
  subtitle?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  skus,
  title = "FEATURED DROPS",
  subtitle = "OFFICIAL FOOTWEAR LINEUP",
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);

  const totalItems = skus.length;

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;
    
    if (maxScroll > 0) {
      const progress = Math.min(Math.max(scrollLeft / maxScroll, 0), 1);
      setScrollProgress(progress);
      
      const itemWidth = 300; // Average card width + gap
      const index = Math.min(Math.floor(scrollLeft / itemWidth) + 1, totalItems);
      setCurrentIndex(Math.max(index, 1));
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll();
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [skus]);

  if (skus.length === 0) return null;

  return (
    <div className="w-full space-y-6 font-mono">
      {/* Top Controls Bar matching one8: Number Index, Arrows & Progress Slider Track */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-red-600 uppercase block">
            {subtitle}
          </span>
          <h3 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
            {title}
          </h3>
        </div>

        {/* ONE8 STYLE SLIDER CONTROLS & PROGRESS TRACK */}
        <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
          {/* Index Counter (e.g. 01 / 07) */}
          <div className="text-xs font-bold font-mono tracking-widest text-neutral-600 dark:text-neutral-400">
            <span className="text-neutral-950 dark:text-white font-black text-sm">
              {String(currentIndex).padStart(2, '0')}
            </span>
            <span className="mx-1 text-neutral-400">/</span>
            <span>{String(totalItems).padStart(2, '0')}</span>
          </div>

          {/* Left / Right Navigation Arrow Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all disabled:opacity-40"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ONE8 Horizontal Progress Bar Track with Active Handle Indicator */}
          <div className="w-28 sm:w-48 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full relative overflow-hidden shrink-0">
            <div
              className="absolute top-0 bottom-0 bg-red-600 rounded-full transition-all duration-150"
              style={{
                left: '0%',
                width: `${Math.max(scrollProgress * 100, 15)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-0.5"
      >
        {skus.map((sku) => (
          <div key={sku.id} className="w-[280px] sm:w-[320px] shrink-0">
            <SkuCard sku={sku} />
          </div>
        ))}
      </div>
    </div>
  );
};
