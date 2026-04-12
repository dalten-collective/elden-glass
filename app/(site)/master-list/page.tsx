import { getMasterListDocument, getMasterListCount } from '@/lib/content';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';

export default function MasterListPage() {
  const doc = getMasterListDocument();
  const count = getMasterListCount();

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent-gold)] mb-4">Complete Evidence</p>
        <h1 className="text-4xl font-serif text-[var(--text-primary)] mb-4">
          {doc.title}
        </h1>
        <p className="text-lg text-[var(--text-secondary)]">
          {count} Correspondences
        </p>
      </header>
      <MarkdownRenderer code={doc.body.code} />
    </article>
  );
}
