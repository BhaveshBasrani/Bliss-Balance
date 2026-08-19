import type { Metadata } from 'next';
import Script from 'next/script';
import { Syne, Plus_Jakarta_Sans, Outfit, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-serif-luxury',
  display: 'swap',
});

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
    title: 'Bliss Balance® — Step Into Perfect Balance | Official Store',
    description:
      'Step into perfect balance. Premium comfort slippers, doctor sandals, cushioned slides, waterproof clogs & lifestyle sneakers. 100% Original, Free Delivery across India.',
    siteName: 'Bliss Balance Footwear',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        secureUrl: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Bliss Balance Footwear - Step Into Perfect Balance',
        type: 'image/jpeg',
      },
      {
        url: `${siteUrl}/og-square.jpg`,
        secureUrl: `${siteUrl}/og-square.jpg`,
        width: 800,
        height: 800,
        alt: 'Bliss Balance Footwear Square Logo',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@blissbalance_',
    creator: '@blissbalance_',
    title: 'Bliss Balance® — Step Into Perfect Balance',
    description:
      'Step into perfect balance. Premium comfort slippers, doctor sandals, cushioned slides, waterproof clogs & lifestyle sneakers.',
    images: [`${siteUrl}/og-image.jpg`],
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
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon-192x192.png', type: 'image/png', sizes: '192x192' },
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
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    bingbot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    msnbot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BRAND DISAMBIGUATION & SEARCH ENGINE KNOWLEDGE GRAPH JSON-LD
  const unifiedJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
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
        image: `${siteUrl}/og-image.jpg`,
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
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Bliss Balance Footwear',
        legalName: 'Bliss Balance',
        url: siteUrl,
        logo: `${siteUrl}/Logo.svg`,
        image: `${siteUrl}/og-image.jpg`,
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
      },
      {
        '@type': 'OnlineStore',
        '@id': `${siteUrl}/#store`,
        name: 'Bliss Balance - Official Online Store',
        url: siteUrl,
        logo: `${siteUrl}/Logo.svg`,
        image: `${siteUrl}/og-image.jpg`,
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
      },
      {
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
      },
      {
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
      },
    ],
  };

  return (
    <html lang="en" className={`${syne.variable} ${jakarta.variable} ${outfit.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#DC2626" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preload" as="image" href="/hero-banner.png" fetchPriority="high" media="(min-width: 640px)" />
        <link rel="preload" as="image" href="/hero-banner-mobile.png" fetchPriority="high" media="(max-width: 639px)" />

        {/* CONSOLIDATED JSON-LD SCHEMA GRAPH */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(unifiedJsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-white dark:bg-black text-neutral-900 dark:text-white font-mono antialiased selection:bg-red-600 selection:text-white">
        {children}

        {/* GOOGLE TAG / ANALYTICS (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DQVHKGD55G"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DQVHKGD55G', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* OFFICIAL GOOGLE RECAPTCHA V3 FLOATING BADGE ENGINE */}
        <Script
          src="https://www.google.com/recaptcha/api.js?render=6LfVFIktAAAAAPRSJXz5I8lCUjX4vmXpnl0jCjoa"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
