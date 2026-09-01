'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, X, ArrowUpRight, Sparkles, ShoppingBag } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface LookbookItem {
  id: string;
  image: string;
  title: string;
  productName: string;
  price: string;
  originalPrice?: string;
  productUrl: string;
  thumbnail: string;
  hotspotX: number; // percentage from left
  hotspotY: number; // percentage from top
}

const DEFAULT_LOOKBOOK_ITEMS: LookbookItem[] = [
  {
    id: 'look-1',
    image: '/feed/feed-bb158-1.png',
    title: 'Street Culture Vol. 1',
    productName: 'Bliss BB158 Lows',
    price: '₹1,675',
    originalPrice: '₹4,499',
    productUrl: '/product/BB158',
    thumbnail: 'https://m.media-amazon.com/images/I/7154SuEEXoL._SL1500_.jpg',
    hotspotX: 28,
    hotspotY: 52,
  },
  {
    id: 'look-2',
    image: '/feed/feed-bb158-2.png',
    title: 'Archive Campaign',
    productName: 'Bliss BB158 Beige',
    price: '₹1,675',
    originalPrice: '₹4,499',
    productUrl: '/product/BB158',
    thumbnail: 'https://m.media-amazon.com/images/I/7154SuEEXoL._SL1500_.jpg',
    hotspotX: 60,
    hotspotY: 60,
  },
  {
    id: 'look-3',
    image: '/feed/feed-bb158-3.png',
    title: 'Urban Silhouette',
    productName: 'Bliss BB158 Outsole',
    price: '₹1,675',
    originalPrice: '₹4,499',
    productUrl: '/product/BB158',
    thumbnail: 'https://m.media-amazon.com/images/I/7154SuEEXoL._SL1500_.jpg',
    hotspotX: 65,
    hotspotY: 78,
  },
  {
    id: 'look-4',
    image: '/feed/feed-bb158-4.png',
    title: 'On-Foot Lookbook',
    productName: 'Bliss BB158 Street',
    price: '₹1,675',
    originalPrice: '₹4,499',
    productUrl: '/product/BB158',
    thumbnail: 'https://m.media-amazon.com/images/I/7154SuEEXoL._SL1500_.jpg',
    hotspotX: 42,
    hotspotY: 78,
  },
];

import { getStoredSettings } from '@/lib/dataStore';

export const LookbookSection: React.FC = () => {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [items, setItems] = useState<LookbookItem[]>(() => {
    const s = getStoredSettings()?.media;
    return DEFAULT_LOOKBOOK_ITEMS.map((item, idx) => {
      const key = `lookbook${idx + 1}Image` as keyof typeof s;
      return s && s[key] ? { ...item, image: s[key] as string } : item;
    });
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      const s = getStoredSettings()?.media;
      setItems(DEFAULT_LOOKBOOK_ITEMS.map((item, idx) => {
        const key = `lookbook${idx + 1}Image` as keyof typeof s;
        return s && s[key] ? { ...item, image: s[key] as string } : item;
      }));
    };
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);

  return (
    <section className="py-14 sm:py-24 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8 sm:space-y-12">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-neutral-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 2026 Archive Campaign
              </span>
              <h2 className="font-heading text-2xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Shop The Look
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 max-w-md font-medium">
              Editorial looks captured live on Indian streets featuring our latest drops.
            </p>
          </div>
        </ScrollReveal>

        {/* 2x2 on Mobile, 4-Col on Desktop Joined Modular Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
          {items.map((item, index) => {
            const isPopupOpen = activeHotspotId === item.id;
            const isNearRightEdge = item.hotspotX > 45;

            return (
              <ScrollReveal key={item.id} direction="up" delay={index * 0.08}>
                <div 
                  className="group relative bg-neutral-900 aspect-[3/4] sm:aspect-[2/3] overflow-hidden"
                  onMouseEnter={() => setActiveHotspotId(item.id)}
                >
                  {/* High Res Background Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-95"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 pointer-events-none" />

                  {/* Interactive Hotspot Pin + Contained Popover Box */}
                  <div
                    className="absolute z-20"
                    style={{ left: `${item.hotspotX}%`, top: `${item.hotspotY}%` }}
                  >
                    {/* Hotspot Pin Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspotId(isPopupOpen ? null : item.id);
                      }}
                      aria-label={`Inspect ${item.productName}`}
                      className="relative -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-black text-white hover:bg-[#E60000] hover:text-white border border-white sm:border-2 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 focus:outline-none z-10 cursor-pointer"
                    >
                      <span className="absolute inset-0 border border-white/60 sm:border-2 animate-ping pointer-events-none" />
                      {isPopupOpen ? (
                        <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      ) : (
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      )}
                    </button>

                    {/* Popover Card - Strictly Constrained with Smart Direction */}
                    {isPopupOpen && (
                      <div
                        className={`hidden sm:block absolute z-30 w-52 bg-black/95 text-white p-3 border-2 border-white shadow-2xl backdrop-blur-md animate-fade-in-up ${
                          isNearRightEdge
                            ? 'right-4 -translate-y-1/2'
                            : 'left-4 -translate-y-1/2'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Thumbnail */}
                          <div className="w-12 h-12 bg-white shrink-0 border border-neutral-700 flex items-center justify-center p-0.5">
                            <img
                              src={item.thumbnail}
                              alt={item.productName}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          {/* Details */}
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <h4 className="font-heading font-black text-[11px] uppercase tracking-tight text-white truncate">
                              {item.productName}
                            </h4>
                            
                            <div className="flex items-baseline gap-1.5 text-xs">
                              <span className="font-heading font-black text-white">{item.price}</span>
                              {item.originalPrice && (
                                <span className="text-[9px] text-neutral-400 line-through font-mono">{item.originalPrice}</span>
                              )}
                            </div>

                            <Link
                              href={item.productUrl}
                              className="inline-flex items-center gap-1 text-[9px] font-heading font-black uppercase text-[#E60000] hover:underline pt-0.5"
                            >
                              <span>Shop Now</span>
                              <ArrowUpRight className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Tag Bar */}
                  <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between p-2.5 sm:p-3.5 bg-black/85 backdrop-blur-md border-t border-white/10 text-white">
                    <div className="space-y-0.5 min-w-0 pr-1.5">
                      <span className="text-[8px] sm:text-[9px] font-mono uppercase text-neutral-400 block tracking-wider sm:tracking-widest truncate">
                        {item.title}
                      </span>
                      <p className="font-heading font-bold text-[10px] sm:text-xs uppercase truncate">
                        {item.productName}
                      </p>
                    </div>
                    <Link
                      href={item.productUrl}
                      className="p-1.5 sm:p-2 bg-white text-black hover:bg-[#E60000] hover:text-white transition-colors shrink-0 border border-black"
                      aria-label={`Shop ${item.productName}`}
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </Link>
                  </div>

                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
