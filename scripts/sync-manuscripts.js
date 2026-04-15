#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const PROOFS_DIR = path.join(process.cwd(), 'public', 'proofs');
const OUTPUT_PATH = path.join(process.cwd(), 'data', 'manuscripts.json');
const ELIGIBLE_EXTENSIONS = new Set(['.txt', '.md', '.eml']);

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

async function main() {
  if (!fs.existsSync(PROOFS_DIR)) {
    log('No public/proofs directory found, skipping.');
    process.exit(0);
  }

  const manuscriptModuleUrl = pathToFileURL(path.join(process.cwd(), 'lib', 'manuscript.ts')).href;
  const { loadManuscriptFromDisk } = await import(manuscriptModuleUrl);

  const entries = fs
    .readdirSync(PROOFS_DIR, { withFileTypes: true })
    .filter(isEligibleProofFile)
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  const manifest = {};

  for (const filename of entries) {
    manifest[filename] = loadManuscriptFromDisk(filename);
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  log(`Synced ${entries.length} manuscript entries into data/manuscripts.json.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
