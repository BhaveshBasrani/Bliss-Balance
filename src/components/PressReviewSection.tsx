'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, CheckCircle, MessageSquare } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { fetchSupabaseReviews } from '@/lib/supabaseClient';
import { ProductReview } from '@/lib/types';

export const PressReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchSupabaseReviews().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setReviews(data);
      }
    });
  }, []);

  if (reviews.length === 0) {
    return null; // Zero fake reviews: remains cleanly hidden until real customers submit reviews
  }

  const activeReview = reviews[currentIndex];

  return (
    <section className="py-14 sm:py-24 bg-[#F7F6F2] dark:bg-[#0D0D0D] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#E60000] uppercase">
              Verified Customer Feedback
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
                src="/editorial-streets.png"
                alt="Bliss Balance Footwear"
                loading="lazy"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Active Product Tag */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex items-center justify-between px-3 py-2 bg-black/80 backdrop-blur-md border border-white/10 text-white">
                <div>
                  <span className="text-[9px] font-mono text-neutral-400 block uppercase">Product</span>
                  <p className="text-[11px] sm:text-xs font-heading font-bold uppercase">{activeReview.productId || 'Bliss Balance'}</p>
                </div>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(activeReview.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quote */}
            <div className="lg:col-span-7 p-4 sm:p-10 lg:p-14 flex flex-col justify-between gap-6 sm:gap-8">
              <div className="space-y-3 sm:space-y-5">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(activeReview.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                {activeReview.headline && (
                  <h3 className="font-heading text-lg sm:text-3xl font-black uppercase tracking-tight text-neutral-950 dark:text-white leading-tight">
                    &ldquo;{activeReview.headline}&rdquo;
                  </h3>
                )}
                <p className="text-xs sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                  &ldquo;{activeReview.comment}&rdquo;
                </p>
              </div>

              {/* Author + Nav */}
              <div className="flex items-center justify-between gap-4 pt-4 sm:pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-black text-xs sm:text-sm uppercase text-neutral-950 dark:text-white">
                      {activeReview.authorName}
                    </span>
                    {activeReview.verified && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle className="w-2.5 h-2.5" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-neutral-500 font-mono">
                    {activeReview.createdAt ? new Date(activeReview.createdAt).toLocaleDateString() : 'Verified Customer'}
                  </p>
                </div>

                {reviews.length > 1 && (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setCurrentIndex((p) => (p - 1 + reviews.length) % reviews.length)}
                      aria-label="Previous"
                      className="p-2 sm:p-2.5 border border-neutral-200 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentIndex((p) => (p + 1) % reviews.length)}
                      aria-label="Next"
                      className="p-2 sm:p-2.5 border border-neutral-200 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95"
                    >
                      <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};

