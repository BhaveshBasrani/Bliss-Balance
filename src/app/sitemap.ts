import { MetadataRoute } from 'next';
import { getStoredSKUs, INITIAL_COLLECTIONS } from '@/lib/dataStore';
import { fetchSupabaseSKUs } from '@/lib/supabaseClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blissbalance.co';
  const currentDate = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/collections`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/men`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/women`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/faq`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/care`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
  ];

  // Specific collection category slugs without dynamic URL query parameters
  const categorySlugs = [
    'slippers',
    'slides',
    'sandals',
    'clogs',
    'casual-shoes',
    'sneakers',
    'flip-flops',
    'bestsellers',
    'new-arrivals',
    ...INITIAL_COLLECTIONS.map(col => col.slug || col.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')),
  ];

  const uniqueCategorySlugs = Array.from(new Set(categorySlugs));

  const collectionRoutes: MetadataRoute.Sitemap = uniqueCategorySlugs.map((slug) => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Product SKU Routes from live storage
  const activeSkus = await fetchSupabaseSKUs();
  const productRoutes: MetadataRoute.Sitemap = activeSkus.map((sku) => ({
    url: `${baseUrl}/product/${sku.id}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
