import type { MetadataRoute } from 'next';

import { getRouteCatalog } from '@/lib/route-catalog';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eldenringisthelargeglass.com';
const now = new Date();

/**
 * Generates the sitemap from the route catalog, whose source of truth is MDX
 * frontmatter, critique frontmatter, layout.json injected links, and the few
 * non-content app routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return getRouteCatalog()
    .filter((entry) => entry.sitemap && !entry.external)
    .map((entry) => ({
      url: `${BASE_URL}${entry.path}`,
      lastModified: entry.updated ? new Date(entry.updated) : now,
      changeFrequency: 'monthly' as const,
      priority: entry.sitemapPriority,
    }));
}
