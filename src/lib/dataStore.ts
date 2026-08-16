import { FootwearSKU, CollectionItem, SiteSettings } from './types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText: 'FREE SHIPPING ON ORDERS OVER ₹799 • EASY 7-DAY RETURNS • CUSHIONED & ANTI-SKID FOOTWEAR • OFFICIAL STORE',
  heroHeadline: 'FEEL THE BLISS',
  heroSubheadline: 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.',
  heroImageDimensions: '1200 x 600 px (2:1 Wide Banner)',
  heroImageUrl: '',
  appScriptUrl: process.env.NEXT_PUBLIC_APPSCRIPT_URL || 'https://script.google.com/macros/s/AKfycbykDG_64LHgNhlS6gu-TowyNkTAC2Qfl3ohBoKmzQaub5oD0jj8Ah2Ow227lLG4D45ZzA/exec',
  googleDriveFolderId: '1_BlissBalance_Footwear_Drive_Folder_ID',
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LfVFIktAAAAAPRSJXz5I8lCUjX4vmXpnl0jCjoa',
  adminEmail: 'admin@blissbalance.co',
};

export const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    title: 'Men\'s Slippers',
    gender: 'Men',
    description: 'Soft cushioned slippers engineered for all-day indoor & relaxed wear.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/mens-slippers.jpg',
    slug: 'mens-slippers',
  },
  {
    id: 'col-2',
    title: 'Men\'s Slides & Sandals',
    gender: 'Men',
    description: 'Lightweight everyday slides and supportive sandals built for reliable grip.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/mens-slides-sandals.jpg',
    slug: 'mens-slides-sandals',
  },
  {
    id: 'col-3',
    title: 'Men\'s Casual & Sneakers',
    gender: 'Men',
    description: 'Contemporary silhouettes with cushioned soles for work, travel and outings.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/mens-casual-sneakers.jpg',
    slug: 'mens-casual-sneakers',
  },
  {
    id: 'col-4',
    title: 'Women\'s Slippers & Slides',
    gender: 'Women',
    description: 'Ultra-lightweight everyday slippers and stylish slides designed for easy steps.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/womens-slippers-slides.jpg',
    slug: 'womens-slippers-slides',
  },
  {
    id: 'col-5',
    title: 'Women\'s Sandals & Flats',
    gender: 'Women',
    description: 'Supportive contours and modern aesthetics for versatile daily wear.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/womens-sandals-flats.jpg',
    slug: 'womens-sandals-flats',
  },
  {
    id: 'col-6',
    title: 'Women\'s Clogs & Sneakers',
    gender: 'Women',
    description: 'Cushioned everyday walking footwear designed for outdoor and casual life.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    imageUrl: '/collections/womens-clogs-sneakers.jpg',
    slug: 'womens-clogs-sneakers',
  },
];

export const INITIAL_SKUS: FootwearSKU[] = [];

// Persistence Storage Keys
const SKUS_STORAGE_KEY = 'bliss_balance_skus_v2';
const SETTINGS_STORAGE_KEY = 'bliss_balance_settings_v2';

export function getStoredSKUs(): FootwearSKU[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(SKUS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveStoredSKUs(skus: FootwearSKU[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SKUS_STORAGE_KEY, JSON.stringify(skus));
  } catch (e) {
    console.error('Error saving SKUs:', e);
  }
}

export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return data ? JSON.parse(data) : DEFAULT_SITE_SETTINGS;
  } catch (e) {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveStoredSettings(settings: SiteSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings:', e);
  }
}

/**
 * Live Dynamic Cloud Fetch from Google Sheets AppsScript Endpoint
 * Guarantees cross-device live sync between laptops, phones, and tablets!
 */
export async function fetchCloudSKUs(appScriptUrl?: string): Promise<FootwearSKU[]> {
  const url = appScriptUrl || DEFAULT_SITE_SETTINGS.appScriptUrl;
  if (!url || url.includes('EXAMPLE')) return getStoredSKUs();

  try {
    const res = await fetch(`${url}?action=getProducts`, { method: 'GET' });
    const data = await res.json();
    if (data && data.products && Array.isArray(data.products)) {
      saveStoredSKUs(data.products);
      return data.products;
    }
  } catch (e) {
    console.warn('Could not fetch live cloud products:', e);
  }
  return getStoredSKUs();
}

export async function fetchCloudSettings(appScriptUrl?: string): Promise<SiteSettings> {
  const url = appScriptUrl || DEFAULT_SITE_SETTINGS.appScriptUrl;
  if (!url || url.includes('EXAMPLE')) return getStoredSettings();

  try {
    const res = await fetch(`${url}?action=getSettings`, { method: 'GET' });
    const data = await res.json();
    if (data && data.settings && typeof data.settings === 'object') {
      const merged = { ...getStoredSettings(), ...data.settings };
      saveStoredSettings(merged);
      return merged;
    }
  } catch (e) {
    console.warn('Could not fetch live cloud settings:', e);
  }
  return getStoredSettings();
}
