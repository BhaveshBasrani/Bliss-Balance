'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

interface FeedItem {
  id: string;
  image: string;
  handle: string;
  productName: string;
  price: string;
  productUrl: string;
}

import { getStoredSettings } from '@/lib/dataStore';

const DEFAULT_FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    image: '/feed/feed-bb158-1.png',
    handle: '@blissbalance.co',
    productName: 'Bliss BB158 Street Lows',
    price: '₹1,675',
    productUrl: '/product/BB158',
  },
  {
    id: 'feed-2',
    image: '/feed/feed-bb158-2.png',
    handle: '@streetwear.india',
    productName: 'Bliss BB158 Ivory Beige',
    price: '₹1,675',
    productUrl: '/product/BB158',
  },
  {
    id: 'feed-3',
    image: '/feed/feed-bb158-3.png',
    handle: '@urban.daily',
    productName: 'Bliss BB158 Cushion Outsole',
    price: '₹1,675',
    productUrl: '/product/BB158',
  },
  {
    id: 'feed-4',
    image: '/feed/feed-bb158-4.png',
    handle: '@sneakerhead_in',
    productName: 'Bliss BB158 Archive Edition',
    price: '₹1,675',
    productUrl: '/product/BB158',
  },
];

export const SocialFeedSection: React.FC = () => {
  const [feedItems, setFeedItems] = React.useState<FeedItem[]>(() => {
    const s = getStoredSettings()?.media;
    return DEFAULT_FEED_ITEMS.map((item, idx) => {
      const key = `lookbook${idx + 1}Image` as keyof typeof s;
      return s && s[key] ? { ...item, image: s[key] as string } : item;
    });
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      const s = getStoredSettings()?.media;
      setFeedItems(DEFAULT_FEED_ITEMS.map((item, idx) => {
        const key = `lookbook${idx + 1}Image` as keyof typeof s;
        return s && s[key] ? { ...item, image: s[key] as string } : item;
      }));
    };
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);
  return (
    <section className="py-16 sm:py-28 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 space-y-10 sm:space-y-14">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-neutral-400 uppercase flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5" /> Community Feed
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Shop The Feed
              </h2>
            </div>
            <a
              href="https://www.instagram.com/blissbalance.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              @blissbalance.co
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </ScrollReveal>

        {/* 4-Column Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200 dark:bg-neutral-800">
          {feedItems.map((item, index) => (
            <ScrollReveal key={item.id} direction="up" delay={index * 0.07}>
              <div className="group relative bg-neutral-900 aspect-[3/4] overflow-hidden">
                
                <img
                  src={item.image}
                  alt={item.productName}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 pointer-events-none" />

                {/* Instagram badge */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="w-7 h-7 bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white">
                    <Instagram className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Tagged Product Pill */}
                <div className="absolute inset-x-0 bottom-0 z-10">
                  <Link
                    href={item.productUrl}
                    className="flex items-center justify-between px-3 py-3 bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800 group/link hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-heading font-black text-[10px] sm:text-xs uppercase text-neutral-950 dark:text-white truncate">
                        {item.productName}
                      </p>
                      <span className="text-[9px] font-mono text-neutral-400 block">{item.handle}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-heading font-black text-[10px] text-neutral-950 dark:text-white">{item.price}</span>
                      <div className="w-6 h-6 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center group-hover/link:scale-110 transition-transform shrink-0">
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </Link>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
};
