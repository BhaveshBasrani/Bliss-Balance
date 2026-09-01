'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { recordSupabaseVisit } from '@/lib/supabaseClient';
import { auth } from '@/lib/firebase';

const VISITOR_ID_KEY = 'bliss_balance_visitor_id';
const SESSION_ID_KEY = 'bliss_balance_session_id';

function getOrSetVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = 'v_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch (e) {
    return 'anon_visitor_' + Math.random().toString(36).slice(2, 8);
  }
}

function getOrSetSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = 's_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch (e) {
    return 'anon_session_' + Math.random().toString(36).slice(2, 8);
  }
}

function detectDevice(): { deviceType: string; browser: string; os: string } {
  if (typeof window === 'undefined') {
    return { deviceType: 'Desktop', browser: 'Unknown', os: 'Unknown' };
  }

  const ua = navigator.userAgent || '';
  
  // Device Type
  let deviceType = 'Desktop';
  if (/iPad|Tablet|PlayBook/i.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/i.test(ua))) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle/i.test(ua)) {
    deviceType = 'Mobile';
  }

  // OS
  let os = 'Unknown';
  if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Mac/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Browser
  let browser = 'Unknown';
  if (/Instagram/i.test(ua)) browser = 'Instagram App';
  else if (/FBAN|FBAV/i.test(ua)) browser = 'Facebook App';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

  return { deviceType, browser, os };
}

function TrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string>('');

  useEffect(() => {
    if (pathname && pathname.startsWith('/admin')) {
      return;
    }

    const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    if (lastTrackedPath.current === currentUrl) {
      return;
    }
    lastTrackedPath.current = currentUrl;

    const timer = setTimeout(() => {
      const visitorId = getOrSetVisitorId();
      const sessionId = getOrSetSessionId();
      const { deviceType, browser, os } = detectDevice();

      const utmSource = searchParams?.get('utm_source') || undefined;
      const utmMedium = searchParams?.get('utm_medium') || undefined;
      const utmCampaign = searchParams?.get('utm_campaign') || undefined;

      let referrer = document.referrer || 'Direct';
      if (referrer && referrer.includes(window.location.hostname)) {
        referrer = 'Internal';
      } else if (referrer.includes('instagram.com')) {
        referrer = 'Instagram';
      } else if (referrer.includes('google.com')) {
        referrer = 'Google Search';
      } else if (referrer.includes('facebook.com')) {
        referrer = 'Facebook';
      } else if (referrer.includes('t.co') || referrer.includes('twitter.com') || referrer.includes('x.com')) {
        referrer = 'Twitter / X';
      } else if (referrer.includes('youtube.com')) {
        referrer = 'YouTube';
      } else if (referrer.includes('whatsapp')) {
        referrer = 'WhatsApp';
      }

      if (utmSource) {
        referrer = `${utmSource} (Campaign)`;
      }

      const userEmail = auth?.currentUser?.email || undefined;

      recordSupabaseVisit({
        visitorId,
        sessionId,
        pagePath: pathname || '/',
        pageTitle: document.title || 'Bliss Balance',
        referrer,
        deviceType,
        browser,
        os,
        utmSource,
        utmMedium,
        utmCampaign,
        userEmail,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  );
}
