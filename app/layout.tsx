import type { Metadata } from 'next';

import './globals.css';

// Use CSS variables with system font fallbacks (no network required)
// When online, Google Fonts can be loaded via globals.css @import if desired

/**
 * Canonical site URL. In production this should be set via NEXT_PUBLIC_BASE_URL
 * (Vercel sets it automatically; the sitemap already reads from the same var).
 * The fallback is the eldenglass.com production domain so local dev still
 * renders absolute OG/Twitter image URLs rather than localhost references,
 * which silences Next's "metadataBase is not set" build-time warning.
 */
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://eldenglass.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Elden Glass — Blockchain Verified Lore Discovery',
  description: 'A groundbreaking discovery reveals Elden Ring as a digital reimagining of Marcel Duchamp\'s The Large Glass. Blockchain-timestamped research with cryptographic verification.',
  keywords: ['Elden Ring', 'Marcel Duchamp', 'The Large Glass', 'FromSoftware', 'Pataphysics', 'Game Analysis', 'Art History', 'Blockchain Verification'],
  authors: [{ name: 'TGB' }],
  icons: {
    icon: '/images/dashusnavnulsigil.png',
    apple: '/images/dashusnavnulsigil.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Elden Ring Is The Large Glass - Verified Discovery',
    description: 'FromSoftware\'s masterpiece decoded: A complete digital reimagining of Duchamp\'s mechanical bride fantasy.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Elden Glass',
    images: [
      {
        url: '/images/replica-large-glass.jpg',
        width: 800,
        height: 533,
        alt: 'The Large Glass replica in Tokyo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elden Ring Is The Large Glass',
    description: 'A blockchain-verified discovery proving Elden Ring reimagines Duchamp\'s The Large Glass',
    images: ['/images/replica-large-glass.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover',
  themeColor: '#c9a961',
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

import { AgentationDev } from '@/components/agentation-dev';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <AgentationDev />}
      </body>
    </html>
  );
}
