'use client';

import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

export const IntroLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [flickerState, setFlickerState] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if user already saw intro loader in this browser session
    const hasSeenIntro = sessionStorage.getItem('bliss_balance_intro_seen');
    if (hasSeenIntro) {
      setVisible(false);
      return;
    }

    // Rapid sharp flicker sequence (Comet style: 0ms, 150ms, 300ms, 450ms, 600ms, 800ms)
    const timers: NodeJS.Timeout[] = [];

    timers.push(setTimeout(() => setFlickerState(false), 180));
    timers.push(setTimeout(() => setFlickerState(true), 320));
    timers.push(setTimeout(() => setFlickerState(false), 480));
    timers.push(setTimeout(() => setFlickerState(true), 650));
    timers.push(setTimeout(() => setFlickerState(true), 900));

    // Begin smooth fadeout after 1.5 seconds
    timers.push(
      setTimeout(() => {
        setFadeOut(true);
      }, 1500)
    );

    // Unmount from DOM after 1.9 seconds
    timers.push(
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('bliss_balance_intro_seen', 'true');
      }, 1900)
    );

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 pointer-events-none ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Rapid sharp flicker container */}
      <div
        className={`transition-opacity duration-75 ${
          flickerState ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <BrandLogo size="xl" className="shadow-2xl" />
      </div>
    </div>
  );
};
