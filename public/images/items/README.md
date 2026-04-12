# Elden Ring Item Icons

This directory contains UI icons for Elden Ring items to be displayed in hover cards throughout the website.

## How to Obtain Icons

### Option 1: RubyRed's Icon Dump (Recommended)
RubyRed has created a comprehensive dump of all Elden Ring item icons, including cut content.

1. Search for "RubyRed Elden Ring icons dump" on community forums
2. Download the icon pack
3. Extract to this directory

### Option 2: Extract from Game Files
If you have Elden Ring installed:

1. Use **UXM (Unpack eXtract Mod)** to unpack game files
2. Use **ERDB** to extract icons:
   ```bash
   pip install erdb
   erdb icons --game-dir "path/to/elden-ring" --output-dir ./public/images/items
   ```

### Option 3: Download from Wikis
Icons can be downloaded from:
- **Fextralife Wiki**: https://eldenring.wiki.fextralife.com/
- **Fandom Wiki**: https://eldenring.fandom.com/wiki/Category:Images_-_Icons

Right-click on item images and save to this directory.

## Naming Convention

Item images should be named using kebab-case matching the item slug in `/lib/items.ts`:

```
glass-shard.png
godricks-great-rune.png
malenias-great-rune.png
radahns-great-rune.png
```

## Image Format

- **Format**: PNG with transparency
- **Size**: Ideally 512x512 or 1024x1024
- **Background**: Transparent
- **Style**: In-game UI icon appearance (as shown in inventory)

## Priority Items for Discovery

These items are most important for your Elden Ring/Large Glass discovery:

### Critical Items:
- `glass-shard.png` - The key clue!
- All Great Runes (the Chocolate Grinder parts)
  - `godricks-great-rune.png` (Louis XV Chassis)
  - `morgotts-great-rune.png` (Necktie)
  - `malenias-great-rune.png` (Roller)
  - `radahns-great-rune.png` (Roller - Juggler of Gravity)
  - `rykards-great-rune.png` (Roller)
  - `miquellas-great-rune.png` (Scissors/Sieves)

### Important Lore Items:
- `grace.png` (Love Gasoline)
- `golden-seed.png`
- `sacred-tear.png`

## TODO

- [ ] Download Glass Shard icon
- [ ] Download all Great Rune icons
- [ ] Download key lore item icons
- [ ] Optional: Download full icon set from RubyRed dump

## Quick Start

For now, you can use placeholder images or just the text descriptions will show in hover cards.
Icons will enhance the display but aren't required for the component to work.
