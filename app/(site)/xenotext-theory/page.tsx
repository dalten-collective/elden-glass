import { Metadata } from 'next';
import { BookOpen, Dna, FlaskConical, Flower2, Building2, Users } from 'lucide-react';
import theoriesData from '@/data/xenotext-theories.json';

export const metadata: Metadata = {
  title: 'The Xenotext Theory - Elden Ring Is The Large Glass',
  description: 'Research notes connecting Christian Bök\'s The Xenotext to Elden Ring and The Large Glass',
};

const iconMap: Record<string, React.ReactNode> = {
  'uncontrollable-meaning': <Dna className="h-5 w-5" />,
  'miyazaki-knew': <FlaskConical className="h-5 w-5" />,
  'flower-crucible-erdtree': <Flower2 className="h-5 w-5" />,
  'late-heavy-bombardment': <BookOpen className="h-5 w-5" />,
  'hive-capital': <Building2 className="h-5 w-5" />,
  'flower-maidens': <Users className="h-5 w-5" />,
};

export default function XenotextTheoryPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Dna className="h-5 w-5 text-[var(--accent-purple)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Research Notes</p>
          </div>
          <h1 className="page-hero-title">
            The Xenotext Theory
          </h1>
          <p className="page-hero-description">
            Connecting Christian Bök&apos;s <em>The Xenotext</em> to Elden Ring and The Large Glass.
            The xenotext means what interpreters cannot prevent it from meaning.
          </p>
        </div>
      </section>

      {/* Theories Grid */}
      <section className="space-y-8">
        <h2 className="text-sm uppercase tracking-[0.25em] text-[var(--text-tertiary)]">Research Notes</h2>

        {theoriesData.theories.map((theory) => (
          <article
            key={theory.id}
            id={theory.id}
            className="glass-card border border-[var(--border-subtle)] p-6 lg:p-8 scroll-mt-24"
          >
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[var(--accent-purple)]">
                  {iconMap[theory.id] || <BookOpen className="h-5 w-5" />}
                </span>
                <h3 className="font-serif text-2xl text-[var(--text-primary)]">
                  {theory.title}
                </h3>
              </div>
              <p className="text-[var(--text-secondary)]">{theory.summary}</p>
            </header>

            <div className="space-y-6">
              {theory.sections.map((section, index) => (
                <div key={index} className="border-l-2 border-[var(--border-subtle)] pl-4">
                  <h4 className="font-semibold text-[var(--text-primary)] mb-2">
                    {section.heading}
                  </h4>
                  <div className="prose prose-sm prose-invert max-w-none">
                    {section.content.split('\n\n').map((paragraph, pIndex) => {
                      // Handle blockquotes
                      if (paragraph.startsWith('>')) {
                        return (
                          <blockquote key={pIndex} className="border-l-2 border-[var(--accent-gold)] pl-4 italic text-[var(--text-secondary)] my-3">
                            {paragraph.replace(/^>\s*"?|"$/g, '')}
                          </blockquote>
                        );
                      }
                      // Handle lists
                      if (paragraph.startsWith('-')) {
                        const items = paragraph.split('\n').filter(l => l.startsWith('-'));
                        return (
                          <ul key={pIndex} className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                            {items.map((item, iIndex) => (
                              <li key={iIndex}>{item.replace(/^-\s*/, '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      // Handle numbered lists
                      if (/^\d+\./.test(paragraph)) {
                        const items = paragraph.split('\n').filter(l => /^\d+\./.test(l));
                        return (
                          <ol key={pIndex} className="list-decimal list-inside space-y-1 text-[var(--text-secondary)]">
                            {items.map((item, iIndex) => (
                              <li key={iIndex}>{item.replace(/^\d+\.\s*/, '')}</li>
                            ))}
                          </ol>
                        );
                      }
                      // Regular paragraphs with bold handling
                      return (
                        <p
                          key={pIndex}
                          className="text-[var(--text-secondary)] my-2"
                          dangerouslySetInnerHTML={{
                            __html: paragraph
                              .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[var(--text-primary)]">$1</strong>')
                              .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {theory.source && (
              <footer className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                <p className="text-xs text-[var(--text-tertiary)]">
                  Source: {theory.source}
                </p>
              </footer>
            )}
          </article>
        ))}
      </section>

      {/* Navigation */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="text-sm uppercase tracking-[0.25em] text-[var(--text-tertiary)] mb-4">Quick Navigation</h2>
        <div className="flex flex-wrap gap-2">
          {theoriesData.theories.map((theory) => (
            <a
              key={theory.id}
              href={`#${theory.id}`}
              className="px-3 py-1.5 text-sm bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--accent-gold)] hover:border-[var(--accent-gold)]/30 transition-colors"
            >
              {theory.title}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
