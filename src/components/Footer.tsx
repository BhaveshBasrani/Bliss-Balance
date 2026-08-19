'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { BrandTitleText } from './BrandTitleText';
import { PaymentLogos } from './PaymentLogos';
import { Truck, ShieldCheck, RefreshCw, Mail, MessageSquare, MapPin, ExternalLink, Facebook, Twitter, Youtube, Instagram, Sun, Moon } from 'lucide-react';

export const Footer: React.FC = () => {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const animationFrameRef = useRef<number | null>(null);

  const barCount = 28;
  const waveColor = 'rgb(220, 38, 38)';

  useEffect(() => {
    // Sync Light/Dark Mode Preference (Default Light)
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
      { threshold: 0.1 }
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
    <footer ref={footerRef} className="w-full bg-white dark:bg-black text-neutral-900 dark:text-white border-t-2 border-neutral-900 dark:border-neutral-800 transition-colors duration-300 font-mono relative overflow-hidden select-none">
      


      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info & Address Details */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandLogo size="md" />
              <BrandTitleText size="md" showSubtitle={true} />
            </Link>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm font-bold">
              Bliss Balance is a modern Indian footwear brand combining soft comfort, contemporary style, lightweight construction, and dependable anti-skid grip for everyday life.
            </p>

            {/* Detailed Head Office Address Link */}
            <a
              href="https://maps.app.goo.gl/LkJSdiNqZNrcXKJE7"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 space-y-1.5 text-xs hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-md group"
            >
              <span className="text-[10px] font-black text-red-600 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> REGISTERED HEAD OFFICE ADDRESS <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <p className="text-neutral-900 dark:text-neutral-100 leading-relaxed font-bold">
                Novel House, Iskon Temple, Road No. 1,<br />
                Muralidhar Bagh, Abids, Hyderabad,<br />
                Telangana 500012, India
              </p>
            </a>

            {/* Social Media Links & Theme Switcher */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
                OFFICIAL SOCIAL CHANNELS
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/blissbalance.co?igsh=MWJpbmRpNGxnOW83NA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all shadow-sm hover:shadow-md"
                  aria-label="Instagram Official Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/share/1Bhmz8KL1w/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm hover:shadow-md"
                  aria-label="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/blissbalance_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm hover:shadow-md"
                  aria-label="Twitter X Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@blissbalance_26?si=5xinn2mC-29ifst9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm hover:shadow-md"
                  aria-label="YouTube Channel"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <span className="font-black text-neutral-950 dark:text-white uppercase tracking-widest block text-xs border-b-2 border-red-600 pb-1">
              SHOP COLLECTION
            </span>
            <ul className="space-y-2 font-bold text-neutral-700 dark:text-neutral-300">
              <li><Link href="/men" className="hover:text-red-600 transition-colors">Men's Footwear</Link></li>
              <li><Link href="/women" className="hover:text-red-600 transition-colors">Women's Footwear</Link></li>
              <li><Link href="/collections/slippers" className="hover:text-red-600 transition-colors">Slippers</Link></li>
              <li><Link href="/collections/slides" className="hover:text-red-600 transition-colors">Slides</Link></li>
              <li><Link href="/collections/sandals" className="hover:text-red-600 transition-colors">Sandals</Link></li>
              <li><Link href="/collections/clogs" className="hover:text-red-600 transition-colors">Clogs</Link></li>
            </ul>
          </div>

          {/* Customer Help */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <span className="font-black text-neutral-950 dark:text-white uppercase tracking-widest block text-xs border-b-2 border-red-600 pb-1">
              CUSTOMER HELP
            </span>
            <ul className="space-y-2 font-bold text-neutral-700 dark:text-neutral-300">
              <li><Link href="/faq" className="hover:text-red-600 transition-colors">FAQ & Support</Link></li>
              <li><Link href="/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Official Direct Contact Channels */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="font-black text-neutral-950 dark:text-white uppercase tracking-widest block text-xs border-b-2 border-red-600 pb-1">
              OFFICIAL CHANNELS
            </span>

            {/* Official Instagram Badge Link */}
            <a
              href="https://www.instagram.com/blissbalance.co?igsh=MWJpbmRpNGxnOW83NA=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 backdrop-blur-md border border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-200 hover:bg-gradient-to-r hover:from-amber-500 hover:via-rose-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-rose-600 group-hover:text-white shrink-0" />
                <span className="font-black text-xs uppercase">INSTAGRAM @BLISSBALANCE.CO</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 ml-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Official Amazon Brand Store Badge Link */}
            <a
              href="https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3?lp_asin=B0GV6T919J&ref_=cm_sw_r_apann_ast_store_DTJ19G6CEXMFCXTTDYBR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 backdrop-blur-md border border-amber-200 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 hover:bg-amber-500 hover:text-black hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-2">
                <span className="font-black text-xs uppercase">AMAZON BRAND STORE</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 ml-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* WhatsApp Direct Chat */}
            <a
              href="https://wa.me/919440961776?text=Hi%20Bliss%20Balance%20Team%2C%20I%20have%20a%20query"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 backdrop-blur-md border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-600 hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 group-hover:text-white shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase">WhatsApp Support</span>
                  <span className="text-xs font-black">+91 9440961776</span>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 ml-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Official Gmail */}
            <a
              href="mailto:blissbalance.in@gmail.com"
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-white/80 dark:bg-black/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 text-neutral-950 dark:text-white hover:border-red-600 hover:text-red-600 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-xs font-black">blissbalance.in@gmail.com</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 ml-3 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </a>

          </div>

        </div>

        {/* GIANT HIGH-FASHION WATERMARK LOGO AT FOOTER BOTTOM - 100% PERFECT MOBILE SCALING */}
        <div className="w-full select-none pointer-events-none opacity-[0.12] dark:opacity-[0.22] py-2 text-center my-2 overflow-hidden px-2">
          <svg viewBox="0 0 1600 130" className="w-full h-auto max-h-[140px] mx-auto" preserveAspectRatio="xMidYMid meet">
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              className="font-heading font-black text-[105px] fill-current text-neutral-950 dark:text-white tracking-tight uppercase"
            >
              BLISS BALANCE
            </text>
          </svg>
        </div>

        {/* Payment Method Badges, Theme Switcher & Copyright Line */}
        <div className="pt-6 border-t-2 border-neutral-900 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-black">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-neutral-950 dark:text-white text-xs uppercase">© {new Date().getFullYear()} BLISS BALANCE FOOTWEAR.</span>
            <span className="text-neutral-400">HYDERABAD, TELANGANA 500012.</span>
            
            {/* Small Footer Theme Switcher Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900/90 border border-neutral-300 dark:border-neutral-700/80 text-[10px] font-black uppercase text-neutral-900 dark:text-white hover:border-red-600 transition-all duration-200 shadow-xs hover:shadow-md hover:scale-105 active:scale-95 ml-2 backdrop-blur-xs"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="tracking-wider">DARK MODE</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="tracking-wider">LIGHT MODE</span>
                </>
              )}
            </button>
          </div>

          {/* Graphical Payment Method Badges */}
          <PaymentLogos />
        </div>

      </div>

      {/* Red Animated Wave Canvas Bar at Bottom */}
      <div
        id="waveContainer"
        aria-hidden="true"
        style={{ overflow: 'hidden', height: 160 }}
        className="w-full opacity-95"
      >
        <div style={{ marginTop: 0 }}>
          {Array.from({ length: barCount }).map((_, index) => (
            <div
              key={index}
              ref={(el) => {
                waveRefs.current[index] = el;
              }}
              className="wave-segment"
              style={{
                height: `${index + 2}px`,
                backgroundColor: waveColor,
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
