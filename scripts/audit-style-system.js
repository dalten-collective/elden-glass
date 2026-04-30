#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TOKEN_FILE = path.join(ROOT, 'app', 'globals.css');
const SCAN_TARGETS = ['app', 'components', 'content', 'lib', 'scripts', 'tailwind.config.mjs'];
const SCAN_EXTENSIONS = new Set(['.css', '.js', '.jsx', '.md', '.mdx', '.ts', '.tsx', '.mjs']);
const IGNORED_DIRS = new Set(['.git', '.next', '.turbo', 'node_modules']);
const EXCLUDED_FILES = new Set([path.relative(ROOT, TOKEN_FILE), 'scripts/audit-style-system.js']);

const LEGACY_TOKENS = [
  '--font-crimson',
  '--font-inter',
  '--bg-primary',
  '--bg-secondary',
  '--bg-tertiary',
  '--bg-elevated',
  '--text-primary',
  '--text-secondary',
  '--text-tertiary',
  '--accent-gold',
  '--accent-gold-hover',
  '--accent-blue',
  '--accent-purple',
  '--accent-muted',
  '--accent-red',
  '--border-subtle',
  '--border-emphasis',
  '--success-green',
  '--bg-primary-rgb',
  '--bg-secondary-rgb',
  '--accent-gold-rgb',
  '--accent-blue-rgb',
  '--accent-purple-rgb',
  '--success-green-rgb',
];

const DELAY_PRIMITIVES = [
  'pane',
  'pane--solid',
  'plate',
  'plate-no',
  'plate-cap',
  'eyebrow',
  'eyebrow--gold',
  'eyebrow--rust',
  'eyebrow--blue',
  'spec',
  'cap',
  'lead',
  'quote',
  'quote-body',
  'quote-attr',
  'margin-note',
  'attest',
  'correspondence',
  'crackline',
  'crackline--gold',
  'seal-strip',
  'stair',
  'delay-h1',
  'delay-h2',
  'delay-h3',
  'delay-h4',
];

const COLOR_UTILITY_PATTERN =
  /\b(?:hover:|focus:|focus-visible:|active:|disabled:|group-hover:|sm:|md:|lg:|xl:|2xl:|dark:)*(?:bg|text|border|ring|from|via|to|fill|stroke|decoration|placeholder)-((?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}|black|white)\b/g;

