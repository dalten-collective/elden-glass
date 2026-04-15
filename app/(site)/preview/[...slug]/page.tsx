import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ContentPageRenderer } from '@/components/site/content-page-renderer';
import { allStagingContentPagesSorted, getStagingContentPageBySlug } from '@/lib/content';

interface PageProps {
  params: { slug: string[] };
}

export function generateStaticParams() {
  return allStagingContentPagesSorted().map((doc) => ({ slug: doc.slug.split('/') }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const doc = getStagingContentPageBySlug(params.slug.join('/'));

  if (!doc) {
    return {
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `[PREVIEW] ${doc.title} - Elden Ring Is The Large Glass`,
    description: doc.summary,
    robots: { index: false, follow: false },
  };
}

export default function PreviewContentPageRoute({ params }: PageProps) {
  const doc = getStagingContentPageBySlug(params.slug.join('/'));

  if (!doc) {
    notFound();
  }

  return (
    <>
      <div className="bg-[var(--accent-gold)] text-[var(--bg-primary)] text-center py-2 text-sm font-semibold uppercase tracking-[0.25em]">
        Preview — Staging Content
      </div>
      <ContentPageRenderer doc={doc} />
    </>
  );
}
