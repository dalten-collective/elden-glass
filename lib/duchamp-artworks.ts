import duchampArtworksData from '@/data/duchamp-artworks.json';
import { duchampArtworksSchema } from '@/lib/duchamp-artworks-schema';

export type { DuchampArtwork, DuchampPeriod } from '@/types/duchamp-artworks';

export const duchampArtworks = duchampArtworksSchema.parse(duchampArtworksData);
