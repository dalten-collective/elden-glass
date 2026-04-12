import { Metadata } from 'next';

import { getPataphysicsVocabulary } from '@/lib/content';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';

export const metadata: Metadata = {
  title: "'Pataphysics Vocabulary | Elden Glass",
  description:
    "Key terms and definitions from Christian Bök's 'Pataphysics: The Poetics of an Imaginary Science",
};

export default function VocabPage() {
  const doc = getPataphysicsVocabulary();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl lg:text-4xl text-[var(--accent-gold)] mb-4">
        {doc.title}
      </h1>
      {doc.subtitle && (
        <p className="text-[var(--text-secondary)] mb-8 text-sm italic">{doc.subtitle}</p>
      )}
      <section className="prose prose-lg prose-invert max-w-none">
        <MarkdownRenderer code={doc.body.code} />
      </section>
    </div>
  );
}
