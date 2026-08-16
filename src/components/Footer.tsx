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
          
          {/* Brand Info Column */}
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

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-heading text-sm font-bold text-neutral-950 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              HELP & INFO
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              <Link href="/about" className="hover:text-red-600 transition-colors py-0.5">About Us</Link>
              <Link href="/faq" className="hover:text-red-600 transition-colors py-0.5">FAQ</Link>
              <Link href="/account" className="hover:text-red-600 transition-colors py-0.5">Track Order</Link>
            </div>
          </div>

          {/* Men's Footwear Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-sm font-bold text-neutral-950 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              MEN'S FOOTWEAR
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              {['Slippers', 'Flip-Flops', 'Slides', 'Sandals', 'Clogs', 'Casual Shoes', 'Sneakers', 'Loafers'].map((item) => (
                <Link key={item} href={`/men?type=${encodeURIComponent(item)}`} className="hover:text-red-600 transition-colors py-0.5">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Women's Footwear Column */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-heading text-sm font-bold text-neutral-950 dark:text-white uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 pb-2">
              WOMEN'S FOOTWEAR
            </h4>
            <div className="grid grid-cols-2 gap-1.5 text-xs font-mono text-neutral-700 dark:text-neutral-300">
              {['Slippers', 'Flip-Flops', 'Slides', 'Sandals', 'Flats', 'Casual Shoes', 'Sneakers', 'Heels'].map((item) => (
                <Link key={item} href={`/women?type=${encodeURIComponent(item)}`} className="hover:text-red-600 transition-colors py-0.5">
                  {item}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright & Subtle Theme Toggle */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} BLISS BALANCE. All rights reserved. Walk in Bliss. Live in Balance.</p>

          <div className="flex items-center gap-4">
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
