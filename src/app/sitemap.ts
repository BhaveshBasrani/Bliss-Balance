import { MetadataRoute } from 'next';
import { getStoredSKUs, INITIAL_COLLECTIONS } from '@/lib/dataStore';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blissbalance.co';
  const currentDate = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/collections`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/men`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/women`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/our-story`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/admin`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Collection Routes
  const collectionRoutes: MetadataRoute.Sitemap = INITIAL_COLLECTIONS.map((col) => ({
    url: `${baseUrl}/collections?cat=${encodeURIComponent(col.title)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Product SKU Routes from live storage
  const activeSkus = getStoredSKUs();
  const productRoutes: MetadataRoute.Sitemap = activeSkus.map((sku) => ({
    url: `${baseUrl}/product/${sku.id}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
