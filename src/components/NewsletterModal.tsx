'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Mail, Phone, Sparkles, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { addStoredSubscriber } from '@/lib/dataStore';
import { upsertSupabaseSubscriber } from '@/lib/supabaseClient';
import { syncWithAppsScript } from '@/lib/appScriptSync';
import { getStoredSettings } from '@/lib/dataStore';

interface NewsletterModalProps {
  initialOpenDelayMs?: number; // default 3500ms
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({
  initialOpenDelayMs = 3500,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [countryISO, setCountryISO] = useState('IN');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Country Code Options
  const countries = [
    { iso: 'IN', code: '+91', label: 'India (+91)' },
    { iso: 'US', code: '+1', label: 'United States (+1)' },
    { iso: 'UK', code: '+44', label: 'United Kingdom (+44)' },
    { iso: 'AE', code: '+971', label: 'UAE (+971)' },
    { iso: 'SG', code: '+65', label: 'Singapore (+65)' },
    { iso: 'CA', code: '+1', label: 'Canada (+1)' },
    { iso: 'AU', code: '+61', label: 'Australia (+61)' },
  ];

  // Auto-open logic & Global listener
  useEffect(() => {
    // 1. Listen for manual trigger from anywhere (e.g. Footer or announcement bar)
    const handleOpen = () => {
      setIsSuccess(false);
      setErrorMessage('');
      setIsOpen(true);
    };

    window.addEventListener('open-newsletter-modal', handleOpen);

    // 2. Check if already subscribed or dismissed within 5 days
    try {
      const isSubscribed = localStorage.getItem('bliss_newsletter_subscribed');
      const dismissedAt = localStorage.getItem('bliss_newsletter_dismissed');

      if (isSubscribed) {
        return () => window.removeEventListener('open-newsletter-modal', handleOpen);
      }

      if (dismissedAt) {
        const diffDays = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
        if (diffDays < 5) {
          return () => window.removeEventListener('open-newsletter-modal', handleOpen);
        }
      }

      // Auto-trigger timer
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, initialOpenDelayMs);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('open-newsletter-modal', handleOpen);
      };
    } catch (e) {
      return () => window.removeEventListener('open-newsletter-modal', handleOpen);
    }
  }, [initialOpenDelayMs]);

  // Handle Close & Dismiss
  const handleClose = () => {
    setIsOpen(false);
    try {
      localStorage.setItem('bliss_newsletter_dismissed', Date.now().toString());
    } catch (e) {}
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');

    // Basic Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (cleanPhone && cleanPhone.length < 7) {
      setErrorMessage('Please enter a valid phone number or leave it blank.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Save to Local Storage
      const newSub = addStoredSubscriber({
        email: cleanEmail,
        phone: cleanPhone ? `${countryCode} ${cleanPhone}` : undefined,
        countryCode: countryCode,
        source: 'newsletter_modal',
      });

      // 2. Sync to Supabase
      upsertSupabaseSubscriber(newSub).catch(() => {});

      // 3. Sync to Google Apps Script if URL configured
      const settings = getStoredSettings();
      if (settings.appScriptUrl && !settings.appScriptUrl.includes('EXAMPLE')) {
        syncWithAppsScript(settings.appScriptUrl, {
          action: 'LOG_SUBSCRIBER',
          data: {
            email: cleanEmail,
            phone: cleanPhone ? `${countryCode} ${cleanPhone}` : '',
            countryCode,
            source: 'Website Newsletter Popup',
            date: new Date().toISOString(),
          },
        }).catch(() => {});
      }

      // 4. Mark as subscribed in localStorage
      try {
        localStorage.setItem('bliss_newsletter_subscribed', 'true');
      } catch (e) {}

      setIsLoading(false);
      setIsSuccess(true);

      // Auto close after 3.5 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3800);
    } catch (err) {
      setIsLoading(false);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-[420px] bg-white dark:bg-[#111] shadow-2xl overflow-hidden z-10 border border-neutral-200/80 dark:border-neutral-800 transition-colors"
          >
            {/* Top Close 'X' Button */}
            <button
              onClick={handleClose}
              aria-label="Close Newsletter Modal"
              className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-md transition-all active:scale-95 group"
            >
              <X className="w-4 h-4 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            </button>

            {/* Top Banner Image with Overlay */}
            <div className="relative w-full h-[220px] sm:h-[240px] overflow-hidden bg-neutral-900">
              <Image
                src="/newsletter-banner.jpg"
                alt="Bliss Balance Footwear Lifestyle"
                fill
                priority
                sizes="(max-width: 440px) 100vw, 440px"
                className="object-cover object-center brightness-95"
              />
              
              {/* Subtle Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30" />

              {/* Bold Title Overlay on Banner Image */}
              <div className="absolute inset-x-0 bottom-4 text-center px-4">
                <span className="inline-block text-white font-heading font-black tracking-wider text-lg sm:text-xl uppercase drop-shadow-md">
                  WELCOME TO BLISS BALANCE
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="p-6 sm:p-7 text-center">
              {isSuccess ? (
                /* Success View */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4 space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-brand-black dark:text-white uppercase tracking-tight">
                      You&apos;re On The List!
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xs mx-auto leading-relaxed">
                      Thank you for joining. Look out for exclusive early drop alerts and secret discount perks in your inbox.
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="mt-2 w-full py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-heading font-bold text-sm tracking-wide shadow-md transition-all active:scale-[0.98]"
                  >
                    Start Exploring
                  </button>
                </motion.div>
              ) : (
                /* Subscription Form */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Headline & Subtitle */}
                  <div className="space-y-1.5">
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium leading-snug">
                      New drops. Exclusive stories. Early access.
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal">
                      All of it, straight to your inbox
                    </p>
                  </div>

                  {/* Form Inputs Container */}
                  <div className="space-y-3 pt-2 text-left">
                    {/* 1. Email Input */}
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="Enter Your Email"
                        className="w-full px-5 py-3.5 text-xs sm:text-sm border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-brand-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                      />
                    </div>

                    {/* 2. Phone Input with Country Code Prefix */}
                    <div className="flex items-center border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all">
                      {/* Country Code Selector Badge */}
                      <div className="relative bg-neutral-100 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 px-3.5 py-3.5 flex items-center shrink-0">
                        <select
                          value={countryCode}
                          onChange={(e) => {
                            const found = countries.find(c => c.code === e.target.value);
                            setCountryCode(e.target.value);
                            if (found) setCountryISO(found.iso);
                          }}
                          aria-label="Country Dial Code"
                          className="bg-transparent text-xs font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer focus:outline-none pr-1"
                        >
                          {countries.map((c) => (
                            <option key={`${c.iso}-${c.code}`} value={c.code} className="text-black bg-white dark:bg-neutral-900 dark:text-white">
                              {c.iso} {c.code}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Number Input */}
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errorMessage) setErrorMessage('');
                        }}
                        placeholder="Enter Your Number"
                        className="flex-1 px-4 py-3.5 text-xs sm:text-sm bg-transparent text-brand-black dark:text-white placeholder-neutral-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Error Message if any */}
                  {errorMessage && (
                    <p className="text-xs text-red-500 font-medium text-center">
                      {errorMessage}
                    </p>
                  )}

                  {/* Primary CTA Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-black hover:bg-neutral-900 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-white font-heading font-bold text-sm tracking-widest uppercase shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <span>Welcome</span>
                    )}
                  </button>

                  {/* Trust badge / Privacy guarantee */}
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center flex items-center justify-center gap-1.5 pt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    No spam ever. Unsubscribe with one click anytime.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
