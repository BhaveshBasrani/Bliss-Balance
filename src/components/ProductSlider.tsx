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
  title = "OFFICIAL FOOTWEAR CATALOG",
  subtitle = "FEEL THE BLISS • HIGH-PERFORMANCE SLIDER",
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
      
      const itemWidth = 330; // Average card width + gap
      const index = Math.min(Math.floor((scrollLeft + itemWidth / 2) / itemWidth) + 1, totalItems);
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
      el.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [skus]);

  if (skus.length === 0) return null;

  return (
    <div className="w-full space-y-8 font-mono select-none">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div className="space-y-1">
          <span className="text-[11px] font-black tracking-[0.25em] text-red-600 uppercase block">
            {subtitle}
          </span>
          <h3 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
            {title}
          </h3>
        </div>

        {/* Minimal Controls & Index Counter */}
        <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
          
          {/* Index Counter */}
          <div className="text-xs font-bold font-mono tracking-widest text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 px-3.5 py-2">
            <span className="text-red-600 font-black text-sm">
              {String(currentIndex).padStart(2, '0')}
            </span>
            <span className="mx-1.5 text-neutral-400">/</span>
            <span>{String(totalItems).padStart(2, '0')}</span>
          </div>

          {/* Left / Right Navigational Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="p-2.5 rounded-none bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2.5 rounded-none bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* SLEEK COMPACT HORIZONTAL SLIDER TRACK */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-2 px-1"
      >
        {(Array.isArray(skus) ? skus : []).map((sku) => (
          <div key={sku?.id || Math.random()} className="w-[230px] sm:w-[270px] shrink-0 snap-start">
            <SkuCard sku={sku} />
          </div>
        ))}
      </div>

    </div>
  );
};
