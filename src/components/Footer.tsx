'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BrandLogo } from './BrandLogo';
import { BrandTitleText } from './BrandTitleText';
import { PaymentLogos } from './PaymentLogos';
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
    <footer ref={footerRef} className="w-full bg-white dark:bg-black text-neutral-900 dark:text-white border-t-2 border-neutral-900 dark:border-neutral-800 transition-colors duration-300 font-mono relative overflow-hidden select-none">
      
      {/* Brand Value Highlights (Gumroad Brutalist Cards) */}
      <div className="border-b-2 border-neutral-900 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            <div className="flex items-start gap-4 p-5 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="p-3 rounded-none bg-red-600 text-white shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-black uppercase tracking-wider text-neutral-950 dark:text-white">
                  FAST PAN-INDIA SHIPPING
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed font-bold">
                  Complimentary free shipping on all orders over ₹799 across India.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="p-3 rounded-none bg-red-600 text-white shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-black uppercase tracking-wider text-neutral-950 dark:text-white">
                  CUSHIONED & ANTI-SKID
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed font-bold">
                  Engineered with premium EVA and dependable outer soles for everyday life.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <div className="p-3 rounded-none bg-red-600 text-white shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-heading text-sm font-black uppercase tracking-wider text-neutral-950 dark:text-white">
                  7-DAY EASY RETURNS
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed font-bold">
                  Hassle-free 7-day doorstep returns and size exchanges guaranteed.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info & Address Details */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <BrandLogo size="md" className="rounded-none border border-black dark:border-white" />
              <BrandTitleText size="md" showSubtitle={true} />
            </Link>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm font-bold">
              Bliss Balance is a modern Indian footwear brand combining soft comfort, contemporary style, lightweight construction, and dependable anti-skid grip for everyday life.
            </p>

            {/* Detailed Head Office Address Card */}
            <div className="p-4 rounded-none bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-800 space-y-1.5 text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
              <span className="text-[10px] font-black text-red-600 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600" /> REGISTERED HEAD OFFICE ADDRESS
              </span>
              <p className="text-neutral-900 dark:text-neutral-100 leading-relaxed font-black">
                Novel House, Iskon Temple, Road No. 1,<br />
                Muralidhar Bagh, Abids, Hyderabad,<br />
                Telangana 500012, India
              </p>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 block">
                OFFICIAL SOCIAL CHANNELS
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/share/1Bhmz8KL1w/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  aria-label="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://x.com/blissbalance_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                  aria-label="Twitter X Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com/@blissbalance_26?si=5xinn2mC-29ifst9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
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
              <li><Link href="/collections?cat=Slippers" className="hover:text-red-600 transition-colors">Slippers</Link></li>
              <li><Link href="/collections?cat=Slides" className="hover:text-red-600 transition-colors">Slides</Link></li>
              <li><Link href="/collections?cat=Sandals" className="hover:text-red-600 transition-colors">Sandals</Link></li>
              <li><Link href="/collections?cat=Clogs" className="hover:text-red-600 transition-colors">Clogs</Link></li>
            </ul>
          </div>

          {/* Customer Help */}
          <div className="md:col-span-2 space-y-3 text-xs">
            <span className="font-black text-neutral-950 dark:text-white uppercase tracking-widest block text-xs border-b-2 border-red-600 pb-1">
              CUSTOMER HELP
            </span>
            <ul className="space-y-2 font-bold text-neutral-700 dark:text-neutral-300">
              <li><Link href="/account" className="hover:text-red-600 transition-colors">Track Order</Link></li>
              <li><Link href="/faq" className="hover:text-red-600 transition-colors">FAQ & Support</Link></li>
              <li><Link href="/about" className="hover:text-red-600 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Official Direct Contact Channels */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <span className="font-black text-neutral-950 dark:text-white uppercase tracking-widest block text-xs border-b-2 border-red-600 pb-1">
              OFFICIAL CHANNELS
            </span>

            {/* Official Amazon Brand Store Badge Link */}
            <a
              href="https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3?lp_asin=B0GV6T919J&ref_=cm_sw_r_apann_ast_store_DTJ19G6CEXMFCXTTDYBR"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-none bg-amber-50 dark:bg-amber-950/70 border-2 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-200 hover:bg-amber-500 hover:text-black transition-all group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
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
              className="flex items-center gap-2 p-3 rounded-none bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 dark:border-emerald-700/60 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600 group-hover:text-white shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase">WhatsApp Support</span>
                <span className="text-xs font-black">+91 9440961776</span>
              </div>
            </a>

            {/* Official Gmail */}
            <a
              href="mailto:blissbalance.in@gmail.com"
              className="flex items-center gap-2 p-3 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-800 text-neutral-900 dark:text-white hover:border-red-600 hover:text-red-600 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
            >
              <Mail className="w-4 h-4 text-red-600 shrink-0" />
              <span className="text-xs font-black">blissbalance.in@gmail.com</span>
            </a>

          </div>

        </div>

        {/* GIANT ONE8-STYLE WATERMARK LOGO AT FOOTER BOTTOM (USER IMAGE 1 REPLICATED) */}
        <div className="w-full overflow-hidden select-none pointer-events-none opacity-[0.08] dark:opacity-[0.14] pt-10 pb-4 text-center">
          <span className="font-heading font-black text-6xl sm:text-8xl lg:text-[11rem] tracking-tighter uppercase text-neutral-950 dark:text-white leading-none block whitespace-nowrap">
            bliss balance
          </span>
        </div>

        {/* Payment Method Badges & Copyright Line */}
        <div className="pt-6 border-t-2 border-neutral-900 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-black">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-neutral-950 dark:text-white text-xs uppercase">© {new Date().getFullYear()} BLISS BALANCE FOOTWEAR.</span>
            <span className="text-neutral-400">HYDERABAD, TELANGANA 500012.</span>
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
