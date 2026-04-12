#!/usr/bin/env node

/**
 * Export Title Cards to Federated Wiki pages
 * Converts each title card to a fed.wiki page JSON format
 */

const fs = require('fs');
const path = require('path');

// Paths
const TITLE_CARDS_PATH = path.join(__dirname, '../data/title-cards.json');
const FEDWIKI_PAGES_PATH = path.expanduser ? path.expanduser('~/.wiki/pages') : `${process.env.HOME}/.wiki/pages`;

// Generate a random ID for story items
function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

// Convert title to slug (fedwiki page filename format)
function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Convert a title card to fedwiki page format
function cardToFedwikiPage(card, allCards) {
  const story = [];
  const now = Date.now();

  // Add category/section as a subtle header
  if (card.section || card.category) {
    const categoryText = [card.section, card.category, card.subcategory]
      .filter(Boolean)
      .join(' → ');
    story.push({
      type: 'paragraph',
      id: generateId(),
      text: `<i>${categoryText}</i>`
    });
  }

  // Add image if present
  if (card.image) {
    story.push({
      type: 'image',
      id: generateId(),
      url: card.image,
      caption: card.title,
      text: card.title
    });
  }

  // Add multiple images for split cards
  if (card.images && card.images.length > 0) {
    for (const img of card.images) {
      story.push({
        type: 'image',
        id: generateId(),
        url: img,
        caption: card.title,
        text: card.title
      });
    }
  }

  // Add description
  if (card.description) {
    story.push({
      type: 'paragraph',
      id: generateId(),
      text: card.description
    });
  }

  // Add source badge
  if (card.source) {
    const sourceText = card.source === 'dlc' ? 'Shadow of the Erdtree (DLC)' : 'Elden Ring (Base Game)';
    story.push({
      type: 'paragraph',
      id: generateId(),
      text: `<b>Source:</b> ${sourceText}`
    });
  }

  // Add grace connections as wiki links
  if (card.connections && card.connections.length > 0) {
    const connectionLinks = card.connections.map(conn => {
      const connectedCard = allCards.find(c => c.id === conn.cardId);
      if (connectedCard) {
        const linkText = conn.label ? `${connectedCard.title} (${conn.label})` : connectedCard.title;
        return `[[${connectedCard.title}]]`;
      }
      return null;
    }).filter(Boolean);

    if (connectionLinks.length > 0) {
      story.push({
        type: 'paragraph',
        id: generateId(),
        text: `<b>Grace Connections:</b> ${connectionLinks.join(', ')}`
      });
    }
  }

  // Add external links
  if (card.links && card.links.length > 0) {
    const linkItems = card.links.map(link => `[${link.url} ${link.label}]`).join('\n');
    story.push({
      type: 'paragraph',
      id: generateId(),
      text: `<b>References:</b>\n${linkItems}`
    });
  }

  // Add search term
  story.push({
    type: 'paragraph',
    id: generateId(),
    text: `<i>Search term: "${card.term}"</i>`
  });

  // Create the page object
  const page = {
    title: card.title,
    story: story,
    journal: [
      {
        type: 'create',
        item: { title: card.title, story: [] },
        date: now
      },
      {
        type: 'add',
        id: story[0]?.id,
        item: story[0],
        date: now
      }
    ]
  };

  return page;
}

// Main export function
async function exportToFedwiki() {
  console.log('Reading title cards...');

  // Read title cards
  const data = JSON.parse(fs.readFileSync(TITLE_CARDS_PATH, 'utf8'));
  const cards = Array.isArray(data) ? data : data.cards || [];

  console.log(`Found ${cards.length} title cards`);
  console.log(`Exporting to: ${FEDWIKI_PAGES_PATH}`);

  // Ensure pages directory exists
  if (!fs.existsSync(FEDWIKI_PAGES_PATH)) {
    fs.mkdirSync(FEDWIKI_PAGES_PATH, { recursive: true });
  }

  let exported = 0;
  let errors = 0;

  for (const card of cards) {
    try {
      const page = cardToFedwikiPage(card, cards);
      const slug = toSlug(card.title);
      const filePath = path.join(FEDWIKI_PAGES_PATH, slug);

      fs.writeFileSync(filePath, JSON.stringify(page, null, 2));
      exported++;

      if (exported % 100 === 0) {
        console.log(`Exported ${exported}/${cards.length}...`);
      }
    } catch (err) {
      console.error(`Error exporting "${card.title}":`, err.message);
      errors++;
    }
  }

  console.log(`\nDone! Exported ${exported} pages to fedwiki.`);
  if (errors > 0) {
    console.log(`${errors} errors occurred.`);
  }
  console.log(`\nRestart your fedwiki or refresh to see the new pages.`);
}

// Run
exportToFedwiki().catch(console.error);
