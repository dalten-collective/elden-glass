import { AlertTriangle } from 'lucide-react';

interface UnfinishedBadgeProps {
  /** Optional note appended to the default "unfinished notes" copy. */
  note?: string;
}

/**
 * Prominent, top-of-page indicator that marks a page as unfinished scratch
 * writing rather than polished prose. Meant to be rendered directly above the
 * main content (or below the hero) so a reader cannot miss it. The default
 * message names the page as scratch writing; a custom note can be passed in
 * to say more about what is missing or unresolved.
 */
export function UnfinishedBadge({ note }: UnfinishedBadgeProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-dashed border-[var(--accent-gold)]/60 bg-[rgb(var(--accent-gold-rgb)/0.08)] p-4">
      <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--accent-gold)]" />
      <div className="text-sm text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--accent-gold)]">Unfinished notes</p>
        <p className="mt-1">
          This page is a working draft rather than finished prose. Content may be incomplete, contradictory, or still under revision.
          {note ? ` ${note}` : ''}
        </p>
      </div>
    </div>
  );
}
