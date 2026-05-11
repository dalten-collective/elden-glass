import type { Metadata, Viewport } from 'next';
import { EB_Garamond, Inter_Tight } from 'next/font/google';
import localFont from 'next/font/local';

import './globals.css';
import {
  absoluteSiteUrl,
  DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_ORIGIN,
  SITE_TITLE,
} from '@/lib/site-metadata';

// Delay in Glass typography:
//   • EB Garamond — the voice (body, headings)
//   • Inter Tight — the apparatus (eyebrows, labels, captions)
//   • JetBrains Mono — the machine (hashes, spec, plate numbers)
// EB Garamond and Inter Tight are fetched through next/font/google. JetBrains
// Mono is self-hosted from public/fonts because Vercel's build fleet has
// intermittently failed to fetch it from fonts.gstatic.com, breaking preview
// builds with ETIMEDOUT. Self-hosting the variable font removes the build-time
// network dependency for this family.
const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const jetBrainsMono = localFont({
  src: '../public/fonts/JetBrainsMono-Variable.woff2',
  display: 'swap',
  weight: '400 600',
  style: 'normal',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: 'TGB' }],
  icons: {
    icon: '/images/dashusnavnulsigil.png',
    apple: '/images/dashusnavnulsigil.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
    url: '/',
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
      'text/plain': '/llms.txt',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#c9a961',
};

import { AgentationDev } from '@/components/agentation-dev';
import { PostHogMount } from '@/components/analytics/posthog-mount';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // `delay` scopes the entire site under the Delay-in-Glass token system
  // (see app/globals.css). The three font-variable classes expose each face
  // as a CSS variable consumed by the tokens.
  const fontVars = `${ebGaramond.variable} ${interTight.variable} ${jetBrainsMono.variable}`;
  return (
    <html lang="en" className={fontVars} data-scroll-behavior="smooth">
      <body className="delay">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
        <PostHogMount />
        {children}
        {process.env.NODE_ENV === 'development' && <AgentationDev />}
      </body>
    </html>
  );
}

/**
 * Describes the site as a WebSite / CreativeWork for search crawlers.
 */
function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'Elden Ring Is The Large Glass',
    url: absoluteSiteUrl('/'),
    description: SITE_DESCRIPTION,
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name: 'Dalten Collective',
    },
  };
}
