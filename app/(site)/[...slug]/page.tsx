import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { ContentPageRenderer } from '@/components/site/content-page-renderer';
import { allContentPagesSorted, getContentPageBySlug } from '@/lib/content';
import { getFirstContentPageSlugInFolder } from '@/lib/content-tree';
import { absoluteSiteUrl, DEFAULT_OG_IMAGE, SITE_NAME, SITE_TITLE } from '@/lib/site-metadata';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  return allContentPagesSorted().map((doc) => ({ slug: doc.slug.split('/') }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const requestedSlug = resolvedParams.slug.join('/');
  const folderFallbackSlug = getFirstContentPageSlugInFolder(requestedSlug);
  const doc =
    getContentPageBySlug(requestedSlug) ??
    (folderFallbackSlug ? getContentPageBySlug(folderFallbackSlug) : null);

  if (!doc) {
    return {};
  }

  const title = `${doc.title} | ${SITE_NAME}`;

  return {
    title,
    description: doc.summary,
    alternates: {
      canonical: doc.url,
    },
    openGraph: {
      title,
      description: doc.summary,
      type: 'article',
      url: doc.url,
      siteName: SITE_NAME,
      publishedTime: doc.date,
      modifiedTime: doc.updated,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: doc.summary,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export default async function ContentPageRoute({ params }: PageProps) {
  const resolvedParams = await params;
  const requestedSlug = resolvedParams.slug.join('/');
  const doc = getContentPageBySlug(requestedSlug);

  if (doc) {
    return (
      <>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(contentJsonLd(doc)) }}
        />
        <ContentPageRenderer doc={doc} />
      </>
    );
  }

  const folderFallbackSlug = getFirstContentPageSlugInFolder(requestedSlug);

  if (folderFallbackSlug) {
    redirect(`/${folderFallbackSlug}`);
  }

  notFound();
}

/**
 * Describes one MDX content document as an Article for search crawlers.
 */
function contentJsonLd(doc: NonNullable<ReturnType<typeof getContentPageBySlug>>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: doc.title,
    description: doc.summary,
    url: absoluteSiteUrl(doc.url),
    mainEntityOfPage: absoluteSiteUrl(doc.url),
    datePublished: doc.date,
    dateModified: doc.updated,
    inLanguage: 'en-US',
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_TITLE,
      url: absoluteSiteUrl('/'),
    },
    author: {
      '@type': 'Person',
      name: 'TGB',
    },
  };
}
