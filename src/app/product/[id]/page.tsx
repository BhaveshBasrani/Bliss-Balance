import React from 'react';
import { Metadata } from 'next';
import ProductDetailClient from './ProductDetailClient';
import { getStoredSKUs } from '@/lib/dataStore';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export const dynamicParams = true;

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const skus = getStoredSKUs();
  const product = skus.find(s => s.id.toLowerCase() === params.id.toLowerCase());
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
  const activeSkus = getStoredSKUs();
  const initialIds = activeSkus.map(sku => ({ id: sku.id }));
  
  const fallbackIds = [
    { id: 'BB924' },
    { id: 'BB1106' },
    { id: 'BB12' },
    { id: 'BB155' },
    { id: 'default' },
  ];

  return [...initialIds, ...fallbackIds];
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailClient productId={params.id} />;
}
