export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      {/* Title */}
      <div className="h-8 bg-[var(--bg-tertiary)] rounded w-3/4" />

      {/* Category badge */}
      <div className="flex gap-2">
        <div className="h-5 bg-[var(--bg-tertiary)] rounded w-20" />
        <div className="h-5 bg-[var(--bg-tertiary)] rounded w-16" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 pt-4">
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" />
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" />
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-5/6" />
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-4/6" />
      </div>

      {/* Connections section */}
      <div className="pt-6 space-y-3">
        <div className="h-5 bg-[var(--bg-tertiary)] rounded w-24" />
        <div className="flex gap-2">
          <div className="h-8 bg-[var(--bg-tertiary)] rounded w-28" />
          <div className="h-8 bg-[var(--bg-tertiary)] rounded w-32" />
          <div className="h-8 bg-[var(--bg-tertiary)] rounded w-24" />
        </div>
      </div>

      {/* Semantic tags */}
      <div className="pt-4 space-y-2">
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-28" />
        <div className="flex flex-wrap gap-1">
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-16" />
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-20" />
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-14" />
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-18" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse border border-[var(--border-subtle)] rounded-lg p-4 space-y-3"
        >
          <div className="h-6 bg-[var(--bg-tertiary)] rounded w-3/4" />
          <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-full" />
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)]"
        >
          <div className="h-10 w-10 bg-[var(--bg-tertiary)] rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--bg-tertiary)] rounded w-2/3" />
            <div className="h-3 bg-[var(--bg-tertiary)] rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
