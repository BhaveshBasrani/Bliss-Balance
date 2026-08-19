import React from 'react';
import { Metadata } from 'next';
import { WomenClient } from './WomenClient';

const siteUrl = 'https://blissbalance.co';

export const metadata: Metadata = {
  title: "Women's Footwear — Slippers, Slides & Clogs | Bliss Balance®",
  description: "Shop official Bliss Balance Women's footwear in India. Ultra-soft cushioned chappals, stylish ortho slides, and lightweight waterproof clogs.",
  alternates: {
    canonical: `${siteUrl}/women`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: `${siteUrl}/women`,
    title: "Women's Footwear Collection | Bliss Balance® India",
    description: "Explore ortho-friendly comfort slippers, slides, and sandals for women.",
    siteName: 'Bliss Balance Footwear',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Bliss Balance Women's Footwear Collection",
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Women's Footwear Collection | Bliss Balance®",
    description: "Explore ortho-friendly comfort slippers, slides, and sandals for women.",
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function WomenPage() {
  return <WomenClient />;
}
