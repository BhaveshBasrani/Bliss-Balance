import React from 'react';
import { Metadata } from 'next';
import { CareClient } from './CareClient';

const siteUrl = 'https://blissbalance.co';

export const metadata: Metadata = {
  title: 'Footwear Care & Maintenance Guide | Bliss Balance®',
  description: 'Simple tips to clean, protect, and extend the lifespan of your Bliss Balance EVA slippers, slides, sandals, and sneakers.',
  alternates: {
    canonical: `${siteUrl}/care`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: `${siteUrl}/care`,
    title: 'Footwear Care Guide | Bliss Balance® India',
    description: 'Learn how to clean and maintain your Bliss Balance footwear for maximum durability.',
    siteName: 'Bliss Balance Footwear',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Bliss Balance Care Guide',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Footwear Care Guide | Bliss Balance®',
    description: 'Learn how to clean and maintain your Bliss Balance footwear for maximum durability.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function CarePage() {
  return <CareClient />;
}
