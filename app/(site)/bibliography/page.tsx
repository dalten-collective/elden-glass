import { getBibliographyDocument } from '@/lib/content';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';

export default function BibliographyPage() {
  const doc = getBibliographyDocument();

  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-serif text-[var(--accent-gold)] mb-2">
          {doc.title}
        </h1>
      </header>
      <MarkdownRenderer code={doc.body.code} />
    </article>
  );
}
