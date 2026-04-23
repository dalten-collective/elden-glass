import { CalendarDays, Clock, ShieldCheck } from 'lucide-react';

import { Crackline, Eyebrow, Spec } from '@/components/delay';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { HeroMeta } from '@/components/site/hero-meta';
import { PageToc } from '@/components/site/page-toc';
import { VocabSearch } from '@/components/site/vocab-search';
import { Button } from '@/components/ui/button';
import { HashVerification } from '@/components/verification/hash-verification';
import type { ContentPage } from '@/lib/content';

function stripLeadingThe(value: string) {
  return value.replace(/^The\s+/i, '').toLowerCase();
}

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
 * Renders the hero, body, and table-of-contents layout for ContentPage
 * documents in the Delay-in-Glass voice. The hero uses the SVG crackline
 * seeded with the document slug, so each page has its own stable crack.
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
    <div className="space-y-10">
      <section>
        {/* Running head — eyebrow on the left, spec identifier on the right */}
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <Eyebrow tone="gold">{doc.eyebrow ?? 'Elden Glass'}</Eyebrow>
          <Spec>{doc.slug}</Spec>
        </div>

        {/* Seeded crackline — a different ornament for every page */}
        <div className="mb-8">
          <Crackline seed={`${doc.slug}-top`} tone="gold" />
        </div>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl flex-1">
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

        {doc.vocabSearch && (
          <div className="mt-6">
            <VocabSearch placeholder={doc.vocabSearchPlaceholder} />
          </div>
        )}
      </section>

      {doc.documentHash && doc.hashableFile && (
        <HashVerification
          documentHash={doc.documentHash}
          hashableFile={doc.hashableFile}
          sealedDate={doc.sealedDate}
          bitcoinOts={doc.bitcoinOts}
          ethereumAttestation={doc.ethereumAttestation}
          subject={doc.verificationSubject ?? stripLeadingThe(doc.title)}
        />
      )}

      <PageToc headings={doc.headings} />

      <MarkdownRenderer source={doc.body.raw} />
    </div>
  );
}
