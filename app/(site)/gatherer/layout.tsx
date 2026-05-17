import { sitePageMetadata } from '@/lib/site-metadata';

export const metadata = sitePageMetadata({
  title: 'Item Card Gatherer | Elden Glass',
  description:
    'Browse the structured Elden Glass item-card database connecting Elden Ring terms, Duchamp references, and thesis evidence.',
  path: '/gatherer',
});

export default function GathererLayout({ children }: { children: React.ReactNode }) {
  return children;
}
