'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useTheme } from './ThemeProvider';

export const Footer: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <footer className="bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-300 border-t border-neutral-200 dark:border-neutral-800 pt-16 pb-24 md:pb-16 font-body transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info Column with BIG LOGO */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-4 group">
              <BrandLogo size="lg" className="group-hover:scale-105 transition-transform" />
              <div>
                <span className="font-heading text-2xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight block uppercase">
                  BLISS BALANCE
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 uppercase block font-semibold">
                  Walk in Bliss. Live in Balance.
                </span>
              </div>
            </Link>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              Bliss Balance is a modern footwear brand created for people who believe everyday footwear should feel as good as it looks. We combine comfort, contemporary style, lightweight construction, and dependable grip.
            </p>
          </div>

          {/* Men's Footwear Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-lg font-bold text-neutral-950 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              MEN'S FOOTWEAR
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              {['Slippers', 'Flip-Flops', 'Slides', 'Sandals', 'Clogs', 'Casual Shoes', 'Sneakers', 'Loafers', 'Formal Footwear'].map((item) => (
                <Link key={item} href={`/men?type=${encodeURIComponent(item)}`} className="hover:text-red-600 transition-colors py-1">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Women's Footwear Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-heading text-lg font-bold text-neutral-950 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              WOMEN'S FOOTWEAR
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              {['Slippers', 'Flip-Flops', 'Slides', 'Sandals', 'Flats', 'Casual Shoes', 'Sneakers', 'Clogs', 'Heels'].map((item) => (
                <Link key={item} href={`/women?type=${encodeURIComponent(item)}`} className="hover:text-red-600 transition-colors py-1">
                  {item}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* SEO Text Block */}
        <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
          <p className="font-mono font-bold text-neutral-900 dark:text-neutral-200 uppercase tracking-widest">
            BLISS BALANCE • EVERYDAY FOOTWEAR STORE
          </p>
          <p>
            Bliss Balance offers everyday slippers, slides, sandals, clogs, casual walking shoes, sneakers, flats, and loafers for men and women. Engineered with soft cushioning, lightweight construction, and textured anti-skid outsoles, Bliss Balance footwear is designed for everyday stability at home, work, travel, and casual outings. Available on official marketplace partners including Amazon and Myntra.
          </p>
        </div>

        {/* Copyright & Subtle Theme Toggle */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} BLISS BALANCE. All rights reserved. Walk in Bliss. Live in Balance.</p>

          <div className="flex items-center gap-4">
            {/* Small Subtle Theme Button */}
            <button
              onClick={toggleTheme}
              className="p-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-red-600 transition-all flex items-center gap-2 text-[11px] font-bold uppercase"
              title="Toggle Light / Dark Mode"
            >
              {theme === 'light' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-neutral-700" />
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
              className="text-[11px] font-mono text-neutral-400 hover:text-red-600 flex items-center gap-1"
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
