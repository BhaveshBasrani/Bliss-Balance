'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchModal } from '@/components/SearchModal';
import { HelpCircle, ChevronDown, ChevronUp, Mail, MessageSquare } from 'lucide-react';

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
      a: "Bliss Balance footwear is available on official partner marketplaces including Amazon India and Myntra with fast express delivery nationwide."
    },
    {
      q: "How do I choose the correct shoe size?",
      a: "Our footwear follows standard Indian/UK sizing. Check our size chart on product cards or choose your standard everyday footwear size."
    },
    {
      q: "What is your return & exchange policy?",
      a: "All purchases made via Amazon or partner marketplaces are covered by a 7-Day Easy Return & Size Exchange Policy."
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

        {/* Official Direct Contact Card */}
        <div className="p-6 rounded-3xl bg-neutral-900 text-white space-y-4 border border-neutral-800 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">
                STILL NEED HELP?
              </span>
              <h3 className="font-heading text-xl font-bold uppercase">
                CONTACT CUSTOMER SUPPORT
              </h3>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-3 py-1 rounded-full border border-emerald-700/60 self-start sm:self-auto">
              • ONLINE 24/7
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://wa.me/919440961776?text=Hi%20Bliss%20Balance%20Team%2C%20I%20have%20a%20query"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-700/80 text-white hover:bg-emerald-600 transition-all group"
            >
              <MessageSquare className="w-6 h-6 text-emerald-400 group-hover:text-white shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-300 block">WhatsApp Support</span>
                <span className="text-sm font-black tracking-wider">+91 9440961776</span>
              </div>
            </a>

            <a
              href="mailto:blissbalance.in@gmail.com"
              className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-white hover:border-red-600 hover:text-red-500 transition-all group"
            >
              <Mail className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase text-neutral-400 block">Official Support Email</span>
                <span className="text-xs font-bold tracking-wide">blissbalance.in@gmail.com</span>
              </div>
            </a>
          </div>
        </div>

      </main>

      <Footer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} skus={[]} />
    </div>
  );
}
