'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Film, ShoppingBag, Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { getStoredSettings } from '@/lib/dataStore';

interface FeedItem {
  id: string;
  image: string;
  reelUrl?: string;
  productName: string;
  price: string;
  productUrl: string;
}

const DEFAULT_FEED_ITEMS: FeedItem[] = [
  {
    id: 'feed-1',
    image: 'https://m.media-amazon.com/images/I/71le81xHiYL._SL1500_.jpg',
    reelUrl: 'https://www.instagram.com/reel/Dcn8NTSBZeB/',
    productName: 'Bliss Balance BB158 Street Lows',
    price: '₹1,675',
    productUrl: '/product/BB158?color=NAVY_BLUE',
  },
  {
    id: 'feed-2',
    image: 'https://m.media-amazon.com/images/I/71MU0xqI6fL._SL1500_.jpg',
    reelUrl: 'https://www.instagram.com/reel/DcX2wpcoi9x/',
    productName: 'Bliss Balance BB156 Casual Sneaker',
    price: '₹669',
    productUrl: '/product/BB156?color=GREY',
  },
  {
    id: 'feed-3',
    image: 'https://m.media-amazon.com/images/I/71oIukw6OXL._SL1500_.jpg',
    reelUrl: 'https://www.instagram.com/reel/DcLmwH3Isf-/',
    productName: 'Bliss Balance BB924 Ortho Sandal',
    price: '₹949',
    productUrl: '/product/BB924',
  },
  {
    id: 'feed-4',
    image: 'https://m.media-amazon.com/images/I/71crmIFqqgL._SL1500_.jpg',
    reelUrl: 'https://www.instagram.com/reel/DY4eExUuJm1/',
    productName: 'Bliss Balance BB1105 Platform Slide',
    price: '₹1,447',
    productUrl: '/product/BB1105?color=BROWN',
  },
];

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  const clean = url.toLowerCase().split('?')[0];
  return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.includes('/video/');
}

function getInstagramEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  const match = clean.match(/\/(reel|p|tv)\/([A-Za-z0-9_-]+)/i);
  if (match && match[2]) {
    return `https://www.instagram.com/reel/${match[2]}/embed/`;
  }
  if (clean.includes('/embed')) {
    return clean;
  }
  if (/^[A-Za-z0-9_-]{11}$/.test(clean)) {
    return `https://www.instagram.com/reel/${clean}/embed/`;
  }
  return null;
}

interface ReelCardProps {
  item: FeedItem;
  isInView: boolean;
  mounted: boolean;
}

const ReelCard: React.FC<ReelCardProps> = ({ item, isInView, mounted }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const isVideo = isVideoUrl(item.reelUrl);
  const embedUrl = getInstagramEmbedUrl(item.reelUrl);

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  const toggleSound = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="group relative bg-neutral-950 aspect-[9/16] overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl flex flex-col justify-end select-none">
      
      {/* Top Sound Control (if video) */}
      {mounted && isVideo && (
        <div className="absolute top-0 right-0 z-20 p-3.5 flex items-center justify-end pointer-events-auto">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="w-8 h-8 rounded-full bg-black/80 hover:bg-red-600 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>
        </div>
      )}

      {/* Media Background / Video / Instagram Reel */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black flex items-center justify-center">
        {mounted && isVideo ? (
          <video
            ref={videoRef}
            src={item.reelUrl}
            poster={item.image}
            loop
            muted={isMuted}
            playsInline
            autoPlay
            preload="auto"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : mounted && embedUrl ? (
          <iframe
            src={embedUrl}
            className="w-full h-full border-0 bg-black"
            scrolling="no"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title={`Reel - ${item.productName}`}
          />
        ) : (
          <img
            src={item.image}
            alt={item.productName}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        )}

        {/* Subtle Bottom shadow for product card readability */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
      </div>

      {/* Bottom Tagged Product Card — Always Pinned at Bottom */}
      <div className="absolute inset-x-0 bottom-0 z-20 p-3 pointer-events-auto">
        <Link
          href={item.productUrl}
          className="flex items-center justify-between p-3 bg-white/95 dark:bg-black/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 hover:border-red-600 dark:hover:border-red-600 transition-all group/link shadow-xl"
        >
          <div className="min-w-0 pr-2">
            <p className="font-heading font-black text-xs uppercase text-neutral-950 dark:text-white truncate">
              {item.productName}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-heading font-black text-xs text-red-600">{item.price}</span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">• In Stock</span>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-black hover:bg-red-600 text-white dark:bg-white dark:text-black dark:hover:bg-red-600 dark:hover:text-white text-[10px] font-heading font-black uppercase tracking-wider flex items-center gap-1 transition-all shrink-0">
            <span>SHOP</span>
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

    </div>
  );
};

export const SocialFeedSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [feedItems, setFeedItems] = useState<FeedItem[]>(DEFAULT_FEED_ITEMS);

  useEffect(() => {
    setMounted(true);
    const s = getStoredSettings()?.media;
    if (s) {
      setFeedItems(DEFAULT_FEED_ITEMS.map((item, idx) => {
        const imgKey = `lookbook${idx + 1}Image` as keyof typeof s;
        const reelKey = `lookbook${idx + 1}ReelUrl` as keyof typeof s;
        return {
          ...item,
          image: s[imgKey] ? (s[imgKey] as string) : item.image,
          reelUrl: s[reelKey] ? (s[reelKey] as string) : item.reelUrl,
        };
      }));
    }

    const handleUpdate = () => {
      const updatedMedia = getStoredSettings()?.media;
      setFeedItems(DEFAULT_FEED_ITEMS.map((item, idx) => {
        const imgKey = `lookbook${idx + 1}Image` as keyof typeof updatedMedia;
        const reelKey = `lookbook${idx + 1}ReelUrl` as keyof typeof updatedMedia;
        return {
          ...item,
          image: (updatedMedia && updatedMedia[imgKey]) ? (updatedMedia[imgKey] as string) : item.image,
          reelUrl: (updatedMedia && updatedMedia[reelKey]) ? (updatedMedia[reelKey] as string) : item.reelUrl,
        };
      }));
    };
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);

  // IntersectionObserver to trigger in-view state on scroll
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-10 sm:py-24 bg-white dark:bg-[#0A0A0A] border-b border-neutral-200/60 dark:border-neutral-800/60 relative select-none">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-6 sm:space-y-12">
        
        {/* Header */}
        <ScrollReveal direction="up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.25em] text-[#E60000] uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Featured Style Reels
              </span>
              <h2 className="font-heading text-2xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                Shop The Feed
              </h2>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="sm:hidden text-[10px] font-mono text-neutral-400 uppercase font-bold flex items-center gap-1">
                Swipe drops 👉
              </span>
              <Link
                href="/collections"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <span>Explore All Styles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* DESKTOP: EXACT 100% ORIGINAL 4-COLUMN REELS GRID */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {feedItems.map((item, index) => (
            <ScrollReveal key={item.id} direction="up" delay={index * 0.07}>
              <ReelCard item={item} isInView={isInView} mounted={mounted} />
            </ScrollReveal>
          ))}
        </div>

        {/* MOBILE: SWIPEABLE TOUCH REELS CAROUSEL */}
        <div className="sm:hidden flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 no-scrollbar">
          {feedItems.map((item, index) => (
            <div key={item.id} className="w-[72vw] max-w-[280px] shrink-0 snap-center rounded-xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800">
              <ReelCard item={item} isInView={isInView} mounted={mounted} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


