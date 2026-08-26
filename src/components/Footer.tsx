'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { BrandTitleText } from './BrandTitleText';
import { PaymentLogos } from './PaymentLogos';
import { Mail, MessageSquare, MapPin, ExternalLink, Facebook, Twitter, Youtube, Instagram, Sun, Moon, ArrowUp, Sparkles, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bliss_balance_theme');
      if (stored === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      localStorage.setItem('bliss_balance_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} className="w-full bg-white dark:bg-black text-brand-black dark:text-white border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300 font-body relative overflow-hidden select-none">
      
      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 lg:gap-14">
          
          {/* Brand Info & Story */}
          <div className="md:col-span-5 space-y-4 sm:space-y-5">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandLogo size="md" />
              <BrandTitleText size="md" showSubtitle={false} />
            </Link>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-md">
              Bliss Balance is a contemporary Indian footwear label engineered for all-day comfort, posture alignment, and dependable grip — crafted for modern everyday movement.
            </p>

            {/* Head Office Address */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs space-y-1.5 max-w-md">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-900 dark:text-white" /> Head Office
              </span>
              <p className="text-neutral-900 dark:text-neutral-200 font-medium leading-relaxed text-[11px] sm:text-xs">
                Novel House, Iskon Temple, Road No. 1, Muralidhar Bagh, Abids, Hyderabad, Telangana 500012, India
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {[
                { icon: Instagram, href: "https://www.instagram.com/blissbalance.co", label: "Instagram" },
                { icon: Facebook, href: "https://www.facebook.com/share/1Bhmz8KL1w/", label: "Facebook" },
                { icon: Twitter, href: "https://x.com/blissbalance_", label: "Twitter" },
                { icon: Youtube, href: "https://youtube.com/@blissbalance_26?si=5xinn2mC-29ifst9", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border border-neutral-200 dark:border-neutral-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Shop */}
            <div className="space-y-3 sm:space-y-4 text-xs">
              <span className="font-heading font-black text-sm tracking-tight text-neutral-950 dark:text-white uppercase block">
                Shop
              </span>
              <ul className="space-y-2 text-neutral-500 font-medium text-xs">
                <li><Link href="/men" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">Men&apos;s Lineup</Link></li>
                <li><Link href="/women" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">Women&apos;s Lineup</Link></li>
                <li><Link href="/collections/slippers" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">Ortho Slippers</Link></li>
                <li><Link href="/collections/slides" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">Comfort Slides</Link></li>
                <li><Link href="/collections/sandals" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">Ergonomic Sandals</Link></li>
                <li><Link href="/collections/sneakers" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">Street Sneakers</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div className="space-y-3 sm:space-y-4 text-xs">
              <span className="font-heading font-black text-sm tracking-tight text-neutral-950 dark:text-white uppercase block">
                Help & Info
              </span>
              <ul className="space-y-2 text-neutral-500 font-medium text-xs">
                <li><Link href="/faq" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">FAQ & Sizing</Link></li>
                <li><Link href="/care" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">Footwear Care</Link></li>
                <li><Link href="/about" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">About Us</Link></li>
                <li><Link href="/account" className="hover:text-black dark:hover:text-white transition-colors py-0.5 block">Order Tracking</Link></li>
              </ul>
            </div>
          </div>

          {/* Support & Newsletter */}
          <div className="md:col-span-3 space-y-3 sm:space-y-4 text-xs">
            <span className="font-heading font-black text-sm tracking-tight text-neutral-950 dark:text-white uppercase block">
              Support
            </span>

            <div className="space-y-2">
              {/* WhatsApp */}
              <a
                href="https://wa.me/919440961776?text=Hi%20Bliss%20Balance%20Team%2C%20I%20have%20a%20query"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-neutral-400 block uppercase font-mono">WhatsApp</span>
                    <span className="text-xs font-bold text-neutral-950 dark:text-white truncate block">+91 9440961776</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors shrink-0" />
              </a>

              {/* Email */}
              <a
                href="mailto:blissbalance.in@gmail.com"
                className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-neutral-950 dark:text-white shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-neutral-400 block uppercase font-mono">Email</span>
                    <span className="text-xs font-bold text-neutral-950 dark:text-white truncate block">blissbalance.in@gmail.com</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors shrink-0" />
              </a>

              {/* Newsletter Trigger */}
              <div className="p-3.5 bg-neutral-950 text-white dark:bg-neutral-900 border border-neutral-800 space-y-2 mt-3">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E60000]" />
                  <span className="font-heading font-black text-xs uppercase tracking-wider">
                    THE BLISS CLUB
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed font-body">
                  Secret drop dates, VIP access, and exclusive archival footwear perks.
                </p>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-newsletter-modal'))}
                  className="w-full py-2.5 px-3 bg-[#E60000] hover:bg-white hover:text-black text-white text-xs font-heading font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-[#E60000]"
                >
                  <span>JOIN CLUB & GET 10% OFF</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 sm:pt-10 mt-8 sm:mt-10 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400 text-center sm:text-left">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span className="font-mono text-[11px]">© {new Date().getFullYear()} BLISS BALANCE®. ALL RIGHTS RESERVED.</span>
            
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono font-bold text-neutral-900 dark:text-white hover:border-black dark:hover:border-white transition-all"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3 h-3 text-amber-400" />
                  <span>DARK</span>
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>LIGHT</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono font-bold text-neutral-900 dark:text-white hover:border-black dark:hover:border-white transition-all"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3 h-3" />
              <span>TOP</span>
            </button>
          </div>

          <PaymentLogos />
        </div>

      </div>

      {/* Huge Bliss Balance Text Bottom Stamp */}
      <div className="w-full overflow-hidden flex justify-center items-end mt-4 pointer-events-none select-none">
        <span className="font-heading font-black text-[12.5vw] sm:text-[13vw] leading-[0.75] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-white dark:from-neutral-800 dark:to-black whitespace-nowrap">
          BLISS BALANCE
        </span>
      </div>

    </footer>
  );
};
