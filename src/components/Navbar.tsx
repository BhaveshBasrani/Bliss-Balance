'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Menu,
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
  Linkedin,
  Youtube,
  ShieldCheck,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { CustomerAuthModal } from './CustomerAuthModal';
import { WishlistModal } from './WishlistModal';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

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

  // Accordion open section states for one8 style drawer
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

  // Lock body scroll when mobile menu is open to prevent page peeking through
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
        const ids: string[] = JSON.parse(stored);
        setWishlistCount(ids.length);
      } else {
        setWishlistCount(0);
      }
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
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo & Title */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3.5 group shrink-0">
              <BrandLogo size="sm" className="sm:hidden" />
              <BrandLogo size="md" className="hidden sm:flex group-hover:scale-105 transition-transform duration-300" />

              <div className="flex flex-col">
                <span className="font-heading text-base sm:text-2xl lg:text-3xl font-black tracking-tight text-neutral-950 dark:text-white uppercase leading-none">
                  BLISS BALANCE
                </span>
                <span className="hidden sm:block text-[9px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 uppercase font-semibold mt-0.5">
                  Feel The Bliss
                </span>
              </div>
            </Link>

            {/* Desktop Category Links */}
            <nav className="hidden lg:flex items-center space-x-6">
              {desktopNavLinks.map((link) => (
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

              {/* Wishlist Button */}
              <button
                onClick={() => setWishlistModalOpen(true)}
                className="relative p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 hover:border-red-500 transition-all"
                title="View Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 hover:border-red-500 transition-all"
                title="Search Footwear"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Account Avatar Dropdown (Desktop Only) */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200 hover:text-red-600 hover:border-red-500 transition-all flex items-center gap-1.5"
                  title="Account Menu"
                >
                  {currentUser && currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Profile'}
                      className="w-6 h-6 rounded-full object-cover border border-red-500"
                    />
                  ) : currentUser ? (
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-[10px] flex items-center justify-center uppercase">
                      {currentUser.displayName ? currentUser.displayName[0] : (currentUser.email ? currentUser.email[0] : 'U')}
                    </div>
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {/* Dropdown Card */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-5 space-y-4 animate-in fade-in duration-150 z-50 font-body text-xs"
                  >
                    {currentUser ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-800">
                          {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="User PFP" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-red-600 text-white font-mono font-bold text-sm flex items-center justify-center uppercase">
                              {currentUser.displayName ? currentUser.displayName[0] : (currentUser.email ? currentUser.email[0] : 'U')}
                            </div>
                          )}
                          <div className="space-y-0.5 overflow-hidden">
                            <h4 className="font-heading text-sm font-bold text-neutral-950 dark:text-white uppercase truncate">
                              {currentUser.displayName || 'Valued Patron'}
                            </h4>
                            <p className="font-mono text-[10px] text-neutral-500 truncate">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={handleLogout}
                          className="w-full py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-800 dark:text-neutral-200 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-4 h-4" /> LOGOUT SESSION
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
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
                      </div>
                    )}

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2 font-mono font-bold text-neutral-700 dark:text-neutral-300 text-xs">
                      <Link
                        href="/collections"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block py-1 hover:text-red-600 transition-colors"
                      >
                        Explore Collections
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

              {/* Mobile Drawer Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-200"
                aria-label="Toggle Mobile Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ONE8 STYLE ULTRA-LUXURY FULL SCREEN MOBILE MENU DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[99999] bg-[#0A0A0A] text-white flex flex-col justify-between overflow-y-auto lg:hidden animate-in fade-in duration-300 h-[100dvh] w-screen">
          
          {/* Top Bar: Brand Logo & Close Button */}
          <div className="p-5 sm:p-6 border-b border-neutral-800/80 flex items-center justify-between sticky top-0 bg-[#0A0A0A] z-20">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
              <BrandLogo size="sm" />
              <span className="font-heading text-xl font-black text-white uppercase tracking-tight">
                BLISS BALANCE
              </span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-full bg-neutral-900 text-neutral-300 hover:text-white transition-all border border-neutral-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Middle Section: ONE8 Style Accordion List */}
          <div className="px-6 py-8 space-y-6 flex-1 font-heading">
            
            {/* Accordion 1: SHOP */}
            <div className="border-b border-neutral-800 pb-4 space-y-3">
              <button
                onClick={() => toggleAccordion('shop')}
                className="w-full flex items-center justify-between text-2xl font-bold text-white uppercase tracking-wider text-left"
              >
                <span>Shop</span>
                {openAccordion === 'shop' ? <Minus className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5 text-neutral-400" />}
              </button>

              {openAccordion === 'shop' && (
                <div className="grid grid-cols-2 gap-2.5 pt-2 animate-in fade-in duration-200 font-mono text-xs">
                  <Link
                    href="/men"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-neutral-900/80 text-neutral-200 hover:text-red-500 font-bold uppercase tracking-wider border border-neutral-800"
                  >
                    Men's Footwear
                  </Link>
                  <Link
                    href="/women"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-neutral-900/80 text-neutral-200 hover:text-red-500 font-bold uppercase tracking-wider border border-neutral-800"
                  >
                    Women's Footwear
                  </Link>
                  <Link
                    href="/collections?cat=Slippers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-neutral-900/80 text-neutral-200 hover:text-red-500 font-bold uppercase tracking-wider border border-neutral-800"
                  >
                    Slippers & Slides
                  </Link>
                  <Link
                    href="/collections?cat=Sandals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-neutral-900/80 text-neutral-200 hover:text-red-500 font-bold uppercase tracking-wider border border-neutral-800"
                  >
                    Sandals & Clogs
                  </Link>
                  <Link
                    href="/collections?cat=Casual+Shoes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-neutral-900/80 text-neutral-200 hover:text-red-500 font-bold uppercase tracking-wider border border-neutral-800"
                  >
                    Sneakers & Shoes
                  </Link>
                  <Link
                    href="/collections?filter=new"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 rounded-xl bg-red-950/40 text-red-400 font-bold uppercase tracking-wider border border-red-800/60"
                  >
                    ⚡ New Arrivals
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion 2: BLISS BALANCE */}
            <div className="border-b border-neutral-800 pb-4 space-y-3">
              <button
                onClick={() => toggleAccordion('brand')}
                className="w-full flex items-center justify-between text-2xl font-bold text-white uppercase tracking-wider text-left"
              >
                <span>Bliss Balance</span>
                {openAccordion === 'brand' ? <Minus className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5 text-neutral-400" />}
              </button>

              {openAccordion === 'brand' && (
                <div className="space-y-2 pt-2 animate-in fade-in duration-200 font-mono text-xs font-bold text-neutral-300">
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-3 rounded-xl bg-neutral-900/80 hover:text-red-500 uppercase tracking-wider border border-neutral-800"
                  >
                    Our Footwear Philosophy
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-3 rounded-xl bg-neutral-900/80 hover:text-red-500 uppercase tracking-wider border border-neutral-800"
                  >
                    Frequently Asked Questions
                  </Link>
                </div>
              )}
            </div>

            {/* Accordion 3: CUSTOMER SUPPORT */}
            <div className="border-b border-neutral-800 pb-4 space-y-3">
              <button
                onClick={() => toggleAccordion('support')}
                className="w-full flex items-center justify-between text-2xl font-bold text-white uppercase tracking-wider text-left"
              >
                <span>Customer Support</span>
                {openAccordion === 'support' ? <Minus className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5 text-neutral-400" />}
              </button>

              {openAccordion === 'support' && (
                <div className="space-y-2 pt-2 animate-in fade-in duration-200 font-mono text-xs font-bold text-neutral-300">
                  <Link
                    href="/faq"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block p-3 rounded-xl bg-neutral-900/80 hover:text-red-500 uppercase tracking-wider border border-neutral-800"
                  >
                    Frequently Asked Questions (FAQ)
                  </Link>
                  <div className="p-3 rounded-xl bg-neutral-900/80 uppercase tracking-wider border border-neutral-800 text-neutral-400">
                    7-Day Returns & Exchanges
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 4: ACCOUNT */}
            <div className="border-b border-neutral-800 pb-4 space-y-3">
              <button
                onClick={() => toggleAccordion('account')}
                className="w-full flex items-center justify-between text-2xl font-bold text-white uppercase tracking-wider text-left"
              >
                <span>Account</span>
                {openAccordion === 'account' ? <Minus className="w-5 h-5 text-red-500" /> : <Plus className="w-5 h-5 text-neutral-400" />}
              </button>

              {openAccordion === 'account' && (
                <div className="space-y-2 pt-2 animate-in fade-in duration-200 font-mono text-xs font-bold text-neutral-300">
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                        <span className="truncate">{currentUser.email}</span>
                        <span className="text-[10px] text-emerald-400 font-extrabold uppercase">ACTIVE</span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full p-3 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-center"
                      >
                        LOGOUT SESSION
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalOpen(true);
                      }}
                      className="w-full p-3 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-center"
                    >
                      LOGIN / SIGNUP
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Bottom Social Channels Bar (ONE8 Style) */}
          <div className="p-6 border-t border-neutral-800 space-y-6 font-mono bg-[#0A0A0A]">
            
            <div className="space-y-3">
              <h4 className="font-heading text-lg font-bold uppercase text-white tracking-wider">
                Follow Us
              </h4>
              <p className="text-xs text-neutral-400">
                Connect with Bliss Balance across our official social channels:
              </p>

              <div className="flex items-center gap-3">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-neutral-900 hover:bg-red-600 text-white transition-all border border-neutral-800">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-neutral-900 hover:bg-red-600 text-white transition-all border border-neutral-800">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-neutral-900 hover:bg-red-600 text-white transition-all border border-neutral-800">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-neutral-900 hover:bg-red-600 text-white transition-all border border-neutral-800">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-neutral-900 hover:bg-red-600 text-white transition-all border border-neutral-800">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Copyright & Accepted Payment Methods */}
            <div className="pt-4 border-t border-neutral-800/80 text-center space-y-3">
              <span className="text-xs text-neutral-500 font-bold block">
                © Bliss Balance 2026 • Feel The Bliss
              </span>

              <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-neutral-400 uppercase flex-wrap">
                <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">AMEX</span>
                <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">MASTERCARD</span>
                <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">VISA</span>
                <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">UPI</span>
                <span className="px-2 py-1 bg-neutral-900 rounded border border-neutral-800">RU PAY</span>
              </div>
            </div>

          </div>

        </div>
      )}

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
