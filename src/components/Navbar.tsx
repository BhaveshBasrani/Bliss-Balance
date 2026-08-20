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
      <header className="sticky top-0 z-40 w-full bg-white/98 dark:bg-black/98 backdrop-blur-xl border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300 select-none">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          
          {/* MOBILE HEADER (lg:hidden) */}
          <div className="flex lg:hidden items-center justify-between h-16 w-full">
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2.5 text-brand-black dark:text-white hover:opacity-60 transition-opacity"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <Link href="/" className="flex items-center gap-2 group shrink min-w-0 mx-2">
              <BrandLogo size="sm" />
              <BrandTitleText size="sm" showSubtitle={false} className="shrink min-w-0" />
            </Link>

            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2.5 text-brand-black dark:text-white hover:opacity-60 transition-opacity"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setWishlistModalOpen(true)}
                className="relative p-2.5 text-brand-black dark:text-white hover:opacity-60 transition-opacity"
                aria-label={`View Wishlist (${wishlistCount} items)`}
                title="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand-red text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER (hidden on mobile, lg:flex) */}
          <div className="hidden lg:flex items-center justify-between h-[72px] relative">
            
            {/* LEFT NAV LINKS */}
            <nav className="flex items-center gap-8 xl:gap-10 font-body text-[13px] font-semibold tracking-wide text-brand-black dark:text-white uppercase">
              <Link href="/collections" className="hover:opacity-50 transition-opacity duration-200 py-2">
                Shop
              </Link>
              <Link href="/men" className="hover:opacity-50 transition-opacity duration-200 py-2">
                Men
              </Link>
              <Link href="/women" className="hover:opacity-50 transition-opacity duration-200 py-2">
                Women
              </Link>
              <Link href="/about" className="hover:opacity-50 transition-opacity duration-200 py-2">
                About
              </Link>
            </nav>

            {/* CENTER: BRAND LOGO */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto z-10">
              <Link href="/" className="flex items-center gap-3 group py-2 transition-opacity duration-200 hover:opacity-80">
                <BrandLogo size="md" className="transition-transform duration-300" />
                <BrandTitleText size="md" showSubtitle={false} className="shrink min-w-0" />
              </Link>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-6 xl:gap-8 font-body text-[13px] font-semibold tracking-wide text-brand-black dark:text-white uppercase">
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Open search dialog"
                className="hover:opacity-50 transition-opacity duration-200 py-2"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <button
                type="button"
                onClick={() => setWishlistModalOpen(true)}
                aria-label={`Open Wishlist (${wishlistCount} items)`}
                className="hover:opacity-50 transition-opacity duration-200 py-2 relative"
              >
                <Heart className="w-[18px] h-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-2 bg-brand-red text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  aria-label="Open Account Menu"
                  aria-expanded={userDropdownOpen}
                  className="hover:opacity-50 transition-opacity duration-200 py-2 flex items-center gap-1"
                >
                  <UserIcon className="w-[18px] h-[18px]" />
                </button>

                {/* Account Dropdown */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-2xl p-5 space-y-4 z-50 font-body text-xs animate-fade-in select-none"
                  >
                    {/* Top accent */}
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                      <span className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest">
                        Account
                      </span>
                    </div>

                    {currentUser ? (
                      <>
                        <div className="space-y-1">
                          <p className="text-[10px] font-medium text-brand-stone uppercase tracking-wide">Signed in as</p>
                          <p className="text-sm font-semibold text-brand-black dark:text-white truncate">
                            {currentUser.displayName || currentUser.email || 'Customer'}
                          </p>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-3 bg-neutral-50 dark:bg-neutral-900 hover:bg-brand-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-xs rounded-xl transition-all duration-200"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>My Orders & Profile</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 p-2.5 text-brand-red hover:bg-brand-red hover:text-white font-semibold text-xs rounded-xl border border-brand-red/20 transition-all duration-200"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1.5">
                          <p className="font-heading text-sm font-bold text-brand-black dark:text-white">
                            Welcome
                          </p>
                          <p className="text-[11px] text-brand-stone leading-relaxed">
                            Sign in to save wishlist items, track orders and manage delivery addresses.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setAuthModalOpen(true);
                          }}
                          className="w-full py-3 bg-brand-black dark:bg-white text-white dark:text-black font-semibold text-xs uppercase tracking-wider rounded-full transition-all duration-200 hover:bg-brand-red hover:text-white dark:hover:bg-brand-red"
                        >
                          Sign In / Register
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

      {/* FULL SCREEN MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black text-brand-black dark:text-white flex flex-col font-body overflow-y-auto animate-fade-in">
          
          {/* Drawer Top Header */}
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3"
            >
              <BrandLogo size="md" />
              <BrandTitleText size="md" showSubtitle={false} />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Nav Content */}
          <div className="flex-1 px-6 py-8 space-y-2">
            
            {/* Quick Auth Banner */}
            {!currentUser && (
              <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-950 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Account</p>
                  <p className="text-xs text-brand-stone">Track orders & wishlist</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 bg-brand-black dark:bg-white text-white dark:text-black text-[11px] font-semibold uppercase tracking-wider rounded-full"
                >
                  Sign In
                </button>
              </div>
            )}

            {currentUser && (
              <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-950 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-brand-stone uppercase tracking-wide">Signed in</p>
                  <p className="text-sm font-semibold truncate max-w-[180px]">
                    {currentUser.displayName || currentUser.email || 'Customer'}
                  </p>
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-brand-black dark:bg-white text-white dark:text-black text-[11px] font-semibold uppercase tracking-wider rounded-full"
                >
                  Account
                </Link>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-0">
              
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-4 text-2xl font-heading font-bold tracking-tight border-b border-neutral-100 dark:border-neutral-900 hover:opacity-60 transition-opacity"
              >
                Shop All
              </Link>

              {/* MEN ACCORDION */}
              <div className="border-b border-neutral-100 dark:border-neutral-900">
                <button
                  onClick={() => toggleAccordion('men')}
                  className="w-full py-4 flex items-center justify-between text-left text-2xl font-heading font-bold tracking-tight hover:opacity-60 transition-opacity"
                >
                  <span>Men</span>
                  {openAccordion === 'men' ? (
                    <Minus className="w-5 h-5 text-brand-stone" />
                  ) : (
                    <Plus className="w-5 h-5 text-brand-stone" />
                  )}
                </button>
                {openAccordion === 'men' && (
                  <div className="pl-1 pb-4 space-y-3 text-base text-brand-muted">
                    <Link
                      href="/men"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-brand-black dark:hover:text-white transition-colors"
                    >
                      All Men&apos;s Footwear
                    </Link>
                    <Link
                      href="/collections/slippers"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-brand-black dark:hover:text-white transition-colors"
                    >
                      Slippers & Flip-Flops
                    </Link>
                    <Link
                      href="/collections/slides"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-brand-black dark:hover:text-white transition-colors"
                    >
                      Slides & Clogs
                    </Link>
                    <Link
                      href="/collections/casual-shoes"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-brand-black dark:hover:text-white transition-colors"
                    >
                      Sneakers & Casual
                    </Link>
                  </div>
                )}
              </div>

              {/* WOMEN ACCORDION */}
              <div className="border-b border-neutral-100 dark:border-neutral-900">
                <button
                  onClick={() => toggleAccordion('women')}
                  className="w-full py-4 flex items-center justify-between text-left text-2xl font-heading font-bold tracking-tight hover:opacity-60 transition-opacity"
                >
                  <span>Women</span>
                  {openAccordion === 'women' ? (
                    <Minus className="w-5 h-5 text-brand-stone" />
                  ) : (
                    <Plus className="w-5 h-5 text-brand-stone" />
                  )}
                </button>
                {openAccordion === 'women' && (
                  <div className="pl-1 pb-4 space-y-3 text-base text-brand-muted">
                    <Link
                      href="/women"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-brand-black dark:hover:text-white transition-colors"
                    >
                      All Women&apos;s Footwear
                    </Link>
                    <Link
                      href="/collections/slides"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-brand-black dark:hover:text-white transition-colors"
                    >
                      Slides & Slippers
                    </Link>
                    <Link
                      href="/collections/sandals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1 hover:text-brand-black dark:hover:text-white transition-colors"
                    >
                      Sandals & Flats
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-4 text-2xl font-heading font-bold tracking-tight border-b border-neutral-100 dark:border-neutral-900 hover:opacity-60 transition-opacity"
              >
                About
              </Link>
            </div>

            {/* Social & Contact */}
            <div className="pt-8 space-y-4">
              <p className="text-xs font-medium text-brand-stone uppercase tracking-widest">
                Follow Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-full hover:border-brand-black dark:hover:border-white transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-full hover:border-brand-black dark:hover:border-white transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border border-neutral-200 dark:border-neutral-800 rounded-full hover:border-brand-black dark:hover:border-white transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="px-6 py-5 border-t border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-xs text-brand-stone">
              © {new Date().getFullYear()} Bliss Balance Footwear
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
