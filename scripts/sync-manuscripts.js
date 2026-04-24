#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { parseManuscript } = require('../lib/manuscript-core.js');

const PROOFS_DIR = path.join(process.cwd(), 'public', 'proofs');
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'manuscripts.json');
const ELIGIBLE_EXTENSIONS = new Set(['.txt', '.md', '.eml']);
const CHECK_ONLY = process.argv.includes('--check');

function log(message) {
  console.log(`[sync-manuscripts] ${message}`);
}

function isHexDigestFilename(filename) {
  const extension = path.extname(filename);
  const basename = path.basename(filename, extension);

  return /^[a-f0-9]+$/i.test(basename);
}

function isEligibleProofFile(entry) {
  if (!entry.isFile()) {
    return false;
  }

  const extension = path.extname(entry.name).toLowerCase();

  return ELIGIBLE_EXTENSIONS.has(extension) && !isHexDigestFilename(entry.name);
}

function buildManifest() {
  if (!fs.existsSync(PROOFS_DIR)) {
    return null;
  }

  const entries = fs
    .readdirSync(PROOFS_DIR, { withFileTypes: true })
    .filter(isEligibleProofFile)
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  const manifest = {};

  for (const filename of entries) {
    const raw = fs.readFileSync(path.join(PROOFS_DIR, filename), 'utf8');
    manifest[filename] = parseManuscript(raw);
  }

  return {
    entries,
    json: `${JSON.stringify(manifest, null, 2)}\n`,
  };
}

function checkManifest(expectedJson) {
  if (!fs.existsSync(OUTPUT_PATH)) {
    console.error(
      '[sync-manuscripts] data/manuscripts.json is missing. Run npm run sync:manuscripts.'
    );
    process.exit(1);
  }

  const currentJson = fs.readFileSync(OUTPUT_PATH, 'utf8');

  if (currentJson !== expectedJson) {
    console.error(
      '[sync-manuscripts] data/manuscripts.json is stale. Run npm run sync:manuscripts and commit the result.'
    );
    process.exit(1);
  }

  log('data/manuscripts.json is up to date.');
}

function main() {
  const manifest = buildManifest();

  if (!manifest) {
    log('No public/proofs directory found, skipping.');
    process.exit(0);
  }

  if (CHECK_ONLY) {
    checkManifest(manifest.json);
    return;
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, manifest.json, 'utf8');
  log(`Synced ${manifest.entries.length} manuscript entries into data/manuscripts.json.`);
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
