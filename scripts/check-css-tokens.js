#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TOKEN_FILE = path.join(ROOT, 'app', 'globals.css');
const SCAN_DIRS = ['app', 'components', 'content', 'lib', 'scripts'];
const SCAN_EXTENSIONS = new Set(['.css', '.js', '.jsx', '.mdx', '.ts', '.tsx']);
const IGNORED_DIRS = new Set(['.git', '.next', '.turbo', 'node_modules']);

function walkFiles(directory, files = []) {
  if (!fs.existsSync(directory)) {
    return files;
  }

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        walkFiles(entryPath, files);
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

function readDefinedTokens() {
  const source = fs.readFileSync(TOKEN_FILE, 'utf8');
  const tokens = new Set();

  for (const match of source.matchAll(/(--[A-Za-z0-9_-]+)\s*:/g)) {
    tokens.add(match[1]);
  }

  return tokens;
}

function readTokenUsages(file) {
  const source = fs.readFileSync(file, 'utf8');
  const usages = [];

  for (const match of source.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)) {
    usages.push({
      token: match[1],
      line: lineNumberFor(source, match.index),
    });
  }

  return usages;
}

const definedTokens = readDefinedTokens();
const missing = [];

for (const dir of SCAN_DIRS) {
  for (const file of walkFiles(path.join(ROOT, dir))) {
    for (const usage of readTokenUsages(file)) {
      if (!definedTokens.has(usage.token)) {
        missing.push({
          ...usage,
          file: path.relative(ROOT, file),
        });
      }
    }
  }
}

if (missing.length === 0) {
  console.log(`[check-css-tokens] ${definedTokens.size} tokens defined; all var() usages resolve.`);
  process.exit(0);
}

console.error('[check-css-tokens] Undefined CSS token usage found:');
for (const usage of missing) {
  console.error(`- ${usage.token} at ${usage.file}:${usage.line}`);
}
console.error(
  `\nDefine missing tokens in ${path.relative(ROOT, TOKEN_FILE)} or replace the consumer.`
);
process.exit(1);
