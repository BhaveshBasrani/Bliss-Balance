/**
 * ⚡ OFFICIAL BLISS BALANCE SUPABASE CLIENT ENGINE
 * Optimized for Ultra-Low PostgREST/Database Egress & Maximum Cache Efficiency
 * Connected to: https://ummvwrzzxehetmtaugop.supabase.co
 */

import { FootwearSKU, NewsletterSubscriber, ProductReview, AnalyticsVisit } from './types';
import { INITIAL_SKUS } from './initialSkus';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ummvwrzzxehetmtaugop.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbXZ3cnp6eGVoZXRtdGF1Z29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTI1NzIsImV4cCI6MjEwMjYyODU3Mn0.CWzbUjICztb1Ga3u_gxjicbe362ZR519OdJK5YItu2E';

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

// Fields needed for catalog listing & filtering (Ultra-lightweight projection, saves 95%+ Egress)
const LISTING_FIELDS = [
  'id',
  'title',
  'subtitle',
  'gender',
  'category',
  'price',
  'original_price',
  'image_url',
  'hover_image_url',
  'rating',
  'review_count',
  'is_bestseller',
  'is_new_arrival',
  'sizes',
  'created_at',
].join(',');

// ⚡ HIGH-PERFORMANCE IN-MEMORY CACHE ENGINES (Zero Egress on Repeat Reads)
let _cachedSKUs: { data: FootwearSKU[]; timestamp: number } | null = null;
let _cachedSettings: { data: any; timestamp: number } | null = null;
const _singleSkuCache = new Map<string, { data: FootwearSKU; timestamp: number }>();
const _reviewsCache = new Map<string, { data: ProductReview[]; timestamp: number }>();

const SKUS_TTL_MS = 60 * 60 * 1000; // 1 Hour Cache Window (Zero Egress on Browse)
const SETTINGS_TTL_MS = 120 * 60 * 1000; // 2 Hours Cache Window (Zero Egress on Browse)
const REVIEWS_TTL_MS = 30 * 60 * 1000; // 30 Minutes Cache Window (Zero Egress on Browse)

export function invalidateSupabaseCache() {
  _cachedSKUs = null;
  _cachedSettings = null;
  _singleSkuCache.clear();
  _reviewsCache.clear();
}

/**
 * 1. Fetch Lightweight Product Catalog (Zero Egress if Cached)
 */
