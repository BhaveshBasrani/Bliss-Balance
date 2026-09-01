'use client';

import { useEffect } from 'react';

export function ConsoleSecurityBanner() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if warning has already been printed in current page session
    if ((window as any).__BLISS_CONSOLE_WARNING_PRINTED__) return;
    (window as any).__BLISS_CONSOLE_WARNING_PRINTED__ = true;

    try {
      // 1. Massive Bold Red "Stop!" Banner
      console.log(
        '%cStop!',
        'color: #E60000; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 64px; font-weight: 900; -webkit-text-stroke: 1.5px #000; text-shadow: 2px 2px 0px #000, -1px -1px 0px #000;'
      );

      // 2. Anti-Self-XSS Security Warning Text
      console.log(
        '%cThis is a browser feature intended for developers. If someone told you to copy-paste something here to enable a feature, get discount promo codes, or "hack" someone\'s account, it is a scam and will give them access to your account and personal data.\n\nSee https://en.wikipedia.org/wiki/Self-XSS for more information.',
        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #E5E7EB; line-height: 1.6;'
      );

      // 3. Official Brand Authenticity Stamp
      console.log(
        '%c⚡ BLISS BALANCE® OFFICIAL CONTROL STATION • ALL RIGHTS RESERVED • https://blissbalance.co',
        'font-family: monospace; font-size: 11px; font-weight: bold; color: #E60000; padding-top: 8px;'
      );
    } catch (e) {}
  }, []);

  return null;
}
