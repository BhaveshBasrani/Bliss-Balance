import { FootwearSKU, SiteSettings, CollectionItem, HeroSlide } from './types';
import { fetchSupabaseSKUs, fetchSupabaseSettings, upsertSupabaseSettings } from './supabaseClient';

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    desktopImageUrl: '/hero-banner.png',
    mobileImageUrl: '/hero-banner-mobile.png',
    badgeText: 'FEEL THE BLISS • MADE IN INDIA',
    titleText: 'BUILT FOR THE ONES BALANCING LIFE.',
    subheadlineText: 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.',
    ctaText: 'SHOP MEN',
    ctaLink: '/men',
    ctaText2: 'SHOP WOMEN',
    ctaLink2: '/women',
  },
  {
    id: 'slide-2',
    desktopImageUrl: '/hero-banner.png',
    mobileImageUrl: '/hero-banner-mobile.png',
    badgeText: 'ULTRA-CUSHIONED DROP • NEW ARRIVALS',
    titleText: 'EVERYDAY COMFORT. ZERO COMPROMISE.',
    subheadlineText: 'Experience high-density EVA memory foam cushioning engineered for effortless steps all day long.',
    ctaText: 'EXPLORE SLIDES',
    ctaLink: '/collections?cat=Slides',
    ctaText2: 'EXPLORE CLOGS',
    ctaLink2: '/collections?cat=Clogs',
  },
  {
    id: 'slide-3',
    desktopImageUrl: '/hero-banner.png',
    mobileImageUrl: '/hero-banner-mobile.png',
    badgeText: 'OFFICIAL STREETWEAR COLLECTION',
    titleText: 'UNISEX SNEAKERS & CLOGS.',
    subheadlineText: 'Anti-skid rubber traction meets modern streetwear silhouettes.',
    ctaText: 'SHOP WOMEN',
    ctaLink: '/women',
    ctaText2: 'SHOP MEN',
    ctaLink2: '/men',
  },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText: 'EASY 7-DAY RETURNS & REPLACEMENTS • CUSHIONED & ANTI-SKID FOOTWEAR • OFFICIAL ONLINE STORE • MADE IN INDIA',
  heroHeadline: 'FEEL THE BLISS',
  heroSubheadline: 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.',
  heroImageDimensions: '1200 x 600 px (2:1 Wide Banner)',
  heroImageUrl: '/hero-banner.png',
  heroMobileImageUrl: '/hero-banner-mobile.png',
  heroSlides: DEFAULT_HERO_SLIDES,
  appScriptUrl: 'https://script.google.com/macros/s/AKfycbzNcXkMYw4FyfMeU7WQbSuTah5HUd1kTTSeq95ASxmgLsbR28rxIUbG0wHGkuZrDM0DXA/exec',
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
const SKUS_STORAGE_KEY = 'bliss_balance_skus_v5';
const SKUS_STORAGE_FALLBACK_KEY = 'bliss_balance_skus_v4';
const SETTINGS_STORAGE_KEY = 'bliss_balance_settings_v3';

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
  if (typeof window === 'undefined') return INITIAL_SKUS;
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
    return (memorySkusCache && memorySkusCache.length > 0) ? memorySkusCache : INITIAL_SKUS;
  } catch (e) {
    return (memorySkusCache && memorySkusCache.length > 0) ? memorySkusCache : INITIAL_SKUS;
  }
}

/**
 * ⚡ PREFETCH PRODUCT DATA & IMAGES ON MOUSE HOVER
 * Directive 7: Prefetches product images into browser memory when user mouse enters a product card
 */
const prefetchedSkus = new Set<string>();

export function prefetchProduct(sku: FootwearSKU) {
  if (!sku || !sku.id || typeof window === 'undefined') return;
  const key = sku.id.toLowerCase();
  if (prefetchedSkus.has(key)) return;
  prefetchedSkus.add(key);

  // 1. Preload main product image into browser cache
  if (sku.imageUrl && sku.imageUrl.trim() !== '') {
    const img = new Image();
    img.src = sku.imageUrl;
  }
  // 2. Preload secondary hover image into browser cache
  if (sku.hoverImageUrl && sku.hoverImageUrl.trim() !== '') {
    const hoverImg = new Image();
    hoverImg.src = sku.hoverImageUrl;
  }
}

