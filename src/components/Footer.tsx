'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Truck, ShieldCheck, RefreshCw, Mail, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-neutral-100 dark:bg-black text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300 font-body">
      
      {/* Brand Value Highlights */}
      <div className="border-b border-neutral-200 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white">
                  FAST PAN-INDIA SHIPPING
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Complimentary free shipping on all orders over ₹799 across India.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white">
                  CUSHIONED & ANTI-SKID
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Engineered with premium EVA and dependable outer soles for everyday life.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-950 dark:text-white">
                  7-DAY EASY RETURNS
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Hassle-free 7-day doorstep returns and size exchanges guaranteed.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandLogo size="md" />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                  BLISS BALANCE
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase font-bold">
                  Feel The Bliss
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              Bliss Balance is a modern Indian footwear brand combining soft comfort, contemporary style, lightweight construction, and dependable anti-skid grip for everyday life.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-neutral-500 block mb-2">
                JOIN THE BLISS CLUB
              </span>
              <div className="flex items-center gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter email for newsletter..."
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-white focus:outline-none focus:border-red-600"
                />
                <button className="px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider shrink-0 transition-all">
                  JOIN
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <span className="font-bold text-neutral-950 dark:text-white uppercase tracking-widest block text-[11px]">
              SHOP COLLECTION
            </span>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link href="/men" className="hover:text-red-600 transition-colors">Men's Footwear</Link></li>
              <li><Link href="/women" className="hover:text-red-600 transition-colors">Women's Footwear</Link></li>
              <li><Link href="/collections?cat=Slippers" className="hover:text-red-600 transition-colors">Slippers</Link></li>
              <li><Link href="/collections?cat=Slides" className="hover:text-red-600 transition-colors">Slides</Link></li>
              <li><Link href="/collections?cat=Sandals" className="hover:text-red-600 transition-colors">Sandals</Link></li>
              <li><Link href="/collections?cat=Clogs" className="hover:text-red-600 transition-colors">Clogs</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <span className="font-bold text-neutral-950 dark:text-white uppercase tracking-widest block text-[11px]">
              CUSTOMER HELP
            </span>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link href="/account" className="hover:text-red-600 transition-colors">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-red-600 transition-colors">FAQ & Support</Link></li>
              <li><Link href="/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
              <li><Link href="/admin" className="hover:text-red-600 transition-colors">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="font-bold text-neutral-950 dark:text-white uppercase tracking-widest block text-[11px]">
              OFFICIAL STORE
            </span>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
              Bliss Balance Head Office<br />
              New Delhi, India
            </p>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
              <Mail className="w-4 h-4 text-red-600" />
              <span>support@blissbalance.co</span>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} BLISS BALANCE FOOTWEAR. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-red-600 transition-colors">Terms of Service</Link>
            <Link href="/faq" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>

    </footer>
  );
};
