import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eldenglass.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core pages
  const corePages = [
    '',
    '/tldr',
    '/initial-thesis',
    '/living-thesis',
    '/about',
    '/search',
    '/card-database',
    '/bibliography',
  ].map(path => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' || path === '/living-thesis' ? 1 : 0.8,
  }));

  // Evidence pages
  const evidencePages = [
    '/bachelor-machines',
    '/bachelor-machines/terms',
    '/pataphysics',
    '/pataphysics/pataphysics-engine',
    '/what-is-pataphysics',
    '/readymades',
    '/readymades-research',
    '/the-boxes',
    '/duchamp-biography',
    '/endings',
    '/xenotext-theory',
    '/golden-bough',
    '/xenotext',
    '/la-chose-en-soie',
    '/impossible-bed',
    '/belevan',
    '/rhonda-shearer-archive',
    '/chess-research',
  ].map(path => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Tool pages
  const toolPages = [
    '/gatherer',
    '/vocab',
  ].map(path => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...corePages, ...evidencePages, ...toolPages];
}
