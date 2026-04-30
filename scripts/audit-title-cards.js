#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CARD_PATH = path.join(process.cwd(), 'data', 'title-cards.json');
const SHORT_DESCRIPTION_LIMIT = 35;

function normalize(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function groupBy(cards, field) {
  const groups = new Map();
  for (const card of cards) {
    const key = normalize(card[field]);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(card);
  }
  return [...groups.entries()].filter(([, group]) => group.length > 1);
}

function isImportedStub(card) {
  return typeof card.section === 'string' && card.section.startsWith('Elden Ring');
}

function summarize(group) {
  return group.map((card) => ({
    id: card.id,
    title: card.title,
    term: card.term,
    section: card.section ?? null,
    category: card.category ?? null,
    subcategory: card.subcategory ?? null,
    descriptionLength: card.description ? card.description.trim().length : 0,
  }));
}

const database = JSON.parse(fs.readFileSync(CARD_PATH, 'utf8'));
const cards = database.cards;
const duplicateTitles = groupBy(cards, 'title');
const duplicateTerms = groupBy(cards, 'term');
const missingClassification = cards.filter((card) => !card.section || !card.category);
const shortDescriptions = cards.filter(
  (card) => !card.description || card.description.trim().length < SHORT_DESCRIPTION_LIMIT
);
const shortDescriptionsNeedingReview = shortDescriptions.filter((card) => !isImportedStub(card));

const report = {
  generatedAt: new Date().toISOString(),
  totalCards: cards.length,
  duplicateExactTitleClusters: duplicateTitles.length,
  duplicateExactTermClusters: duplicateTerms.length,
  missingSectionOrCategory: missingClassification.length,
  nullOrShortDescriptions: shortDescriptions.length,
  nullOrShortDescriptionsExcludingImportedStubs: shortDescriptionsNeedingReview.length,
  duplicateTitles: duplicateTitles.map(([value, group]) => ({ value, cards: summarize(group) })),
  duplicateTerms: duplicateTerms.map(([value, group]) => ({ value, cards: summarize(group) })),
  missingClassification: summarize(missingClassification),
  shortDescriptionsNeedingReview: summarize(shortDescriptionsNeedingReview),
};

console.log(JSON.stringify(report, null, 2));

if (process.argv.includes('--fail-on-duplicate-titles') && duplicateTitles.length > 0) {
  process.exitCode = 1;
}
