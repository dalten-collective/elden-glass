# Content Authoring Guide

This guide explains how to write and manage all markdown content for the Elden Glass project using the new Next.js + Contentlayer pipeline. Keep this file under `/content/README.md` so editors can find it quickly.

---

## Front Matter

All markdown documents should start with YAML front matter enclosed in `---`:

```markdown
---
title: 'Document Title'
subtitle: 'Optional Subtitle'
author: 'Your Name'
created: '2024-03-15'
updated: '2024-10-24'
version: '1.0'
tags: ['tag1', 'tag2', 'tag3']
---
```

### Front Matter Fields

#### For Main Documents (`living.md`, `discovery.md`)

- `title`: Main document title
- `subtitle`: Optional subtitle for the document
- `author`: Document author
- `created`: Original creation date (ISO format: YYYY-MM-DD)
- `updated`: Last update date (ISO format: YYYY-MM-DD)
- `version`: Document version number
- `tags`: Array of relevant tags

#### For Criticism Documents

- `source_piece`: Title of the work being criticized
- `source_url`: URL to the original piece
- `author`: Original author's name
- `publication`: Where it was published
- `published_date`: When the original was published
- `criticism_date`: When you wrote the criticism
- `tags`: Relevant tags

---

## Image Insertion Syntax

We use a special syntax for inserting images that allows for better control and metadata:

### Basic Syntax

```markdown
![image:image-id](path/to/image.jpg 'Alt text / caption')
```

### Components

1. **`image:`** - Special prefix that tells the parser this is an enhanced image
2. **`image-id`** - A unique identifier for this image (used for references)
3. **`path/to/image.jpg`** - Relative path to the image file
4. **`"Alt text / caption"`** - Image caption and alt text

### Examples

```markdown
![image:large-glass](assets/images/large-glass.jpg "Marcel Duchamp's The Large Glass")

![image:erdtree-view](assets/images/erdtree-panorama.jpg 'The Erdtree as seen from Limgrave')

![image:marika-statue](assets/images/marika-crucified.jpg 'Marika crucified within the Erdtree')
```

### Image Organization

Store images in organized directories:

```
assets/
├── images/              # Main discovery images
│   ├── large-glass.jpg
│   ├── erdtree.jpg
│   └── marika.jpg
├── criticisms/          # Images specific to criticism responses
│   ├── counter-evidence-1.jpg
│   └── analysis-chart.png
└── screenshots/         # Game screenshots
    ├── location-1.jpg
    └── item-description.jpg
```

> **Critique assets auto-sync**
>
> Drop any artwork or screenshots used by critique documents into `content/critique-images/`. During `npm run dev` or `npm run build`, the `scripts/sync-critique-assets.js` helper copies everything in that directory into `public/images/critiques/`, so your markdown can reference them via `/images/critiques/<filename>`.

---

## Standard Markdown Features

### Headings

```markdown
# H1 - Document Title

## H2 - Major Section

### H3 - Subsection

#### H4 - Minor subsection
```

**Note:** H1 should only be used once for the document title. The table of contents generator will use H2-H4 for navigation.

### Emphasis

```markdown
_italic text_ or _italic text_
**bold text** or **bold text**
**_bold and italic_** or **_bold and italic_**
```

### Links

```markdown
[Link text](https://example.com)
[Link with title](https://example.com 'Link title on hover')
```

### External References

Always use full markdown links for citations:

```markdown
As described in [Duchamp's Green Box](https://www.metmuseum.org/art/collection/search/492389), the Bride undergoes a "cinematic blossoming".
```

### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> And contain multiple paragraphs.
```

### Lists

**Unordered:**

```markdown
- Item 1
- Item 2
  - Nested item 2a
  - Nested item 2b
- Item 3
```

**Ordered:**

```markdown
1. First item
2. Second item
3. Third item
```

### Code

**Inline code:**

```markdown
Use the `sha256sum` command to generate the hash.
```

**Code blocks:**

````markdown
```bash
sha256sum discovery.md
```
````

### Horizontal Rules

```markdown
---
```

or

```markdown
---
```

---

## Auto-Generated Table of Contents

The website will automatically generate a table of contents from your headings. To optimize this:

### Best Practices

1. **Use descriptive headings** that work well in a navigation menu
2. **Keep H2 headings concise** (they appear in the main nav)
3. **Use H3 for subsections** that you want grouped under H2
4. **Avoid more than 3 levels** of nesting (H1 → H2 → H3)

### Example Structure

```markdown
# Document Title (H1 - only use once)

## The Mystery (H2 - appears in nav)

Some content here...

## The Discovery (H2 - appears in nav)

### The Large Glass (H3 - nested under "The Discovery")

Content...