export function saveStoredSKUs(skus: FootwearSKU[]) {
  if (typeof window === 'undefined') return;
  try {
    memorySkusCache = skus;
    lastSkusFetchTime = Date.now();
    
    // Remove legacy fallback key to free up browser storage space
    try {
      localStorage.removeItem(SKUS_STORAGE_FALLBACK_KEY);
    } catch (e) {}

    // Save full original SKUs with intact uploaded image URLs
    const jsonString = JSON.stringify(skus);
    localStorage.setItem(SKUS_STORAGE_KEY, jsonString);
    window.dispatchEvent(new Event('skus-updated'));
  } catch (e) {
    // If quota is still exceeded, clear memory cache and fallback cleanly
    try {
      const minimalSkus = skus.map(s => ({
        id: s.id,
        title: s.title,
        gender: s.gender,
        category: s.category,
        price: s.price,
        imageUrl: s.imageUrl && !s.imageUrl.startsWith('data:') ? s.imageUrl : '',
      }));
      localStorage.setItem(SKUS_STORAGE_KEY, JSON.stringify(minimalSkus));
      window.dispatchEvent(new Event('skus-updated'));
    } catch (err) {
      console.warn('LocalStorage quota reached; operating with in-memory state.');
    }
  }
}

export function clearAllSKUs() {
  if (typeof window === 'undefined') return;
  try {
    memorySkusCache = [];
    localStorage.removeItem(SKUS_STORAGE_KEY);
    localStorage.removeItem(SKUS_STORAGE_FALLBACK_KEY);
    window.dispatchEvent(new Event('skus-updated'));
  } catch (e) {
    console.error('Error clearing SKUs from localStorage:', e);
  }
}

export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const merged = { ...DEFAULT_SITE_SETTINGS, ...parsed };
      if (!merged.appScriptUrl || merged.appScriptUrl.includes('EXAMPLE')) {
        merged.appScriptUrl = DEFAULT_SITE_SETTINGS.appScriptUrl;
      }
      if (!Array.isArray(merged.heroSlides) || merged.heroSlides.length === 0) {
        merged.heroSlides = DEFAULT_HERO_SLIDES;
      }
      return merged;
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
    return memorySkusCache;
  }

  if (inFlightSkusPromise && !forceRefresh) {
    return inFlightSkusPromise;
  }

  inFlightSkusPromise = (async () => {
    try {
      // 1. FETCH AUTHORITATIVE LIST FROM SUPABASE DATABASE
      const supabaseProducts = await fetchSupabaseSKUs();
      if (Array.isArray(supabaseProducts) && supabaseProducts.length > 0) {
        memorySkusCache = supabaseProducts;
        lastSkusFetchTime = Date.now();
        saveStoredSKUs(supabaseProducts);
        return supabaseProducts;
      }
    } catch (e) {
      console.warn('Could not fetch cloud SKUs:', e);
    } finally {
      inFlightSkusPromise = null;
    }

    return local;
  })();

  return inFlightSkusPromise;
}

/**
 * ⚡ FETCH SITE SETTINGS, BANNERS & TICKER (FROM SUPABASE DATABASE WITH APPSCRIPT BACKUP)
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

  inFlightSettingsPromise = (async () => {
    try {
      // 1. FETCH SITE SETTINGS (BANNERS, TICKERS, SLIDES) FROM SUPABASE DATABASE
      const supabaseSettings = await fetchSupabaseSettings();
      if (supabaseSettings && Object.keys(supabaseSettings).length > 0) {
        const remoteSlides = (Array.isArray(supabaseSettings.heroSlides) && supabaseSettings.heroSlides.length > 0)
          ? supabaseSettings.heroSlides
          : local.heroSlides;

        const merged = { ...local, ...supabaseSettings, heroSlides: remoteSlides };
        memorySettingsCache = merged;
        lastSettingsFetchTime = Date.now();
        saveStoredSettings(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Could not fetch settings from Supabase:', e);
    }

    // 2. BACKUP FETCH FROM GOOGLE APPSCRIPT
    const url = appScriptUrl || DEFAULT_SITE_SETTINGS.appScriptUrl;
    if (url && !url.includes('EXAMPLE')) {
      try {
        const res = await fetch(`${url}?action=getSettings`, { method: 'GET' });
        const data = await res.json();
        if (data && data.settings && Object.keys(data.settings).length > 0) {
          const remoteSlides = (Array.isArray(data.settings.heroSlides) && data.settings.heroSlides.length > 0)
            ? data.settings.heroSlides
            : local.heroSlides;

          const merged = { ...local, ...data.settings, heroSlides: remoteSlides };
          memorySettingsCache = merged;
          lastSettingsFetchTime = Date.now();
          saveStoredSettings(merged);
          return merged;
        }
      } catch (e) {
        console.warn('Could not fetch cloud settings from AppsScript:', e);
      }
    }

    inFlightSettingsPromise = null;
    memorySettingsCache = local;
    return local;
  })();

  return inFlightSettingsPromise;
}
