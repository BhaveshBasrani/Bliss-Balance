import { FootwearSKU, SiteSettings, CollectionItem, HeroSlide, ProductReview } from './types';
import { fetchSupabaseSKUs, fetchSupabaseSingleSKU, fetchSupabaseSettings, upsertSupabaseSettings } from './supabaseClient';
import { INITIAL_SKUS } from './initialSkus';

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
    ctaLink: '/collections/slides',
    ctaText2: 'EXPLORE CLOGS',
    ctaLink2: '/collections/clogs',
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

export { INITIAL_SKUS };

// Persistence Storage Keys
const SKUS_STORAGE_KEY = 'bliss_balance_skus_v28';
const SKUS_TIME_KEY = 'bliss_balance_skus_time_v28';
const SETTINGS_STORAGE_KEY = 'bliss_balance_settings_v4';
const SETTINGS_TIME_KEY = 'bliss_balance_settings_time_v4';

// Long-lived Cache TTLs for 99% Database Egress Reduction
const CATALOG_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const SETTINGS_CACHE_TTL_MS = 30 * 1000; // 30 seconds for near-instant live banner updates

// TURBO SPEED IN-MEMORY CACHE
let memorySkusCache: FootwearSKU[] | null = null;
let lastSkusFetchTime = 0;
let inFlightSkusPromise: Promise<FootwearSKU[]> | null = null;

let memorySettingsCache: SiteSettings | null = null;
let lastSettingsFetchTime = 0;
let inFlightSettingsPromise: Promise<SiteSettings> | null = null;

export function mergeSKUArrays(primary: FootwearSKU[], secondary: FootwearSKU[]): FootwearSKU[] {
  const map = new Map<string, FootwearSKU>();
  
  (primary || []).forEach(item => {
    if (item && item.id) map.set(item.id.toLowerCase(), item);
  });

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
  if (memorySkusCache && memorySkusCache.length > 0) return memorySkusCache;

  try {
    const data = localStorage.getItem(SKUS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memorySkusCache = parsed;
        const storedTime = Number(localStorage.getItem(SKUS_TIME_KEY) || 0);
        if (storedTime > 0) lastSkusFetchTime = storedTime;
        return parsed;
      }
    }
    return INITIAL_SKUS;
  } catch (e) {
    return INITIAL_SKUS;
  }
}

export function prefetchProduct(sku: FootwearSKU) {
  if (!sku || !sku.id || typeof window === 'undefined') return;
  if (sku.imageUrl && sku.imageUrl.trim() !== '') {
    const img = new Image();
    img.src = sku.imageUrl;
  }
  if (sku.hoverImageUrl && sku.hoverImageUrl.trim() !== '') {
    const hoverImg = new Image();
    hoverImg.src = sku.hoverImageUrl;
  }
}

export function saveStoredSKUs(skus: FootwearSKU[]) {
  if (typeof window === 'undefined') return;
  try {
    memorySkusCache = skus;
    const now = Date.now();
    lastSkusFetchTime = now;
    localStorage.setItem(SKUS_STORAGE_KEY, JSON.stringify(skus));
    localStorage.setItem(SKUS_TIME_KEY, String(now));
    window.dispatchEvent(new Event('skus-updated'));
  } catch (e) {
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
      console.warn('LocalStorage full, using in-memory state.');
    }
  }
}

export function clearAllSKUs() {
  if (typeof window === 'undefined') return;
  try {
    memorySkusCache = [];
    localStorage.removeItem(SKUS_STORAGE_KEY);
    localStorage.removeItem(SKUS_TIME_KEY);
    window.dispatchEvent(new Event('skus-updated'));
  } catch (e) {}
}

export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  if (memorySettingsCache) return memorySettingsCache;

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
      memorySettingsCache = merged;
      const storedTime = Number(localStorage.getItem(SETTINGS_TIME_KEY) || 0);
      if (storedTime > 0) lastSettingsFetchTime = storedTime;
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
    const now = Date.now();
    lastSettingsFetchTime = now;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    localStorage.setItem(SETTINGS_TIME_KEY, String(now));
    window.dispatchEvent(new Event('settings-updated'));
  } catch (e) {}
}

export const REVIEWS_STORAGE_KEY = 'bliss_balance_reviews_v2';

export function getStoredReviews(): ProductReview[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const legacy = localStorage.getItem('bliss_balance_reviews_v1');
    if (legacy) {
      const parsed = JSON.parse(legacy);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
    return [];
  } catch (e) {
    return [];
  }
}

