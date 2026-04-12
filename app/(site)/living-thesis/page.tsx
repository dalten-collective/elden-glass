import { Metadata } from 'next';
import { CalendarDays, Clock, Eye, Search } from 'lucide-react';

import { getLivingThesisDocument } from '@/lib/content';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { HeroMeta } from '@/components/site/hero-meta';

export const metadata: Metadata = {
  title: 'The Living Thesis - Elden Ring Is The Large Glass',
  description: 'The current, evolving statement of the discovery. Expanded beyond the initial manuscript with Terayama, Frazer, and the full set of correspondences.',
};

export default function LivingThesisPage() {
  const doc = getLivingThesisDocument();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">The Living Thesis</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            {doc.title}
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            The current, evolving statement of the discovery. Where the claim from the initial thesis has been expanded, cited, and pressure-tested.
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Last updated', value: new Date(doc.updated).toLocaleDateString(), icon: CalendarDays },
            { label: 'Reading Time', value: `${doc.readingMinutes || 45} min`, icon: Clock },
            { label: 'Method', value: 'Comparative Analysis', icon: Search },
          ]}
        />
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <MarkdownRenderer code={doc.body.code} />
      </section>

    </div>
  );
}
