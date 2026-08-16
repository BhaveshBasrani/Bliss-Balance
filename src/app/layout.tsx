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

const siteUrl = 'https://blissbalance.rendervoid.xyz';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Bliss Balance • Modern Indian Footwear Brand | Feel The Bliss',
  description:
    'Bliss Balance is a modern Indian footwear brand combining soft comfort, contemporary style, lightweight construction, and dependable anti-skid grip for everyday life.',
  keywords: [
    'Bliss Balance',
    'Feel The Bliss',
    'Men Footwear',
    'Women Footwear',
    'Slippers',
    'Flip-Flops',
    'Slides',
    'Sandals',
    'Clogs',
    'Casual Shoes',
    'Sneakers',
    'Loafers',
    'Heels',
    'Comfortable Footwear India',
  ],
  authors: [{ name: 'Bliss Balance' }],
  creator: 'Bliss Balance',
  publisher: 'Bliss Balance',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Bliss Balance • Feel The Bliss',
    description:
      'Bliss Balance is a modern Indian footwear brand combining soft comfort, contemporary style, lightweight construction, and dependable anti-skid grip for everyday life.',
    siteName: 'Bliss Balance',
    images: [
      {
        url: `${siteUrl}/Logo.svg`,
        width: 512,
        height: 512,
        alt: 'Bliss Balance Logo Emblem',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bliss Balance • Feel The Bliss',
    description:
      'Soft comfort, practical design, modern style, and everyday versatility. Slippers, slides, sandals & clogs for men and women.',
    images: [`${siteUrl}/Logo.svg`],
  },
  icons: {
    icon: [
      { url: '/Logo.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/Logo.svg',
    apple: '/Logo.svg',
  },
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
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LfVFIktAAAAAPRSJXz5I8lCUjX4vmXpnl0jCjoa';

  // JSON-LD Schema Markup for Organization & WebSite
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Bliss Balance',
    url: siteUrl,
    logo: `${siteUrl}/Logo.svg`,
    slogan: 'Feel The Bliss',
    description: 'Modern Indian footwear brand created for everyday comfort, style, and anti-skid stability.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };

  const schemaWebsite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bliss Balance',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/collections?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable} light`} style={{ colorScheme: 'light' }}>
      <head>
        <link rel="icon" type="image/svg+xml" href="/Logo.svg" sizes="any" />
        <link rel="apple-touch-icon" href="/Logo.svg" />
        
        {/* Structured Data / JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebsite) }}
        />

        {/* Official Google reCAPTCHA v3 Script */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      </head>
      <body className="font-body antialiased bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
