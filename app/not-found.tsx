import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="font-serif text-6xl text-[var(--accent-gold)]">404</h1>
          <h2 className="font-serif text-2xl text-[var(--text-primary)]">
            The Illuminating Gas Has Dispersed
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            Like the Bachelors forever separated from the Bride, this page exists
            only in the realm of possibility.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/living-thesis"
            className="px-6 py-3 bg-[var(--accent-gold)] text-[var(--bg-primary)] rounded-lg hover:opacity-90 transition-opacity"
          >
            Return to the Discovery
          </Link>
          <Link
            href="/card-database"
            className="px-6 py-3 border border-[var(--border-emphasis)] text-[var(--text-primary)] rounded-lg hover:border-[var(--accent-gold)] transition-colors"
          >
            Browse All Cards
          </Link>
        </div>

        <p className="text-xs text-[var(--text-tertiary)] mt-8">
          &quot;The bachelor grinds his chocolate himself.&quot; — Marcel Duchamp
        </p>
      </div>
    </div>
  );
}
