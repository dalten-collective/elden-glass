import { DuchampWorksGallery } from '@/components/duchamp-works/duchamp-works-gallery';
import { getDuchampArtworkPeriods } from '@/lib/duchamp-artworks';

export default function DuchampWorksPreviewPage() {
  const periods = getDuchampArtworkPeriods();

  return (
    <>
      <header className="mb-12 border-b border-[rgb(201_169_97/0.2)] pb-8">
        <p className="mb-3 text-[0.65rem] uppercase tracking-[0.35em] text-[var(--accent-gold)] sm:text-xs">
          Catalogue raisonné
        </p>
        <h1 className="mb-4 font-serif text-3xl leading-[1.08] text-[var(--text-primary)] sm:text-4xl lg:text-[2.75rem]">
          Duchamp&apos;s Works
        </h1>
        <p className="max-w-2xl font-serif text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          A chronological gallery of Marcel Duchamp&apos;s production — from the early Blainville
          paintings through the readymades, the Large Glass, and the late objects. Click any work
          for its full record.
        </p>
      </header>

      <DuchampWorksGallery periods={periods} />
    </>
  );
}
