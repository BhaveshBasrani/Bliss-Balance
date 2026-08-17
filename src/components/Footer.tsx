'use client';

import React from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Truck, ShieldCheck, RefreshCw, Mail, MessageSquare, MapPin, ExternalLink, Facebook, Twitter, Youtube } from 'lucide-react';

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
          
          {/* Brand Info & Address Details */}
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

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm font-body">
              Bliss Balance is a modern Indian footwear brand combining soft comfort, contemporary style, lightweight construction, and dependable anti-skid grip for everyday life.
            </p>

            {/* Detailed Head Office Address Card */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-1.5 font-mono text-[11px]">
              <span className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> REGISTERED HEAD OFFICE ADDRESS
              </span>
              <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-semibold">
                Novel House, Iskon Temple, Road No. 1,<br />
                Muralidhar Bagh, Abids, Hyderabad,<br />
                Telangana 500012, India
              </p>
            </div>

            {/* Social Media Links */}
            <div className="pt-1 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 block">
                OFFICIAL SOCIAL CHANNELS
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/share/1Bhmz8KL1w/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-red-600 hover:border-red-600 transition-all"
                  aria-label="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/blissbalance_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-red-600 hover:border-red-600 transition-all"
                  aria-label="Twitter X Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@blissbalance_26?si=5xinn2mC-29ifst9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-red-600 hover:border-red-600 transition-all"
                  aria-label="YouTube Channel"
                >
                  <Youtube className="w-4 h-4" />
                </a>
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

          {/* Customer Help */}
          <div className="md:col-span-2 space-y-3 font-mono text-xs">
            <span className="font-bold text-neutral-950 dark:text-white uppercase tracking-widest block text-[11px]">
              CUSTOMER HELP
            </span>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
              <li><Link href="/account" className="hover:text-red-600 transition-colors">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-red-600 transition-colors">FAQ & Support</Link></li>
              <li><Link href="/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Official Contact & Amazon Store Details */}
          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="font-bold text-neutral-950 dark:text-white uppercase tracking-widest block text-[11px]">
              OFFICIAL CHANNELS
            </span>

            {/* Official Amazon Brand Store Badge Link */}
            <a
              href="https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3?lp_asin=B0GV6T919J&ref_=cm_sw_r_apann_ast_store_DTJ19G6CEXMFCXTTDYBR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-500 hover:text-black transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="font-black text-xs uppercase">AMAZON BRAND STORE</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* WhatsApp Direct Chat */}
            <a
              href="https://wa.me/919440961776?text=Hi%20Bliss%20Balance%20Team%2C%20I%20have%20a%20query"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all group"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 group-hover:text-white shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase">WhatsApp Support</span>
                <span className="text-xs font-mono font-black">+91 9440961776</span>
              </div>
            </a>

            {/* Official Gmail */}
            <a
              href="mailto:blissbalance.in@gmail.com"
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-red-600 hover:text-red-600 transition-all"
            >
              <Mail className="w-4 h-4 text-red-600 shrink-0" />
              <span className="text-xs font-mono font-bold">blissbalance.in@gmail.com</span>
            </a>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} BLISS BALANCE FOOTWEAR. HYDERABAD, TELANGANA 500012. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="hover:text-red-600 transition-colors">Terms of Service</Link>
            <Link href="/faq" className="hover:text-red-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>

    </footer>
  );
};
