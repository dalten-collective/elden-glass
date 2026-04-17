import { z } from 'zod';

const MAX_NOTE_WORDS = 200;

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export const duchampArtworkSchema = z.object({
  title: z.string(),
  year: z.string().optional(),
  filename: z.string(),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  collection: z.string().optional(),
  currentLocation: z.string().optional(),
  sourceUrl: z.string().url().optional(),
  note: z
    .string()
    .refine((value) => countWords(value) <= MAX_NOTE_WORDS, {
      message: `Note must be ${MAX_NOTE_WORDS} words or fewer.`,
    })
    .optional(),
  articleSlug: z
    .string()
    .refine((value) => !value.startsWith('/'), {
      message: 'articleSlug must not start with a leading slash.',
    })
    .optional(),
});

export const duchampPeriodSchema = z.object({
  title: z.string(),
  years: z.string(),
  works: z.array(duchampArtworkSchema),
});

export const duchampArtworksSchema = z.array(duchampPeriodSchema);

export type DuchampArtwork = z.infer<typeof duchampArtworkSchema>;
export type DuchampPeriod = z.infer<typeof duchampPeriodSchema>;
