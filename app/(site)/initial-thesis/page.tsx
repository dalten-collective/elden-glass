import { Metadata } from 'next';
import { CalendarDays, Clock, ShieldCheck, Lock, FileText } from 'lucide-react';
import Link from 'next/link';

import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { HeroMeta } from '@/components/site/hero-meta';
import { HashVerification } from '@/components/verification/hash-verification';
import { ManuscriptDisplay } from '@/components/initial-thesis/manuscript-display';
import { Button } from '@/components/ui/button';
import { getInitialThesisDocument } from '@/lib/content';

export const metadata: Metadata = {
  title: 'The Initial Thesis - Elden Ring Is The Large Glass',
  description: 'The first written statement of the discovery, sent as an email in July 2025 and later sealed on Ethereum via EAS attestation.',
};

export default function InitialThesisPage() {
  const doc = getInitialThesisDocument();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.95)] to-[rgb(var(--bg-secondary-rgb)/0.7)] p-8 lg:p-12">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4 text-[var(--accent-gold)]" />
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent-gold)]">The Initial Thesis</p>
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)]">{doc.title}</h1>
            {doc.subtitle && <p className="mt-4 text-lg lg:text-xl text-[var(--text-secondary)]">{doc.subtitle}</p>}
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={`/proofs/${doc.hashableFile}`} download>
              <FileText className="h-4 w-4 mr-2" />
              Download source
            </a>
          </Button>
        </div>
        <HeroMeta
          items={[
            { label: 'Sealed', value: doc.sealedDate ?? new Date(doc.updated).toLocaleDateString(), icon: CalendarDays },
            { label: 'Reading Time', value: `${doc.readingMinutes || 9} min`, icon: Clock },
            { label: 'Status', value: 'Attested on Ethereum', icon: ShieldCheck },
          ]}
        />
      </section>

      {/* Hash Verification */}
      <HashVerification
        documentHash={doc.documentHash}
        hashableFile={doc.hashableFile}
        sealedDate={doc.sealedDate}
        ethereumAttestation={doc.ethereumAttestation}
        subject="initial thesis"
      />

      {/* Editorial Framing */}
      <section className="prose prose-lg prose-invert max-w-none">
        <MarkdownRenderer code={doc.body.code} />
      </section>

      {/* The Manuscript Itself */}
      <section className="border-t border-[var(--border-subtle)] pt-8">
        <ManuscriptDisplay filename={doc.hashableFile} />
      </section>

      {/* Footer Navigation */}
      <section className="border-t border-[var(--border-subtle)] pt-8">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <p className="text-sm text-[var(--text-tertiary)] mb-2">Continue reading</p>
            <p className="text-[var(--text-secondary)]">The manuscript is the origin. Everything since is an elaboration of the claim it made.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/tldr">
                TL;DR
              </Link>
            </Button>
            <Button asChild>
              <Link href="/living-thesis">
                The Living Thesis →
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
