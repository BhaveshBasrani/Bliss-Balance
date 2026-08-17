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
    default: 'Bliss Balance • Premium Cushioned Footwear India | Feel The Bliss',
    template: '%s | Bliss Balance • Official Store',
  },
  description:
    'Bliss Balance is a modern Indian footwear brand crafting premium cushioned slippers, slides, sandals, clogs, sneakers & daily footwear. Soft comfort, lightweight feel, anti-skid grip, and free shipping across India.',
  keywords: [
    'Bliss Balance',
    'Bliss Balance Footwear',
    'blissbalance.co',
    'Feel The Bliss',
    'Cushioned Slippers India',
    'Men Footwear',
    'Women Footwear',
    'Kids Footwear',
    'Slippers',
    'Flip-Flops',
    'Slides',
    'Sandals',
    'Clogs',
    'Casual Shoes',
    'Sneakers',
    'Loafers',
    'Anti-Skid Footwear',
    'Comfort Footwear India',
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
    title: 'Bliss Balance • Premium Cushioned Footwear | Feel The Bliss',
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
    title: 'Bliss Balance • Premium Cushioned Footwear India',
    description:
      'Soft cushioned slippers, slides, sandals, clogs, & sneakers crafted for everyday life. Feel The Bliss.',
    images: [`${siteUrl}/hero-banner.png`],
    creator: '@blissbalance',
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
    name: 'Bliss Balance',
    url: siteUrl,
    logo: `${siteUrl}/Logo.svg`,
    slogan: 'Feel The Bliss',
    description:
      'Modern Indian footwear brand combining soft comfort, contemporary style, lightweight construction, and dependable anti-skid grip.',
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

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Bliss Balance',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/collections?cat={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${jakarta.variable}`}>
      <head>
        <Script
          id="schema-org-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
        />
        <Script
          id="schema-org-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
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
