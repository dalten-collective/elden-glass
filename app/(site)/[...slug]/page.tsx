import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentPageRenderer } from '@/components/site/content-page-renderer';
import { allContentPagesSorted, getContentPageBySlug } from '@/lib/content';

interface PageProps {
  params: { slug: string[] };
}

export function generateStaticParams() {
  return allContentPagesSorted().map((doc) => ({ slug: doc.slug.split('/') }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const doc = getContentPageBySlug(params.slug.join('/'));

  if (!doc) {
    return {};
  }

  return {
    title: `${doc.title} - Elden Ring Is The Large Glass`,
    description: doc.summary,
  };
}

export default function ContentPageRoute({ params }: PageProps) {
  const doc = getContentPageBySlug(params.slug.join('/'));

  if (!doc) {
    notFound();
  }

  return <ContentPageRenderer doc={doc} />;
}
