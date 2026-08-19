'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Flame } from 'lucide-react';
import { SkuCard } from './SkuCard';
import { FootwearSKU } from '@/lib/types';
import Link from 'next/link';

interface ProductSliderProps {
  skus: FootwearSKU[];
  title?: string;
  subtitle?: string;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  skus,
  title = 'OFFICIAL FOOTWEAR CATALOG',
  subtitle = 'FEEL THE BLISS • HIGH-PERFORMANCE SLIDER',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const totalItems = Array.isArray(skus) ? skus.length : 0;

  const updateScrollState = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);

    if (maxScroll > 0) {
      const progress = Math.min(Math.max(scrollLeft / maxScroll, 0), 1);
      setScrollProgress(progress);

      // Smoothly maps progress proportionally from 1 all the way to totalItems (e.g. 14 / 14)
      const index = Math.min(
        Math.round(progress * (totalItems - 1)) + 1,
        totalItems
      );
      setCurrentIndex(Math.max(index, 1));
    } else {
      setScrollProgress(1);
      setCurrentIndex(totalItems);
    }
  }, [totalItems]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Mouse Drag to Scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag multiplier
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState, { passive: true });
      updateScrollState();
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateScrollState);
    };
  }, [skus, updateScrollState]);

  if (totalItems === 0) return null;

  return (
    <div className="relative w-full space-y-6 font-mono select-none overflow-hidden group/slider">
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 -left-20 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-20 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header Bar with Counter & Precision Controls */}
      {title || subtitle ? (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
          <div className="space-y-1">
            {subtitle && (
              <span className="text-[10px] sm:text-[11px] font-black tracking-[0.25em] text-red-600 uppercase flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-red-600 animate-pulse" /> {subtitle}
              </span>
            )}
            {title && (
              <h3 className="font-heading text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                {title}
              </h3>
            )}
          </div>

          {/* Minimal High-Tech Controls */}
          <div className="flex items-center gap-3 sm:gap-4 self-start sm:self-auto">
            {/* Index Counter Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-black text-neutral-900 dark:text-white shadow-xs">
              <span className="text-red-600 font-black text-sm">
                {String(currentIndex).padStart(2, '0')}
              </span>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-500">{String(totalItems).padStart(2, '0')}</span>
            </div>

            {/* Navigational Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                  canScrollLeft
                    ? 'bg-white dark:bg-black border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-xs hover:scale-105 active:scale-95'
                    : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 opacity-40 cursor-not-allowed'
                }`}
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                  canScrollRight
                    ? 'bg-white dark:bg-black border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-xs hover:scale-105 active:scale-95'
                    : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 opacity-40 cursor-not-allowed'
                }`}
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-3 pb-2">
          {/* Minimal High-Tech Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-black text-neutral-900 dark:text-white shadow-xs">
              <span className="text-red-600 font-black text-sm">
                {String(currentIndex).padStart(2, '0')}
              </span>
              <span className="text-neutral-400">/</span>
              <span className="text-neutral-500">{String(totalItems).padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                  canScrollLeft
                    ? 'bg-white dark:bg-black border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-xs hover:scale-105 active:scale-95'
                    : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 opacity-40 cursor-not-allowed'
                }`}
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                  canScrollRight
                    ? 'bg-white dark:bg-black border-neutral-300 dark:border-neutral-700 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 shadow-xs hover:scale-105 active:scale-95'
                    : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-400 opacity-40 cursor-not-allowed'
                }`}
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HORIZONTAL DRAGGABLE SLIDER TRACK WITH EDGE GRADIENTS */}
      <div className="relative">
        {/* Left Fade Gradient Mask */}
        {canScrollLeft && (
          <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-white dark:from-black to-transparent z-20 pointer-events-none transition-opacity duration-300" />
        )}

        {/* Right Fade Gradient Mask */}
        {canScrollRight && (
          <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-white dark:from-black to-transparent z-20 pointer-events-none transition-opacity duration-300" />
        )}

        {/* The Draggable Card Track */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-4 px-1 cursor-${
            isDragging ? 'grabbing' : 'grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {skus.map((sku, idx) => (
            <div
              key={sku?.id || idx}
              className="w-[240px] sm:w-[280px] shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1.5"
            >
              <SkuCard sku={sku} />
            </div>
          ))}
        </div>
      </div>

      {/* DYNAMIC PROGRESS SCRUBBER BAR */}
      <div className="relative w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-red-600 rounded-full transition-all duration-150 ease-out shadow-[0_0_8px_rgba(220,38,38,0.8)]"
          style={{ width: `${Math.max(scrollProgress * 100, 8)}%` }}
        />
      </div>

    </div>
  );
};

