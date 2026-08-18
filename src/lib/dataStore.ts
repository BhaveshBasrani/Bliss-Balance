import { FootwearSKU, SiteSettings, CollectionItem } from './types';
import { fetchSupabaseSKUs } from './supabaseClient';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText: 'EASY 7-DAY RETURNS & REPLACEMENTS • CUSHIONED & ANTI-SKID FOOTWEAR • OFFICIAL ONLINE STORE • MADE IN INDIA',
  heroHeadline: 'FEEL THE BLISS',
  heroSubheadline: 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.',
  heroImageDimensions: '1200 x 600 px (2:1 Wide Banner)',
  heroImageUrl: '/hero-banner.png',
  appScriptUrl: 'https://script.google.com/macros/s/AKfycbzEXAMPLE/exec',
  recaptchaSiteKey: '6LfVFIktAAAAAPRSJXz5I8lCUjX4vmXpnl0jCjoa',
  adminEmail: 'admin@blissbalance.co',
  googleDriveFolderId: '',
  isEmailEnabled: true,
};

export const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    title: 'Men\'s Slippers & Slides',
    gender: 'Men',
    description: 'Soft cushioned slippers & slides engineered for all-day indoor & relaxed wear.',
    imageDimensions: '800 x 600 px (4:3 Horizontal Banner)',
    imageUrl: '/collections/mens-slippers.jpg',
    slug: 'mens-slippers',
  },
  {
    id: 'col-2',
    title: 'Men\'s Casual & Sneakers',
    gender: 'Men',
    description: 'Contemporary streetwear sneakers with cushioned soles for college, parties & daily wear.',
    imageDimensions: '800 x 600 px (4:3 Horizontal Banner)',
    imageUrl: '/collections/mens-casual-sneakers.jpg',
    slug: 'mens-casual-sneakers',
  },
  {
    id: 'col-3',
    title: 'Women\'s Slippers & Slides',
    gender: 'Women',
    description: 'Ultra-lightweight everyday slippers and stylish slides designed for easy steps.',
    imageDimensions: '800 x 600 px (4:3 Horizontal Banner)',
    imageUrl: '/collections/womens-slippers-slides.jpg',
    slug: 'womens-slippers-slides',
  },
  {
    id: 'col-4',
    title: 'Women\'s Sandals & Flats',
    gender: 'Women',
    description: 'Supportive contours and modern aesthetics for versatile daily wear.',
    imageDimensions: '800 x 600 px (4:3 Horizontal Banner)',
    imageUrl: '/collections/womens-sandals-flats.jpg',
    slug: 'womens-sandals-flats',
  },
  {
    id: 'col-5',
    title: 'Women\'s Clogs & Sneakers',
    gender: 'Women',
    description: 'Cushioned everyday walking footwear designed for outdoor and casual life.',
    imageDimensions: '800 x 600 px (4:3 Horizontal Banner)',
    imageUrl: '/collections/womens-clogs-sneakers.jpg',
    slug: 'womens-clogs-sneakers',
  },
  {
    id: 'col-6',
    title: 'Kids\' Crocs & Clogs',
    gender: 'Kids',
    description: 'Durable anti-skid lightweight clogs & crocs for kids active playtime.',
    imageDimensions: '800 x 600 px (4:3 Horizontal Banner)',
    imageUrl: '/collections/kids.jpg',
    slug: 'kids-crocs',
  },
];

export const INITIAL_SKUS: FootwearSKU[] = [];

// Persistence Storage Keys
const SKUS_STORAGE_KEY = 'bliss_balance_skus_v2';
const SKUS_STORAGE_FALLBACK_KEY = 'bliss_balance_skus';
const SETTINGS_STORAGE_KEY = 'bliss_balance_settings_v2';

// TURBO SPEED MEMORY CACHE
let memorySkusCache: FootwearSKU[] | null = null;
let lastSkusFetchTime = 0;
let inFlightSkusPromise: Promise<FootwearSKU[]> | null = null;

let memorySettingsCache: SiteSettings | null = null;
let lastSettingsFetchTime = 0;
let inFlightSettingsPromise: Promise<SiteSettings> | null = null;

const CACHE_TTL_MS = 15 * 1000; // 15s refresh TTL

export function mergeSKUArrays(primary: FootwearSKU[], secondary: FootwearSKU[]): FootwearSKU[] {
  const map = new Map<string, FootwearSKU>();
  
  // 1. Load primary list first
  (primary || []).forEach(item => {
    if (item && item.id) map.set(item.id.toLowerCase(), item);
  });

  // 2. Merge secondary list (updating existing or appending new)
  (secondary || []).forEach(item => {
    if (item && item.id) {
      const key = item.id.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        map.set(key, { ...existing, ...item });
      } else {
        map.set(key, item);
      }
    }
  });

  return Array.from(map.values());
}

export function getStoredSKUs(): FootwearSKU[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SKUS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memorySkusCache = parsed;
        return parsed;
      }
    }
    const fallbackData = localStorage.getItem(SKUS_STORAGE_FALLBACK_KEY);
    if (fallbackData) {
      const parsedFallback = JSON.parse(fallbackData);
      if (Array.isArray(parsedFallback) && parsedFallback.length > 0) {
        memorySkusCache = parsedFallback;
        localStorage.setItem(SKUS_STORAGE_KEY, JSON.stringify(parsedFallback));
        return parsedFallback;
      }
    }
    return memorySkusCache || [];
  } catch (e) {
    return memorySkusCache || [];
  }
}

