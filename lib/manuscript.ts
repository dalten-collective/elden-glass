import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface ParsedManuscript {
  header: string | null;
  body: string;
}

const EMAIL_MASK_PATTERN = / *<[^>\s]+@[^>\s]+>/g;
const HEADER_PATTERN = /^-{5,}[^\n]*\n(?:(?:From|Date|Subject|To):[^\n]*\n?)+/;

/**
 * Masks private email addresses and splits a manuscript into header/body
 * sections when it starts with a forwarded-email block.
 */
export function parseManuscript(raw: string): ParsedManuscript {
  const masked = raw.replace(EMAIL_MASK_PATTERN, '').trim();
  const match = masked.match(HEADER_PATTERN);

  if (!match) {
    return {
      header: null,
      body: masked,
    };
  }

  return {
    header: match[0].trim(),
    body: masked.slice(match[0].length).trim(),
  };
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
