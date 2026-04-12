import { Metadata } from 'next';
import { Book, Cog, Lightbulb } from 'lucide-react';
import { HeroMeta } from '@/components/site/hero-meta';
import { VocabSearch } from '@/components/site/vocab-search';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { getBachelorMachinesCatalog } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Bachelor Machine Catalog - Elden Ring Is The Large Glass',
  description:
    'Complete catalog of bachelor machines from the 1975 Szeemann exhibition and critical vocabulary',
};

export default function BachelorMachineTermsPage() {
  const doc = getBachelorMachinesCatalog();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Book className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
              Reference Catalog
            </p>
          </div>
          <h1 className="page-hero-title">
            {doc.title}
          </h1>
          {doc.subtitle && (
            <p className="page-hero-description">{doc.subtitle}</p>
          )}
        </div>
        <HeroMeta
          items={[
            { label: 'Source', value: doc.source ?? '—', icon: Book },
            { label: 'Machines', value: doc.machineCount ?? '—', icon: Cog },
            { label: 'Vocabulary', value: doc.vocabularyCount ?? '—', icon: Lightbulb },
          ]}
        />
        <div className="mt-6">
          <VocabSearch placeholder="Search machines and vocabulary..." />
        </div>
      </section>

      {/* Main Content — rendered from content/vocab/bachelor-machines.mdx */}
      <section className="prose prose-lg prose-invert max-w-none">
        <MarkdownRenderer code={doc.body.code} />
      </section>
    </div>
  );
}
