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

  // Parse dynamic ticker items by bullet points (•) or pipes (|)
  const dynamicItems = tickerText
    ? tickerText
        .split(/[•|]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  if (dynamicItems.length === 0) return null;

  return (
    <div className="w-full bg-brand-black dark:bg-black text-white/90 text-[10px] sm:text-[11px] font-body tracking-[0.15em] uppercase font-medium py-2 overflow-hidden border-b border-white/10 relative z-30 select-none">
      <div className="animate-marquee flex whitespace-nowrap">
        {[1, 2, 3, 4].map((loopIdx) => (
          <div key={`loop-col-${loopIdx}`} className="flex items-center space-x-10 pr-10 shrink-0">
            {dynamicItems.map((item, idx) => (
              <span key={`l${loopIdx}-${idx}`} className="flex items-center space-x-4 text-white/80">
                <span className="w-1 h-1 rounded-full bg-brand-red inline-block shrink-0" />
                <span className="hover:text-white transition-colors duration-200">{item}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
