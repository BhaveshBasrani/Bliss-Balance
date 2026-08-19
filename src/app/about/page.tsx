import React from 'react';
import { Metadata } from 'next';
import { AboutClient } from './AboutClient';

const siteUrl = 'https://blissbalance.co';

export const metadata: Metadata = {
  title: 'About Us — Bliss Balance® Footwear India',
  description: 'Learn about Bliss Balance, an Indian footwear brand engineered for everyday balance. Designed for all-day comfort, arch support, and durable anti-skid grip.',
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: `${siteUrl}/about`,
    title: 'About Us | Bliss Balance® India',
    description: 'Homegrown Indian footwear brand creating ultra-cushioned slippers, slides, and sandals.',
    siteName: 'Bliss Balance Footwear',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'About Bliss Balance Footwear',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Bliss Balance®',
    description: 'Learn about Bliss Balance, an Indian footwear brand engineered for everyday balance.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
