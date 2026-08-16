'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, User as UserIcon, ChevronDown } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CustomerAuthModal } from './CustomerAuthModal';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo & Compact Header Title */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group shrink-0">
              <BrandLogo size="sm" className="sm:hidden" />
              <BrandLogo size="md" className="hidden sm:flex group-hover:scale-105 transition-transform duration-300" />

              <div className="flex flex-col">
                <span className="font-heading text-lg sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-none">
                  BLISS BALANCE
                </span>
                <span className="hidden sm:block text-[9px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 uppercase font-semibold mt-0.5">
                  Feel The Bliss
                </span>
              </div>
            </Link>

            {/* Desktop Category Links */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-heading font-bold tracking-widest text-neutral-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-500 transition-colors py-2 relative group uppercase"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Header Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <Link
                href="/about"
                className="hidden md:inline-block text-xs font-heading font-bold text-neutral-700 dark:text-neutral-300 hover:text-red-600 transition-colors uppercase tracking-wider"
              >
                About Us
              </Link>

              <button
                onClick={onOpenSearch}
                className="p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 hover:border-red-500 transition-all"
                title="Search Footwear"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  className="p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 hover:border-red-500 transition-all flex items-center gap-0.5 sm:gap-1"
                  title="Account Menu"
                >
                  <UserIcon className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Card */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-4 animate-in fade-in duration-150 z-50 font-body text-xs"
                  >
                    <div className="space-y-1">
                      <h4 className="font-heading text-lg font-bold text-neutral-950 dark:text-white uppercase">
                        Welcome
                      </h4>
                      <p className="font-mono text-[11px] text-neutral-500">
                        To access account and manage orders
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setAuthModalOpen(true);
                      }}
                      className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-red-500 text-white font-mono font-extrabold text-xs uppercase tracking-widest shadow-md transition-all text-center"
                    >
                      LOGIN / SIGNUP
                    </button>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2 font-mono font-bold text-neutral-700 dark:text-neutral-300 text-xs">
                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block py-1 hover:text-red-600 transition-colors"
                      >
                        Track your Order
                      </Link>
                      <Link
                        href="/faq"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block py-1 hover:text-red-600 transition-colors"
                      >
                        FAQ
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block py-1 hover:text-red-600 transition-colors"
                      >
                        About Us
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Drawer Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-top duration-200 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-xs font-heading font-bold uppercase tracking-widest text-neutral-900 dark:text-neutral-100 hover:bg-red-600 hover:text-white transition-all border border-neutral-200 dark:border-neutral-800"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-2 font-mono text-xs font-bold text-center">
                <Link href="/about" className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">About Us</Link>
                <Link href="/faq" className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-lg">FAQ</Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
