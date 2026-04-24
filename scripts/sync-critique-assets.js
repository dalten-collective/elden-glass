#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const SOURCE_DIR = path.join(process.cwd(), 'content', 'critique-images');
const DEST_DIR = path.join(process.cwd(), 'public', 'images', 'critiques');
const CHECK_ONLY = process.argv.includes('--check');

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

function listFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = [];

  function walk(currentDirectory) {
    for (const entry of fs.readdirSync(currentDirectory, { withFileTypes: true })) {
      const entryPath = path.join(currentDirectory, entry.name);

      if (entry.isDirectory()) {
        walk(entryPath);
        continue;
      }

      if (entry.isFile()) {
        files.push(path.relative(directory, entryPath).replace(/\\/g, '/'));
      }
    }
  }

  walk(directory);
  return files.sort((left, right) => left.localeCompare(right));
}

function sameFileContents(leftPath, rightPath) {
  if (!fs.existsSync(rightPath)) {
    return false;
  }

  return fs.readFileSync(leftPath).equals(fs.readFileSync(rightPath));
}

function checkSyncedAssets() {
  const sourceFiles = listFiles(SOURCE_DIR);
  const destFiles = listFiles(DEST_DIR);
  const sourceList = sourceFiles.join('\n');
  const destList = destFiles.join('\n');

  if (sourceList !== destList) {
    console.error(
      '[sync-critique-assets] public/images/critiques does not match content/critique-images. Run npm run sync:critique-assets and commit the result.'
    );
    process.exit(1);
  }

  for (const file of sourceFiles) {
    const sourcePath = path.join(SOURCE_DIR, file);
    const destPath = path.join(DEST_DIR, file);

    if (!sameFileContents(sourcePath, destPath)) {
      console.error(
        `[sync-critique-assets] public/images/critiques/${file} is stale. Run npm run sync:critique-assets and commit the result.`
      );
      process.exit(1);
    }
  }

  log('public/images/critiques is up to date.');
}

if (!fs.existsSync(SOURCE_DIR)) {
  log('No critique-images directory found, skipping.');
  process.exit(0);
}

if (CHECK_ONLY) {
  checkSyncedAssets();
  process.exit(0);
}

fs.rmSync(DEST_DIR, { recursive: true, force: true });
fs.mkdirSync(DEST_DIR, { recursive: true });
copyRecursive(SOURCE_DIR, DEST_DIR);
log('Synced critique assets into public/images/critiques.');
