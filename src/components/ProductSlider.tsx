'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  title = '',
  subtitle = '',
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

      const index = Math.min(
        Math.round(progress * (totalItems - 1)) + 1,
        totalItems
      );
      setCurrentIndex(Math.max(index, 1));
    } else {
      setScrollProgress(0);
      setCurrentIndex(1);
    }
  }, [totalItems]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = window.innerWidth < 640 ? 180 : 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

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
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollLeft = 0;
      el.addEventListener('scroll', updateScrollState, { passive: true });
      updateScrollState();
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateScrollState);
    };
  }, [skus, updateScrollState]);

  if (totalItems === 0) return null;

  return (
    <div className="relative w-full space-y-4 sm:space-y-6 select-none overflow-hidden group/slider">
      
      {/* Header Controls */}
      <div className="flex items-end justify-between gap-4 pb-1">
        <div className="space-y-0.5">
          {subtitle && (
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
              {subtitle}
            </span>
          )}
          {title && (
            <h3 className="font-heading text-xl sm:text-3xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
              {title}
            </h3>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="text-[11px] sm:text-xs font-mono font-bold text-neutral-400">
            <span className="text-neutral-950 dark:text-white font-black">
              {String(currentIndex).padStart(2, '0')}
            </span>{' '}
            / {String(totalItems).padStart(2, '0')}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 sm:p-2.5 border transition-all ${
                canScrollLeft
                  ? 'border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
              }`}
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 sm:p-2.5 border transition-all ${
                canScrollRight
                  ? 'border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
              }`}
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL JOINED MODULAR TRACK */}
      <div className="relative border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex items-stretch gap-px overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory cursor-${
            isDragging ? 'grabbing' : 'grab'
          }`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {skus.map((sku, idx) => (
            <div
              key={sku?.id || idx}
              className="w-[170px] sm:w-[260px] md:w-[290px] shrink-0 snap-start bg-white dark:bg-[#0D0D0D]"
            >
              <SkuCard sku={sku} />
            </div>
          ))}
        </div>
      </div>

      {/* DYNAMIC PROGRESS SCRUBBER BAR */}
      <div className="relative w-full h-[2px] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
        <div
          className="h-full bg-black dark:bg-white transition-all duration-200 ease-out"
          style={{ width: `${Math.max(scrollProgress * 100, 10)}%` }}
        />
      </div>

    </div>
  );
};
