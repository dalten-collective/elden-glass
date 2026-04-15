import type { ReactNode } from 'react';

interface EvidencePointProps {
  id: string;
  title: string;
  children: ReactNode;
}

/**
 * Renders a compact evidence callout for MDX-authored pages.
 */
export function EvidencePoint({ id, title, children }: EvidencePointProps) {
  return (
    <div className="border-l-4 border-[var(--accent-gold)]/50 pl-6 py-2">
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2 py-1 rounded">
          {id}
        </span>
        <div>
          <h4 className="font-medium text-[var(--text-primary)] mb-1">{title}</h4>
          <div className="text-sm text-[var(--text-secondary)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
