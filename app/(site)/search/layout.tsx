import { sitePageMetadata } from '@/lib/site-metadata';

export const metadata = sitePageMetadata({
  title: 'Search the Elden Glass Corpus | Elden Glass',
  description:
    'Search the Elden Glass research corpus for Elden Ring, Marcel Duchamp, The Large Glass, Great Runes, item-card evidence, and related terms.',
  path: '/search',
});

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
