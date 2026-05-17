import type { Metadata } from 'next';

export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://eldenringisthelargeglass.com';

export const SITE_NAME = 'Elden Glass';

export const SITE_TITLE = "Elden Glass - Elden Ring and Marcel Duchamp's Large Glass";

export const SITE_DESCRIPTION =
  "A long-form thesis arguing that Elden Ring is a playable realization of Marcel Duchamp's The Bride Stripped Bare by Her Bachelors, Even, with evidence across The Large Glass, the Green Box, Great Runes, and FromSoftware's world design.";

export const SITE_KEYWORDS = [
  'Elden Ring',
  'Marcel Duchamp',
  'The Large Glass',
  'The Bride Stripped Bare by Her Bachelors, Even',
  'FromSoftware',
  'Great Runes',
  'Green Box',
  'Pataphysics',
  'Game analysis',
  'Art history',
];

export const DEFAULT_OG_IMAGE = {
  url: '/images/replica-large-glass.jpg',
  width: 800,
  height: 533,
  alt: 'The Large Glass replica in Tokyo',
};

export type SitePageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * Builds complete route metadata so app routes do not inherit the homepage
 * canonical, Open Graph, or Twitter values.
 */
export function sitePageMetadata({
  title,
  description,
  path,
  type = 'website',
  publishedTime,
  modifiedTime,
}: SitePageMetadataOptions): Metadata {
  const openGraph =
    type === 'article'
      ? {
          title,
          description,
          type,
          url: path,
          siteName: SITE_NAME,
          publishedTime,
          modifiedTime,
          images: [DEFAULT_OG_IMAGE],
        }
      : {
          title,
          description,
          type,
          url: path,
          siteName: SITE_NAME,
          images: [DEFAULT_OG_IMAGE],
        };

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

/**
 * Resolves a site-relative path against the configured public origin.
 */
export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, SITE_ORIGIN).toString();
}