### Elden Ring Connection (H3 - nested under "The Discovery")

Content...

## Evidence (H2 - appears in nav)

### Item Descriptions (H3)

### Environmental Clues (H3)

### Cut Content (H3)
```

This will generate a nav like:

```
- The Mystery
- The Discovery
  - The Large Glass
  - Elden Ring Connection
- Evidence
  - Item Descriptions
  - Environmental Clues
  - Cut Content
```

---

## Advanced Features

### Footnotes

```markdown
This is some text with a footnote.[^1]

[^1]: This is the footnote content.
```

### Tables

```markdown
| Header 1 | Header 2 | Header 3 |
| -------- | -------- | -------- |
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |
```

### Task Lists

```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
```

---

## Image Best Practices

### File Naming

Use descriptive, kebab-case names:

✅ Good:

- `large-glass-upper-panel.jpg`
- `erdtree-interior-view.jpg`
- `marika-shattering-moment.jpg`

❌ Bad:

- `IMG_1234.jpg`
- `Screen Shot 2024-10-24.png`
- `image (1).jpg`

### File Formats

- **Photographs/Screenshots:** Use `.jpg` or `.webp`
- **Diagrams/Graphics:** Use `.png` for transparency, `.svg` for vectors
- **Animations:** Use `.gif` sparingly (large file size)

### File Size

- Keep images under 500KB when possible
- Use image optimization tools before adding to repo
- Consider providing multiple sizes for responsive design:
  - `image-name.jpg` (full size)
  - `image-name-thumb.jpg` (thumbnail)
  - `image-name-mobile.jpg` (mobile optimized)

---

## Document Workflow

### Living Thesis (`content/living-thesis.mdx`)

1. Edit freely; this is the main expanding thesis (was `discovery.mdx`).
2. Keep front matter current (`updated`, optional `readingMinutes`).
3. Embed float images using the `{float}` syntax described above.
4. Commit/push—CI builds and deploys automatically.

### Initial Thesis (`content/initial-thesis.mdx`)

1. The first written statement of the discovery, sent as an email on July 18, 2025 and later sealed on Ethereum via EAS.
2. The MDX body contains editorial framing only. The actual manuscript text is read at render time from `public/proofs/manuscript.txt` by the `ManuscriptDisplay` component, which masks email addresses in the display but leaves the downloadable file untouched.
3. Front matter must include `documentHash` (SHA-256 of the hashable file), `ethereumAttestation` (EAS attestation UID), `hashableFile` (filename of the canonical source under `public/proofs/`, i.e. `manuscript.txt`), and `sealedDate`.
4. Updating the manuscript body itself would change the hash and break the EAS attestation. Do not edit `public/proofs/manuscript.txt`.

### TL;DR (`content/tldr.mdx`)

1. The polished condensation of the thesis, timestamped on Bitcoin via OpenTimestamps.
2. Body is web-display markdown. The hashed file is `public/proofs/EldenRingSecretOriginal.md`.
3. Front matter must include `documentHash` (SHA-256 of the hashable file), `bitcoinOts` (filename of the OpenTimestamps `.ots` proof under `public/proofs/`), `hashableFile`, and `sealedDate`.
4. Updating the hashable file would change the hash and break the OTS proof. The MDX body can drift (it's only used for display), but updates should stay faithful to the hashed source.

### Live Research Log (`content/living.mdx`)

1. The continuously updated research notes exposed at `/living`. Separate from the Living Thesis above.
2. Front matter: `title`, `intro`, `updated`, optional `readingMinutes`.

### Critiques (`content/critiques/*.mdx`)

1. Create one MDX file per critique: `content/critiques/<slug>.mdx`.
2. Required front matter: `title`, `summary`, `targetUrl`, `targetTitle`, `published`, `updated`.
3. Add screenshots into `content/critique-images/`; the sync script copies them to `public/images/critiques/` so you can reference them via `/images/critiques/<file>`.

### About (`content/about.mdx`)

1. Stores bio content for the sidebar + about page.
2. Front matter: `title`, `role`, optional `location`, `updated`.

---

## Special Markup Reference

### Quick Reference Card

```markdown
---
title: 'Document Title'
author: 'Your Name'
---

# Main Title

## Section Heading

Some text with **bold** and _italic_ emphasis.

[Link to source](https://example.com)

![image:unique-id](path/to/image.jpg 'Caption text')

> Blockquote for emphasis

- Bullet point
- Another point

1. Numbered item
2. Another item

---

Horizontal rule above
```

---

## Contentlayer + Next.js Reference

- Content files live under `/content/` and are compiled by Contentlayer (`npm run content`).
- The generated typings are stored in `.contentlayer/` and imported via `contentlayer/generated`.
- `npm run dev` / `npm run build` automatically run the asset sync step and Contentlayer build.
- Avoid manual edits to `.contentlayer/`; it regenerates on every build.

---

## Examples

### Complete Document Example

```markdown
---
title: "The Erdtree's True Nature"
subtitle: 'A Deeper Analysis'
author: 'Luke'
created: '2024-03-20'
updated: '2024-10-24'
version: '1.1'
tags: ['erdtree', 'analysis', 'lore']
---

# The Erdtree's True Nature

## Introduction

The Erdtree is not what it appears to be. Through careful analysis of [item descriptions](https://eldenring.wiki.fextralife.com) and environmental storytelling, a different picture emerges.

![image:erdtree-exterior](assets/images/erdtree-exterior.jpg 'The Erdtree viewed from Leyndell')

## The Cinematic Blossoming

Duchamp described the Bride's transformation as a "cinematic blossoming" - a moment of becoming that is perpetually deferred.

### Visual Evidence

![image:erdtree-interior](assets/images/erdtree-interior.jpg 'Inside the Erdtree')

The interior of the Erdtree shows this exact moment: a tree that has burst open, frozen in time.

### Textual Evidence

The [Erdtree Seal](https://eldenring.wiki.fextralife.com/Erdtree+Seal) describes it as:

> "The seal represents the Erdtree, which holds the core of the Elden Ring."

This aligns with Duchamp's concept of the Bride containing the ring (the Elden Ring) within her domain.

## Conclusion

The parallels are too numerous to be coincidental. The Erdtree _is_ the Bride's domain, crystallized in three dimensions.

---

_This analysis is part of the ongoing investigation documented at [discovery site]._
```

### Complete Criticism Example

```markdown
---
source_piece: 'The Erdtree as Cosmic Tree Theory'
source_url: 'https://example.com/erdtree-theory'
author: 'VaatiVidya'
publication: 'YouTube'
published_date: '2024-03-10'
criticism_date: '2024-10-24'
tags: ['erdtree', 'response', 'lore-critique']
---

# Response to "The Erdtree as Cosmic Tree Theory"

## Summary

VaatiVidya proposes that the Erdtree represents a Norse-style World Tree (Yggdrasil), connecting different realms vertically.

## Points of Agreement

1. **The vertical structure is intentional** - Absolutely correct
2. **It connects realms** - Yes, but not in the way proposed
3. **Norse mythology influences FromSoftware** - True for other games

## The Problem with the Yggdrasil Interpretation

### Issue 1: The Interior Doesn't Match

The interior of the Erdtree contradicts a "world tree" interpretation:

![image:erdtree-hollow](assets/criticisms/erdtree-interior-analysis.jpg 'The Erdtree is hollow and burnt')

A cosmic tree should be alive and growing. The Erdtree is clearly hollow, burnt, and _frozen in a moment of expansion_.

### Issue 2: Miyazaki's Own Words

In [his interview with IGN](https://example.com), Miyazaki explicitly states there's a "final secret" no one has found. If it were simply Yggdrasil symbolism, that would have been obvious immediately.

## Alternative: The Duchamp Connection

[Your counter-theory...]

## Conclusion

While the Yggdrasil theory is compelling on surface level, it fails to account for the specific details of the Erdtree's presentation and Miyazaki's statements about a hidden secret.
```

---

## Tips for Writing

### For Discovery Documents

1. **Be specific** - Link to exact sources
2. **Show, don't tell** - Use images to support claims
3. **Structure logically** - Build argument step by step
4. **Anticipate objections** - Address counterarguments preemptively
5. **Update regularly** - Keep the living document current

### For Criticism Documents

1. **Be fair** - Accurately represent the original argument
2. **Find agreement** - Acknowledge valid points first
3. **Be specific** - Cite exact issues with evidence
4. **Offer alternatives** - Don't just criticize, propose better interpretations
5. **Stay professional** - Focus on ideas, not personalities

---

## Troubleshooting

### Front Matter Not Parsing

- Ensure `---` delimiters are on their own lines
- Check for valid YAML syntax (proper quotes, colons, indentation)
- Verify no spaces before `---`

### Images Not Displaying

- Check file path is relative to document location
- Verify image file exists at specified path
- Ensure `image:` prefix is present
- Check for typos in image-id

### Table of Contents Missing Headings

- Ensure headings use `##` (H2) or `###` (H3)
- Verify no extra spaces after `#`
- Check that headings aren't inside code blocks

---

## Resources

- [Marked.js Documentation](https://marked.js.org/) - Standard markdown parsing
- [YAML Syntax](https://yaml.org/) - For front matter
- [Markdown Guide](https://www.markdownguide.org/) - General markdown reference
