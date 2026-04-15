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

function renderHeadingList(headings: TocHeading[]) {
  return (
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
  );
}

/**
 * Renders the per-page table of contents for content documents.
 */
export function PageToc({ headings }: PageTocProps) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] lg:hidden">
        <details className="group">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
            <span className="flex items-center justify-between gap-4">
              <span>On this page ({headings.length})</span>
              <ChevronDown className="h-4 w-4 text-[var(--accent-gold)] transition-transform group-open:rotate-180" />
            </span>
          </summary>
          <div className="border-t border-[var(--border-subtle)] px-4 py-4">
            {renderHeadingList(headings)}
          </div>
        </details>
      </div>

      <aside className="hidden w-[220px] shrink-0 lg:block">
        <div className="sticky top-24 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-5 py-5">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--accent-gold)]">
            On this page
          </p>
          {renderHeadingList(headings)}
        </div>
      </aside>
    </>
  );
}
