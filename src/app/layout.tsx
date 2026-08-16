import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { MobileBottomNav } from '@/components/MobileBottomNav';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0A0A',
};

export const metadata: Metadata = {
  title: 'BLISS BALANCE | Official Store | Walk in Bliss. Live in Balance.',
  description: 'Official Bliss Balance footwear store. Discover comfortable, lightweight, anti-skid slippers, sandals, slides, clogs, sneakers & casual shoes for Men and Women. Available on Amazon & Myntra.',
  keywords: [
    'Bliss Balance',
    'Bliss Balance footwear',
    'Bliss Balance slippers',
    'Bliss Balance sandals',
    'Bliss Balance slides',
    'Bliss Balance clogs',
    'men slippers',
    'women slippers',
    'comfortable footwear India',
    'lightweight slides',
    'anti-skid sandals',
    'everyday walking footwear'
  ],
  authors: [{ name: 'Bliss Balance Brand' }],
  creator: 'Bliss Balance',
  publisher: 'Bliss Balance',
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
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://blissbalance.co',
    siteName: 'Bliss Balance Footwear',
    title: 'BLISS BALANCE | Walk in Bliss. Live in Balance.',
    description: 'Modern Indian footwear brand created for comfort, style, lightweight construction, and dependable grip.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BLISS BALANCE | Official Footwear Store',
    description: 'Walk in Bliss. Live in Balance. Everyday footwear made for comfort, style and reliable grip.',
  },
  alternates: {
    canonical: 'https://blissbalance.co',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: 'Bliss Balance',
    alternateName: 'Bliss Balance Footwear',
    url: 'https://blissbalance.co',
    logo: 'https://blissbalance.co/assets/Logo.svg',
    slogan: 'Walk in Bliss. Live in Balance.',
    description: 'Modern Indian footwear brand combining comfort, contemporary style, lightweight construction and dependable grip.',
    sameAs: [
      'https://www.amazon.in',
      'https://www.myntra.com'
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Google reCAPTCHA v3 Script Loader */}
        <script
          src="https://www.google.com/recaptcha/api.js?render=6Ld_EXAMPLE_RECAPTCHA_V3_SITE_KEY"
          async
          defer
        />
        {/* Structured Data Schema for Google & Bing Indexing */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jakartaSans.variable} ${bebasNeue.variable} font-body bg-neutral-950 text-white dark:bg-neutral-950 dark:text-white light:bg-slate-50 light:text-slate-900 antialiased selection:bg-red-600 selection:text-white min-h-screen flex flex-col justify-between`}
      >
        <ThemeProvider>
          {children}
          {/* Native Mobile Phone Bottom Nav */}
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
