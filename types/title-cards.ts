import { z } from 'zod';

/**
 * Schema for optional popups attached to title-card headers.
 */
export const headerPopupSchema = z
  .object({
    type: z.enum(['titlecard', 'note', 'image', 'webpage']),
    titleCardId: z.string().optional(),
    note: z.string().optional(),
    imageUrl: z.string().optional(),
    title: z.string().optional(),
    url: z.string().optional(),
  })
  .strict();

/**
 * Optional metadata for item cards that also represent catalogued artworks.
 */
export const artworkMetadataSchema = z
  .object({
    kind: z.literal('duchamp-work'),
    filename: z.string().optional(),
    year: z.string().optional(),
    period: z.string(),
    periodYears: z.string().optional(),
    displayOrder: z.number().int().nonnegative(),
    medium: z.string().optional(),
    dimensions: z.string().optional(),
    collection: z.string().optional(),
    currentLocation: z.string().optional(),
    sourceUrl: z.string().url().optional(),
    articleSlug: z
      .string()
      .refine((value) => !value.startsWith('/'), {
        message: 'articleSlug must not start with a leading slash.',
      })
      .optional(),
  })
  .strict();

/**
 * Schema for one canonical item-card record.
 */
export const titleCardSchema = z
  .object({
    id: z.string(),
    term: z.string(),
    aliases: z.array(z.string()).optional(),
    scope: z.enum(['global', 'instance']).optional(),
    instanceId: z.string().optional(),
    title: z.string(),
    description: z.string().nullable(),
    image: z.string().nullable().optional(),
    images: z.array(z.string()).optional(),
    section: z.string().nullable().optional(),
    category: z.string().nullable().optional(),
    subcategory: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    links: z
      .array(
        z
          .object({
            label: z.string(),
            url: z.string(),
          })
          .strict()
      )
      .optional(),
    isSplit: z.boolean().optional(),
    splitCardIds: z.array(z.string()).optional(),
    headerPopup: headerPopupSchema.optional(),
    artwork: artworkMetadataSchema.optional(),
    connections: z
      .array(
        z
          .object({
            cardId: z.string(),
            label: z.string().optional(),
            linkedTitle: z.string().optional(),
          })
          .strict()
      )
      .optional(),
    senses: z.array(z.string()).optional(),
    axes: z.array(z.number()).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .strict();

/**
 * Schema for the canonical item-card database at data/title-cards.json.
 */
export const titleCardDatabaseSchema = z
  .object({
    cards: z.array(titleCardSchema),
  })
  .strict();

export type HeaderPopup = z.infer<typeof headerPopupSchema>;
export type ArtworkMetadata = z.infer<typeof artworkMetadataSchema>;
export type TitleCard = z.infer<typeof titleCardSchema>;
export type TitleCardDatabase = z.infer<typeof titleCardDatabaseSchema>;
