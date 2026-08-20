'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { BrandTitleText } from './BrandTitleText';
import { PaymentLogos } from './PaymentLogos';
import { Mail, MessageSquare, MapPin, ExternalLink, Facebook, Twitter, Youtube, Instagram, Sun, Moon, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const animationFrameRef = useRef<number | null>(null);

  const barCount = 23;

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

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
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

  // Animated wave effect from animated-footer
  useEffect(() => {
    let t = 0;

    const animateWave = () => {
      const waveElements = waveRefs.current;
      let offset = 0;

      waveElements.forEach((element, index) => {
        if (element) {
          offset += Math.max(0, 20 * Math.sin((t + index) * 0.3));
          element.style.transform = `translateY(${index + offset}px)`;
        }
      });

      t += 0.1;
      animationFrameRef.current = requestAnimationFrame(animateWave);
    };

    if (isVisible) {
      animateWave();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isVisible]);

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

            <p className="text-xs sm:text-sm text-brand-stone leading-relaxed max-w-md">
              Bliss Balance is a contemporary Indian footwear label engineered for all-day comfort, posture alignment, and dependable grip — crafted for modern everyday movement.
            </p>

            {/* Head Office Address */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-brand-warm dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs space-y-1.5 max-w-md">
              <span className="text-[10px] font-medium text-brand-stone uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-red" /> Head Office
              </span>
              <p className="text-brand-black dark:text-white font-medium leading-relaxed text-[11px] sm:text-xs">
                Novel House, Iskon Temple, Road No. 1, Muralidhar Bagh, Abids, Hyderabad, Telangana 500012, India
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <a
                href="https://www.instagram.com/blissbalance.co?igsh=MWJpbmRpNGxnOW83NA=="
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-brand-black dark:hover:border-white transition-colors touch-manipulation"
                aria-label="Instagram Official Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1Bhmz8KL1w/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-brand-black dark:hover:border-white transition-colors touch-manipulation"
                aria-label="Facebook Page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/blissbalance_"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-brand-black dark:hover:border-white transition-colors touch-manipulation"
                aria-label="Twitter X Profile"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@blissbalance_26?si=5xinn2mC-29ifst9"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-brand-black dark:hover:border-white transition-colors touch-manipulation"
                aria-label="YouTube Channel"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 2-Column Links on Mobile / Columns on Desktop */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
            {/* Shop Collection Links */}
            <div className="space-y-3 sm:space-y-4 text-xs">
              <span className="font-heading font-bold text-sm tracking-tight text-brand-black dark:text-white uppercase block">
                Shop
              </span>
              <ul className="space-y-2 text-brand-stone font-medium text-xs">
                <li><Link href="/men" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">Men&apos;s</Link></li>
                <li><Link href="/women" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">Women&apos;s</Link></li>
                <li><Link href="/collections/slippers" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">Slippers</Link></li>
                <li><Link href="/collections/slides" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">Slides</Link></li>
                <li><Link href="/collections/sandals" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">Sandals</Link></li>
                <li><Link href="/collections/casual-shoes" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">Sneakers</Link></li>
              </ul>
            </div>

            {/* Customer Help & Company Links */}
            <div className="space-y-3 sm:space-y-4 text-xs">
              <span className="font-heading font-bold text-sm tracking-tight text-brand-black dark:text-white uppercase block">
                Help
              </span>
              <ul className="space-y-2 text-brand-stone font-medium text-xs">
                <li><Link href="/faq" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">FAQ & Sizing</Link></li>
                <li><Link href="/care" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">Footwear Care</Link></li>
                <li><Link href="/about" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">About Us</Link></li>
                <li><Link href="/account" className="hover:text-brand-black dark:hover:text-white transition-colors py-0.5 block touch-manipulation">Order Tracking</Link></li>
              </ul>
            </div>
          </div>

          {/* Direct Support & Store Links */}
          <div className="md:col-span-3 space-y-3 sm:space-y-4 text-xs">
            <span className="font-heading font-bold text-sm tracking-tight text-brand-black dark:text-white uppercase block">
              Support
            </span>

            <div className="space-y-2">
              {/* WhatsApp */}
              <a
                href="https://wa.me/919440961776?text=Hi%20Bliss%20Balance%20Team%2C%20I%20have%20a%20query"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-warm dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-brand-black dark:hover:border-white transition-all duration-200 group touch-manipulation"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-brand-stone block uppercase font-medium">WhatsApp</span>
                    <span className="text-xs font-semibold text-brand-black dark:text-white truncate block">+91 9440961776</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-brand-stone group-hover:text-brand-black dark:group-hover:text-white transition-colors shrink-0" />
              </a>

              {/* Email */}
              <a
                href="mailto:blissbalance.in@gmail.com"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-warm dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-brand-black dark:hover:border-white transition-all duration-200 group touch-manipulation"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-brand-red shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] text-brand-stone block uppercase font-medium">Email</span>
                    <span className="text-xs font-semibold text-brand-black dark:text-white truncate block">blissbalance.in@gmail.com</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-brand-stone group-hover:text-brand-black dark:group-hover:text-white transition-colors shrink-0" />
              </a>

              {/* Amazon Brand Store */}
              <a
                href="https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-brand-warm dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-brand-black dark:hover:border-white transition-all duration-200 group touch-manipulation"
              >
                <span className="text-xs font-semibold text-brand-black dark:text-white">Amazon Brand Store</span>
                <ExternalLink className="w-3.5 h-3.5 text-brand-stone group-hover:text-brand-black dark:group-hover:text-white transition-colors shrink-0" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Back to Top, Theme Switcher & Payment Logos */}
        <div className="pt-8 sm:pt-10 mt-8 sm:mt-10 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-stone text-center sm:text-left">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span>© {new Date().getFullYear()} Bliss Balance Footwear. All rights reserved.</span>
            
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-warm dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-brand-black dark:text-white hover:border-brand-black dark:hover:border-white transition-all touch-manipulation"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3 h-3 text-amber-400" />
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>Light</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-warm dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[11px] font-medium text-brand-black dark:text-white hover:border-brand-black dark:hover:border-white transition-all touch-manipulation"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Top</span>
            </button>
          </div>

          <PaymentLogos />
        </div>

      </div>

      {/* Animated Wave Bar — from animated-footer.tsx pattern */}
      <div
        id="waveContainer"
        aria-hidden="true"
        style={{ overflow: 'hidden', height: 200 }}
        className="w-full"
      >
        <div style={{ marginTop: 0 }}>
          {Array.from({ length: barCount }).map((_, index) => (
            <div
              key={index}
              ref={(el) => { waveRefs.current[index] = el; }}
              className="wave-segment"
              style={{
                height: `${index + 1}px`,
                backgroundColor: 'rgb(220, 38, 38)',
                transition: 'transform 0.1s ease',
                willChange: 'transform',
                marginTop: '-2px',
              }}
            />
          ))}
        </div>
      </div>

    </footer>
  );
};
