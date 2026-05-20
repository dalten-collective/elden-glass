export function CardSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      {/* Title */}
      <div className="dig-skeleton h-8 w-3/4" />

      {/* Category badge */}
      <div className="flex gap-2">
        <div className="dig-skeleton h-5 w-20" />
        <div className="dig-skeleton h-5 w-16" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 pt-4">
        <div className="dig-skeleton h-4 w-full" />
        <div className="dig-skeleton h-4 w-full" />
        <div className="dig-skeleton h-4 w-5/6" />
        <div className="dig-skeleton h-4 w-4/6" />
      </div>

      {/* Connections section */}
      <div className="pt-6 space-y-3">
        <div className="dig-skeleton h-5 w-24" />
        <div className="flex gap-2">
          <div className="dig-skeleton h-8 w-28" />
          <div className="dig-skeleton h-8 w-32" />
          <div className="dig-skeleton h-8 w-24" />
        </div>
      </div>

      {/* Semantic tags */}
      <div className="pt-4 space-y-2">
        <div className="dig-skeleton h-4 w-28" />
        <div className="flex flex-wrap gap-1">
          <div className="dig-skeleton h-6 w-16" />
          <div className="dig-skeleton h-6 w-20" />
          <div className="dig-skeleton h-6 w-14" />
          <div className="dig-skeleton h-6 w-18" />
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
          className="animate-pulse space-y-3 rounded-lg border border-[var(--pane-edge)] p-4"
        >
          <div className="dig-skeleton h-6 w-3/4" />
          <div className="dig-skeleton h-4 w-1/4" />
          <div className="space-y-2">
            <div className="dig-skeleton h-3 w-full" />
            <div className="dig-skeleton h-3 w-5/6" />
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
          className="flex animate-pulse items-center gap-3 rounded-lg bg-[var(--ink-2)] p-3"
        >
          <div className="dig-skeleton h-10 w-10" />
          <div className="flex-1 space-y-2">
            <div className="dig-skeleton h-4 w-2/3" />
            <div className="dig-skeleton h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
