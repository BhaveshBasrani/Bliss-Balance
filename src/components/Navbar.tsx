'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  X,
  User as UserIcon,
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
      <header className="sticky top-0 z-40 w-full bg-white/98 dark:bg-black/98 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300 select-none">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          
          {/* MOBILE HEADER */}
          <div className="flex lg:hidden items-center justify-between h-16 w-full">
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 text-neutral-950 dark:text-white hover:opacity-60 transition-opacity"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            <Link href="/" className="flex items-center gap-2 group shrink min-w-0 mx-2">
              <BrandLogo size="sm" />
              <BrandTitleText size="sm" showSubtitle={false} className="shrink min-w-0" />
            </Link>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-neutral-950 dark:text-white hover:opacity-60 transition-opacity"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setWishlistModalOpen(true)}
                className="relative p-2 text-neutral-950 dark:text-white hover:opacity-60 transition-opacity"
                aria-label={`View Wishlist (${wishlistCount} items)`}
                title="View Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-black text-white dark:bg-white dark:text-black text-[8px] font-mono font-black px-1 leading-none py-0.5 border border-black dark:border-white">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER */}
          <div className="hidden lg:flex items-center justify-between h-[72px] relative">
            
            {/* LEFT LINKS */}
            <nav className="flex items-center gap-8 xl:gap-10 font-heading text-[12px] font-black tracking-widest text-neutral-950 dark:text-white uppercase">
              <Link href="/collections" className="hover:text-neutral-500 transition-colors py-2">
                Shop All
              </Link>
              <Link href="/men" className="hover:text-neutral-500 transition-colors py-2">
                Men
              </Link>
              <Link href="/women" className="hover:text-neutral-500 transition-colors py-2">
                Women
              </Link>
              <Link href="/about" className="hover:text-neutral-500 transition-colors py-2">
                About
              </Link>
            </nav>

            {/* CENTER LOGO */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto z-10">
              <Link href="/" className="flex items-center gap-3 group py-2 transition-opacity duration-200 hover:opacity-80">
                <BrandLogo size="md" className="transition-transform duration-300" />
                <BrandTitleText size="md" showSubtitle={false} className="shrink min-w-0" />
              </Link>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-6 xl:gap-8 font-heading text-[12px] font-black tracking-widest text-neutral-950 dark:text-white uppercase">
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Open search dialog"
                className="hover:opacity-50 transition-opacity py-2"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setWishlistModalOpen(true)}
                aria-label={`Open Wishlist (${wishlistCount} items)`}
                className="hover:opacity-50 transition-opacity py-2 relative"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-black text-white dark:bg-white dark:text-black text-[8px] font-mono font-black px-1.5 py-0.5 leading-none border border-black dark:border-white">
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
                  className="hover:opacity-80 transition-opacity py-1.5 flex items-center gap-1.5"
                >
                  {currentUser?.photoURL ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-black dark:border-white shrink-0">
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'Account'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : currentUser ? (
                    <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black border border-black shrink-0">
                      {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                    </div>
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Account Dropdown */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-neutral-950 border-2 border-black dark:border-neutral-700 shadow-2xl p-5 space-y-4 z-50 text-xs animate-fade-in select-none"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                      <span className="text-[10px] font-mono font-black text-neutral-400 uppercase tracking-widest">
                        MY ACCOUNT
                      </span>
                    </div>

                    {currentUser ? (
                      <>
                        <div className="flex items-center gap-3">
                          {currentUser.photoURL ? (
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-black dark:border-white shrink-0">
                              <img
                                src={currentUser.photoURL}
                                alt={currentUser.displayName || 'Profile'}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm border border-black shrink-0">
                              {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
                            </div>
                          )}
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <p className="text-[10px] font-mono text-neutral-400 uppercase">Signed in as</p>
                            <p className="text-sm font-heading font-black text-neutral-950 dark:text-white truncate">
                              {currentUser.displayName || currentUser.email || 'Customer'}
                            </p>
                          </div>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 p-3 bg-neutral-100 dark:bg-neutral-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-heading font-black text-xs uppercase tracking-wider transition-all"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Orders & Profile</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center gap-2 p-2.5 bg-neutral-50 dark:bg-neutral-900 text-neutral-600 hover:bg-black hover:text-white dark:text-neutral-400 dark:hover:bg-white dark:hover:text-black font-heading font-black text-xs uppercase tracking-wider border border-neutral-200 dark:border-neutral-800 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <p className="font-heading text-sm font-black text-neutral-950 dark:text-white uppercase">
                            Welcome
                          </p>
                          <p className="text-[11px] text-neutral-500 leading-relaxed font-body">
                            Sign in to save wishlist items, track orders and manage addresses.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setAuthModalOpen(true);
                          }}
                          className="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-heading font-black text-xs uppercase tracking-widest hover:bg-[#E60000] hover:text-white transition-all border border-black"
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
        <div className="fixed inset-0 z-50 bg-white dark:bg-black text-neutral-950 dark:text-white flex flex-col overflow-y-auto animate-fade-in">
          
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
              className="p-2 border border-neutral-200 dark:border-neutral-800 hover:bg-black hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-6 py-6 space-y-4">
            
            {!currentUser ? (
              <div className="p-4 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-heading font-black uppercase">Account</p>
                  <p className="text-[11px] text-neutral-500 font-mono">Orders & wishlist</p>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-[10px] font-heading font-black uppercase tracking-wider"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="p-4 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-mono text-neutral-400 uppercase">Signed in</p>
                  <p className="text-xs font-heading font-black truncate max-w-[170px]">
                    {currentUser.displayName || currentUser.email || 'Customer'}
                  </p>
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-[10px] font-heading font-black uppercase tracking-wider"
                >
                  Account
                </Link>
              </div>
            )}

            {/* Links */}
            <div>
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3.5 text-xl font-heading font-black uppercase tracking-tight border-b border-neutral-200 dark:border-neutral-800 hover:text-neutral-500"
              >
                Shop All
              </Link>

              {/* MEN ACCORDION */}
              <div className="border-b border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => toggleAccordion('men')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xl font-heading font-black uppercase tracking-tight hover:text-neutral-500"
                >
                  <span>Men</span>
                  {openAccordion === 'men' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
                {openAccordion === 'men' && (
                  <div className="pl-2 pb-4 space-y-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    <Link href="/men" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-black dark:hover:text-white">All Men&apos;s Footwear</Link>
                    <Link href="/collections/slippers" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-black dark:hover:text-white">Ortho Slippers</Link>
                    <Link href="/collections/slides" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-black dark:hover:text-white">Comfort Slides</Link>
                    <Link href="/collections/casual-shoes" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-black dark:hover:text-white">Street Sneakers</Link>
                  </div>
                )}
              </div>

              {/* WOMEN ACCORDION */}
              <div className="border-b border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={() => toggleAccordion('women')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xl font-heading font-black uppercase tracking-tight hover:text-neutral-500"
                >
                  <span>Women</span>
                  {openAccordion === 'women' ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
                {openAccordion === 'women' && (
                  <div className="pl-2 pb-4 space-y-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    <Link href="/women" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-black dark:hover:text-white">All Women&apos;s Footwear</Link>
                    <Link href="/collections/slides" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-black dark:hover:text-white">Slides & Slippers</Link>
                    <Link href="/collections/sandals" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-black dark:hover:text-white">Ergonomic Sandals</Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3.5 text-xl font-heading font-black uppercase tracking-tight border-b border-neutral-200 dark:border-neutral-800 hover:text-neutral-500"
              >
                About
              </Link>
            </div>

            {/* Social icons */}
            <div className="pt-6 space-y-3">
              <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                Connect
              </p>
              <div className="flex items-center gap-2">
                {[
                  { icon: Instagram, href: "https://www.instagram.com/blissbalance.co", label: "Instagram" },
                  { icon: Facebook, href: "https://www.facebook.com/share/1Bhmz8KL1w/", label: "Facebook" },
                  { icon: Twitter, href: "https://x.com/blissbalance_", label: "Twitter" },
                  { icon: Youtube, href: "https://youtube.com/@blissbalance_26?si=5xinn2mC-29ifst9", label: "YouTube" },
                  { icon: MessageSquare, href: "https://wa.me/919440961776", label: "WhatsApp" },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border border-neutral-200 dark:border-neutral-800 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

          </div>

          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 text-center">
            <p className="text-[11px] font-mono text-neutral-400">
              © {new Date().getFullYear()} BLISS BALANCE®
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
