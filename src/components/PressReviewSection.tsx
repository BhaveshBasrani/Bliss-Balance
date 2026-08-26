'use client';

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface EditorialReview {
  id: string;
  headline: string;
  quote: string;
  author: string;
  location: string;
  product: string;
}

const EDITORIAL_REVIEWS: EditorialReview[] = [
  {
    id: 'rev-1',
    headline: '"Built for the long haul"',
    quote: 'Walked over 18,000 steps through ancient stone streets and airport terminals without an ounce of heel fatigue. The arch contouring is pure genius.',
    author: 'Aarav Mehta',
    location: 'Mumbai',
    product: 'Bliss Apex Street Runner',
  },
  {
    id: 'rev-2',
    headline: '"Doctor approved cushioning"',
    quote: 'As an orthopedic surgeon who stands for 8+ hours a day, the memory foam sole and wave traction provide unparalleled shock absorption. I recommend these to all my patients.',
    author: 'Dr. Radhika Sharma',
    location: 'Hyderabad',
    product: 'Bliss Ortho Doctor Slipper',
  },
  {
    id: 'rev-3',
    headline: '"Streetwear silhouette, sneaker comfort"',
    quote: 'People stop me at cafes to ask where I got these. The colorways rival international brands at triple the price. 10/10.',
    author: 'Karan Singhania',
    location: 'Bengaluru',
    product: 'Bliss X-Lows "Shadow Grey"',
  },
];

const PRESS_OUTLETS = ['VOGUE', 'GQ', 'COSMOPOLITAN', 'ELLE', 'ROLLING STONE', 'GRAZIA'];

export const PressReviewSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeReview = EDITORIAL_REVIEWS[currentIndex];

  return (
    <section className="py-14 sm:py-24 bg-[#F7F6F2] dark:bg-[#0D0D0D] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-neutral-500 uppercase">
              What They&apos;re Saying
            </span>
            <h2 className="font-heading text-2xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
              Loved Across India
            </h2>
          </div>
        </ScrollReveal>

        {/* Split Testimonial Card */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xl overflow-hidden">
            
            {/* Left: Photo */}
            <div className="lg:col-span-5 relative min-h-[240px] sm:min-h-[420px] bg-neutral-900 overflow-hidden">
              <img
                src="/editorial/review-onfoot.jpg"
                alt="Bliss Balance On-Foot"
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Active Product Tag */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-md border border-white/10 text-white">
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 block uppercase">Worn In</span>
                  <p className="text-[11px] sm:text-xs font-heading font-bold uppercase">{activeReview.product}</p>
                </div>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
            </div>

            {/* Right: Quote */}
            <div className="lg:col-span-7 p-4 sm:p-10 lg:p-14 flex flex-col justify-between gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <h3 className="font-heading text-lg sm:text-3xl font-black uppercase tracking-tight text-neutral-950 dark:text-white leading-tight">
                  {activeReview.headline}
                </h3>
                <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                  &ldquo;{activeReview.quote}&rdquo;
                </p>
              </div>

              {/* Author + Nav */}
              <div className="flex items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-xs sm:text-sm uppercase text-neutral-950 dark:text-white">
                      {activeReview.author}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-2.5 h-2.5" /> Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono">{activeReview.location}</p>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setCurrentIndex((p) => (p - 1 + EDITORIAL_REVIEWS.length) % EDITORIAL_REVIEWS.length)}
                    aria-label="Previous"
                    className="p-2 sm:p-2.5 border border-neutral-200 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentIndex((p) => (p + 1) % EDITORIAL_REVIEWS.length)}
                    aria-label="Next"
                    className="p-2 sm:p-2.5 border border-neutral-200 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
                  >
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* Press Strip */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="pt-2 space-y-4">
            <p className="text-center text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-neutral-400">
              As seen in
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-10 gap-y-3">
              {PRESS_OUTLETS.map((press) => (
                <span key={press} className="font-heading font-black text-base sm:text-2xl tracking-tighter text-neutral-300 dark:text-neutral-700 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-default">
                  {press}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
