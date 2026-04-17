import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { ContentPageRenderer } from '@/components/site/content-page-renderer';
import { allContentPagesSorted, getContentPageBySlug } from '@/lib/content';
import { getFirstContentPageSlugInFolder } from '@/lib/content-tree';

interface PageProps {
  params: { slug: string[] };
}

export function generateStaticParams() {
  return allContentPagesSorted().map((doc) => ({ slug: doc.slug.split('/') }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const requestedSlug = params.slug.join('/');
  const folderFallbackSlug = getFirstContentPageSlugInFolder(requestedSlug);
  const doc =
    getContentPageBySlug(requestedSlug) ??
    (folderFallbackSlug ? getContentPageBySlug(folderFallbackSlug) : null);

  if (!doc) {
    return {};
  }

  return {
    title: `${doc.title} - Elden Ring Is The Large Glass`,
    description: doc.summary,
  };
}

export default function ContentPageRoute({ params }: PageProps) {
  const requestedSlug = params.slug.join('/');
  const doc = getContentPageBySlug(requestedSlug);

  if (doc) {
    return <ContentPageRenderer doc={doc} />;
  }

  const folderFallbackSlug = getFirstContentPageSlugInFolder(requestedSlug);

  if (folderFallbackSlug) {
    redirect(`/${folderFallbackSlug}`);
  }

  notFound();
}
