import type { MetadataRoute } from 'next';

import { allContentPagesSorted, getCritiques } from '@/lib/content';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eldenglass.com';
const now = new Date();

const staticRoutes = ['/', '/gatherer', '/search', '/critiques', '/duchamp-works', '/xenotext'];

/**
 * Generates the sitemap from the current content tree plus the handful of
 * bespoke routes that do not originate from Contentlayer.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.5,
  }));

  const contentEntries = allContentPagesSorted().map((doc) => ({
    url: `${BASE_URL}${doc.url}`,
    lastModified: doc.updated ? new Date(doc.updated) : now,
    changeFrequency: 'monthly' as const,
    priority: isPrimaryContentSlug(doc.slug) ? 1 : 0.7,
  }));

  const critiqueEntries = getCritiques().map((critique) => ({
    url: `${BASE_URL}/critiques/${critique.slug}`,
    lastModified: new Date(critique.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...contentEntries, ...critiqueEntries];
}

function isPrimaryContentSlug(slug: string): boolean {
  return ['living-thesis', 'master-list', 'tldr', 'initial-thesis'].includes(slug);
}
