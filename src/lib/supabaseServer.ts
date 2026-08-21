import https from 'https';
import { FootwearSKU } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ummvwrzzxehetmtaugop.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbXZ3cnp6eGVoZXRtdGF1Z29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNTI1NzIsImV4cCI6MjEwMjYyODU3Mn0.CWzbUjICztb1Ga3u_gxjicbe362ZR519OdJK5YItu2E';

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

function httpsGet(urlPath: string): Promise<any> {
  return new Promise((resolve) => {
    const url = new URL(`${SUPABASE_URL}${urlPath}`);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'GET',
      headers: HEADERS
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            resolve(null);
            return;
          }
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.error('HTTPS Get Error:', e);
      resolve(null);
    });
    
    // Add a timeout of 10s
    req.setTimeout(10000, () => {
      req.destroy();
      resolve(null);
    });

    req.end();
  });
}

const LISTING_FIELDS = [
  'id', 'title', 'subtitle', 'gender', 'category', 'price', 'original_price',
  'image_url', 'hover_image_url', 'rating', 'review_count', 'is_bestseller',
  'is_new_arrival', 'color_variants', 'sizes', 'created_at'
].join(',');

export async function fetchSupabaseSKUsServer(): Promise<FootwearSKU[]> {
  const rows = await httpsGet(`/rest/v1/skus?select=${LISTING_FIELDS}&order=created_at.desc`);
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
}

export async function fetchSupabaseSettingsServer(): Promise<any | null> {
  const rows = await httpsGet(`/rest/v1/settings?id=eq.site_settings&select=data`);
  if (Array.isArray(rows) && rows.length > 0 && rows[0].data) {
    return rows[0].data;
  }
  return null;
}
