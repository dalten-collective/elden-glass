# Duchamp Works Data README

This file documents the JSON data that powers the `/duchamp-works` gallery. It is written for authors and editors who want to update the catalog without touching TypeScript or React.

## Where data lives

- Duchamp catalog data lives in `data/duchamp-artworks.json`.
- The schema is enforced by `lib/duchamp-artworks-schema.ts`.
- The data is parsed in `lib/duchamp-artworks.ts`, so schema validation runs during the site build.
- Image files for this catalog live in `public/images/duchamp/paintings/`.

The JSON file is a top-level array of periods. Each period has a `title`, a `years` label, and a `works` array:

```json
[
  {
    "title": "Major Period",
    "years": "1911-1914",
    "works": [
      {
        "title": "Bride",
        "year": "1912",
        "filename": "bride-1912.jpg"
      }
    ]
  }
]
```

## Schema reference

The fields below apply to each object inside a period's `works` array.

| Field             | Required?                                                    | Example                                                              | Rules                                                                                     |
| ----------------- | ------------------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `title`           | Yes                                                          | `"Bride"`                                                            | Plain text string.                                                                        |
| `year`            | Optional in the schema, but expected for new catalog entries | `"1912"`                                                             | String value. Use the display year you want readers to see.                               |
| `filename`        | Yes                                                          | `"bride-1912.jpg"`                                                   | Plain text string. This should match an image file in `public/images/duchamp/paintings/`. |
| `medium`          | Optional                                                     | `"Oil on canvas"`                                                    | Plain text string.                                                                        |
| `dimensions`      | Optional                                                     | `"89.5 x 55.9 cm"`                                                   | Plain text string.                                                                        |
| `collection`      | Optional                                                     | `"Philadelphia Museum of Art"`                                       | Plain text string.                                                                        |
| `currentLocation` | Optional                                                     | `"Philadelphia"`                                                     | Plain text string.                                                                        |
| `sourceUrl`       | Optional                                                     | `"https://www.philamuseum.org/collection/object/51449"`              | Must be a full URL, including `https://`.                                                 |
| `note`            | Optional                                                     | `"Painted during Duchamp's transition into the Large Glass period."` | Plain text string with a maximum of **200 words**.                                        |
| `articleSlug`     | Optional                                                     | `"impossible-bed-i"`                                                 | Plain text string. Must **not** start with a leading slash.                               |

## How to add a work

1. Open `data/duchamp-artworks.json`.
2. Find the period where the new work belongs, then open that period's `works` array.
3. Paste a new object inside that `works` array. Put it next to the other works in that period, using normal JSON commas.
4. For a new catalog entry, use `title`, `year`, and `filename` as your minimum fields.
5. Name the image file in kebab-case with a year suffix, such as `impossible-bed-i-1966.jpg`.
6. Place that image file in `public/images/duchamp/paintings/`.
7. Add any optional metadata you have, such as `medium`, `dimensions`, `collection`, `currentLocation`, `sourceUrl`, `note`, or `articleSlug`.
8. Save the JSON and run `npm run build` (or `npm run check`) so the schema validator can confirm the entry is valid.

Example entry:

```json
{
  "title": "Impossible Bed",
  "year": "1966",
  "filename": "impossible-bed-i-1966.jpg",
  "medium": "Photograph",
  "sourceUrl": "https://example.com/impossible-bed",
  "articleSlug": "impossible-bed-i"
}
```

## How to link a work to a full article

Add an `articleSlug` field to the work entry:

```json
"articleSlug": "impossible-bed-i"
```

That slug resolves against the site's catch-all MDX route, so an MDX file at `content/pages/impossible-bed-i.mdx` will be reachable from the work card. For the article authoring pattern, use `content/pages/impossible-bed-i.mdx` as the model instead of duplicating MDX guidance here.

## What happens if I break the schema

If the JSON does not match the schema, the site build fails when `lib/duchamp-artworks.ts` parses `data/duchamp-artworks.json`. The error points to the field path and explains the problem, which makes it straightforward to fix the entry and rerun the build. A typical message looks like this:

```text
path: [0, "works", 0, "articleSlug"]
message: articleSlug must not start with a leading slash.
```
