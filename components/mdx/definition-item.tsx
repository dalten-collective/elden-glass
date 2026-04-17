import type { ReactNode } from 'react';

/**
 * DefinitionItem — the visual unit for the Pataphysics Vocabulary page.
 *
 * Renders a gold-accented definition list entry with four parts:
 * - term: the headword (gold, medium weight)
 * - definition: the italic quoted definition (tertiary text)
 * - source: optional citation, appended after the definition
 * - children: the expanded explanation paragraph
 *
 * This component is registered in MarkdownRenderer so MDX authors can
 * write entries as:
 *
 *   <DefinitionItem
 *     term={`Clinamen`}
 *     definition={`the third declension of exception...`}
 *     source={`(Bök 1997, after Lucretius)`}
 *   >
 *     Borrowed from Lucretius's ancient atomism...
 *   </DefinitionItem>
 *
 * Previously this lived inline in app/(site)/vocab/page.tsx where the
 * entire vocab page was hardcoded JSX. It was extracted here so the
 * page body can be edited as MDX instead.
 */
export function DefinitionItem({
  term,
  definition,
  source,
  children,
}: {
  term: string;
  definition: string;
  source?: string;
  children?: ReactNode;
}) {
  return (
    <div data-definition-item className="pl-4 border-l-2 border-[var(--accent-gold)]/30 my-6 not-prose">
      <dt className="text-[var(--accent-gold)] font-medium text-lg mb-1">{term}</dt>
      <dd className="text-[var(--text-secondary)] leading-relaxed">
        <span className="italic text-[var(--text-tertiary)]">&quot;{definition}&quot;</span>
        {source && <span className="text-[var(--text-tertiary)] text-sm ml-1">{source}</span>}
        {children && <div className="mt-3 text-[var(--text-secondary)]">{children}</div>}
      </dd>
    </div>
  );
}
