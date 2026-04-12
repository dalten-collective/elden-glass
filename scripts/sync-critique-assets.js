#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(process.cwd(), 'content', 'critique-images');
const DEST_DIR = path.join(process.cwd(), 'public', 'images', 'critiques');

function log(message) {
  console.log(`[sync-critique-assets] ${message}`);
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else if (stats.isFile()) {
    fs.copyFileSync(src, dest);
  }
}

if (!fs.existsSync(SOURCE_DIR)) {
  log('No critique-images directory found, skipping.');
  process.exit(0);
}

fs.rmSync(DEST_DIR, { recursive: true, force: true });
fs.mkdirSync(DEST_DIR, { recursive: true });
copyRecursive(SOURCE_DIR, DEST_DIR);
log('Synced critique assets into public/images/critiques.');
