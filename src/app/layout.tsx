import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://blissbalance.co';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bliss Balance - Official Online Store',
    template: '%s | Bliss Balance - Official Online Store',
  },
  description:
    "Bliss Balance is India's official footwear brand creating cushioned slippers, flip-flops, slides, sandals, clogs & sneakers for everyday comfort and grip.",
  keywords: [
    'Bliss Balance',
    'Bliss Balance Footwear',
    'Bliss Balance Shoes',
    'Bliss Balance Slippers',
    'Bliss Balance Slides',
    'Bliss Balance Sandals',
    'Bliss Balance Clogs',
    'Bliss Balance Sneakers',
    'Bliss Balance Official Store',
    'Bliss Balance India',
    'Bliss Balance Hyderabad',
    'blissbalance.co',
    'Feel The Bliss',
    'Cushioned Footwear India',
    'Anti Skid Shoes India',
    'Men Footwear Bliss Balance',
    'Women Footwear Bliss Balance',
  ],
  authors: [{ name: 'Bliss Balance Footwear' }],
  creator: 'Bliss Balance Footwear',
  publisher: 'Bliss Balance Footwear',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Bliss Balance - Official Online Store',
    description:
      'Bliss Balance is a homegrown Indian lifestyle & footwear brand creating unisex sneakers, slides, sandals & slippers for everyday balance. Feel The Bliss.',
    siteName: 'Bliss Balance Footwear',
    images: [
      {
        url: `${siteUrl}/hero-banner.png`,
        width: 1920,
        height: 1080,
        alt: 'Bliss Balance Streetwear Footwear Hero Spotlight',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bliss Balance - Official Online Store',
    description:
      'Bliss Balance is a homegrown Indian lifestyle & footwear brand creating unisex footwear for everyday balance. Feel The Bliss.',
    images: [`${siteUrl}/hero-banner.png`],
    creator: '@blissbalance_',
  },
  verification: {
    other: {
      'msvalidate.01': 'c89a01f782e541b0b2e8d91c2b5d4e10',
      'indexnow': 'c89a01f782e541b0b2e8d91c2b5d4e10',
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BRAND DISAMBIGUATION & SEARCH ENGINE JSON-LD
  const jsonLdBrand = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `${siteUrl}/#brand`,
    name: 'Bliss Balance',
    alternateName: [
      'Bliss Balance Footwear',
      'Bliss Balance Shoes',
      'Bliss Balance Official Online Store',
      'Bliss Balance India',
    ],
    url: siteUrl,
    logo: `${siteUrl}/Logo.svg`,
    image: `${siteUrl}/hero-banner.png`,
    slogan: 'Feel The Bliss',
    description:
      'Bliss Balance is an Indian footwear & lifestyle brand manufacturing unisex sneakers, slides, sandals, clogs & slippers. Engineered for all-day comfort and anti-skid grip.',
    disambiguatingDescription:
      'Bliss Balance is an Indian footwear and shoe manufacturing brand based in Hyderabad, India. It is a footwear e-commerce store and NOT a massage oil.',
    knowsAbout: ['Footwear', 'Shoes', 'Slippers', 'Slides', 'Sandals', 'Sneakers', 'Clogs'],
    sameAs: [
      'https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3',
      'https://www.facebook.com/share/1Bhmz8KL1w/',
      'https://x.com/blissbalance_',
      'https://youtube.com/@blissbalance_26',
    ],
  };

  const jsonLdOnlineStore = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${siteUrl}/#store`,
    name: 'Bliss Balance - Official Online Store',
    url: siteUrl,
    logo: `${siteUrl}/Logo.svg`,
    image: `${siteUrl}/hero-banner.png`,
    description:
      'Official Online Store of Bliss Balance Footwear. Buy unisex slippers, slides, sandals & sneakers online in India.',
    priceRange: '₹999 - ₹4999',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Credit Card, Debit Card, UPI, Net Banking, Cash on Delivery',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Novel House, Iskon Temple, Road No. 1, Muralidhar Bagh, Abids',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500012',
      addressCountry: 'IN',
    },
    telephone: '+919440961776',
    email: 'blissbalance.in@gmail.com',
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'Bliss Balance - Official Online Store',
    alternateName: 'Bliss Balance Footwear',
    publisher: {
      '@id': `${siteUrl}/#brand`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/collections?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdSiteNavigation = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Men',
        description: 'Browse Bliss Balance Mens Cushioning Footwear, Slides & Sandals',
        url: `${siteUrl}/men`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Women',
        description: 'Browse Bliss Balance Womens Slides, Sandals & Clogs',
        url: `${siteUrl}/women`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'Sneakers',
        description: 'Bliss Balance Everyday Casual Sneakers Collection',
        url: `${siteUrl}/collections?cat=Sneakers`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Slides',
        description: 'Bliss Balance Soft Memory Foam Slides',
        url: `${siteUrl}/collections?cat=Slides`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'About Us',
        description: 'Learn about Bliss Balance Footwear brand story and Hyderabad head office',
        url: `${siteUrl}/about`,
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=JetBrains+Mono:wght@700;800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD DISAMBIGUATION SCHEMAS FOR GOOGLE ENGINE */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBrand) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOnlineStore) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSiteNavigation) }}
        />
      </head>
      <body className="bg-white dark:bg-black text-neutral-900 dark:text-white font-mono antialiased selection:bg-red-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
