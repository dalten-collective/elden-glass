#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const matter = require('gray-matter');

const CONTENT_DIR = path.join(process.cwd(), 'content');
const EXCLUDED_ROUTES = new Set([
  // These are sealed/provenance-sensitive publication dates, not ordinary
  // editorial freshness dates. Extend this list deliberately for future
  // attested documents rather than deriving exclusions heuristically.
  '/initial-thesis',
  '/tldr',
]);

function listMdxFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listMdxFiles(entryPath);
      return entry.isFile() && /\.mdx?$/.test(entry.name) ? [entryPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function routeForContentFile(filePath) {
  const relative = path.relative(path.join(CONTENT_DIR, 'pages'), filePath).replace(/\\/g, '/');
  if (!relative.startsWith('..')) {
    return `/${relative.replace(/\.mdx?$/, '')}`;
  }

  const critiqueRelative = path
    .relative(path.join(CONTENT_DIR, 'critiques'), filePath)
    .replace(/\\/g, '/');
  if (!critiqueRelative.startsWith('..')) {
    return `/critiques/${critiqueRelative.replace(/\.mdx?$/, '')}`;
  }

  return null;
}

function normalizeFrontmatterDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.valueOf())) return parsed.toISOString().slice(0, 10);
  }

  return null;
}

function latestCommitDateForFile(filePath) {
  try {
    const output = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', path.relative(process.cwd(), filePath)],
      { encoding: 'utf8' }
    ).trim();

    return output || null;
  } catch (error) {
    return null;
  }
}

function compareDateOnly(leftDate, rightIsoDateTime) {
  const rightDate = rightIsoDateTime.slice(0, 10);
  return leftDate.localeCompare(rightDate);
}

const files = [
  ...listMdxFiles(path.join(CONTENT_DIR, 'pages')),
  ...listMdxFiles(path.join(CONTENT_DIR, 'critiques')),
];

const checked = [];
const excluded = [];
const missingUpdated = [];
const stale = [];

for (const filePath of files) {
  const route = routeForContentFile(filePath);
  const relativePath = path.relative(process.cwd(), filePath);
  const parsed = matter(fs.readFileSync(filePath, 'utf8'));
  const updated = normalizeFrontmatterDate(parsed.data.updated);

  if (route && EXCLUDED_ROUTES.has(route)) {
    excluded.push({ file: relativePath, route, updated });
    continue;
  }

  if (!updated) {
    missingUpdated.push({ file: relativePath, route });
    continue;
  }

  const latestCommitDate = latestCommitDateForFile(filePath);
  const row = { file: relativePath, route, updated, latestCommitDate };
  checked.push(row);

  if (latestCommitDate && compareDateOnly(updated, latestCommitDate) < 0) {
    stale.push(row);
  }
}

const report = {
  checked: checked.length,
  stale: stale.length,
  excluded: excluded.length,
  missingUpdated: missingUpdated.length,
  staleFiles: stale,
  excludedFiles: excluded,
  missingUpdatedFiles: missingUpdated,
};

console.log('Content updated-date drift report');
console.log('=================================');
console.log(`Checked files: ${report.checked}`);
console.log(`Potentially stale updated dates: ${report.stale}`);
console.log(`Excluded files: ${report.excluded}`);
console.log(`Files without updated frontmatter: ${report.missingUpdated}`);

if (stale.length > 0) {
  console.log('\nPotential drift:');
  for (const item of stale) {
    console.log(
      `- ${item.file}: frontmatter updated=${item.updated}, latest commit=${item.latestCommitDate.slice(0, 10)}`
    );
  }
}

if (missingUpdated.length > 0) {
  console.log('\nFiles without updated frontmatter:');
  for (const item of missingUpdated) {
    console.log(`- ${item.file}`);
  }
}

console.log('\nJSON report:');
console.log(JSON.stringify(report, null, 2));

// This is intentionally report-only for now. Do not fail CI until the project
// has reviewed false positives and decided the signal is strict enough.
