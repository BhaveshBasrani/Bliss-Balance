import { MetadataRoute } from 'next';
import { INITIAL_SKUS, INITIAL_COLLECTIONS } from '@/lib/dataStore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://blissbalance.co';
  const currentDate = new Date();

  // Core Static Brand Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/men`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/women`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/collections`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Dynamic Collection Category Routes
  const collectionRoutes: MetadataRoute.Sitemap = INITIAL_COLLECTIONS.map((col) => ({
    url: `${baseUrl}/collections?cat=${encodeURIComponent(col.title)}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Product SKU Routes
  const productRoutes: MetadataRoute.Sitemap = INITIAL_SKUS.map((sku) => ({
    url: `${baseUrl}/product/${sku.id}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  return [...staticRoutes, ...collectionRoutes, ...productRoutes];
}
