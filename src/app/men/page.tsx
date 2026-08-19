import React from 'react';
import { Metadata } from 'next';
import { MenClient } from './MenClient';

const siteUrl = 'https://blissbalance.co';

export const metadata: Metadata = {
  title: "Men's Footwear — Slippers, Slides & Sneakers | Bliss Balance®",
  description: "Shop official Bliss Balance Men's footwear in India. Extra soft ortho slippers, lightweight EVA slides, doctor sandals, and lifestyle sneakers.",
  alternates: {
    canonical: `${siteUrl}/men`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: `${siteUrl}/men`,
    title: "Men's Footwear Collection | Bliss Balance® India",
    description: "Shop high-performance comfort slippers, memory foam slides, doctor sandals & sneakers for men.",
    siteName: 'Bliss Balance Footwear',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Bliss Balance Men's Footwear Collection",
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Men's Footwear Collection | Bliss Balance®",
    description: "Shop high-performance comfort slippers, memory foam slides, doctor sandals & sneakers for men.",
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function MenPage() {
  return <MenClient />;
}
