import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import manuscriptCore from './manuscript-core.js';

export interface ParsedManuscript {
  header: string | null;
  body: string;
}

const { parseManuscript: parseManuscriptCore } = manuscriptCore as {
  parseManuscript(raw: string): ParsedManuscript;
};

/**
 * Masks private email addresses and splits a manuscript into header/body
 * sections when it starts with a forwarded-email block.
 */
export function parseManuscript(raw: string): ParsedManuscript {
  return parseManuscriptCore(raw);
}

/**
 * Reads a manuscript from `public/proofs/` and returns the parsed display
 * payload used by the MDX rendering surface.
 */
export function loadManuscriptFromDisk(filename: string): ParsedManuscript {
  const filePath = join(process.cwd(), 'public', 'proofs', filename);
  const raw = readFileSync(filePath, 'utf8');

  return parseManuscript(raw);
}
