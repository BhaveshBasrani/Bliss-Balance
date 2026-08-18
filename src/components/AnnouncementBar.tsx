'use client';

import React, { useState, useEffect } from 'react';
import { getStoredSettings, fetchCloudSettings } from '@/lib/dataStore';

interface AnnouncementBarProps {
  announcementText?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ announcementText }) => {
  const [tickerText, setTickerText] = useState<string>(
    announcementText || ''
  );

  useEffect(() => {
    const updateText = () => {
      if (announcementText) {
        setTickerText(announcementText);
        return;
      }
      const stored = getStoredSettings();
      if (stored && stored.announcementText) {
        setTickerText(stored.announcementText);
      }
    };

    updateText();

    // Fetch fresh cloud settings
    fetchCloudSettings().then((cloudSettings) => {
      if (cloudSettings && cloudSettings.announcementText) {
        setTickerText(cloudSettings.announcementText);
      }
    }).catch(() => {});

    window.addEventListener('settings-updated', updateText);
    return () => window.removeEventListener('settings-updated', updateText);
  }, [announcementText]);

  // Parse 100% COMPLETELY DYNAMIC ticker items by bullet points (•) or pipes (|)
  const dynamicItems = tickerText
    ? tickerText
        .split(/[•|]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  if (dynamicItems.length === 0) return null;

  return (
    <div className="w-full bg-[#E50914] text-white text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-extrabold py-2.5 overflow-hidden border-b border-red-800 shadow-xs relative z-30 select-none">
      <div className="animate-marquee flex whitespace-nowrap">
        
        {/* Quadrupled Columns for 100% Seamless Infinite Loop */}
        {[1, 2, 3, 4].map((loopIdx) => (
          <div key={`loop-col-${loopIdx}`} className="flex items-center space-x-10 pr-10 shrink-0">
            {dynamicItems.map((item, idx) => (
              <span key={`l${loopIdx}-${idx}`} className="flex items-center space-x-3 text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block shrink-0 animate-pulse" />
                <span className="hover:text-neutral-200 transition-colors">{item}</span>
              </span>
            ))}
          </div>
        ))}

      </div>
    </div>
  );
};