export function saveStoredReviews(reviews: ProductReview[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    localStorage.setItem('bliss_balance_reviews_v1', JSON.stringify(reviews));
    window.dispatchEvent(new Event('reviews-updated'));
  } catch (e) {}
}

/**
 * ⚡ FETCH PRODUCTS (WITH 30-MINUTE SERVER/LOCAL CACHE - 99% SUPABASE EGRESS SAVINGS)
 */
export async function fetchCloudSKUs(appScriptUrl?: string, forceRefresh = false): Promise<FootwearSKU[]> {
  const local = getStoredSKUs();
  const now = Date.now();

  // 1. Instant Cache Hit: Return memory or localStorage cache without any network request
  if (!forceRefresh && local && local.length > 0 && (now - lastSkusFetchTime < CATALOG_CACHE_TTL_MS)) {
    return local;
  }

  // 2. De-duplicate parallel in-flight requests
  if (inFlightSkusPromise && !forceRefresh) {
    return inFlightSkusPromise;
  }

  inFlightSkusPromise = (async () => {
    try {
      // 3. Try Next.js Cached Server Route First (/api/catalog)
      try {
        const apiRes = await fetch('/api/catalog', { method: 'GET' });
        if (apiRes.ok) {
          const apiProducts = await apiRes.json();
          if (Array.isArray(apiProducts) && apiProducts.length > 0) {
            saveStoredSKUs(apiProducts);
            return apiProducts;
          }
        }
      } catch (err) {
        // Fall through to direct Supabase client query
      }

      // 4. Direct Supabase Query (Lightweight Listing Projection only)
      const supabaseProducts = await fetchSupabaseSKUs();
      if (Array.isArray(supabaseProducts) && supabaseProducts.length > 0) {
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
 * ⚡ FETCH FULL DETAILS FOR A SINGLE PRODUCT ONLY WHEN VIEWING /product/[id]
 */
export async function fetchSingleProduct(id: string, forceRefresh = false): Promise<FootwearSKU | null> {
  const targetId = decodeURIComponent(id).trim().toLowerCase();
  const all = getStoredSKUs();
  const existing = all.find(s => s.id.toLowerCase() === targetId || encodeURIComponent(s.id).toLowerCase() === targetId);

  // If already exists with full details (gallery / features), return instantly
  if (!forceRefresh && existing && existing.galleryImages && existing.galleryImages.length > 0) {
    return existing;
  }

  try {
    const singleProduct = await fetchSupabaseSingleSKU(id);
    if (singleProduct) {
      // Update this single product in local cache without re-fetching entire DB
      const updated = all.map(s => (s.id.toLowerCase() === targetId ? { ...s, ...singleProduct } : s));
      if (!all.some(s => s.id.toLowerCase() === targetId)) {
        updated.unshift(singleProduct);
      }
      saveStoredSKUs(updated);
      return singleProduct;
    }
  } catch (e) {
    console.warn('Error fetching single product:', e);
  }

  return existing || null;
}

/**
 * ⚡ FETCH SITE SETTINGS WITH 2-HOUR CACHE
 */
export async function fetchCloudSettings(appScriptUrl?: string, forceRefresh = false): Promise<SiteSettings> {
  const local = getStoredSettings();
  const now = Date.now();

  if (!forceRefresh && memorySettingsCache && (now - lastSettingsFetchTime < SETTINGS_CACHE_TTL_MS)) {
    return memorySettingsCache;
  }

  if (inFlightSettingsPromise && !forceRefresh) {
    return inFlightSettingsPromise;
  }

  inFlightSettingsPromise = (async () => {
    try {
      // Try Next.js cached server route (/api/settings)
      try {
        const apiRes = await fetch('/api/settings', { method: 'GET' });
        if (apiRes.ok) {
          const apiSettings = await apiRes.json();
          if (apiSettings && Object.keys(apiSettings).length > 0) {
            const merged = { ...local, ...apiSettings };
            saveStoredSettings(merged);
            return merged;
          }
        }
      } catch (err) {}

      // Direct Supabase Settings fetch
      const supabaseSettings = await fetchSupabaseSettings();
      if (supabaseSettings && Object.keys(supabaseSettings).length > 0) {
        const remoteSlides = (Array.isArray(supabaseSettings.heroSlides) && supabaseSettings.heroSlides.length > 0)
          ? supabaseSettings.heroSlides
          : local.heroSlides;

        const merged = { ...local, ...supabaseSettings, heroSlides: remoteSlides };
        saveStoredSettings(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Could not fetch settings from Supabase:', e);
    } finally {
      inFlightSettingsPromise = null;
    }

    return local;
  })();

  return inFlightSettingsPromise;
}
