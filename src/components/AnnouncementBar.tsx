'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Tag, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC<{ announcementText?: string }> = ({ announcementText }) => {
  const text = announcementText || 'FREE SHIPPING ON ORDERS OVER ₹799 • EASY 7-DAY RETURNS • NEW ARRIVALS DROP • COMFORT GUARANTEED • OFFICIAL STORE';

  // Duplicate items for seamless continuous marquee loop
  const tickerItems = [
    { icon: Truck, text: text },
    { icon: Tag, text: "SPECIAL LAUNCH OFFER: FREE SHIPPING ON ALL ORDERS OVER ₹799" },
    { icon: ShieldCheck, text: "CUSHIONED & ANTI-SKID FOOTWEAR GUARANTEE" },
    { icon: RefreshCw, text: "COMPLIMENTARY 7-DAY EASY RETURNS & EXCHANGES" },
    { icon: Sparkles, text: "NEW ARRIVALS: SLIDES, SANDALS & CLOGS LIVE NOW" },
  ];

  return (
    <div className="w-full bg-[#E50914] text-white text-[11px] font-mono tracking-widest uppercase font-bold py-2 overflow-hidden border-b border-red-800 shadow-sm relative z-30">
      <div className="flex whitespace-nowrap animate-marquee items-center gap-12">
        {tickerItems.concat(tickerItems).map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="inline-flex items-center gap-2 shrink-0">
              <Icon className="w-3.5 h-3.5" />
              <span>{item.text}</span>
              <span className="text-red-300 ml-6">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
