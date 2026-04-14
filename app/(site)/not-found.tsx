export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="font-serif text-6xl text-[var(--accent-gold)]">404</h1>
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">
          The Illuminating Gas Has Dispersed
        </h2>
        <p className="max-w-md text-[var(--text-secondary)]">
          Like the Bachelors forever separated from the Bride, this page exists only in the realm
          of possibility.
        </p>
        <p className="pt-6 text-xs text-[var(--text-tertiary)]">
          &quot;The bachelor grinds his chocolate himself.&quot; — Marcel Duchamp
        </p>
      </div>
    </div>
  );
}
