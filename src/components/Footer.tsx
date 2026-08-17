'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { Truck, ShieldCheck, RefreshCw, Mail, MessageSquare, MapPin, ExternalLink, Facebook, Twitter, Youtube } from 'lucide-react';

export const Footer: React.FC = () => {
  const waveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  const barCount = 28;
  const waveColor = 'rgb(220, 38, 38)';

  useEffect(() => {
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
    <footer ref={footerRef} className="w-full bg-neutral-100 dark:bg-black text-neutral-900 dark:text-white border-t border-neutral-200 dark:border-neutral-800 transition-colors duration-300 font-body relative overflow-hidden select-none">
      
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

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
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
            <div className="pt-1 space-y-2 font-mono">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">
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
          <div className="md:col-span-3 space-y-3 font-mono text-xs relative">
            <span className="font-bold text-neutral-950 dark:text-white uppercase tracking-widest block text-[11px]">
              OFFICIAL CHANNELS
            </span>

            {/* Official Amazon Brand Store Badge Link */}
            <a
              href="https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3?lp_asin=B0GV6T919J&ref_=cm_sw_r_apann_ast_store_DTJ19G6CEXMFCXTTDYBR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-500 hover:text-black transition-all group relative z-10"
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
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all group relative z-10"
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
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-red-600 hover:text-red-600 transition-all relative z-10"
            >
              <Mail className="w-4 h-4 text-red-600 shrink-0" />
              <span className="text-xs font-mono font-bold">blissbalance.in@gmail.com</span>
            </a>

            {/* RAW GRAPHITE PENCIL SKETCHED LOGO EMBLEM ETCHED IN THE BACKGROUND (NO BOX) */}
            <div className="pt-4 flex items-center justify-center pointer-events-none select-none relative z-0">
              <img
                src="/Logo.svg"
                alt="Bliss Balance Raw Pencil Sketched Logo"
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain filter contrast-200 grayscale opacity-60 dark:opacity-75 dark:invert mix-blend-multiply dark:mix-blend-screen drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-all"
              />
            </div>

          </div>

        </div>

        {/* Payment Method Badges & Copyright Line */}
        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-neutral-900 dark:text-white text-xs">© {new Date().getFullYear()} BLISS BALANCE FOOTWEAR.</span>
            <span>HYDERABAD, TELANGANA 500012.</span>
          </div>

          {/* Actual UI Payment Method Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-blue-600 text-white font-black text-[9px] rounded uppercase shadow-xs">AMEX</span>
            <span className="px-2 py-0.5 bg-blue-800 text-white font-black text-[9px] rounded uppercase shadow-xs">DINERS</span>
            <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[9px] rounded uppercase shadow-xs">MASTERCARD</span>
            <span className="px-2 py-0.5 bg-amber-600 text-black font-black text-[9px] rounded uppercase shadow-xs">VISA</span>
            <span className="px-2 py-0.5 bg-emerald-700 text-white font-black text-[9px] rounded uppercase shadow-xs">RUPAY</span>
            <span className="px-2 py-0.5 bg-neutral-900 dark:bg-neutral-800 text-white font-black text-[9px] rounded uppercase shadow-xs border border-neutral-700">UPI</span>
          </div>
        </div>

      </div>

      {/* Red Animated Wave Canvas Bar at Bottom */}
      <div
        id="waveContainer"
        aria-hidden="true"
        style={{ overflow: 'hidden', height: 160 }}
        className="w-full opacity-90"
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
