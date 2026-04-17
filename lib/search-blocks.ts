import { toString } from 'mdast-util-to-string';
import type { Content, Root } from 'mdast';
import { unified } from 'unified';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';

export type SearchableBlock = {
  id: string;
  text: string;
};

/**
 * Normalizes searchable block text so IDs and duplicate tracking are stable
 * across indexing and rendering.
 */
export function normalizeSearchBlockText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Returns the next deterministic block ID for a block of text within one
 * document. Duplicate blocks receive a numeric suffix in encounter order.
 */
export function getNextSearchBlockId(text: string, seenCounts: Map<string, number>): string {
  const normalized = normalizeSearchBlockText(text);
  const nextOccurrence = (seenCounts.get(normalized) ?? 0) + 1;
  seenCounts.set(normalized, nextOccurrence);

  const slug = slugifySearchBlockText(normalized);
  return nextOccurrence === 1 ? `block-${slug}` : `block-${slug}-${nextOccurrence}`;
}

/**
 * Extracts the searchable prose/list blocks from raw MDX in document order so
 * the search index can link to stable block anchors.
 */
export function extractSearchableBlocks(raw: string): SearchableBlock[] {
  const tree = unified().use(remarkParse).use(remarkMdx).use(remarkGfm).parse(raw) as Root;
  const blocks: SearchableBlock[] = [];
  const seenCounts = new Map<string, number>();

  collectSearchableBlocks(tree.children, blocks, seenCounts, { insideListItem: false });

  return blocks;
}

function collectSearchableBlocks(
  nodes: Content[],
  blocks: SearchableBlock[],
  seenCounts: Map<string, number>,
  context: { insideListItem: boolean }
) {
  for (const node of nodes) {
    if (node.type === 'listItem') {
      const text = normalizeSearchBlockText(toString(node));

      if (text.length > 0) {
        blocks.push({
          id: getNextSearchBlockId(text, seenCounts),
          text,
        });
      }

      collectChildBlocks(node, blocks, seenCounts, { insideListItem: true });
      continue;
    }

    if (node.type === 'paragraph' && !context.insideListItem) {
      const text = normalizeSearchBlockText(toString(node));

      if (text.length > 0) {
        blocks.push({
          id: getNextSearchBlockId(text, seenCounts),
          text,
        });
      }

      continue;
    }

    collectChildBlocks(node, blocks, seenCounts, context);
  }
}

function collectChildBlocks(
  node: Content,
  blocks: SearchableBlock[],
  seenCounts: Map<string, number>,
  context: { insideListItem: boolean }
) {
  if (!('children' in node) || !Array.isArray(node.children)) {
    return;
  }

  collectSearchableBlocks(node.children as Content[], blocks, seenCounts, context);
}

function slugifySearchBlockText(text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/['’"]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 72);

  return slug || 'content';
}
