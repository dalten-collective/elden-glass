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

/**
 * Adds search-result anchors to rendered MDX using the same traversal that
 * builds the search index. Doing this during compilation keeps SSR and client
 * hydration from recalculating block IDs independently.
 */
export function remarkSearchBlocks() {
  return (tree: Root) => {
    const seenCounts = new Map<string, number>();
    collectSearchableBlocks(tree.children, [], seenCounts, { insideListItem: false }, addBlockId);
  };
}

type SearchBlockVisitor = (node: Content, block: SearchableBlock) => void;

function collectSearchableBlocks(
  nodes: Content[],
  blocks: SearchableBlock[],
  seenCounts: Map<string, number>,
  context: { insideListItem: boolean },
  visitor?: SearchBlockVisitor
) {
  for (const node of nodes) {
    if (node.type === 'listItem') {
      const text = normalizeSearchBlockText(toString(node));

      if (text.length > 0) {
        const block = {
          id: getNextSearchBlockId(text, seenCounts),
          text,
        };
        blocks.push(block);
        visitor?.(node, block);
      }

      collectChildBlocks(node, blocks, seenCounts, { insideListItem: true }, visitor);
      continue;
    }

    if (node.type === 'paragraph' && !context.insideListItem) {
      const text = normalizeSearchBlockText(toString(node));

      if (text.length > 0) {
        const block = {
          id: getNextSearchBlockId(text, seenCounts),
          text,
        };
        blocks.push(block);
        visitor?.(node, block);
      }

      continue;
    }

    collectChildBlocks(node, blocks, seenCounts, context, visitor);
  }
}

function collectChildBlocks(
  node: Content,
  blocks: SearchableBlock[],
  seenCounts: Map<string, number>,
  context: { insideListItem: boolean },
  visitor?: SearchBlockVisitor
) {
  if (!('children' in node) || !Array.isArray(node.children)) {
    return;
  }

  collectSearchableBlocks(node.children as Content[], blocks, seenCounts, context, visitor);
}

function addBlockId(node: Content, block: SearchableBlock) {
  const nodeWithData = node as Content & {
    data?: {
      hProperties?: Record<string, unknown>;
    };
  };

  nodeWithData.data = nodeWithData.data ?? {};
  nodeWithData.data.hProperties = {
    ...nodeWithData.data.hProperties,
    id: block.id,
    'data-search-block': 'true',
  };
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
