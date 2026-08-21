import React from 'react';
import { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Bliss Balance | Comfortable Footwear for Everyday Life',
  description: 'Bliss Balance is an Indian footwear brand designing comfortable slippers, sandals, slides, clogs, and sneakers for everyday comfort.',
  openGraph: {
    title: 'Bliss Balance | Comfortable Footwear for Everyday Life',
    description: 'Bliss Balance is an Indian footwear brand designing comfortable slippers, sandals, slides, clogs, and sneakers for everyday comfort.',
    url: 'https://blissbalance.co/',
    siteName: 'Bliss Balance',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bliss Balance | Comfortable Footwear for Everyday Life',
    description: 'Bliss Balance is an Indian footwear brand designing comfortable slippers, sandals, slides, clogs, and sneakers for everyday comfort.',
  }
};

import { fetchSupabaseSKUs, fetchSupabaseSettings } from '@/lib/supabaseClient';
import { DEFAULT_SITE_SETTINGS } from '@/lib/dataStore';

export const revalidate = 7200; // 2 hours window before devices update

export default async function HomePage() {
  let initialSkus: any[] = [];
  let initialSettings: any = null;
  try {
    const [skus, settings] = await Promise.all([
      fetchSupabaseSKUs(),
      fetchSupabaseSettings()
    ]);
    initialSkus = skus || [];
    initialSettings = settings ? { ...DEFAULT_SITE_SETTINGS, ...settings } : null;
  } catch (e) {
    console.error('Failed to fetch data on server:', e);
  }

  return (
    <>
      {/* 
        Visually hidden H1 for SEO. 
        Establishes Bliss Balance as an Indian footwear brand.
      */}
      <h1 className="sr-only">
        Bliss Balance - Indian Footwear Brand for Everyday Comfort and Contemporary Style
      </h1>
      <HomePageClient initialSkus={initialSkus} initialSettings={initialSettings} />
    </>
  );
}
