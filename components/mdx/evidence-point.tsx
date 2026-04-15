import type { ReactNode } from 'react';

interface EvidencePointProps {
  id?: string;
  title: string;
  children: ReactNode;
}

/**
 * Renders a single evidence callout inside an EvidenceGroup. The optional
 * `id` prop is used as an HTML anchor target only; it is not displayed.
 */
export function EvidencePoint({ id, title, children }: EvidencePointProps) {
  return (
    <div id={id} className="border-l-4 border-[var(--accent-gold)]/50 pl-6 py-2">
      <h4 className="font-medium text-[var(--text-primary)] mb-1">{title}</h4>
      <div className="text-sm text-[var(--text-secondary)]">{children}</div>
    </div>
  );
}
