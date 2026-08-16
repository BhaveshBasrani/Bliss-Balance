import type { Metadata, Viewport } from 'next';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { MobileBottomNav } from '@/components/MobileBottomNav';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FFFFFF',
};

export const metadata: Metadata = {
  title: 'BLISS BALANCE | Official Store | Walk in Bliss. Live in Balance.',
  description: 'Official Bliss Balance footwear store. Discover comfortable, lightweight, anti-skid slippers, sandals, slides, clogs, sneakers & casual shoes for Men and Women.',
  keywords: [
    'Bliss Balance',
    'Bliss Balance footwear',
    'Bliss Balance slippers',
    'Bliss Balance sandals',
    'Bliss Balance slides',
    'men slippers',
    'women slippers',
    'everyday walking footwear'
  ],
  authors: [{ name: 'Bliss Balance' }],
  creator: 'Bliss Balance',
  publisher: 'Bliss Balance',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://blissbalance.co',
    siteName: 'Bliss Balance Footwear',
    title: 'BLISS BALANCE | Walk in Bliss. Live in Balance.',
    description: 'Everyday footwear made for comfort, style, lightweight feel and reliable grip.',
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
    url: 'https://blissbalance.co',
    logo: 'https://blissbalance.co/Logo.svg',
    slogan: 'Walk in Bliss. Live in Balance.',
    description: 'Modern footwear brand combining comfort, contemporary style, lightweight construction and dependable grip.',
  };

  return (
    <html lang="en" className="light scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body
        className={`${outfit.variable} ${jakartaSans.variable} font-body bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white antialiased selection:bg-red-600 selection:text-white min-h-screen flex flex-col justify-between tracking-wide leading-relaxed`}
      >
        <ThemeProvider>
          {children}
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
