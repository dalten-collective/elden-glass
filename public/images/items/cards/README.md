# Elden Ring In-Game Item Card Screenshots

This directory contains screenshots of Elden Ring item cards **exactly as they appear in-game** - the full inventory UI showing the item description, icon, and stats.

## What Are Item Cards?

Item cards are the description screens you see when you select an item in your inventory. They include:
- The item icon
- Item name
- Item description text
- Stats (weight, max held, etc.)
- The game's UI styling and background

## How to Obtain Screenshots

### Method 1: Take Your Own Screenshots (Recommended)

This gives you the exact authentic look from the game.

#### On PC (Steam):
1. Launch Elden Ring
2. Open your inventory (Tab/Start)
3. Navigate to the item you want
4. Position the description panel clearly on screen
5. Take screenshot:
   - **Steam**: F12 (default)
   - **Windows**: Win + Print Screen
   - **Snipping Tool**: Win + Shift + S

#### On PlayStation:
1. Open inventory and navigate to item
2. Press **Share button** → **Save Screenshot**
3. Transfer to computer via USB or PlayStation app

#### On Xbox:
1. Open inventory and navigate to item
2. Press **Xbox button** → **Y** (screenshot)
3. Transfer via Xbox app or OneDrive

### Method 2: Community Resources

#### Elden Ring Wiki Screenshots
Most wikis have high-quality screenshots:
- **Fextralife**: https://eldenring.wiki.fextralife.com/
- **Fandom**: https://eldenring.fandom.com/

Look for item pages and find screenshots showing the description UI.

#### YouTube Videos
Many Elden Ring guides show item cards:
1. Find a video showing the item
2. Pause when the item card is visible
3. Screenshot the video (use a screen capture tool)

## Screenshot Guidelines

### Resolution
- **Minimum**: 1280x720 (720p)
- **Recommended**: 1920x1080 (1080p) or higher
- Higher resolution = better quality on hover

### Framing
- Capture the **entire item description panel**
- Include the dark background/overlay
- Make sure text is readable
- Avoid capturing menus overlapping the item card

### File Format
- **PNG** (preferred) - lossless quality
- **JPG** (acceptable) - use high quality (90%+)

### Naming Convention
Match the item slug from `/lib/items.ts` and add `-card.png`:

```
glass-shard-card.png
godricks-great-rune-card.png
morgotts-great-rune-card.png
malenias-great-rune-card.png
radahns-great-rune-card.png
rykards-great-rune-card.png
```

## Post-Processing (Optional)

You can clean up screenshots if needed:

### Cropping
Crop to just the item description panel:
- Remove unnecessary UI elements
- Keep the item card background
- Center the card in the image

### Image Editors
- **Preview** (Mac): Built-in, simple cropping
- **Paint** (Windows): Built-in, basic editing
- **GIMP**: Free, advanced editing
- **Photoshop**: Professional (if you have it)

### Quick Crop Example (Mac Preview):
1. Open screenshot in Preview
2. Tools → Rectangular Selection
3. Select just the item card
4. Crop to Selection (Cmd + K)
5. Export

## Priority Items to Screenshot

For your Elden Ring discovery, prioritize these items:

### Critical Items:
1. **Glass Shard** - The key clue
2. **All Great Runes**:
   - Godrick's Great Rune (Louis XV Chassis)
   - Morgott's Great Rune (Necktie)
   - Malenia's Great Rune (Roller)
   - Radahn's Great Rune (Roller/Juggler of Gravity)
   - Rykard's Great Rune (Roller)
   - Miquella's Great Rune (if available)

### Important Lore Items:
- Site of Grace (if you can screenshot it)
- Golden Seed
- Sacred Tear
- Elden Ring items related to The Large Glass

## Testing Your Screenshots

After adding screenshots to this folder:

1. Verify the file name matches the database entry in `/lib/items.ts`
2. Check the website locally:
   ```bash
   npm run dev
   ```
3. Navigate to a page with item hovers
4. Hover over an item name
5. Confirm the card image appears correctly

## Fallback Behavior

If a screenshot doesn't exist yet, the hover card will show:
```
[Item Name]
In-game card image not available yet
```

This lets you add items to your content before you have the screenshots ready.

## File Size Considerations

### Optimization
Screenshots can be large. Optimize them:
- Use PNG compression tools (e.g., TinyPNG, ImageOptim)
- Target < 500KB per image if possible
- Balance quality vs file size

### Tools for Optimization:
- **TinyPNG**: https://tinypng.com/ (web-based)
- **ImageOptim** (Mac): Free, drag-and-drop
- **Squoosh** (Web): https://squoosh.app/

## Example: Adding a New Item Card

1. Take screenshot of item in-game
2. Crop to item description panel
3. Save as `item-slug-card.png` in this directory
4. Add `cardImage` field to `/lib/items.ts`:
   ```typescript
   'item-slug': {
     // ... other fields
     cardImage: '/images/items/cards/item-slug-card.png',
   }
   ```
5. Use in content:
   ```mdx
   <ItemCard itemSlug="item-slug">Item Name</ItemCard>
   ```

## Current Status

### Need Screenshots For:
- [ ] glass-shard-card.png
- [ ] godricks-great-rune-card.png
- [ ] morgotts-great-rune-card.png
- [ ] malenias-great-rune-card.png
- [ ] radahns-great-rune-card.png
- [ ] rykards-great-rune-card.png

## Tips

1. **Save files if you're actively playing**: Take screenshots as you encounter items
2. **NG+ playthroughs**: Great opportunity to capture all items
3. **Community help**: Consider asking Elden Ring subreddit if you need specific screenshots
4. **Quality over quantity**: Better to have a few perfect screenshots than many poor ones

## Alternative: Video Extraction

If you have gameplay recordings:

1. Open video in a player (VLC, QuickTime, etc.)
2. Pause on the item card frame
3. Use video export/screenshot function
4. Higher quality than screenshotting a video player

## Questions?

If you're unsure about a screenshot:
- Check if text is readable at 100% zoom
- Verify the item name matches your database entry
- Test on the actual website to see how it looks

---

**Remember**: The goal is to show visitors the **authentic Elden Ring experience** - exactly as it appears in the game!
