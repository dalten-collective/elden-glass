#!/usr/bin/env node

/**
 * Generate a standalone HTML Gatherer page for Federated Wiki
 * This embeds all title cards data directly in the HTML
 */

const fs = require('fs');
const path = require('path');

const TITLE_CARDS_PATH = path.join(__dirname, '../data/title-cards.json');
const OUTPUT_PATH = path.join(process.env.HOME, '.wiki/assets/gatherer.html');

// Read title cards
const data = JSON.parse(fs.readFileSync(TITLE_CARDS_PATH, 'utf8'));
const cards = Array.isArray(data) ? data : data.cards || [];

// Extract unique values for filters
const sections = [...new Set(cards.map(c => c.section).filter(Boolean))].sort();
const categories = [...new Set(cards.map(c => c.category).filter(Boolean))].sort();
const subcategories = [...new Set(cards.map(c => c.subcategory).filter(Boolean))].sort();

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gatherer - Title Card Browser</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
      color: #333;
    }
    h1 { margin: 0 0 20px 0; font-size: 24px; }
    .search-box {
      width: 100%;
      padding: 12px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 8px;
      margin-bottom: 15px;
    }
    .filter-toggle {
      cursor: pointer;
      color: #4a90d9;
      margin-bottom: 10px;
      display: inline-block;
      user-select: none;
    }
    .filter-toggle:hover { text-decoration: underline; }
    .filters {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      display: none;
    }
    .filters.show { display: block; }
    .filter-section { margin-bottom: 12px; }
    .filter-label { font-weight: 600; margin-bottom: 6px; display: block; font-size: 13px; color: #666; }
    .chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip {
      padding: 5px 12px;
      border-radius: 16px;
      cursor: pointer;
      font-size: 13px;
      background: #e8e8e8;
      border: none;
      transition: all 0.15s;
    }
    .chip:hover { background: #d8d8d8; }
    .chip.selected { background: #4a90d9; color: white; }
    .count { color: #666; margin-bottom: 15px; font-size: 14px; }
    .cards { display: grid; gap: 12px; }
    .card {
      background: white;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }
    .card-title {
      font-weight: 600;
      color: #333;
      cursor: pointer;
      text-decoration: none;
    }
    .card-title:hover { color: #4a90d9; text-decoration: underline; }
    .card-meta { font-size: 12px; color: #888; margin-top: 4px; }
    .card-desc { font-size: 14px; color: #555; margin-top: 8px; line-height: 1.4; }
    .load-more {
      display: block;
      width: 100%;
      padding: 12px;
      margin-top: 15px;
      background: #4a90d9;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
    .load-more:hover { background: #3a7bc8; }
  </style>
</head>
<body>
  <h1>Gatherer</h1>
  <input type="text" class="search-box" placeholder="Search ${cards.length} title cards..." id="search">
  <div class="filter-toggle" id="filterToggle">▶ Filters</div>
  <div class="filters" id="filters">
    <div class="filter-section">
      <span class="filter-label">Sections</span>
      <div class="chips" id="sectionChips"></div>
    </div>
    <div class="filter-section">
      <span class="filter-label">Categories</span>
      <div class="chips" id="categoryChips"></div>
    </div>
    <div class="filter-section">
      <span class="filter-label">Subcategories</span>
      <div class="chips" id="subcategoryChips"></div>
    </div>
  </div>
  <div class="count" id="count"></div>
  <div class="cards" id="cards"></div>
  <button class="load-more" id="loadMore" style="display:none">Load More</button>

  <script>
    const cards = ${JSON.stringify(cards)};
    const sections = ${JSON.stringify(sections)};
    const categories = ${JSON.stringify(categories)};
    const subcategories = ${JSON.stringify(subcategories)};

    let search = '';
    let showFilters = false;
    let selectedSections = [];
    let selectedCategories = [];
    let selectedSubcategories = [];
    let page = 0;
    const pageSize = 50;

    function toSlug(title) {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 100);
    }

    function filterCards() {
      return cards.filter(card => {
        if (search) {
          const s = search.toLowerCase();
          const matches = (card.title && card.title.toLowerCase().includes(s)) ||
                         (card.term && card.term.toLowerCase().includes(s)) ||
                         (card.description && card.description.toLowerCase().includes(s));
          if (!matches) return false;
        }
        if (selectedSections.length > 0 && !selectedSections.includes(card.section)) return false;
        if (selectedCategories.length > 0 && !selectedCategories.includes(card.category)) return false;
        if (selectedSubcategories.length > 0 && !selectedSubcategories.includes(card.subcategory)) return false;
        return true;
      });
    }

    function renderChips(container, items, selected, toggle) {
      container.innerHTML = items.map(item =>
        \`<button class="chip \${selected.includes(item) ? 'selected' : ''}" data-value="\${item}">\${item}</button>\`
      ).join('');
      container.querySelectorAll('.chip').forEach(chip => {
        chip.onclick = () => toggle(chip.dataset.value);
      });
    }

    function render() {
      const filtered = filterCards();
      const paged = filtered.slice(0, (page + 1) * pageSize);
      const hasMore = paged.length < filtered.length;

      document.getElementById('filterToggle').textContent =
        (showFilters ? '▼' : '▶') + ' Filters' +
        (selectedSections.length + selectedCategories.length + selectedSubcategories.length > 0
          ? ' (' + (selectedSections.length + selectedCategories.length + selectedSubcategories.length) + ' active)'
          : '');

      document.getElementById('filters').className = 'filters' + (showFilters ? ' show' : '');

      renderChips(document.getElementById('sectionChips'), sections, selectedSections, v => {
        selectedSections = selectedSections.includes(v) ? selectedSections.filter(x => x !== v) : [...selectedSections, v];
        page = 0; render();
      });
      renderChips(document.getElementById('categoryChips'), categories, selectedCategories, v => {
        selectedCategories = selectedCategories.includes(v) ? selectedCategories.filter(x => x !== v) : [...selectedCategories, v];
        page = 0; render();
      });
      renderChips(document.getElementById('subcategoryChips'), subcategories, selectedSubcategories, v => {
        selectedSubcategories = selectedSubcategories.includes(v) ? selectedSubcategories.filter(x => x !== v) : [...selectedSubcategories, v];
        page = 0; render();
      });

      document.getElementById('count').textContent = \`Showing \${paged.length} of \${filtered.length} cards\`;

      document.getElementById('cards').innerHTML = paged.map(card => \`
        <div class="card">
          <a class="card-title" href="/\${toSlug(card.title)}.html">\${card.title}</a>
          <div class="card-meta">\${[card.section, card.category, card.subcategory].filter(Boolean).join(' → ')}</div>
          \${card.description ? \`<div class="card-desc">\${card.description.substring(0, 200)}\${card.description.length > 200 ? '...' : ''}</div>\` : ''}
        </div>
      \`).join('');

      const loadMoreBtn = document.getElementById('loadMore');
      loadMoreBtn.style.display = hasMore ? 'block' : 'none';
      loadMoreBtn.textContent = \`Load More (\${filtered.length - paged.length} remaining)\`;
    }

    document.getElementById('search').oninput = e => { search = e.target.value; page = 0; render(); };
    document.getElementById('filterToggle').onclick = () => { showFilters = !showFilters; render(); };
    document.getElementById('loadMore').onclick = () => { page++; render(); };

    render();
  </script>
</body>
</html>`;

fs.writeFileSync(OUTPUT_PATH, html);
console.log(`Generated Gatherer HTML at: ${OUTPUT_PATH}`);
console.log(`Contains ${cards.length} title cards`);
console.log(`\nAccess at: http://localhost:3000/assets/gatherer.html`);
