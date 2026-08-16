'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw } from 'lucide-react';

export const AnnouncementBar: React.FC<{ announcementText?: string }> = ({ announcementText }) => {
  const text = announcementText || 'FREE SHIPPING ON ORDERS OVER ₹799 • COMFORT-FOCUSED FOOTWEAR • EASY 7-DAY RETURNS • OFFICIAL BRAND STORE';

  return (
    <div className="w-full bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white text-[11px] font-mono tracking-wider font-semibold py-2 px-4 overflow-hidden border-b border-red-900/50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Desktop Highlights */}
        <div className="hidden md:flex items-center justify-center gap-8 w-full">
          <span className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5" /> FREE SHIPPING ON ORDERS OVER ₹799
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" /> COMFORT & SUPPORT GUARANTEED
          </span>
          <span className="text-red-300">•</span>
          <span className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> EASY 7-DAY RETURN POLICY
          </span>
        </div>

        {/* Mobile Ticker */}
        <div className="md:hidden flex items-center justify-center w-full text-center truncate">
          <span className="truncate flex items-center justify-center gap-2">
            <Truck className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{text}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
