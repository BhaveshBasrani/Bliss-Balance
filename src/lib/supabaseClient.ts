/**
 * ⚡ OFFICIAL BLISS BALANCE SUPABASE CLIENT ENGINE
 * Dedicated ONLY AND ONLY to Products Info & Image Data Storage
 * Connected to: https://ummvwrzzxehetmtaugop.supabase.co
 */

import { FootwearSKU } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ummvwrzzxehetmtaugop.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbXZ3cnp6eGVoZXRtdGF1Z29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTI1NzIsImV4cCI6MjEwMjYyODU3Mn0.CWzbUjICztb1Ga3u_gxjicbe362ZR519OdJK5YItu2E';

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

/**
 * Fetch all Product SKUs directly from Supabase REST API
 */
/**
 * Fetch all Product SKUs directly from Supabase REST API with robust timeout & retry
 */
export async function fetchSupabaseSKUs(): Promise<FootwearSKU[]> {
  const attemptFetch = async (timeoutMs: number): Promise<FootwearSKU[]> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/skus?select=*&order=created_at.desc`, {
        method: 'GET',
        headers: HEADERS,
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.warn('Supabase product fetch returned non-200:', res.status);
        return [];
      }

      const rows = await res.json();
      if (!Array.isArray(rows)) return [];

      return rows.map((row: any): FootwearSKU => ({
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
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  };

  try {
    // Attempt 1: 12-second generous timeout for cross-device & mobile 4G/Wi-Fi
    return await attemptFetch(12000);
  } catch (e) {
    console.warn('First Supabase fetch attempt timed out, retrying with 8s timeout...');
    try {
      // Attempt 2: Quick retry fallback with 8s timeout
      return await attemptFetch(8000);
    } catch (err) {
      console.error('Error fetching Supabase SKUs across devices:', err);
      return [];
    }
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
export async function fetchSupabaseSettings(): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings?id=eq.site_settings&select=*`, {
      method: 'GET',
      headers: HEADERS,
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;
    const rows = await res.json();
    if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
      return rows[0].data;
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * ⚡ SAVE SITE SETTINGS (TICKERS, BANNERS, HERO SLIDES) TO SUPABASE DATABASE
 */
export async function upsertSupabaseSettings(settings: any): Promise<boolean> {
  try {
    const payload = {
      id: 'site_settings',
      data: settings,
      updated_at: new Date().toISOString(),
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
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
