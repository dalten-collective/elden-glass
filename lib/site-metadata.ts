export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://eldenringisthelargeglass.com';

export const SITE_NAME = 'Elden Glass';

export const SITE_TITLE = 'Elden Ring Is The Large Glass | Elden Glass';

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

/**
 * Resolves a site-relative path against the configured public origin.
 */
export function absoluteSiteUrl(pathname: string): string {
  return new URL(pathname, SITE_ORIGIN).toString();
}
