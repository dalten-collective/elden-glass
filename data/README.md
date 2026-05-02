# Duchamp Works Data README

This file documents the item-card data that powers the `/duchamp/duchamp-works` gallery.

## Where Data Lives

- Duchamp works are canonical item cards in `data/item-cards.json`.
- The schema is enforced by `types/item-cards.ts`.
- The gallery is derived by `lib/duchamp-artworks.ts`.
- Image files for this catalog live in `public/images/duchamp/paintings/`.

There is no separate Duchamp artwork catalog. A card appears in the gallery when it has an
`artwork` block with `kind: "duchamp-work"`.

## Item-Card Shape

The item card owns the title, description, links, connections, section, category, and search identity.
The `artwork` block only stores gallery-specific metadata:

```json
{
  "id": "duchamp-work-bicycle-wheel-1913",
  "term": "bicycle wheel",
  "title": "Bicycle Wheel",
  "description": null,
  "image": "/images/duchamp/paintings/bicycle-wheel-1913.jpg",
  "section": "Marcel Duchamp",
  "category": "Major Period",
  "artwork": {
    "kind": "duchamp-work",
    "year": "1913",
    "period": "Major Period",
    "periodYears": "1911-1914",
    "displayOrder": 33
  },
  "createdAt": "2026-04-24T00:00:00.000Z",
  "updatedAt": "2026-04-24T00:00:00.000Z"
}
```

## Artwork Metadata

| Field             | Required? | Example                                                 | Rules                                                                                                |
| ----------------- | --------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `kind`            | Yes       | `"duchamp-work"`                                        | Literal marker used by the gallery filter.                                                           |
| `filename`        | Optional  | `"bride-1912.jpg"`                                      | Must match an image file in `public/images/duchamp/paintings/` when local fallback lookup is needed. |
| `period`          | Yes       | `"Major Period"`                                        | Gallery grouping label.                                                                              |
| `displayOrder`    | Yes       | `28`                                                    | Non-negative integer used to sort works inside and across periods.                                   |
| `year`            | Optional  | `"1912"`                                                | Display year.                                                                                        |
| `periodYears`     | Optional  | `"1911-1914"`                                           | Display range for the period heading.                                                                |
| `medium`          | Optional  | `"Oil on canvas"`                                       | Plain text string.                                                                                   |
| `dimensions`      | Optional  | `"89.5 x 55.9 cm"`                                      | Plain text string.                                                                                   |
| `collection`      | Optional  | `"Philadelphia Museum of Art"`                          | Plain text string.                                                                                   |
| `currentLocation` | Optional  | `"Philadelphia"`                                        | Plain text string.                                                                                   |
| `sourceUrl`       | Optional  | `"https://www.philamuseum.org/collection/object/51449"` | Must be a full URL, including `https://`.                                                            |
| `articleSlug`     | Optional  | `"duchamp/rhonda-shearer/impossible-bed-i"`             | Must not start with a leading slash.                                                                 |

## How To Add A Work

1. Open `data/item-cards.json`.
2. Add or update an item card for the work.
3. Set `image` to the local gallery image path when one is available.
4. Add an `artwork` block with at least `kind`, `period`, and `displayOrder`.
5. Place local image files in `public/images/duchamp/paintings/`.
6. Run `npm run check` so the item-card schema validates the entry.

Use an existing item card when one already represents the work. The goal is one canonical card with
the story and gallery metadata together, not a separate artwork record that can drift.
