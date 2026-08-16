'use client';

import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

export const IntroLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if user already saw intro loader in this browser session
    const hasSeenIntro = sessionStorage.getItem('bliss_balance_intro_seen');
    if (hasSeenIntro) {
      setVisible(false);
      return;
    }

    // Timer sequence for star flicker
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1100);

    const unmountTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('bliss_balance_intro_seen', 'true');
    }, 1450);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-350 pointer-events-none ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Rapid Star Flicker Container */}
      <div className="relative flex flex-col items-center gap-4 animate-[starFlicker_0.35s_ease-in-out_infinite_alternate]">
        
        {/* Ambient Star Flare Glow */}
        <div className="absolute inset-0 rounded-full bg-red-600/30 blur-2xl animate-pulse pointer-events-none" />

        {/* Central Logo Emblem */}
        <BrandLogo size="xl" className="shadow-2xl relative z-10" />

      </div>

      <style jsx global>{`
        @keyframes starFlicker {
          0% {
            opacity: 1;
            transform: scale(1);
            filter: drop-shadow(0 0 15px rgba(229, 9, 20, 0.9));
          }
          25% {
            opacity: 0.15;
            transform: scale(0.96);
            filter: drop-shadow(0 0 2px rgba(229, 9, 20, 0.2));
          }
          50% {
            opacity: 1;
            transform: scale(1.04);
            filter: drop-shadow(0 0 25px rgba(255, 255, 255, 1));
          }
          75% {
            opacity: 0.3;
            transform: scale(0.98);
            filter: drop-shadow(0 0 5px rgba(229, 9, 20, 0.4));
          }
          100% {
            opacity: 1;
            transform: scale(1.02);
            filter: drop-shadow(0 0 30px rgba(229, 9, 20, 1));
          }
        }
      `}</style>
    </div>
  );
};
