import { FootwearSKU, CollectionItem, SiteSettings } from './types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText: 'FREE SHIPPING ON ORDERS OVER ₹799 • EASY 7-DAY RETURNS • CUSHIONED & ANTI-SKID FOOTWEAR • OFFICIAL STORE',
  heroHeadline: 'FEEL THE BLISS',
  heroSubheadline: 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.',
  heroImageDimensions: '1200 x 600 px (2:1 Wide Banner)',
  heroImageUrl: '/hero-banner.png',
  appScriptUrl: process.env.NEXT_PUBLIC_APPSCRIPT_URL || 'https://script.google.com/macros/s/AKfycbykDG_64LHgNhlS6gu-TowyNkTAC2Qfl3ohBoKmzQaub5oD0jj8Ah2Ow227lLG4D45ZzA/exec',
  googleDriveFolderId: '1_BlissBalance_Footwear_Drive_Folder_ID',
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LfVFIktAAAAAPRSJXz5I8lCUjX4vmXpnl0jCjoa',
  adminEmail: 'blissbalance.in@gmail.com',
};

export const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    title: 'Men\'s Slippers & Slides',
    gender: 'Men',
    description: 'Soft cushioned slippers & slides engineered for all-day indoor & relaxed wear.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/mens-slippers.jpg',
    slug: 'mens-slippers',
  },
  {
    id: 'col-2',
    title: 'Men\'s Casual & Sneakers',
    gender: 'Men',
    description: 'Contemporary streetwear sneakers with cushioned soles for college, parties & daily wear.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/mens-casual-sneakers.jpg',
    slug: 'mens-casual-sneakers',
  },
  {
    id: 'col-3',
    title: 'Women\'s Slippers & Slides',
    gender: 'Women',
    description: 'Ultra-lightweight everyday slippers and stylish slides designed for easy steps.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/womens-slippers-slides.jpg',
    slug: 'womens-slippers-slides',
  },
  {
    id: 'col-4',
    title: 'Women\'s Sandals & Flats',
    gender: 'Women',
    description: 'Supportive contours and modern aesthetics for versatile daily wear.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/womens-sandals-flats.jpg',
    slug: 'womens-sandals-flats',
  },
  {
    id: 'col-5',
    title: 'Women\'s Clogs & Sneakers',
    gender: 'Women',
    description: 'Cushioned everyday walking footwear designed for outdoor and casual life.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/womens-clogs-sneakers.jpg',
    slug: 'womens-clogs-sneakers',
  },
  {
    id: 'col-6',
    title: 'Kids\' Crocs & Clogs',
    gender: 'Unisex',
    description: 'Durable anti-skid lightweight clogs & crocs for kids active playtime.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/kids-crocs.jpg',
    slug: 'kids-crocs',
  },
];

// ZERO HARDCODED / DEFAULT PRODUCTS - STRICTLY READS FROM LIVE ADMIN / GOOGLE SHEETS
export const INITIAL_SKUS: FootwearSKU[] = [];

// Persistence Storage Keys
const SKUS_STORAGE_KEY = 'bliss_balance_skus_v2';
const SETTINGS_STORAGE_KEY = 'bliss_balance_settings_v2';

// TURBO SPEED MEMORY CACHE & PROMISE DEDUPLICATION ENGINE
let memorySkusCache: FootwearSKU[] | null = null;
let lastSkusFetchTime = 0;
let inFlightSkusPromise: Promise<FootwearSKU[]> | null = null;

let memorySettingsCache: SiteSettings | null = null;
let lastSettingsFetchTime = 0;
let inFlightSettingsPromise: Promise<SiteSettings> | null = null;

const CACHE_TTL_MS = 3 * 60 * 1000; // 3-minute high-speed in-memory TTL

export function getStoredSKUs(): FootwearSKU[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SKUS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (e) {
    return [];
  }
}

export function saveStoredSKUs(skus: FootwearSKU[]) {
  if (typeof window === 'undefined') return;
  try {
    memorySkusCache = skus;
    lastSkusFetchTime = Date.now();
    localStorage.setItem(SKUS_STORAGE_KEY, JSON.stringify(skus));
  } catch (e) {
    console.error('Error saving SKUs:', e);
  }
}

export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...DEFAULT_SITE_SETTINGS, ...parsed };
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (e) {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveStoredSettings(settings: SiteSettings) {
  if (typeof window === 'undefined') return;
  try {
    memorySettingsCache = settings;
    lastSettingsFetchTime = Date.now();
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

/**
 * ⚡ TURBO SPEED DYNAMIC CLOUD FETCH WITH IN-MEMORY PROMISE DEDUPLICATION
 * Loads in 0 MILLISECONDS for cached requests!
 */
export async function fetchCloudSKUs(appScriptUrl?: string, forceRefresh = false): Promise<FootwearSKU[]> {
  const local = getStoredSKUs();
  const now = Date.now();

  // 1. INSTANT RETURN (0ms): Return in-memory cache if fresh
  if (!forceRefresh && memorySkusCache && (now - lastSkusFetchTime < CACHE_TTL_MS)) {
    return memorySkusCache;
  }

  // 2. DEDUPLICATED IN-FLIGHT PROMISE: Re-use network request if already in progress
  if (inFlightSkusPromise) {
    return inFlightSkusPromise;
  }

  const url = appScriptUrl || DEFAULT_SITE_SETTINGS.appScriptUrl;
  if (!url || url.includes('EXAMPLE')) {
    memorySkusCache = local;
    return local;
  }

  inFlightSkusPromise = (async () => {
    try {
      const res = await fetch(`${url}?action=getProducts`, { method: 'GET' });
      const data = await res.json();
      if (data && data.products && Array.isArray(data.products)) {
        memorySkusCache = data.products;
        lastSkusFetchTime = Date.now();
        saveStoredSKUs(data.products);
        return data.products;
      }
    } catch (e) {
      console.warn('Could not fetch live cloud products:', e);
    } finally {
      inFlightSkusPromise = null;
    }
    memorySkusCache = local;
    return local;
  })();

  return inFlightSkusPromise;
}

export async function fetchCloudSettings(appScriptUrl?: string, forceRefresh = false): Promise<SiteSettings> {
  const local = getStoredSettings();
  const now = Date.now();

  if (!forceRefresh && memorySettingsCache && (now - lastSettingsFetchTime < CACHE_TTL_MS)) {
    return memorySettingsCache;
  }

  if (inFlightSettingsPromise) {
    return inFlightSettingsPromise;
  }

  const url = appScriptUrl || DEFAULT_SITE_SETTINGS.appScriptUrl;
  if (!url || url.includes('EXAMPLE')) {
    memorySettingsCache = local;
    return local;
  }

  inFlightSettingsPromise = (async () => {
    try {
      const res = await fetch(`${url}?action=getSettings`, { method: 'GET' });
      const data = await res.json();
      if (data && data.settings && typeof data.settings === 'object') {
        const merged = { ...getStoredSettings(), ...data.settings };
        memorySettingsCache = merged;
        lastSettingsFetchTime = Date.now();
        saveStoredSettings(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Could not fetch live cloud settings:', e);
    } finally {
      inFlightSettingsPromise = null;
    }
    memorySettingsCache = local;
    return local;
  })();

  return inFlightSettingsPromise;
}
