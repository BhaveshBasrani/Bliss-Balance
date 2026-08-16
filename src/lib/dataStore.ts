import { FootwearSKU, CollectionItem, SiteSettings } from './types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  announcementText: 'FREE SHIPPING ON ORDERS OVER ₹999 • COMFORT-FOCUSED FOOTWEAR • EASY Marketplace REDIRECTS',
  heroHeadline: 'WALK IN BLISS. LIVE IN BALANCE.',
  heroSubheadline: 'Comfort, contemporary style, lightweight construction and dependable grip — crafted for everyday life.',
  heroImageDimensions: '1200 x 600 px (2:1 Wide Banner)',
  heroImageUrl: '', // Empty: user will add custom photo via Admin Panel
  appScriptUrl: 'https://script.google.com/macros/s/AKfycbx_EXAMPLE_BLISS_BALANCE/exec',
  googleDriveFolderId: '1_BlissBalance_Footwear_Drive_Folder_ID',
  recaptchaSiteKey: '6Ld_EXAMPLE_RECAPTCHA_V3_SITE_KEY',
  adminEmail: 'admin@blissbalance.co',
};

export const INITIAL_COLLECTIONS: CollectionItem[] = [
  {
    id: 'col-1',
    title: 'Men\'s Slippers',
    gender: 'Men',
    description: 'Soft cushioned slippers engineered for all-day indoor & relaxed wear.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    slug: 'mens-slippers',
  },
  {
    id: 'col-2',
    title: 'Men\'s Slides & Sandals',
    gender: 'Men',
    description: 'Lightweight everyday slides and supportive sandals built for reliable grip.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    slug: 'mens-slides-sandals',
  },
  {
    id: 'col-3',
    title: 'Men\'s Casual & Sneakers',
    gender: 'Men',
    description: 'Contemporary silhouettes with cushioned soles for work, travel and outings.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    slug: 'mens-casual-sneakers',
  },
  {
    id: 'col-4',
    title: 'Women\'s Slippers & Slides',
    gender: 'Women',
    description: 'Ultra-lightweight everyday slippers and stylish slides designed for easy steps.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    slug: 'womens-slippers-slides',
  },
  {
    id: 'col-5',
    title: 'Women\'s Sandals & Flats',
    gender: 'Women',
    description: 'Supportive contours and modern aesthetics for versatile daily wear.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    slug: 'womens-sandals-flats',
  },
  {
    id: 'col-6',
    title: 'Women\'s Clogs & Sneakers',
    gender: 'Women',
    description: 'Cushioned everyday walking footwear designed for outdoor and casual life.',
    imageDimensions: '600 x 800 px (3:4 Portrait Banner)',
    slug: 'womens-clogs-sneakers',
  },
];

export const INITIAL_SKUS: FootwearSKU[] = [
  {
    id: 'sku-bb-m01',
    title: 'Bliss Comfort Slides - Men',
    subtitle: 'Ultra-cushioned anti-skid slides for indoor & outdoor wear',
    gender: 'Men',
    category: 'Slides',
    price: 1299,
    originalPrice: 1999,
    amazonUrl: 'https://www.amazon.in/dp/example-bliss-slides-men',
    myntraUrl: 'https://www.myntra.com/bliss-balance-men-slides',
    imageDimensions: '800 x 800 px (1:1 Product Image)',
    features: ['Cushioned Footwear', 'Lightweight Feel', 'Anti-Skid Outsole', 'Water-Resistant'],
    isNewArrival: true,
    isBestseller: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sku-bb-w01',
    title: 'Bliss Everyday Sandals - Women',
    subtitle: 'Adjustable fit lightweight sandals crafted for daily walking comfort',
    gender: 'Women',
    category: 'Sandals',
    price: 1499,
    originalPrice: 2299,
    amazonUrl: 'https://www.amazon.in/dp/example-bliss-sandals-women',
    myntraUrl: 'https://www.myntra.com/bliss-balance-women-sandals',
    imageDimensions: '800 x 800 px (1:1 Product Image)',
    features: ['Adjustable Strap', 'Soft Cushioning', 'Reliable Grip', 'Everyday Versatility'],
    isNewArrival: true,
    isBestseller: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sku-bb-m02',
    title: 'Bliss Walking Clogs - Men',
    subtitle: 'Breathable lightweight outdoor & indoor clogs with textured sole',
    gender: 'Men',
    category: 'Clogs',
    price: 1699,
    originalPrice: 2499,
    amazonUrl: 'https://www.amazon.in/dp/example-bliss-clogs-men',
    myntraUrl: 'https://www.myntra.com/bliss-balance-men-clogs',
    imageDimensions: '800 x 800 px (1:1 Product Image)',
    features: ['Textured Outsole', 'Lightweight EVA', 'Ventilated Design', 'Supportive Bed'],
    isNewArrival: false,
    isBestseller: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sku-bb-w02',
    title: 'Bliss Minimalist Flats - Women',
    subtitle: 'Sleek contemporary flats with soft padded footbed for daily outings',
    gender: 'Women',
    category: 'Flats',
    price: 1399,
    originalPrice: 1899,
    amazonUrl: 'https://www.amazon.in/dp/example-bliss-flats-women',
    myntraUrl: 'https://www.myntra.com/bliss-balance-women-flats',
    imageDimensions: '800 x 800 px (1:1 Product Image)',
    features: ['Padded Footbed', 'Flexible Rubber Sole', 'Modern Silhouette', 'All-Day Comfort'],
    isNewArrival: true,
    isBestseller: false,
    createdAt: new Date().toISOString(),
  },
];

// Data Store Helpers for Local Storage & Persistence
const SKUS_STORAGE_KEY = 'bliss_balance_skus_v1';
const SETTINGS_STORAGE_KEY = 'bliss_balance_settings_v1';
const COLLECTIONS_STORAGE_KEY = 'bliss_balance_collections_v1';

export function getStoredSKUs(): FootwearSKU[] {
  if (typeof window === 'undefined') return INITIAL_SKUS;
  try {
    const data = localStorage.getItem(SKUS_STORAGE_KEY);
    return data ? JSON.parse(data) : INITIAL_SKUS;
  } catch (e) {
    console.error('Error reading stored SKUs:', e);
    return INITIAL_SKUS;
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
    console.error('Error reading settings:', e);
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
