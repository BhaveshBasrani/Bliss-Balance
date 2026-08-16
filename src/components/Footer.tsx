'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useTheme } from './ThemeProvider';

export const Footer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800 pt-16 pb-24 md:pb-16 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <BrandLogo size="sm" />
              <div>
                <span className="font-heading text-2xl font-black text-white tracking-tight block uppercase">
                  BLISS BALANCE
                </span>
                <span className="text-[9px] font-mono tracking-widest text-neutral-400 uppercase block">
                  Walk in Bliss. Live in Balance.
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Bliss Balance is a modern footwear brand created for people who believe everyday footwear should feel as good as it looks. We combine comfort, contemporary style, lightweight construction, and dependable grip.
            </p>
          </div>

          {/* Men's Footwear Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
              MEN'S FOOTWEAR
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {['Slippers', 'Flip-Flops', 'Slides', 'Sandals', 'Clogs', 'Casual Shoes', 'Sneakers', 'Loafers', 'Formal Footwear'].map((item) => (
                <Link key={item} href={`/men?type=${encodeURIComponent(item)}`} className="hover:text-red-500 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Women's Footwear Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider border-b border-neutral-800 pb-2">
              WOMEN'S FOOTWEAR
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {['Slippers', 'Flip-Flops', 'Slides', 'Sandals', 'Flats', 'Casual Shoes', 'Sneakers', 'Clogs', 'Heels'].map((item) => (
                <Link key={item} href={`/women?type=${encodeURIComponent(item)}`} className="hover:text-red-500 transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* SEO Text Paragraph */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 space-y-2 leading-relaxed">
          <p className="font-mono font-bold text-neutral-200 uppercase tracking-widest">
            BLISS BALANCE • EVERYDAY FOOTWEAR
          </p>
          <p>
            Bliss Balance offers everyday slippers, slides, sandals, clogs, casual walking shoes, sneakers, flats, and loafers for men and women. Engineered with soft cushioning, lightweight construction, and textured anti-skid outsoles, Bliss Balance footwear is designed for everyday stability at home, work, travel, and casual outings. Available on official marketplace partners including Amazon and Myntra.
          </p>
        </div>

        {/* Copyright & Subtle Theme Toggle at Footer End */}
        <div className="pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} BLISS BALANCE. All rights reserved. Walk in Bliss. Live in Balance.</p>

          <div className="flex items-center gap-4">
            {/* Small Subtle Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase"
              title="Toggle Theme Mode"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-neutral-300" />
                  <span>DARK MODE</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>LIGHT MODE</span>
                </>
              )}
            </button>

            {/* Subtle Admin Link */}
            <Link
              href="/admin"
              className="text-[10px] font-mono text-neutral-600 hover:text-neutral-400 flex items-center gap-1"
              title="Admin Portal"
            >
              <Lock className="w-3 h-3" /> Admin
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
