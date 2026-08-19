'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  User as UserIcon,
  ChevronDown,
  Heart,
  LogOut,
  Plus,
  Minus,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  MessageSquare,
  Menu,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BrandTitleText } from './BrandTitleText';
import { CustomerAuthModal } from './CustomerAuthModal';
import { WishlistModal } from './WishlistModal';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { FootwearSKU } from '@/lib/types';
import { getStoredSKUs } from '@/lib/dataStore';

interface NavbarProps {
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);

  // Accordion state for mobile category navigation
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    updateWishlistCount();
    window.addEventListener('wishlist-updated', updateWishlistCount);

    return () => {
      unsubscribe();
      window.removeEventListener('wishlist-updated', updateWishlistCount);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const updateWishlistCount = () => {
    try {
      const stored = localStorage.getItem('bliss_balance_wishlist');
      if (stored) {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids)) {
          const validSkus = getStoredSKUs();
          const validIds = ids.filter((id: string) =>
            typeof id === 'string' &&
            id.trim().length > 0 &&
            validSkus.some((s: FootwearSKU) => s.id.toLowerCase() === id.toLowerCase())
          );

          if (validIds.length !== ids.length) {
            localStorage.setItem('bliss_balance_wishlist', JSON.stringify(validIds));
          }

          setWishlistCount(validIds.length);
          return;
        }
      }
      setWishlistCount(0);
    } catch (e) {
      setWishlistCount(0);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
    } catch (e) {}
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* MOBILE HEADER (lg:hidden) */}
          <div className="flex lg:hidden items-center justify-between h-16 w-full font-mono">
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-xl text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <Link href="/" className="flex items-center gap-2 group shrink min-w-0 mx-2">
              <BrandLogo size="sm" />
              <BrandTitleText size="sm" showSubtitle={false} className="shrink min-w-0" />
            </Link>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setWishlistModalOpen(true)}
                className="relative p-2 rounded-xl text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                title="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER (hidden on mobile, lg:flex) - HIGH-FASHION CHK STYLE MINIMALIST CENTERPIECE */}
          <div className="hidden lg:flex items-center justify-between h-20 relative">
            
            {/* LEFT NAV LINKS (Spaced out, clean tracking) */}
            <nav className="flex items-center space-x-8 xl:space-x-10 font-mono text-xs font-black tracking-widest text-neutral-800 dark:text-neutral-200 uppercase">
              <Link href="/collections" className="hover:text-red-600 transition-colors py-2 relative group">
                SHOP ALL
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/men" className="hover:text-red-600 transition-colors py-2 relative group">
                MEN
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/women" className="hover:text-red-600 transition-colors py-2 relative group">
                WOMEN
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/about" className="hover:text-red-600 transition-colors py-2 relative group">
                OUR STORY
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* EXACT CENTER: BRAND LOGO & TITLE CENTERPIECE */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto z-10">
              <Link href="/" className="flex items-center gap-3 group px-4 py-1.5 rounded-2xl hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition-all duration-300 relative">
                <div className="absolute inset-0 bg-red-600/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <BrandLogo size="md" className="group-hover:scale-105 transition-transform duration-300" />
                <BrandTitleText size="md" showSubtitle={true} className="shrink min-w-0" />
              </Link>
            </div>

            {/* RIGHT ACTIONS (Text + Minimal Icon Labels) */}
            <div className="flex items-center space-x-8 xl:space-x-10 font-mono text-xs font-black tracking-widest text-neutral-800 dark:text-neutral-200 uppercase">
              <button
                onClick={onOpenSearch}
                className="hover:text-red-600 transition-colors py-2 flex items-center gap-1.5"
              >
                <span>SEARCH</span>
                <Search className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={() => setWishlistModalOpen(true)}
                className="hover:text-red-600 transition-colors py-2 flex items-center gap-1.5 relative"
              >
                <span>WISHLIST ({wishlistCount})</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  className="hover:text-red-600 transition-colors py-2 flex items-center gap-1.5"
                >
                  <span>ACCOUNT</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Account Dropdown Popover Box */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 shadow-xl rounded-xl p-5 space-y-4 z-50 font-mono text-xs animate-in fade-in zoom-in-95 duration-150 select-none"
                  >
                    {/* Top Accent Pill */}
                    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
                      <span className="text-[9px] font-mono font-black text-red-600 uppercase tracking-widest">
                        BLISS BALANCE • ACCOUNT
                      </span>
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    </div>

                    {currentUser ? (
                      <>
                        <div className="space-y-1">
                          <p className="text-[9px] font-mono font-bold text-neutral-400 uppercase">LOGGED IN AS</p>
                          <p className="text-xs font-black text-neutral-950 dark:text-white truncate">
                            {currentUser.displayName || currentUser.email || 'Customer'}
                          </p>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-3 bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-950 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-black font-black uppercase text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 transition-all duration-200"
                        >
                          <UserIcon className="w-4 h-4 text-red-600" />
                          <span>MY ORDERS & PROFILE</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 p-2.5 bg-red-600/10 hover:bg-red-600 hover:text-white font-black uppercase text-xs text-red-600 rounded-xl border border-red-600/30 transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>SIGN OUT</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <h4 className="font-heading text-sm font-black uppercase text-neutral-950 dark:text-white tracking-tight">
                            WELCOME TO BLISS BALANCE
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-bold leading-relaxed">
                            Sign in to save wishlist items, track orders and manage delivery addresses.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setAuthModalOpen(true);
                          }}
                          className="w-full py-3 bg-red-600 hover:bg-neutral-950 text-white font-mono font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-200 shadow-md border border-red-600 active:scale-98"
                        >
                          SIGN IN / REGISTER
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* FULL SCREEN ACCORDION MOBILE DRAWER WITH CUBIC-BEZIER FLUID ANIMATION */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black text-neutral-950 dark:text-white flex flex-col font-mono animate-in slide-in-from-right duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto">
          
          {/* Drawer Top Header */}
          <div className="p-4 sm:p-6 border-b-2 border-neutral-900 dark:border-neutral-100 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <BrandLogo size="md" />
              <BrandTitleText size="md" showSubtitle={true} />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full border-2 border-neutral-900 dark:border-neutral-100 hover:bg-red-600 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Nav Content */}
          <div className="flex-1 p-6 sm:p-8 space-y-6">
            
            {/* Quick Auth Banner in Mobile Drawer */}
            <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-none border-2 border-neutral-900 dark:border-neutral-100 flex items-center justify-between">
              <div>
                {currentUser ? (
                  <>
                    <p className="text-[10px] font-black text-red-600 uppercase">LOGGED IN AS</p>
                    <p className="text-xs font-bold truncate max-w-[180px]">
                      {currentUser.displayName || currentUser.email || 'Customer'}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-black uppercase">ACCOUNT ACCESS</p>
                    <p className="text-[10px] text-neutral-500 font-bold">Track orders & save wishlist</p>
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser) {
                    window.location.href = '/account';
                  } else {
                    setAuthModalOpen(true);
                  }
                }}
                className="px-3 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase border border-red-600"
              >
                {currentUser ? 'MY ACCOUNT' : 'LOGIN / REGISTER'}
              </button>
            </div>

            {/* Accordion Links */}
            <div className="space-y-4 font-mono text-sm font-black uppercase">
              
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 border-b border-neutral-200 dark:border-neutral-800 hover:text-red-600 transition-colors"
              >
                SHOP ALL FOOTWEAR
              </Link>

              {/* MEN ACCORDION */}
              <div className="border-b border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => toggleAccordion('men')}
                  className="w-full py-3 flex items-center justify-between text-left hover:text-red-600 transition-colors"
                >
                  <span>MEN'S COLLECTION</span>
                  {openAccordion === 'men' ? (
                    <Minus className="w-4 h-4 text-red-600" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
                {openAccordion === 'men' && (
                  <div className="pl-4 pb-3 space-y-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                    <Link
                      href="/men"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-red-600"
                    >
                      ALL MEN'S FOOTWEAR
                    </Link>
                    <Link
                      href="/collections?cat=Slippers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-red-600"
                    >
                      SLIPPERS & FLIP-FLOPS
                    </Link>
                    <Link
                      href="/collections?cat=Slides"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-red-600"
                    >
                      SLIDES & CLOGS
                    </Link>
                    <Link
                      href="/collections?cat=Casual+Shoes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-red-600"
                    >
                      SNEAKERS & CASUAL SHOES
                    </Link>
                  </div>
                )}
              </div>

              {/* WOMEN ACCORDION */}
              <div className="border-b border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => toggleAccordion('women')}
                  className="w-full py-3 flex items-center justify-between text-left hover:text-red-600 transition-colors"
                >
                  <span>WOMEN'S COLLECTION</span>
                  {openAccordion === 'women' ? (
                    <Minus className="w-4 h-4 text-red-600" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </button>
                {openAccordion === 'women' && (
                  <div className="pl-4 pb-3 space-y-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                    <Link
                      href="/women"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-red-600"
                    >
                      ALL WOMEN'S FOOTWEAR
                    </Link>
                    <Link
                      href="/collections?cat=Slides"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-red-600"
                    >
                      SLIDES & SLIPPERS
                    </Link>
                    <Link
                      href="/collections?cat=Sandals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-red-600"
                    >
                      SANDALS & FLATS
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 border-b border-neutral-200 dark:border-neutral-800 hover:text-red-600 transition-colors"
              >
                OUR STORY / ABOUT US
              </Link>
            </div>

            {/* Social Icons & Contact */}
            <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
              <p className="text-xs font-mono font-black uppercase tracking-widest text-red-600">
                CONNECT WITH BLISS BALANCE
              </p>
              <div className="flex items-center gap-4 text-neutral-700 dark:text-neutral-300">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-full hover:border-red-600 hover:text-red-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-full hover:border-red-600 hover:text-red-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-neutral-300 dark:border-neutral-700 rounded-full hover:border-red-600 hover:text-red-600 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t-2 border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900 text-center font-mono text-xs">
            <p className="font-bold text-neutral-500">
              © {new Date().getFullYear()} BLISS BALANCE FOOTWEAR. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>
      )}

      {/* MODALS */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <WishlistModal
        isOpen={wishlistModalOpen}
        onClose={() => setWishlistModalOpen(false)}
      />
    </>
  );
};
