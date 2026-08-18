import type { Metadata, Viewport } from 'next';
import { Syne, Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Script from 'next/script';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['700', '800'],
});

const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
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
    default: 'Bliss Balance - Official Online Store',
    template: '%s | Bliss Balance Official Store',
  },
  description:
    'Bliss Balance is a homegrown Indian lifestyle & footwear brand that creates unisex footwear and believes in living fearlessly and in everyday balance. Engineered for comfort, style & everyday living.',
  keywords: [
    'Bliss Balance',
    'Bliss Balance Official Online Store',
    'Bliss Balance Shoes',
    'Bliss Balance Slippers',
    'Bliss Balance Slides',
    'Bliss Balance Sandals',
    'Bliss Balance Clogs',
    'Bliss Balance Footwear',
    'Bliss Balance India',
    'Bliss Balance Hyderabad',
    'blissbalance.co',
    'Feel The Bliss',
    'Cushioned Slippers India',
    'Anti Skid Footwear',
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
      'Bliss Balance is a homegrown Indian lifestyle & footwear brand creating unisex sneakers, slides, sandals & slippers for everyday balance.',
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
    title: 'Bliss Balance - Official Online Store',
    description:
      'Bliss Balance is a homegrown Indian lifestyle & footwear brand creating unisex footwear for everyday balance. Feel The Bliss.',
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
      'Bliss Balance is a homegrown Indian lifestyle & footwear brand creating unisex sneakers, slides, sandals & slippers for everyday balance.',
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
      'https://www.amazon.in/stores/BLISSBALANCE/page/41BF3BA5-26D5-42E4-BD12-56E78C103FB3',
    ],
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

  // Google Sitelinks Navigation Schema (Matches Comet Search Results Structure)
  const jsonLdSitelinks = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Men',
        description: 'Explore Bliss Balance Men\'s Footwear — bold unisex sneakers, slides & slippers crafted for fearless living.',
        url: `${siteUrl}/men`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Women',
        description: 'Explore Bliss Balance Women\'s Footwear — soft cushioned slides, sandals & sneakers.',
        url: `${siteUrl}/women`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'Sneakers',
        description: 'Browse men\'s & unisex sneakers by Bliss Balance. Lightweight, cushioned lifestyle footwear.',
        url: `${siteUrl}/collections?cat=Sneakers`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Slides',
        description: 'Shop premium cushioned slides engineered for everyday comfort and anti-skid grip.',
        url: `${siteUrl}/collections?cat=Slides`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'About Us',
        description: 'Learn about Bliss Balance, a homegrown Indian lifestyle footwear brand built on comfort & everyday balance.',
        url: `${siteUrl}/about`,
      },
      {
        '@type': 'SiteNavigationElement',
        position: 6,
        name: 'Contact Us',
        description: 'Get in touch with Bliss Balance customer care and support team.',
        url: `${siteUrl}/about#contact`,
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${space.variable} ${jakarta.variable}`}>
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
          id="schema-org-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <Script
          id="schema-org-sitelinks"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSitelinks) }}
        />
        <Script
          id="google-recaptcha"
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LfVFIktAAAAAPRSJXz5I8lCUjX4vmXpnl0jCjoa'}`}
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-black font-body text-neutral-900 dark:text-white antialiased selection:bg-red-600 selection:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
