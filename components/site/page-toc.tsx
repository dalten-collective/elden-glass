import { ChevronDown } from 'lucide-react';

interface TocHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

interface PageTocProps {
  headings: TocHeading[];
}

function linkClassName(level: TocHeading['level']) {
  if (level === 3) {
    return 'ml-4 text-xs text-[var(--text-secondary)]';
  }

  return 'text-sm text-[var(--text-primary)]';
}

/**
 * Renders the per-page table of contents as a collapsible accordion that
 * matches the site's glass-card visual family on every viewport.
 */
export function PageToc({ headings }: PageTocProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <details className="glass-card border border-[var(--border-subtle)] group">
      <summary className="cursor-pointer list-none px-6 py-4">
        <span className="flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-gold)]">
            On this page ({headings.length})
          </span>
          <ChevronDown className="h-4 w-4 text-[var(--accent-gold)] transition-transform group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-[var(--border-subtle)] px-6 py-5">
        <ol className="space-y-3">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`${linkClassName(heading.level)} block leading-snug transition-colors hover:text-[var(--accent-gold)]`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </details>
  );
}
