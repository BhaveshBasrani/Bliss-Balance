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
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-black border-b-2 border-neutral-900 dark:border-neutral-100 transition-colors duration-300 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo & Title with Custom Pi-Arch 'A' */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <BrandLogo size="md" className="group-hover:scale-105 transition-transform duration-300 rounded-none border border-black dark:border-white" />

              <BrandTitleText size="md" showSubtitle={true} />
            </Link>

            {/* Desktop Category Links */}
            <nav className="hidden lg:flex items-center space-x-6">
              {desktopNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-mono font-black tracking-widest text-neutral-900 dark:text-neutral-100 hover:text-red-600 dark:hover:text-red-500 transition-colors py-2 relative group uppercase"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/about"
                className="hidden md:inline-block text-xs font-mono font-black text-neutral-900 dark:text-neutral-100 hover:text-red-600 transition-colors uppercase tracking-wider px-2 py-1 border border-transparent hover:border-neutral-900 dark:hover:border-neutral-100"
              >
                ABOUT US
              </Link>

              {/* Wishlist Button */}
              <button
                onClick={() => setWishlistModalOpen(true)}
                className="relative p-2.5 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                title="View Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white font-mono text-[9px] font-black w-5 h-5 border border-black flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="p-2.5 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
                title="Search Footwear"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* User Account Avatar Dropdown (Desktop Only) */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  onMouseEnter={() => setUserDropdownOpen(true)}
                  className="p-2.5 rounded-none bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-all flex items-center gap-1.5"
                  title="Account Menu"
                >
                  <UserIcon className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-64 rounded-none bg-white dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-100 shadow-2xl p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150 font-mono"
                  >
                    {currentUser ? (
                      <>
                        <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase">LOGGED IN AS</p>
                          <p className="text-xs font-black text-neutral-950 dark:text-white truncate">
                            {currentUser.displayName || currentUser.email || 'Customer'}
                          </p>
                        </div>

                        <Link
                          href="/account"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 p-2 rounded-none hover:bg-neutral-100 dark:hover:bg-neutral-900 text-xs font-bold uppercase transition-all"
                        >
                          <UserIcon className="w-4 h-4 text-red-600" />
                          <span>MY ORDERS & PROFILE</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 p-2 rounded-none hover:bg-red-600 hover:text-white text-xs font-bold uppercase text-red-600 transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>SIGN OUT</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <h4 className="font-heading text-sm font-black uppercase text-neutral-950 dark:text-white">
                            WELCOME TO BLISS BALANCE
                          </h4>
                          <p className="text-[11px] text-neutral-500 font-body">
                            Sign in to track orders, save wishlist items, and manage addresses.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setAuthModalOpen(true);
                          }}
                          className="w-full py-2.5 bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all shadow-md"
                        >
                          SIGN IN / REGISTER
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Hamburger Trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 rounded-none bg-neutral-100 dark:bg-neutral-900 border-2 border-neutral-900 dark:border-neutral-100 text-neutral-950 dark:text-white"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ONE8 / COMET STYLE DRAWER SIDEBAR NAVIGATION OVERLAY */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex font-mono select-none">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar Container */}
          <div className="relative w-full max-w-md bg-white dark:bg-black border-r-2 border-neutral-900 dark:border-neutral-100 h-full flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            
            {/* Drawer Top Header Bar */}
            <div className="flex items-center justify-between p-5 border-b-2 border-neutral-900 dark:border-neutral-100 bg-white dark:bg-black">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2"
              >
                <BrandLogo size="sm" />
                <BrandTitleText size="sm" />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-900 dark:border-neutral-100 hover:bg-red-600 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Drawer Body with Accordion Navigation */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Account Quick Action Banner */}
              <div className="p-4 rounded-none bg-neutral-50 dark:bg-neutral-950 border border-neutral-900 dark:border-neutral-100 flex items-center justify-between">
                {currentUser ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-red-600 text-white font-black flex items-center justify-center text-sm border border-black">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block">LOGGED IN</span>
                      <span className="text-xs font-black text-neutral-950 dark:text-white line-clamp-1">
                        {currentUser.displayName || currentUser.email}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black uppercase text-neutral-950 dark:text-white">CUSTOMER ACCOUNT</span>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setAuthModalOpen(true);
                      }}
                      className="px-4 py-2 bg-red-600 text-white font-black text-xs uppercase"
                    >
                      LOGIN / REGISTER
                    </button>
                  </div>
                )}
              </div>

              {/* Accordions */}
              <div className="space-y-4">
                
                {/* 1. SHOP FOOTWEAR ACCORDION */}
                <div className="border border-neutral-900 dark:border-neutral-100 rounded-none overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('shop')}
                    className="w-full p-4 flex items-center justify-between bg-neutral-100 dark:bg-neutral-900 font-heading font-black text-sm uppercase tracking-wider text-neutral-950 dark:text-white"
                  >
                    <span>SHOP FOOTWEAR</span>
                    {openAccordion === 'shop' ? <Minus className="w-4 h-4 text-red-600" /> : <Plus className="w-4 h-4" />}
                  </button>

                  {openAccordion === 'shop' && (
                    <div className="p-4 bg-white dark:bg-black space-y-2 border-t border-neutral-900 dark:border-neutral-100 font-mono text-xs font-bold">
                      <Link
                        href="/men"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 hover:text-red-600 transition-colors border-b border-neutral-200 dark:border-neutral-900"
                      >
                        ⚡ MEN'S FOOTWEAR
                      </Link>
                      <Link
                        href="/women"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 hover:text-red-600 transition-colors border-b border-neutral-200 dark:border-neutral-900"
                      >
                        ⚡ WOMEN'S FOOTWEAR
                      </Link>
                      <Link
                        href="/collections?cat=Slippers"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 hover:text-red-600 transition-colors"
                      >
                        SLIPPERS & FLIP-FLOPS
                      </Link>
                      <Link
                        href="/collections?cat=Slides"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 hover:text-red-600 transition-colors"
                      >
                        SLIDES & SANDALS
                      </Link>
                      <Link
                        href="/collections?cat=Clogs"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 hover:text-red-600 transition-colors"
                      >
                        CLOGS & CROCS
                      </Link>
                      <Link
                        href="/collections?cat=Casual+Shoes"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 hover:text-red-600 transition-colors"
                      >
                        SNEAKERS & SHOES
                      </Link>
                    </div>
                  )}
                </div>

                {/* 2. CUSTOMER HELP ACCORDION */}
                <div className="border border-neutral-900 dark:border-neutral-100 rounded-none overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('help')}
                    className="w-full p-4 flex items-center justify-between bg-neutral-100 dark:bg-neutral-900 font-heading font-black text-sm uppercase tracking-wider text-neutral-950 dark:text-white"
                  >
                    <span>CUSTOMER SUPPORT</span>
                    {openAccordion === 'help' ? <Minus className="w-4 h-4 text-red-600" /> : <Plus className="w-4 h-4" />}
                  </button>

                  {openAccordion === 'help' && (
                    <div className="p-4 bg-white dark:bg-black space-y-2 border-t border-neutral-900 dark:border-neutral-100 font-mono text-xs font-bold">
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 hover:text-red-600 transition-colors"
                      >
                        TRACK MY ORDER
                      </Link>
                      <Link
                        href="/faq"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 hover:text-red-600 transition-colors"
                      >
                        FAQ & RETURNS POLICY
                      </Link>
                      <Link
                        href="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 hover:text-red-600 transition-colors"
                      >
                        ABOUT BLISS BALANCE
                      </Link>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Drawer Bottom Bar */}
            <div className="p-5 border-t-2 border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-950 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-neutral-500 uppercase">CONNECT WITH US</span>
                <div className="flex items-center gap-3">
                  <a href="https://www.facebook.com/share/1Bhmz8KL1w/" target="_blank" rel="noopener noreferrer" className="hover:text-red-600"><Facebook className="w-4 h-4" /></a>
                  <a href="https://x.com/blissbalance_" target="_blank" rel="noopener noreferrer" className="hover:text-red-600"><Twitter className="w-4 h-4" /></a>
                  <a href="https://youtube.com/@blissbalance_26?si=5xinn2mC-29ifst9" target="_blank" rel="noopener noreferrer" className="hover:text-red-600"><Youtube className="w-4 h-4" /></a>
                </div>
              </div>

              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-none bg-neutral-900 text-white dark:bg-neutral-100 dark:text-black font-black text-xs uppercase"
                >
                  LOGOUT ACCOUNT
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={wishlistModalOpen}
        onClose={() => setWishlistModalOpen(false)}
      />
    </>
  );
};
