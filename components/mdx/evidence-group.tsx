import type { ReactNode } from 'react';

/**
 * Wraps a set of EvidencePoint elements in a glass-card with consistent
 * vertical spacing and opts the group out of prose margins so each
 * EvidencePoint's left-border renders as a discrete segment.
 */
export function EvidenceGroup({ children }: { children: ReactNode }) {
  return (
    <section className="glass-card border border-[var(--border-subtle)] p-8 space-y-6 not-prose">
      {children}
    </section>
  );
}
