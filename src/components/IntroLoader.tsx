'use client';

import React, { useEffect, useState } from 'react';

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

    // Fast crisp flicker timer sequence
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1000);

    const unmountTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('bliss_balance_intro_seen', 'true');
    }, 1300);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Pure White Logo Emblem with Crisp Opacity Flicker (No red bg, no glow, no scaling) */}
      <div className="animate-[pureFlicker_0.3s_ease-in-out_infinite]">
        <img
          src="/Logo.svg"
          alt="Bliss Balance Intro Emblem"
          className="w-24 h-24 sm:w-28 sm:h-28 object-contain filter brightness-0 invert"
        />
      </div>

      <style jsx global>{`
        @keyframes pureFlicker {
          0% {
            opacity: 1;
          }
          20% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          60% {
            opacity: 0.15;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
