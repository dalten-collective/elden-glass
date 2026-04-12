import { Metadata } from 'next';
import { CalendarDays, Clock, ShieldCheck, Zap, FileText } from 'lucide-react';
import Link from 'next/link';

import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { HeroMeta } from '@/components/site/hero-meta';
import { HashVerification } from '@/components/verification/hash-verification';
import { Button } from '@/components/ui/button';
import { getTldrDocument } from '@/lib/content';

export const metadata: Metadata = {
  title: 'TL;DR - Elden Ring Is The Large Glass',
  description: 'The discovery in about 3,000 words. The polished condensation of the thesis, timestamped on Bitcoin via OpenTimestamps before publication.',
};

export default function TldrPage() {
  const doc = getTldrDocument();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.95)] to-[rgb(var(--bg-secondary-rgb)/0.7)] p-8 lg:p-12">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-[var(--accent-gold)]" />
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent-gold)]">TL;DR</p>
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
            { label: 'Reading Time', value: `${doc.readingMinutes || 18} min`, icon: Clock },
            { label: 'Status', value: 'Timestamped on Bitcoin', icon: ShieldCheck },
          ]}
        />
      </section>

      {/* Hash Verification */}
      <HashVerification
        documentHash={doc.documentHash}
        hashableFile={doc.hashableFile}
        sealedDate={doc.sealedDate}
        bitcoinOts={doc.bitcoinOts}
        subject="TL;DR"
      />

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <MarkdownRenderer code={doc.body.code} />
      </section>

      {/* Footer Navigation */}
      <section className="border-t border-[var(--border-subtle)] pt-8">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div>
            <p className="text-sm text-[var(--text-tertiary)] mb-2">Go deeper</p>
            <p className="text-[var(--text-secondary)]">The initial email and the full expanded thesis are both waiting.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/initial-thesis">
                The Initial Thesis
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
