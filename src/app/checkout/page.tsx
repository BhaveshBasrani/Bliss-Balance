import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckoutClient from '@/app/checkout/CheckoutClient';
import { BrandLoadingScreen } from '@/components/BrandLoadingScreen';

export const metadata: Metadata = {
  title: 'Express Checkout | Bliss Balance Footwear',
  description: 'Complete your official Bliss Balance order with free shipping across India, cash on delivery, and 7-day hassle-free returns.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<BrandLoadingScreen message="FEEL THE BLISS • PREPARING CHECKOUT..." />}>
      <CheckoutClient />
    </Suspense>
  );
}
