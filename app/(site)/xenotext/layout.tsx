import { sitePageMetadata } from '@/lib/site-metadata';

export const metadata = sitePageMetadata({
  title: 'Xenotext Engine | Elden Glass',
  description:
    'An interactive xenotext and cipher apparatus for exploring biological text transformation inside the Elden Glass thesis.',
  path: '/xenotext',
});

export default function XenotextLayout({ children }: { children: React.ReactNode }) {
  return children;
}
