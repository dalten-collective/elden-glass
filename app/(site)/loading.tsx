export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-4">
        <div className="h-10 bg-[var(--bg-tertiary)] rounded w-2/3" />
        <div className="h-5 bg-[var(--bg-tertiary)] rounded w-1/2" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" />
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-full" />
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-5/6" />
        <div className="h-4 bg-[var(--bg-tertiary)] rounded w-4/6" />
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-6 md:grid-cols-3 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-[var(--border-subtle)] rounded-lg p-6 space-y-4">
            <div className="h-12 w-12 bg-[var(--bg-tertiary)] rounded-lg" />
            <div className="h-6 bg-[var(--bg-tertiary)] rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-[var(--bg-tertiary)] rounded w-full" />
              <div className="h-3 bg-[var(--bg-tertiary)] rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
