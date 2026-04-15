import { BookOpen, CalendarDays, Clock, ShieldCheck } from 'lucide-react';

import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { HeroMeta } from '@/components/site/hero-meta';
import { PageToc } from '@/components/site/page-toc';
import { Button } from '@/components/ui/button';
import type { ContentPage } from '@/lib/content';

function getSealStatus(doc: ContentPage) {
  if (doc.ethereumAttestation && doc.bitcoinOts) {
    return 'Sealed on Bitcoin and Ethereum';
  }

  if (doc.ethereumAttestation) {
    return 'Attested on Ethereum';
  }

  if (doc.bitcoinOts) {
    return 'Timestamped on Bitcoin';
  }

  return null;
}

/**
 * Renders the shared hero, body, and table-of-contents layout for ContentPage documents.
 */
export function ContentPageRenderer({ doc }: { doc: ContentPage }) {
  const sealStatus = getSealStatus(doc);
  const heroMetaItems = [
    {
      label: 'Updated',
      value: new Date(doc.updated).toLocaleDateString(),
      icon: CalendarDays,
    },
    ...(doc.readingMinutes
      ? [
          {
            label: 'Reading Time',
            value: `${doc.readingMinutes} min`,
            icon: Clock,
          },
        ]
      : []),
    ...(sealStatus
      ? [
          {
            label: 'Status',
            value: sealStatus,
            icon: ShieldCheck,
          },
        ]
      : []),
  ];

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-8">
      <div className="lg:col-start-2 lg:row-start-1">
        <PageToc headings={doc.headings} />
      </div>

      <div className="space-y-10 lg:col-start-1 lg:row-start-1">
        <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.95)] to-[rgb(var(--bg-secondary-rgb)/0.7)] p-8 lg:p-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl flex-1">
              {doc.eyebrow && (
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[var(--accent-gold)]" />
                  <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
                    {doc.eyebrow}
                  </p>
                </div>
              )}
              <h1 className="page-hero-title">{doc.title}</h1>
              {doc.subtitle && <p className="mt-4 page-hero-description">{doc.subtitle}</p>}
            </div>

            {doc.hashableFile && (
              <Button asChild variant="outline" size="sm">
                <a href={`/proofs/${doc.hashableFile}`} download>
                  Download source
                </a>
              </Button>
            )}
          </div>

          <HeroMeta items={heroMetaItems} />
        </section>

        <MarkdownRenderer code={doc.body.code} />
      </div>
    </div>
  );
}
