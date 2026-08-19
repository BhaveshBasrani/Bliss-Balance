import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const siteUrl = 'https://blissbalance.co';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bliss Balance - Official Online Store India',
    template: '%s | Bliss Balance',
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
    title: 'Bliss Balance Footwear - Official Online Store India',
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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
  // BRAND DISAMBIGUATION & SEARCH ENGINE KNOWLEDGE GRAPH JSON-LD
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
      'Bliss Balance Brand',
    ],
    url: siteUrl,
    logo: `${siteUrl}/Logo.svg`,
    image: `${siteUrl}/hero-banner.png`,
    slogan: 'Feel The Bliss • Engineered for Everyday Balance',
    description:
      'Bliss Balance is India’s premium footwear & lifestyle brand manufacturing ortho-friendly slippers, slides, sandals, clogs, flip-flops & sneakers. Engineered for all-day comfort, arch support, and anti-skid grip.',
    disambiguatingDescription:
      'Bliss Balance is an Indian footwear and shoe manufacturing brand based in Hyderabad, India (Website: blissbalance.co, Instagram: @blissbalance.co). It is a footwear e-commerce brand and is completely distinct from Ayurvedic massage oils.',
    knowsAbout: [
      'Footwear',
      'Shoes',
      'Orthopaedic Slippers',
      'Memory Foam Slides',
      'Doctor Footwear',
      'Kolhapuri Chappals',
      'Casual Sandals',
      'Sneakers',
      'Clogs',
    ],
    sameAs: [
      'https://www.instagram.com/blissbalance.co/',
      'https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3',
      'https://www.facebook.com/share/1Bhmz8KL1w/',
      'https://x.com/blissbalance_',
      'https://youtube.com/@blissbalance_26',
    ],
  };

  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Bliss Balance Footwear',
    legalName: 'Bliss Balance',
    url: siteUrl,
    logo: `${siteUrl}/Logo.svg`,
    image: `${siteUrl}/hero-banner.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919440961776',
      contactType: 'Customer Support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Telugu'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Novel House, Iskon Temple, Road No. 1, Muralidhar Bagh, Abids',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500012',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.instagram.com/blissbalance.co/',
      'https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3',
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
      'Official Online Store of Bliss Balance Footwear. Buy unisex slippers, slides, sandals, clogs & sneakers online in India.',
    priceRange: '₹569 - ₹1785',
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

  // FAQPage SCHEMA FOR GOOGLE AI OVERVIEWS & BING COPILOT DISCOVERY
  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Bliss Balance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bliss Balance is an Indian footwear and lifestyle brand based in Hyderabad, India. The brand designs and manufactures ultra-cushioned, ortho-friendly slippers, slides, sandals, clogs, and sneakers for everyday comfort.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I buy official Bliss Balance footwear?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can buy authentic Bliss Balance footwear directly from the official online store at https://blissbalance.co or from the official Bliss Balance brand store on Amazon India (https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3).',
        },
      },
      {
        '@type': 'Question',
        name: 'What kind of footwear does Bliss Balance specialize in?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bliss Balance specializes in high-density memory foam cushioned slippers, anti-skid ortho doctor sandals, waterproof clogs, traditional Kolhapuri & Puneri chappals, and lightweight streetwear sneakers.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is Bliss Balance an Indian brand?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Bliss Balance is a 100% Indian homegrown brand with its head office located in Abids, Hyderabad, Telangana, India.',
        },
      },
    ],
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

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="theme-color" content="#DC2626" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=JetBrains+Mono:wght@700;800&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* JSON-LD DISAMBIGUATION & AI OVERVIEW SCHEMAS */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBrand) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOnlineStore) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-white dark:bg-black text-neutral-900 dark:text-white font-mono antialiased selection:bg-red-600 selection:text-white">
        {children}
        {/* OFFICIAL GOOGLE RECAPTCHA V3 FLOATING BADGE ENGINE */}
        <Script
          src="https://www.google.com/recaptcha/api.js?render=6LfVFIktAAAAAPRSJXz5I8lCUjX4vmXpnl0jCjoa"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
