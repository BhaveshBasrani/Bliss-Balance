'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Tag, Sparkles } from 'lucide-react';

export const AnnouncementBar: React.FC<{ announcementText?: string }> = ({ announcementText }) => {
  const customText = announcementText || 'FREE SHIPPING ON ORDERS OVER ₹799 • EASY 7-DAY RETURNS • CUSHIONED & ANTI-SKID FOOTWEAR • OFFICIAL STORE';

  const defaultAnnouncements = [
    customText,
    "FESTIVE LAUNCH OFFER: FREE SHIPPING ON ALL ORDERS OVER ₹799 PAN-INDIA",
    "CUSHIONED & ANTI-SKID FOOTWEAR — ENGINEERED FOR EVERYDAY COMFORT & BALANCE",
    "COMPLIMENTARY 7-DAY EASY RETURNS & REPLACEMENTS ON ALL PRODUCTS",
    "NEW ARRIVALS LIVE NOW: SLIDES, SANDALS, FLIP-FLOPS & CLOGS FOR MEN & WOMEN"
  ];

  return (
    <div className="w-full bg-[#E50914] text-white text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-extrabold py-2.5 overflow-hidden border-b border-red-800 shadow-xs relative z-30 select-none">
      <div className="animate-marquee flex whitespace-nowrap">
        
        {/* First Loop Column */}
        <div className="flex items-center space-x-10 pr-10">
          {defaultAnnouncements.map((item, idx) => (
            <span key={`l1-${idx}`} className="flex items-center space-x-3 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block shrink-0 animate-pulse" />
              <span className="hover:text-neutral-200 transition-colors">{item}</span>
            </span>
          ))}
        </div>

        {/* Second Identical Loop Column for Seamless Continuous Loop */}
        <div className="flex items-center space-x-10 pr-10">
          {defaultAnnouncements.map((item, idx) => (
            <span key={`l2-${idx}`} className="flex items-center space-x-3 text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block shrink-0 animate-pulse" />
              <span className="hover:text-neutral-200 transition-colors">{item}</span>
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};
