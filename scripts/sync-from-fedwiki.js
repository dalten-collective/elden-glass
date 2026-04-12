#!/usr/bin/env node

/**
 * Sync title cards from Federated Wiki pages
 * Reads all pages from ~/.wiki/pages/ and converts them to title-cards.json
 * Fedwiki is the source of truth, this generates the local cache
 */

const fs = require('fs');
const path = require('path');

const FEDWIKI_PAGES_PATH = path.join(process.env.HOME, '.wiki/pages');
const TITLE_CARDS_PATH = path.join(__dirname, '../data/title-cards.json');

// Pages to skip (not title cards)
const SKIP_PAGES = new Set([
  'welcome-visitors',
  'gatherer',
  'how-to-wiki',
  'recent-changes'
]);

// Parse category path from first story item
// Format: <i>Section → Category → Subcategory</i>
function parseCategoryPath(text) {
  const match = text.match(/<i>(.+?)<\/i>/);
  if (!match) return {};

  const parts = match[1].split('→').map(s => s.trim());
  return {
    section: parts[0] || null,
    category: parts[1] || null,
    subcategory: parts[2] || null
  };
}

// Parse search term from story item
// Format: <i>Search term: "term"</i>
function parseSearchTerm(text) {
  const match = text.match(/Search term:\s*"([^"]+)"/i);
  return match ? match[1] : null;
}

// Parse source badge
// Format: <b>Source:</b> Shadow of the Erdtree (DLC) or Elden Ring (Base Game)
function parseSource(text) {
  if (text.includes('Shadow of the Erdtree') || text.includes('DLC')) {
    return 'dlc';
  }
  if (text.includes('Base Game')) {
    return 'base';
  }
  return null;
}

// Parse grace connections from wiki links
// Format: <b>Grace Connections:</b> [[Page Title]], [[Another Page]]
function parseConnections(text, allPageSlugs) {
  const connections = [];
  const linkMatches = text.matchAll(/\[\[([^\]]+)\]\]/g);

  for (const match of linkMatches) {
    const linkedTitle = match[1];
    const linkedSlug = toSlug(linkedTitle);
    if (allPageSlugs.has(linkedSlug)) {
      connections.push({
        cardId: linkedSlug, // We'll map this to real IDs later
        linkedTitle: linkedTitle
      });
    }
  }

  return connections;
}

// Parse external links
// Format: <b>References:</b>\n[url label]
function parseLinks(text) {
  const links = [];
  const linkMatches = text.matchAll(/\[([^\s\]]+)\s+([^\]]+)\]/g);

  for (const match of linkMatches) {
    links.push({
      url: match[1],
      label: match[2]
    });
  }

  return links;
}

// Convert title to slug
function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Generate a random ID
function generateId() {
  return Math.random().toString(16).substring(2, 18);
}

// Convert a fedwiki page to title card format
function pageToCard(pageData, filename, allPageSlugs) {
  const card = {
    id: generateId(),
    term: null,
    scope: 'global',
    title: pageData.title,
    description: null,
    section: null,
    category: null,
    subcategory: null,
    source: null,
    image: null,
    images: [],
    connections: [],
    links: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Extract creation date from journal if available
  if (pageData.journal && pageData.journal.length > 0) {
    const createEntry = pageData.journal.find(j => j.type === 'create');
    if (createEntry && createEntry.date) {
      card.createdAt = new Date(createEntry.date).toISOString();
    }
  }

  // Process story items
  for (const item of pageData.story || []) {
    if (item.type === 'paragraph') {
      const text = item.text || '';

      // Check for category path (usually first item)
      if (text.startsWith('<i>') && text.includes('→') && !text.includes('Search term')) {
        const { section, category, subcategory } = parseCategoryPath(text);
        card.section = section;
        card.category = category;
        card.subcategory = subcategory;
      }
      // Check for search term
      else if (text.includes('Search term:')) {
        card.term = parseSearchTerm(text);
      }
      // Check for source
      else if (text.includes('<b>Source:</b>')) {
        card.source = parseSource(text);
      }
      // Check for grace connections
      else if (text.includes('Grace Connections:') || text.includes('[[')) {
        const connections = parseConnections(text, allPageSlugs);
        card.connections.push(...connections);
      }
      // Check for references/links
      else if (text.includes('<b>References:</b>')) {
        card.links = parseLinks(text);
      }
      // Otherwise it's likely description
      else if (!text.startsWith('<i>') && !text.startsWith('<b>') && text.trim()) {
        // Accumulate description
        if (card.description) {
          card.description += '\n\n' + text;
        } else {
          card.description = text;
        }
      }
    }
    // Handle images
    else if (item.type === 'image') {
      if (!card.image) {
        card.image = item.url;
      } else {
        card.images.push(item.url);
      }
    }
  }

  // Use filename as term if not found
  if (!card.term) {
    card.term = filename.replace(/-/g, ' ');
  }

  return card;
}

// Main sync function
async function syncFromFedwiki() {
  console.log('Reading fedwiki pages from:', FEDWIKI_PAGES_PATH);

  // Read all page files
  const files = fs.readdirSync(FEDWIKI_PAGES_PATH);
  const pageFiles = files.filter(f => !SKIP_PAGES.has(f) && !f.startsWith('.'));

  console.log(`Found ${pageFiles.length} page files`);

  // Build set of all page slugs for connection resolution
  const allPageSlugs = new Set(pageFiles);

  // Track unique cards by title to avoid duplicates
  const cardsByTitle = new Map();
  const cards = [];
  let errors = 0;

  for (const filename of pageFiles) {
    try {
      const filePath = path.join(FEDWIKI_PAGES_PATH, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      const pageData = JSON.parse(content);

      const card = pageToCard(pageData, filename, allPageSlugs);

      // Check for existing card with same title
      if (cardsByTitle.has(card.title)) {
        // This is likely an alternate search term for same card
        // Add as separate entry with different term
        const existingCard = cardsByTitle.get(card.title);
        if (card.term !== existingCard.term) {
          // Create a reference card with just the term pointing to same content
          const refCard = { ...existingCard, id: generateId(), term: card.term };
          cards.push(refCard);
        }
      } else {
        cardsByTitle.set(card.title, card);
        cards.push(card);
      }

    } catch (err) {
      console.error(`Error processing ${filename}:`, err.message);
      errors++;
    }
  }

  // Sort cards by section, category, title
  cards.sort((a, b) => {
    const sectionCmp = (a.section || '').localeCompare(b.section || '');
    if (sectionCmp !== 0) return sectionCmp;
    const categoryCmp = (a.category || '').localeCompare(b.category || '');
    if (categoryCmp !== 0) return categoryCmp;
    return (a.title || '').localeCompare(b.title || '');
  });

  // Write to title-cards.json
  const output = { cards };
  fs.writeFileSync(TITLE_CARDS_PATH, JSON.stringify(output, null, 2));

  console.log(`\nSync complete!`);
  console.log(`  - ${cards.length} cards synced to title-cards.json`);
  console.log(`  - ${cardsByTitle.size} unique titles`);
  if (errors > 0) {
    console.log(`  - ${errors} errors occurred`);
  }
  console.log(`\nFedwiki is now the source of truth.`);
  console.log(`Edit pages in fedwiki, then run this script to update the site.`);
}

// Run
syncFromFedwiki().catch(console.error);
