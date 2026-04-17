import manuscripts from '@/data/manuscripts.json';
import type { ParsedManuscript } from '@/lib/manuscript';

interface ManuscriptDisplayProps {
  /** Filename under public/proofs/ to render from the generated manifest. */
  filename: string;
}

type ManuscriptManifest = Record<string, ParsedManuscript>;
const manuscriptManifest = manuscripts as ManuscriptManifest;

/**
 * Renders a parsed manuscript from the build-time manifest in the same visual
 * format as the original server-rendered implementation.
 */
export function ManuscriptDisplay({ filename }: ManuscriptDisplayProps) {
  const manuscript = manuscriptManifest[filename];

  if (!manuscript) {
    if (process.env.NODE_ENV !== 'production') {
      return (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          Missing manuscript manifest entry for <code>{filename}</code>.
        </div>
      );
    }

    return null;
  }

  const paragraphs = manuscript.body
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="space-y-6">
      {manuscript.header && (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgb(var(--bg-primary-rgb)/0.5)] p-4 font-mono text-xs text-[var(--text-tertiary)]">
          <pre className="whitespace-pre-wrap m-0 leading-relaxed">{manuscript.header}</pre>
        </div>
      )}
      <div className="space-y-6 font-serif text-lg text-[var(--text-primary)] leading-relaxed">
        {paragraphs.map((para, i) => (
          <p key={i} className="whitespace-pre-wrap">
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}
