'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes Bliss Balance footwear different?",
      a: "Bliss Balance combines soft cushioning, contemporary style, lightweight construction, and dependable anti-skid grip. Designed for everyday versatility — from home to work, travel, shopping, and casual outings."
    },
    {
      q: "Where can I buy Bliss Balance footwear?",
      a: "Bliss Balance footwear is available on official partner marketplaces including Amazon India and Flipkart with fast express delivery nationwide."
    },
    {
      q: "How do I choose the correct shoe size?",
      a: "Our footwear follows standard Indian/UK sizing. Check our size chart on product cards or choose your standard everyday footwear size."
    },
    {
      q: "What is your return & exchange policy?",
      a: "All purchases made via Amazon or Flipkart are covered by a 7-Day Easy Return & Size Exchange Policy."
    },
    {
      q: "Are Bliss Balance slippers and slides waterproof?",
      a: "Yes! Our slippers, slides, and clogs are built using water-resistant EVA and rubber compounds ideal for daily indoor, outdoor, and monsoon wear."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full">
        
        <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-8 text-center sm:text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-black uppercase text-neutral-950 dark:text-white">
            FAQ & <span className="text-red-600">HELP</span>
          </h1>
          <p className="font-body text-neutral-600 dark:text-neutral-400 text-sm max-w-xl">
            Everything you need to know about Bliss Balance footwear sizing, materials, shipping, and returns.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-heading text-base font-bold uppercase text-neutral-950 dark:text-white hover:text-red-600 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-red-600 shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-red-600" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 font-body text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-200/60 dark:border-neutral-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={[]} />
    </div>
  );
}
