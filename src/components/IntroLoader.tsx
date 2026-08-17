'use client';

import React, { useEffect, useState } from 'react';

export const IntroLoader: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Crisp 0.9s flicker sequence on fresh page entry
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 900);

    const unmountTimer = setTimeout(() => {
      setVisible(false);
    }, 1200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-black flex items-center justify-center transition-opacity duration-300 pointer-events-none ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Pure White Logo Emblem (200% BIGGER & BOLDER) */}
      <div className="animate-[pureFlicker_0.3s_ease-in-out_infinite]">
        <img
          src="/Logo.svg"
          alt="Bliss Balance Intro Emblem"
          className="w-36 h-36 sm:w-48 sm:h-48 object-contain filter brightness-0 invert scale-125 sm:scale-150"
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
            opacity: 0.2;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
