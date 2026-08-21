import React from 'react';
import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import { fetchSupabaseSingleSKU, fetchSupabaseSKUs } from '@/lib/supabaseClient';
import { INITIAL_SKUS } from '@/lib/initialSkus';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export const dynamicParams = true;
// Revalidate every 12 hours (43200 seconds)
export const revalidate = 43200;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await fetchSupabaseSingleSKU(params.id);
  const siteUrl = 'https://blissbalance.co';

  if (!product) {
    return {
      title: 'Product Details | Bliss Balance®',
      description: 'Official Bliss Balance footwear details, sizing, and authentic pricing.',
      openGraph: {
        images: [`${siteUrl}/og-image.jpg`],
      },
    };
  }

  const title = `${product.title} | Bliss Balance® Official Store`;
  const description = product.subtitle || `Buy ${product.title} online at Bliss Balance India. Doctor-recommended comfort, lightweight EVA sole, and anti-skid grip.`;
  const imageUrl = product.imageUrl && product.imageUrl.startsWith('http') ? product.imageUrl : `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/product/${product.id}`,
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: `${siteUrl}/product/${product.id}`,
      title,
      description,
      siteName: 'Bliss Balance Footwear',
      images: [
        {
          url: imageUrl,
          width: 1000,
          height: 1000,
          alt: product.title,
        },
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'Bliss Balance Footwear - Step Into Perfect Balance',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export async function generateStaticParams() {
  return INITIAL_SKUS.map(sku => ({ id: sku.id }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchSupabaseSingleSKU(params.id);
  const siteUrl = 'https://blissbalance.co';

  let jsonLd: any = null;
  if (product) {
    const imageUrl = product.imageUrl && product.imageUrl.startsWith('http') ? product.imageUrl : `${siteUrl}/og-image.jpg`;
    const productSchema: any = {
      '@type': 'Product',
      name: product.title,
      image: imageUrl,
      description: product.subtitle || `Official Bliss Balance ${product.title} footwear.`,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: 'Bliss Balance'
      },
      offers: {
        '@type': 'Offer',
        url: `${siteUrl}/product/${product.id}`,
        priceCurrency: 'INR',
        price: product.price,
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Bliss Balance'
        }
      }
    };
    
    // Add AggregateRating if it exists
    if (product.rating && product.reviewCount && product.reviewCount > 0) {
      productSchema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount
      };
    }

    jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        productSchema,
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': siteUrl
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Collections',
              'item': `${siteUrl}/collections`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': product.title,
              'item': `${siteUrl}/product/${product.id}`
            }
          ]
        }
      ]
    };
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient productId={params.id} />
    </>
  );
}
