import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Script from 'next/script';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = 'https://blissbalance.co';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BLISS BALANCE® Official Store | Premium Cushioned Footwear India | Feel The Bliss',
    template: '%s | Bliss Balance® Official Store',
  },
  description:
    'Bliss Balance® is India\'s premier cushioned footwear brand crafting soft slippers, slides, sandals, clogs, sneakers & daily shoes. Anti-skid grip, lightweight feel, 7-day easy returns & free shipping across India.',
  keywords: [
    'Bliss Balance',
    'Bliss Balance Shoes',
    'Bliss Balance Slippers',
    'Bliss Balance Slides',
    'Bliss Balance Sandals',
    'Bliss Balance Clogs',
    'Bliss Balance Footwear',
    'Bliss Balance India',
    'Bliss Balance Hyderabad',
    'Bliss Balance Official Website',
    'Bliss Balance Amazon Store',
    'blissbalance.co',
    'Feel The Bliss',
    'Cushioned Slippers India',
    'Anti Skid Footwear',
    'Men Footwear Bliss Balance',
    'Women Footwear Bliss Balance',
    'Kids Footwear Bliss Balance',
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
    title: 'BLISS BALANCE® Official Store | Premium Cushioned Footwear India | Feel The Bliss',
    description:
      'Bliss Balance is a modern Indian footwear brand combining soft comfort, contemporary style, lightweight construction, and dependable anti-skid grip for everyday life.',
    siteName: 'Bliss Balance',
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
    title: 'BLISS BALANCE® Official Store | Premium Cushioned Footwear India',
    description:
      'Soft cushioned slippers, slides, sandals, clogs, & sneakers crafted for everyday life. Feel The Bliss.',
    images: [`${siteUrl}/hero-banner.png`],
    creator: '@blissbalance_',
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
  const jsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'Bliss Balance',
    alternateName: ['Bliss Balance Footwear', 'Bliss Balance India'],
    url: siteUrl,
    logo: `${siteUrl}/Logo.svg`,
    image: `${siteUrl}/hero-banner.png`,
    slogan: 'Feel The Bliss',
    description:
      'Bliss Balance is an official Indian cushioned footwear brand combining soft comfort, contemporary style, lightweight construction, and dependable anti-skid grip for everyday life.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+919440961776',
      email: 'blissbalance.in@gmail.com',
      contactType: 'customer support',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
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
      'https://www.facebook.com/share/1Bhmz8KL1w/',
      'https://x.com/blissbalance_',
      'https://youtube.com/@blissbalance_26?si=5xinn2mC-29ifst9',
      'https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3?lp_asin=B0GV6T919J&ref_=cm_sw_r_apann_ast_store_DTJ19G6CEXMFCXTTDYBR',
    ],
  };

  const jsonLdStore = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${siteUrl}/#store`,
    name: 'Bliss Balance Official Store',
    url: siteUrl,
    image: `${siteUrl}/hero-banner.png`,
    telephone: '+919440961776',
    priceRange: '₹799 - ₹4999',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Novel House, Iskon Temple, Road No. 1, Muralidhar Bagh, Abids',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500012',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.3850,
      longitude: 78.4867,
    },
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Bliss Balance',
    url: siteUrl,
    publisher: { '@id': `${siteUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/collections?cat={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const jsonLdBrand = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `${siteUrl}/#brand`,
    name: 'Bliss Balance',
    alternateName: 'Bliss Balance Footwear',
    url: siteUrl,
    logo: `${siteUrl}/Logo.svg`,
    slogan: 'Feel The Bliss',
    description: 'Bliss Balance is a modern Indian footwear brand specializing in cushioned slippers, slides, sandals, clogs, and sneakers for everyday comfort.',
  };

  const jsonLdFAQ = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Bliss Balance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bliss Balance is an official Indian cushioned footwear brand offering soft, anti-skid slippers, slides, sandals, clogs, and sneakers for everyday comfort.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I buy official Bliss Balance footwear?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can buy official Bliss Balance footwear online at https://blissbalance.co or on the official Amazon India Brand Store at https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where is Bliss Balance headquartered?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Bliss Balance is headquartered at Novel House, Iskon Temple, Road No. 1, Muralidhar Bagh, Abids, Hyderabad, Telangana 500012, India.',
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${jakarta.variable}`}>
      <head>
        <link rel="canonical" href="https://blissbalance.co/" />
        <meta name="theme-color" content="#DC2626" />
        <meta name="apple-mobile-web-app-title" content="Bliss Balance" />
        <Script
          id="schema-org-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <Script
          id="schema-org-store"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdStore) }}
        />
        <Script
          id="schema-org-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <Script
          id="schema-org-brand"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBrand) }}
        />
        <Script
          id="schema-org-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }}
        />
        <Script
          id="google-recaptcha"
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LfVFIktAAAAAPRSJXz5I8lCUjX4vmXpnl0jCjoa'}`}
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-neutral-950 font-body text-neutral-900 dark:text-white antialiased selection:bg-red-600 selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
