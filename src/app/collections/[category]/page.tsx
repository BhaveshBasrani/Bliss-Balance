import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CollectionsClient } from '../CollectionsClient';

interface Props {
  params: {
    category: string;
  };
}

interface CategoryRouteConfig {
  title: string;
  badge: string;
  metaTitle: string;
  metaDescription: string;
  category?: string;
  gender?: string;
  filter?: string;
}

const CATEGORY_MAP: Record<string, CategoryRouteConfig> = {
  'slippers': {
    title: 'SLIPPERS & FLIP-FLOPS',
    badge: 'BLISS BALANCE • SLIPPERS',
    metaTitle: 'Comfort Slippers & Flip-Flops | Bliss Balance®',
    metaDescription: 'Shop doctor-recommended orthopedic slippers and cushioned flip-flops engineered for everyday balance and arch support.',
    category: 'Slippers',
  },
  'slides': {
    title: 'COMFORT SLIDES',
    badge: 'BLISS BALANCE • SLIDES',
    metaTitle: 'Ultra-Cushioned Slides | Bliss Balance®',
    metaDescription: 'Discover high-density EVA slides with bounce-back footbeds and anti-skid wave soles for men and women.',
    category: 'Slides',
  },
  'sandals': {
    title: 'COMFORT SANDALS',
    badge: 'BLISS BALANCE • SANDALS',
    metaTitle: 'Doctor Sandals & Adjustable Contours | Bliss Balance®',
    metaDescription: 'Shop adjustable strap doctor sandals and orthopedic comfort sandals crafted for daily walking comfort.',
    category: 'Sandals',
  },
  'clogs': {
    title: 'WATERPROOF CLOGS',
    badge: 'BLISS BALANCE • CLOGS',
    metaTitle: 'Waterproof Clogs & Crocs | Bliss Balance®',
    metaDescription: 'Featherlight waterproof clogs with breathable ventilation ports and anti-slip grip for monsoon and everyday wear.',
    category: 'Clogs',
  },
  'casual-shoes': {
    title: 'CASUAL SHOES & SNEAKERS',
    badge: 'BLISS BALANCE • CASUAL SHOES',
    metaTitle: 'Everyday Casual Shoes | Bliss Balance®',
    metaDescription: 'Modern casual footwear and daily walkers engineered with high-traction soles and cushioned comfort.',
    category: 'Casual Shoes',
  },
  'sneakers': {
    title: 'STREETWEAR SNEAKERS',
    badge: 'BLISS BALANCE • SNEAKERS',
    metaTitle: 'Contemporary Streetwear Sneakers | Bliss Balance®',
    metaDescription: 'Explore lifestyle sneakers built with breathable uppers and durable outsoles for versatile styling.',
    category: 'Sneakers',
  },
  'flip-flops': {
    title: 'FLIP-FLOPS',
    badge: 'BLISS BALANCE • FLIP-FLOPS',
    metaTitle: 'Daily Flip-Flops | Bliss Balance®',
    metaDescription: 'Soft lightweight flip-flops with anti-skid wave texture for relaxing at home or casual steps outside.',
    category: 'Flip-Flops',
  },
  'loafers': {
    title: 'COMFORT LOAFERS',
    badge: 'BLISS BALANCE • LOAFERS',
    metaTitle: 'Slip-On Loafers | Bliss Balance®',
    metaDescription: 'Effortless slip-on loafers designed with memory foam cushioning for daily office and casual wear.',
    category: 'Loafers',
  },
  'bestsellers': {
    title: 'OUR BEST SELLERS',
    badge: 'BLISS BALANCE • TOP RATED',
    metaTitle: 'Best Selling Footwear | Bliss Balance®',
    metaDescription: 'Explore India\'s top-rated footwear styles trusted by over 1,00,000+ satisfied customers nationwide.',
    filter: 'bestseller',
  },
  'new-arrivals': {
    title: 'NEW ARRIVALS',
    badge: 'BLISS BALANCE • FRESH DROPS',
    metaTitle: 'New Footwear Arrivals | Bliss Balance®',
    metaDescription: 'Discover the latest comfort slippers, slides, sandals, and clogs recently added to our catalog.',
    filter: 'new',
  },
  'mens-slippers': {
    title: 'MEN\'S SLIPPERS & SLIDES',
    badge: 'BLISS BALANCE • MEN',
    metaTitle: 'Men\'s Slippers & Slides | Bliss Balance®',
    metaDescription: 'Shop men\'s cushioned slippers, flip-flops, and slides with anti-skid soles and arch support.',
    category: 'Slippers',
    gender: 'Men',
  },
  'mens-casual-sneakers': {
    title: 'MEN\'S CASUAL & SNEAKERS',
    badge: 'BLISS BALANCE • MEN',
    metaTitle: 'Men\'s Casual Shoes & Sneakers | Bliss Balance®',
    metaDescription: 'Men\'s contemporary casual footwear and streetwear sneakers designed for daily steps.',
    category: 'Sneakers',
    gender: 'Men',
  },
  'womens-slippers-slides': {
    title: 'WOMEN\'S SLIPPERS & SLIDES',
    badge: 'BLISS BALANCE • WOMEN',
    metaTitle: 'Women\'s Slippers & Slides | Bliss Balance®',
    metaDescription: 'Ultra-lightweight women\'s comfort slippers and fashionable slides for effortless everyday balance.',
    category: 'Slides',
    gender: 'Women',
  },
  'womens-sandals-flats': {
    title: 'WOMEN\'S SANDALS & FLATS',
    badge: 'BLISS BALANCE • WOMEN',
    metaTitle: 'Women\'s Sandals & Flats | Bliss Balance®',
    metaDescription: 'Supportive women\'s sandals, doctor contours, and comfort flats for work and daily outings.',
    category: 'Sandals',
    gender: 'Women',
  },
  'womens-clogs-sneakers': {
    title: 'WOMEN\'S CLOGS & SNEAKERS',
    badge: 'BLISS BALANCE • WOMEN',
    metaTitle: 'Women\'s Clogs & Sneakers | Bliss Balance®',
    metaDescription: 'Waterproof clogs with charms and cushioned streetwear sneakers for active women.',
    category: 'Clogs',
    gender: 'Women',
  },
  'kids-crocs': {
    title: 'KIDS\' CROCS & CLOGS',
    badge: 'BLISS BALANCE • KIDS',
    metaTitle: 'Kids\' Clogs & Active Footwear | Bliss Balance®',
    metaDescription: 'Lightweight anti-skid clogs and slip-on sandals engineered for kids playtime.',
    category: 'Clogs',
    gender: 'Kids',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (params.category || '').toLowerCase();
  const config = CATEGORY_MAP[slug];
  const siteUrl = 'https://blissbalance.co';

  const title = config ? config.metaTitle : `${slug.replace(/-/g, ' ').toUpperCase()} Collection | Bliss Balance®`;
  const description = config ? config.metaDescription : `Explore the ${slug.replace(/-/g, ' ')} footwear collection from Bliss Balance India.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/collections/${slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: `${siteUrl}/collections/${slug}`,
      title,
      description,
      siteName: 'Bliss Balance Footwear',
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `Bliss Balance Footwear - ${title}`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}/og-image.jpg`],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((category) => ({
    category,
  }));
}

export default function CategoryCollectionPage({ params }: Props) {
  const slug = (params.category || '').toLowerCase();
  const config = CATEGORY_MAP[slug];

  const categoryName = config ? config.category : slug.replace(/-/g, ' ');
  const title = config?.title || slug.replace(/-/g, ' ').toUpperCase();
  const badge = config?.badge || 'BLISS BALANCE CATALOG';

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <CollectionsClient
        initialCategory={categoryName}
        initialGender={config?.gender}
        initialFilter={config?.filter}
        customTitle={title}
        customBadge={badge}
      />
    </Suspense>
  );
}
