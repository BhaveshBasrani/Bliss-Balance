import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://blissbalance.co';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      {
        userAgent: ['Bingbot', 'BingMediaBot', 'msnbot', 'adidxbot', 'BingPreview', 'Copilot', 'Googlebot'],
        allow: '/',
        disallow: ['/admin'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
