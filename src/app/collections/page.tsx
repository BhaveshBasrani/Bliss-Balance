import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { CollectionsClient } from './CollectionsClient';

const siteUrl = 'https://blissbalance.co';

export const metadata: Metadata = {
  title: 'All Footwear Collection | Bliss Balance®',
  description: 'Explore the complete catalog of Bliss Balance orthopedic slippers, slides, comfort doctor sandals, waterproof clogs, and sneakers built for everyday balance in India.',
  alternates: {
    canonical: `${siteUrl}/collections`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: `${siteUrl}/collections`,
    title: 'All Footwear Collection | Bliss Balance® Official Store',
    description: 'Explore the complete catalog of Bliss Balance orthopedic slippers, slides, comfort doctor sandals, waterproof clogs, and sneakers.',
    siteName: 'Bliss Balance Footwear',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Bliss Balance Footwear - Complete Catalog',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Footwear Collection | Bliss Balance®',
    description: 'Explore the complete catalog of Bliss Balance slippers, slides, sandals, clogs, and sneakers.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CollectionsClient />
    </Suspense>
  );
}