export async function fetchSupabaseSKUs(forceFresh: boolean = false): Promise<FootwearSKU[]> {
  const now = Date.now();
  if (!forceFresh && _cachedSKUs && (now - _cachedSKUs.timestamp < SKUS_TTL_MS)) {
    return _cachedSKUs.data;
  }

  const attemptFetch = async (timeoutMs: number): Promise<FootwearSKU[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/skus?select=${LISTING_FIELDS}&order=created_at.desc`, {
        method: 'GET',
        headers: HEADERS,
        signal: controller.signal,
        // @ts-ignore
        next: { revalidate: 3600 },
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        return _cachedSKUs ? _cachedSKUs.data : INITIAL_SKUS;
      }

      const rows = await res.json();
      if (!Array.isArray(rows) || rows.length === 0) {
        return _cachedSKUs ? _cachedSKUs.data : INITIAL_SKUS;
      }

      const mapped = rows.map((row: any): FootwearSKU => ({
        id: row.id,
        title: row.title,
        subtitle: row.subtitle || '',
        gender: row.gender,
        category: row.category,
        price: Number(row.price),
        originalPrice: row.original_price ? Number(row.original_price) : undefined,
        imageUrl: row.image_url || '',
        hoverImageUrl: row.hover_image_url || '',
        galleryImages: row.gallery_images || [],
        amazonUrl: row.amazon_url || '',
        myntraUrl: row.myntra_url || '',
        flipkartUrl: row.flipkart_url || '',
        officialUrl: row.official_url || '',
        features: row.features || ['Soft Cushioning', 'Lightweight Construction', 'Anti-Skid'],
        sizes: row.sizes || [],
        colorVariants: row.color_variants || [],
        sizeMarketplaceUrls: row.size_marketplace_urls || {},
        rating: Number(row.rating || 5.0),
        reviewCount: Number(row.review_count || row.reviews_count || 0),
        isNewArrival: Boolean(row.is_new_arrival),
        isBestseller: Boolean(row.is_bestseller),
        createdAt: row.created_at || new Date().toISOString(),
      }));

      _cachedSKUs = { data: mapped, timestamp: Date.now() };
      return mapped;
    } catch (e) {
      clearTimeout(timeoutId);
      return _cachedSKUs ? _cachedSKUs.data : INITIAL_SKUS;
    }
  };

  try {
    return await attemptFetch(4000);
  } catch (err) {
    return _cachedSKUs ? _cachedSKUs.data : INITIAL_SKUS;
  }
}

/**
 * 2. Fetch Full Details for a Single Product (Zero Egress if Cached)
 */
export async function fetchSupabaseSingleSKU(id: string, forceFresh: boolean = false): Promise<FootwearSKU | null> {
  const cleanId = id.trim().toLowerCase();
  const now = Date.now();
  
  if (!forceFresh && _singleSkuCache.has(cleanId)) {
    const cached = _singleSkuCache.get(cleanId)!;
    if (now - cached.timestamp < SKUS_TTL_MS) {
      return cached.data;
    }
  }

  const fallback = INITIAL_SKUS.find(
    (sku) => sku.id.toLowerCase() === id.toLowerCase() || sku.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  ) || null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/skus?id=eq.${encodeURIComponent(id)}&select=*`, {
      method: 'GET',
      headers: HEADERS,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return fallback;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return fallback;

    const row = rows[0];
    const mapped: FootwearSKU = {
      id: row.id,
      title: row.title,
      subtitle: row.subtitle || '',
      gender: row.gender,
      category: row.category,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : undefined,
      imageUrl: row.image_url || '',
      hoverImageUrl: row.hover_image_url || '',
      galleryImages: row.gallery_images || [],
      amazonUrl: row.amazon_url || '',
      myntraUrl: row.myntra_url || '',
      flipkartUrl: row.flipkart_url || '',
      officialUrl: row.official_url || '',
      features: row.features || ['Soft Cushioning', 'Lightweight Construction', 'Anti-Skid'],
      sizes: row.sizes || [],
      colorVariants: row.color_variants || [],
      sizeMarketplaceUrls: row.size_marketplace_urls || {},
      rating: Number(row.rating || 5.0),
      reviewCount: Number(row.review_count || row.reviews_count || 0),
      isNewArrival: Boolean(row.is_new_arrival),
      isBestseller: Boolean(row.is_bestseller),
      createdAt: row.created_at || new Date().toISOString(),
    };

    _singleSkuCache.set(cleanId, { data: mapped, timestamp: Date.now() });
    return mapped;
  } catch (e) {
    return fallback;
  }
}

/**
 * Insert or Update Product SKU in Supabase
 */
export async function upsertSupabaseSKU(sku: FootwearSKU): Promise<boolean> {
  try {
    const payload = {
      id: sku.id,
      title: sku.title,
      subtitle: sku.subtitle || '',
      gender: sku.gender,
      category: sku.category,
      price: sku.price,
      original_price: sku.originalPrice || null,
      image_url: sku.imageUrl || '',
      hover_image_url: sku.hoverImageUrl || '',
      gallery_images: sku.galleryImages || [],
      amazon_url: sku.amazonUrl || '',
      myntra_url: sku.myntraUrl || '',
      flipkart_url: sku.flipkartUrl || '',
      official_url: sku.officialUrl || '',
      features: sku.features || ['Soft Cushioning', 'Lightweight Construction', 'Anti-Skid'],
      sizes: sku.sizes || [],
      color_variants: sku.colorVariants || [],
      size_marketplace_urls: sku.sizeMarketplaceUrls || {},
      rating: sku.rating || 5.0,
      review_count: sku.reviewCount || 0,
      is_new_arrival: !!sku.isNewArrival,
      is_bestseller: !!sku.isBestseller,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/skus`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.error(`Supabase Upsert Failed (${res.status}):`, errorText);
      return false;
    }

    return true;
  } catch (e) {
    console.error('Error upserting Supabase SKU:', e);
    return false;
  }
}

/**
 * Delete Product SKU from Supabase
 */
export async function deleteSupabaseSKU(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/skus?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: HEADERS,
    });

    return res.ok;
  } catch (e) {
    console.error('Error deleting Supabase SKU:', e);
    return false;
  }
}

/**
 * Delete ALL Product SKUs from Supabase (Wipe Supabase Database)
 */
export async function deleteAllSupabaseSKUs(): Promise<boolean> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/skus?id=not.is.null`, {
      method: 'DELETE',
      headers: HEADERS,
    });

    return res.ok;
  } catch (e) {
    console.error('Error wiping Supabase database:', e);
    return false;
  }
}

/**
 * 📊 1GB STORAGE LIMITATION & USAGE METRICS MONITOR FOR SUPABASE PRODUCTS
 */
export interface StorageQuotaStats {
  totalLimitBytes: number; // 1,073,741,824 Bytes (1 GB)
  estimatedUsedBytes: number;
  remainingBytes: number;
  usedPercentage: number;
  skuCount: number;
}

export async function getStorageQuotaStats(skus: FootwearSKU[]): Promise<StorageQuotaStats> {
  const TOTAL_LIMIT_BYTES = 1024 * 1024 * 1024; // 1 GB Free Tier Capacity

  // Estimate JSON DB payload size + average 500KB per hosted product image
  const jsonSize = JSON.stringify(skus).length;
  const imageCount = skus.filter(s => s.imageUrl && s.imageUrl.length > 0).length;
  const estimatedImagesBytes = imageCount * 500 * 1024;

  const estimatedUsedBytes = jsonSize + estimatedImagesBytes;
  const remainingBytes = Math.max(0, TOTAL_LIMIT_BYTES - estimatedUsedBytes);
  const usedPercentage = Math.min(100, Number(((estimatedUsedBytes / TOTAL_LIMIT_BYTES) * 100).toFixed(2)));

  return {
    totalLimitBytes: TOTAL_LIMIT_BYTES,
    estimatedUsedBytes,
    remainingBytes,
    usedPercentage,
    skuCount: skus.length,
  };
}

/**
 * ⚡ FETCH SITE SETTINGS (TICKERS, BANNERS, HERO SLIDES) FROM SUPABASE DATABASE
 */
export async function fetchSupabaseSettings(forceFresh: boolean = false): Promise<any | null> {
  const now = Date.now();
  if (!forceFresh && _cachedSettings && (now - _cachedSettings.timestamp < SETTINGS_TTL_MS)) {
    return _cachedSettings.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings?id=eq.site_settings&select=data`, {
      method: 'GET',
      headers: HEADERS,
      signal: controller.signal,
      // @ts-ignore
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return _cachedSettings ? _cachedSettings.data : null;
    const rows = await res.json();
    if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
      _cachedSettings = { data: rows[0].data, timestamp: Date.now() };
      return rows[0].data;
    }
    return _cachedSettings ? _cachedSettings.data : null;
  } catch (e) {
    return _cachedSettings ? _cachedSettings.data : null;
  }
}

/**
 * ⚡ SAVE SITE SETTINGS (TICKERS, BANNERS, HERO SLIDES) TO SUPABASE DATABASE
 */
export async function upsertSupabaseSettings(settings: any): Promise<boolean> {
  try {
    _cachedSettings = { data: settings, timestamp: Date.now() };

    const payload = {
      id: 'site_settings',
      data: settings,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings?on_conflict=id`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (e) {
    console.error('Error upserting Supabase settings:', e);
    return false;
  }
}

/**
 * ⚡ UPSERT NEWSLETTER SUBSCRIBER TO SUPABASE
 */
export async function upsertSupabaseSubscriber(subscriber: NewsletterSubscriber): Promise<boolean> {
  try {
    const payload = {
      id: subscriber.id,
      email: subscriber.email.trim().toLowerCase(),
      phone: subscriber.phone || null,
      country_code: subscriber.countryCode || '+91',
      source: subscriber.source || 'newsletter_modal',
      created_at: subscriber.createdAt || new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?on_conflict=email`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (e) {
    console.warn('Could not sync subscriber to Supabase:', e);
    return false;
  }
}

/**
 * ⚡ FETCH ALL SUBSCRIBERS FROM SUPABASE
 */
export async function fetchSupabaseSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers?select=*&order=created_at.desc`, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!res.ok) return [];
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];

    return rows.map((r: any): NewsletterSubscriber => ({
      id: r.id || String(r.created_at),
      email: r.email,
      phone: r.phone || undefined,
      countryCode: r.country_code || '+91',
      source: r.source || 'newsletter_modal',
      createdAt: r.created_at || new Date().toISOString(),
    }));
  } catch (e) {
    return [];
  }
}

/**
 * ⚡ FETCH REVIEWS FROM SUPABASE (Zero Egress if Cached)
 */
export async function fetchSupabaseReviews(productId?: string, forceFresh: boolean = false): Promise<ProductReview[]> {
  const cacheKey = productId || 'all_reviews';
  const now = Date.now();

  if (!forceFresh && _reviewsCache.has(cacheKey)) {
    const cached = _reviewsCache.get(cacheKey)!;
    if (now - cached.timestamp < REVIEWS_TTL_MS) {
      return cached.data;
    }
  }

  try {
    let url = `${SUPABASE_URL}/rest/v1/reviews?select=*&order=created_at.desc`;
    if (productId) {
      url = `${SUPABASE_URL}/rest/v1/reviews?product_id=eq.${encodeURIComponent(productId)}&select=*&order=created_at.desc`;
    }

    const res = await fetch(url, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!res.ok) return _reviewsCache.get(cacheKey)?.data || [];
    const rows = await res.json();
    if (!Array.isArray(rows)) return _reviewsCache.get(cacheKey)?.data || [];

    const mapped = rows.map((r: any): ProductReview => ({
      id: r.id,
      productId: r.product_id,
      authorName: r.author_name,
      rating: Number(r.rating || 5),
      headline: r.headline || '',
      comment: r.comment || '',
      createdAt: r.created_at || new Date().toISOString(),
      verified: Boolean(r.verified ?? true),
    }));

    _reviewsCache.set(cacheKey, { data: mapped, timestamp: Date.now() });
    return mapped;
  } catch (e) {
    return _reviewsCache.get(cacheKey)?.data || [];
  }
}

/**
 * ⚡ INSERT REVIEW TO SUPABASE
 */
export async function insertSupabaseReview(review: ProductReview): Promise<boolean> {
  try {
    _reviewsCache.clear();

    const payload = {
      id: review.id || `rev-${Date.now()}`,
      product_id: review.productId,
      author_name: review.authorName.trim(),
      rating: review.rating,
      headline: review.headline?.trim() || null,
      comment: review.comment.trim(),
      created_at: review.createdAt || new Date().toISOString(),
      verified: review.verified ?? true,
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (e) {
    console.warn('Could not insert review to Supabase:', e);
    return false;
  }
}

/**
 * ⚡ DELETE REVIEW FROM SUPABASE
 */
export async function deleteSupabaseReview(id: string): Promise<boolean> {
  try {
    _reviewsCache.clear();
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reviews?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: HEADERS,
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

/**
 * ⚡ RECORD REAL-TIME SITE VISITOR EVENT TO SUPABASE
 */
export async function recordSupabaseVisit(visit: Partial<AnalyticsVisit>): Promise<boolean> {
  try {
    const payload = {
      id: visit.id || `vis_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      session_id: visit.sessionId || 'anonymous_session',
      visitor_id: visit.visitorId || 'anonymous_visitor',
      page_path: visit.pagePath || '/',
      page_title: visit.pageTitle || 'Bliss Balance',
      referrer: visit.referrer || 'direct',
      device_type: visit.deviceType || 'Desktop',
      browser: visit.browser || 'Unknown',
      os: visit.os || 'Unknown',
      utm_source: visit.utmSource || null,
      utm_medium: visit.utmMedium || null,
      utm_campaign: visit.utmCampaign || null,
      user_email: visit.userEmail || null,
      created_at: visit.createdAt || new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/analytics_visits`, {
      method: 'POST',
      headers: {
        ...HEADERS,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (e) {
    return false;
  }
}

/**
 * ⚡ FETCH RECENT VISITOR ANALYTICS FROM SUPABASE
 */
export async function fetchSupabaseVisits(limit: number = 200): Promise<AnalyticsVisit[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/analytics_visits?select=*&order=created_at.desc&limit=${limit}`, {
      method: 'GET',
      headers: HEADERS,
    });

    if (!res.ok) return [];
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];

    return rows.map((r: any): AnalyticsVisit => ({
      id: r.id,
      sessionId: r.session_id,
      visitorId: r.visitor_id,
      pagePath: r.page_path,
      pageTitle: r.page_title,
      referrer: r.referrer,
      deviceType: r.device_type,
      browser: r.browser,
      os: r.os,
      utmSource: r.utm_source,
      utmMedium: r.utm_medium,
      utmCampaign: r.utm_campaign,
      userEmail: r.user_email,
      createdAt: r.created_at || new Date().toISOString(),
    }));
  } catch (e) {
    return [];
  }
}