function walkFiles(target, files = []) {
  const fullTarget = path.join(ROOT, target);
  if (!fs.existsSync(fullTarget)) {
    return files;
  }

  const stat = fs.statSync(fullTarget);
  if (stat.isFile()) {
    if (SCAN_EXTENSIONS.has(path.extname(fullTarget))) {
      files.push(fullTarget);
    }
    return files;
  }

  for (const entry of fs.readdirSync(fullTarget, { withFileTypes: true })) {
    const entryPath = path.join(fullTarget, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        walkFiles(path.relative(ROOT, entryPath), files);
      }
      continue;
    }

    if (entry.isFile() && SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

function lineNumberFor(source, index) {
  return source.slice(0, index).split('\n').length;
}

function compactSnippet(line) {
  return line.trim().replace(/\s+/g, ' ').slice(0, 160);
}

function lineAt(source, lineNumber) {
  return source.split('\n')[lineNumber - 1] ?? '';
}

function pushMatch(results, kind, file, line, value, source) {
  results.push({
    kind,
    file,
    line,
    value,
    source: compactSnippet(lineAt(source, line)),
  });
}

function collectRegexMatches(source, regex, callback) {
  regex.lastIndex = 0;
  for (const match of source.matchAll(regex)) {
    callback(match);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function auditFile(file) {
  const relativeFile = path.relative(ROOT, file);
  const source = fs.readFileSync(file, 'utf8');
  const results = [];

  if (!EXCLUDED_FILES.has(relativeFile)) {
    const legacyAlternates = [...LEGACY_TOKENS]
      .sort((left, right) => right.length - left.length)
      .map(escapeRegExp)
      .join('|');
    const legacyPattern = new RegExp(`var\\(\\s*(${legacyAlternates})(?=[\\s,)])`, 'g');
    collectRegexMatches(source, legacyPattern, (match) => {
      pushMatch(
        results,
        'legacy-token',
        relativeFile,
        lineNumberFor(source, match.index),
        match[1],
        source
      );
    });
  }

  if (!EXCLUDED_FILES.has(relativeFile)) {
    collectRegexMatches(source, /style\s*=\s*\{\{/g, (match) => {
      pushMatch(
        results,
        'inline-style',
        relativeFile,
        lineNumberFor(source, match.index),
        'style={{ ... }}',
        source
      );
    });
  }

  if (!EXCLUDED_FILES.has(relativeFile)) {
    collectRegexMatches(source, /#[0-9A-Fa-f]{3,8}\b|\b(?:rgba?|hsla?)\(/g, (match) => {
      pushMatch(
        results,
        'raw-color',
        relativeFile,
        lineNumberFor(source, match.index),
        match[0],
        source
      );
    });

    collectRegexMatches(source, COLOR_UTILITY_PATTERN, (match) => {
      pushMatch(
        results,
        'tailwind-color-utility',
        relativeFile,
        lineNumberFor(source, match.index),
        match[0],
        source
      );
    });
  }

  if (!EXCLUDED_FILES.has(relativeFile)) {
    const lines = source.split('\n');
    lines.forEach((line, index) => {
      const namesSurface =
        line.includes('glass-card') ||
        (line.includes('border') && (line.includes('bg-[var(') || line.includes('bg-[rgb(var(')));
      const alreadyDelayPrimitive = /\b(?:pane|plate|attest|quote|margin-note)\b/.test(line);
      if (namesSurface && !alreadyDelayPrimitive) {
        results.push({
          kind: 'hand-rolled-surface',
          file: relativeFile,
          line: index + 1,
          value: 'surface recipe',
          source: compactSnippet(line),
        });
      }
    });
  }

  const primitiveAlternates = [...DELAY_PRIMITIVES]
    .sort((left, right) => right.length - left.length)
    .map(escapeRegExp)
    .join('|');
  const primitivePattern = new RegExp(`\\b(${primitiveAlternates})\\b`, 'g');
  collectRegexMatches(source, primitivePattern, (match) => {
    if (!EXCLUDED_FILES.has(relativeFile)) {
      pushMatch(
        results,
        'delay-primitive',
        relativeFile,
        lineNumberFor(source, match.index),
        match[1],
        source
      );
    }
  });

  return results;
}

function groupBy(items, key) {
  const groups = new Map();
  for (const item of items) {
    const groupKey = item[key];
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), item]);
  }
  return groups;
}

function printCategory(title, items, options = {}) {
  const { sampleLimit = 8, positive = false } = options;
  const byFile = groupBy(items, 'file');
  const label = positive ? 'present' : 'found';
  console.log(`\n${title}: ${items.length} ${label} across ${byFile.size} files`);

  if (items.length === 0) {
    return;
  }

  const rankedFiles = [...byFile.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [file, fileItems] of rankedFiles.slice(0, sampleLimit)) {
    const first = fileItems[0];
    console.log(`- ${file}: ${fileItems.length} (first ${first.line}: ${first.value})`);
  }
}

const files = SCAN_TARGETS.flatMap((target) => walkFiles(target));
const allResults = files.flatMap(auditFile);
const byKind = groupBy(allResults, 'kind');

const driftKinds = [
  'legacy-token',
  'inline-style',
  'raw-color',
  'tailwind-color-utility',
  'hand-rolled-surface',
];

const driftTotal = driftKinds.reduce((total, kind) => total + (byKind.get(kind)?.length ?? 0), 0);

console.log('[style-system-audit] Non-failing Delay in Glass drift report');
console.log(`Scanned ${files.length} files.`);
console.log(`Excluded canonical definitions: ${[...EXCLUDED_FILES].join(', ')}`);
console.log(`Total drift signals: ${driftTotal}`);

printCategory('Legacy token usages', byKind.get('legacy-token') ?? []);
printCategory('Inline style objects', byKind.get('inline-style') ?? []);
printCategory('Raw color literals', byKind.get('raw-color') ?? []);
printCategory('Non-system Tailwind color utilities', byKind.get('tailwind-color-utility') ?? []);
printCategory('Hand-rolled surfaces', byKind.get('hand-rolled-surface') ?? []);
printCategory('Delay primitive usages', byKind.get('delay-primitive') ?? [], { positive: true });

console.log('\nThis audit reports drift only; it does not fail CI.');
