'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ShoppingBag } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "MEN", href: "/men" },
    { name: "WOMEN", href: "/women" },
    { name: "SLIPPERS", href: "/collections?cat=Slippers" },
    { name: "SANDALS", href: "/collections?cat=Sandals" },
    { name: "SLIDES", href: "/collections?cat=Slides" },
    { name: "CLOGS", href: "/collections?cat=Clogs" },
    { name: "SHOES", href: "/collections?cat=Casual+Shoes" },
    { name: "NEW ARRIVALS", href: "/collections?filter=new" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-neutral-950/95 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3.5 group">
            {/* Red Square Logo Icon */}
            <BrandLogo size="md" className="group-hover:scale-105 transition-transform duration-300" />

            <div className="flex flex-col">
              <span className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-none">
                BLISS BALANCE
              </span>
              <span className="text-[9px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 uppercase font-semibold mt-0.5">
                Walk in Bliss. Live in Balance.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-mono font-bold tracking-widest text-neutral-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-500 transition-colors py-2 relative group uppercase"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Action Icons (Search & Mobile Hamburger) */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSearch}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 hover:border-red-500 transition-all"
              title="Search Footwear"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs font-mono font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 hover:bg-red-600 hover:text-white transition-all border border-neutral-200 dark:border-neutral-800"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
