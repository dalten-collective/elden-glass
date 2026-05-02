import { getItemCards, toPublicItemCard, type PublicItemCard } from '@/lib/item-cards';

export type DuchampArtwork = PublicItemCard & {
  artwork: NonNullable<PublicItemCard['artwork']>;
};

export type DuchampPeriod = {
  title: string;
  years: string;
  works: DuchampArtwork[];
};

/**
 * Returns item cards that represent Duchamp artworks, grouped for the gallery.
 */
export function getDuchampArtworkPeriods(): DuchampPeriod[] {
  const periods = new Map<string, DuchampPeriod>();

  for (const card of getItemCards()) {
    if (card.artwork?.kind !== 'duchamp-work') {
      continue;
    }

    const artwork = toPublicItemCard(card) as DuchampArtwork;
    const period = periods.get(artwork.artwork.period) ?? {
      title: artwork.artwork.period,
      years: artwork.artwork.periodYears ?? '',
      works: [],
    };

    period.works.push(artwork);
    periods.set(period.title, period);
  }

  return [...periods.values()]
    .sort((a, b) => firstDisplayOrder(a) - firstDisplayOrder(b))
    .map((period) => ({
      ...period,
      works: period.works
        .slice()
        .sort(
          (a, b) =>
            a.artwork.displayOrder - b.artwork.displayOrder || a.title.localeCompare(b.title)
        ),
    }));
}

/**
 * Returns the gallery image path for a Duchamp artwork card, when known.
 */
export function getDuchampArtworkImage(artwork: DuchampArtwork): string | null {
  return (
    artwork.image ??
    (artwork.artwork.filename ? `/images/duchamp/paintings/${artwork.artwork.filename}` : null)
  );
}

function firstDisplayOrder(period: DuchampPeriod): number {
  return Math.min(...period.works.map((work) => work.artwork.displayOrder));
}
