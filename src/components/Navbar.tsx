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
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { BrandTitleText } from './BrandTitleText';
import { CustomerAuthModal } from './CustomerAuthModal';
import { WishlistModal } from './WishlistModal';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { getStoredSKUs } from '@/lib/dataStore';
import { FootwearSKU } from '@/lib/types';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Accordion open section states for mobile drawer
  const [openAccordion, setOpenAccordion] = useState<string | null>('shop');

  useEffect(() => {
    // Listen to Firebase Auth state
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

  const desktopNavLinks = [
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
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* BRAND LOGO & TITLE */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0 pr-1">
              <BrandLogo size="md" />
              <BrandTitleText size="md" showSubtitle={true} className="shrink min-w-0" />
            </Link>

            {/* DESKTOP CATEGORY LINKS */}
            <nav className="hidden lg:flex items-center space-x-7 font-mono">
              {desktopNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-bold tracking-widest text-neutral-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-500 transition-colors py-2 relative group uppercase"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* MINIMALIST RIGHT HEADER ACTIONS */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 font-mono">
              <Link
                href="/about"
                className="hidden md:inline-block text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:text-red-600 transition-colors uppercase tracking-wider px-2 py-1"
              >
                ABOUT US
              </Link>

              {/* Minimal Wishlist Icon */}
              <button
                onClick={() => setWishlistModalOpen(true)}
                className="relative p-2 rounded-none text-neutral-800 dark:text-neutral-200 hover:text-red-600 transition-colors"
                title="View Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Minimal Search Icon */}
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-none text-neutral-800 dark:text-neutral-200 hover:text-red-600 transition-colors"
                title="Search Footwear"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Minimal User Account Icon */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  className="p-2 rounded-none text-neutral-800 dark:text-neutral-200 hover:text-red-600 transition-colors flex items-center gap-1"
                  title="Account Menu"
                >
                  <UserIcon className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Minimal Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-xl p-4 space-y-3 z-50 font-mono text-xs"
                  >
                    {currentUser ? (
                      <>
                        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
                          <p className="text-[9px] font-bold text-neutral-400 uppercase">LOGGED IN AS</p>
                          <p className="text-xs font-bold text-neutral-950 dark:text-white truncate">
                            {currentUser.displayName || currentUser.email || 'Customer'}
                          </p>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-1.5 hover:text-red-600 font-bold uppercase transition-all"
                        >
                          <UserIcon className="w-4 h-4 text-red-600" />
                          <span>MY ORDERS & PROFILE</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 p-1.5 hover:text-red-600 font-bold uppercase text-red-600 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>SIGN OUT</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <h4 className="font-heading text-xs font-bold uppercase text-neutral-950 dark:text-white">
                            WELCOME TO BLISS BALANCE
                          </h4>
                          <p className="text-[11px] text-neutral-500">
                            Sign in to track orders, save wishlist items, and manage addresses.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setAuthModalOpen(true);
                          }}
                          className="w-full py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-500 transition-all"
                        >
                          SIGN IN / REGISTER
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Minimal Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-none text-neutral-900 dark:text-white hover:text-red-600 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                  <span
                    className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${
                      mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 bg-current transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0 scale-x-0' : ''
                    }`}
                  />
                  <span
                    className={`w-full h-0.5 bg-current transition-all duration-300 origin-center ${
                      mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                    }`}
                  />
                </div>
              </button>

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
              className="flex items-center gap-2"
            >
              <BrandLogo size="md" />
              <BrandTitleText size="md" showSubtitle={true} />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search & Wishlist Quick Buttons inside Mobile Drawer */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="py-3 px-4 bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-100 flex items-center justify-center gap-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <Search className="w-4 h-4 text-red-600" />
              <span>SEARCH</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setWishlistModalOpen(true);
              }}
              className="relative py-3 px-4 bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-100 flex items-center justify-center gap-2 text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            >
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              <span>WISHLIST ({wishlistCount})</span>
            </button>
          </div>

          {/* Drawer Accordion Links */}
          <div className="flex-1 p-4 sm:p-6 space-y-4">
            
            {/* Shop Accordion */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <button
                onClick={() => toggleAccordion('shop')}
                className="w-full flex items-center justify-between py-2 text-left font-heading text-xl font-black uppercase tracking-wider text-neutral-950 dark:text-white"
              >
                <span>SHOP FOOTWEAR</span>
                {openAccordion === 'shop' ? <Minus className="w-5 h-5 text-red-600" /> : <Plus className="w-5 h-5" />}
              </button>

              {openAccordion === 'shop' && (
                <div className="pl-4 pt-2 space-y-3 font-mono text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  <Link href="/men" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-600 transition-colors">
                    Men's Footwear
                  </Link>
                  <Link href="/women" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-600 transition-colors">
                    Women's Footwear
                  </Link>
                  <Link href="/collections?cat=Slippers" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-600 transition-colors">
                    Slippers & Slides
                  </Link>
                  <Link href="/collections?cat=Sandals" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-600 transition-colors">
                    Sandals & Flats
                  </Link>
                  <Link href="/collections?cat=Clogs" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-600 transition-colors">
                    Clogs & Crocs
                  </Link>
                  <Link href="/collections?cat=Casual+Shoes" onClick={() => setMobileMenuOpen(false)} className="block hover:text-red-600 transition-colors">
                    Casual Shoes & Sneakers
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <div className="space-y-3 font-mono text-sm font-black uppercase tracking-wider pt-2">
              <Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-red-600">
                EXPLORE ALL COLLECTIONS →
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block py-2">
                ABOUT BLISS BALANCE
              </Link>
              <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-2">
                SUPPORT & FAQ
              </Link>
            </div>

          </div>

          {/* Drawer Footer Account CTA */}
          <div className="p-6 border-t-2 border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-950 space-y-3">
            {currentUser ? (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-neutral-400 uppercase">LOGGED IN AS: {currentUser.email}</p>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-600 text-white font-black text-xs uppercase tracking-widest border-2 border-black"
                >
                  SIGN OUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full py-3.5 bg-red-600 text-white font-black text-xs uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                SIGN IN / REGISTER
              </button>
            )}
          </div>

        </div>
      )}

      {/* Floating Auth Modal & Wishlist Modal */}
      <CustomerAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <WishlistModal isOpen={wishlistModalOpen} onClose={() => setWishlistModalOpen(false)} />
    </>
  );
};