export function saveStoredSKUs(skus: FootwearSKU[]) {
  if (typeof window === 'undefined') return;
  try {
    memorySkusCache = skus;
    lastSkusFetchTime = Date.now();
    const jsonString = JSON.stringify(skus);
    localStorage.setItem(SKUS_STORAGE_KEY, jsonString);
    localStorage.setItem(SKUS_STORAGE_FALLBACK_KEY, jsonString);
    window.dispatchEvent(new Event('skus-updated'));
  } catch (e) {
    try {
      const sanitized = skus.map(s => ({
        ...s,
        imageUrl: s.imageUrl && s.imageUrl.startsWith('data:image') ? '/collections/mens-casual-sneakers.jpg' : s.imageUrl,
        hoverImageUrl: s.hoverImageUrl && s.hoverImageUrl.startsWith('data:image') ? '' : s.hoverImageUrl,
      }));
      const cleanJson = JSON.stringify(sanitized);
      localStorage.setItem(SKUS_STORAGE_KEY, cleanJson);
      localStorage.setItem(SKUS_STORAGE_FALLBACK_KEY, cleanJson);
      window.dispatchEvent(new Event('skus-updated'));
    } catch (err) {
      console.error('Error saving SKUs to localStorage:', err);
    }
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
    window.dispatchEvent(new Event('settings-updated'));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

/**
 * ⚡ FETCH PRODUCTS (EXCLUSIVELY FROM SUPABASE DATABASE WITH APPSCRIPT BACKUP)
 */
export async function fetchCloudSKUs(appScriptUrl?: string, forceRefresh = false): Promise<FootwearSKU[]> {
  const local = getStoredSKUs();
  const now = Date.now();

  if (!forceRefresh && memorySkusCache && (now - lastSkusFetchTime < CACHE_TTL_MS)) {
    return mergeSKUArrays(local, memorySkusCache);
  }

  if (inFlightSkusPromise && !forceRefresh) {
    return inFlightSkusPromise;
  }

  inFlightSkusPromise = (async () => {
    try {
      // 1. FETCH EXCLUSIVELY FROM SUPABASE DATABASE
      const supabaseProducts = await fetchSupabaseSKUs();

      let cloudProducts: FootwearSKU[] = [];
      if (supabaseProducts && supabaseProducts.length > 0) {
        cloudProducts = supabaseProducts;
      }

      // 2. BACKUP FETCH FROM APPSCRIPT IF NEEDED
      const url = appScriptUrl || DEFAULT_SITE_SETTINGS.appScriptUrl;
      if (url && !url.includes('EXAMPLE')) {
        try {
          const res = await fetch(`${url}?action=getProducts`, { method: 'GET' });
          const data = await res.json();
          if (data && data.products && Array.isArray(data.products) && data.products.length > 0) {
            cloudProducts = mergeSKUArrays(cloudProducts, data.products);
          }
        } catch (gasErr) {}
      }

      // MERGE LOCAL & CLOUD PRODUCTS (LOCAL NEVER LOST)
      const merged = mergeSKUArrays(local, cloudProducts);

      if (merged.length > 0) {
        memorySkusCache = merged;
        lastSkusFetchTime = Date.now();
        saveStoredSKUs(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Could not fetch cloud SKUs:', e);
    } finally {
      inFlightSkusPromise = null;
    }

    memorySkusCache = local;
    return local;
  })();

  return inFlightSkusPromise;
}

/**
 * ⚡ FETCH SITE SETTINGS & TICKER (EXCLUSIVELY FROM GOOGLE APPSCRIPT)
 */
export async function fetchCloudSettings(appScriptUrl?: string, forceRefresh = false): Promise<SiteSettings> {
  const local = getStoredSettings();
  const now = Date.now();

  if (!forceRefresh && memorySettingsCache && (now - lastSettingsFetchTime < CACHE_TTL_MS)) {
    return memorySettingsCache;
  }

  if (inFlightSettingsPromise && !forceRefresh) {
    return inFlightSettingsPromise;
  }

  const url = appScriptUrl || DEFAULT_SITE_SETTINGS.appScriptUrl;
  if (!url || url.includes('EXAMPLE')) {
    memorySettingsCache = local;
    return local;
  }

  inFlightSettingsPromise = (async () => {
    try {
      // FETCH EXCLUSIVELY FROM GOOGLE APPSCRIPT
      const res = await fetch(`${url}?action=getSettings`, { method: 'GET' });
      const data = await res.json();
      if (data && data.settings && Object.keys(data.settings).length > 0) {
        const merged = { ...local, ...data.settings };
        memorySettingsCache = merged;
        lastSettingsFetchTime = Date.now();
        saveStoredSettings(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Could not fetch cloud settings from AppsScript:', e);
    } finally {
      inFlightSettingsPromise = null;
    }

    memorySettingsCache = local;
    return local;
  })();

  return inFlightSettingsPromise;
}
