import React from 'react';
import { Metadata } from 'next';
import { FAQClient } from './FAQClient';

const siteUrl = 'https://blissbalance.co';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | Bliss Balance® Footwear',
  description: 'Get answers regarding Bliss Balance footwear sizing, memory foam cushioning, returns, warranty, and official store ordering in India.',
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: `${siteUrl}/faq`,
    title: 'FAQ & Help | Bliss Balance® Footwear India',
    description: 'Frequently Asked Questions about Bliss Balance footwear sizing, ordering, and comfort features.',
    siteName: 'Bliss Balance Footwear',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Bliss Balance FAQ & Help',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ & Help | Bliss Balance®',
    description: 'Frequently Asked Questions about Bliss Balance footwear sizing, ordering, and comfort features.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
