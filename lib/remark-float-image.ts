import { visitParents } from 'unist-util-visit-parents';
import type { Image, Parent } from 'mdast';

type FloatMeta = {
  caption?: string;
  align?: 'left' | 'right' | 'center';
  width?: number;
};

function parseMeta(raw?: string): FloatMeta | null {
  if (!raw) return null;
  const segments = raw
    .split('|')
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (!segments.length) return null;

  const caption = segments.shift();
  const meta: FloatMeta = { caption };

  segments.forEach((segment) => {
    const [key, value] = segment.split(':').map((piece) => piece.trim());
    if (!key || !value) return;
    const normalized = key.toLowerCase();
    if (normalized === 'float' || normalized === 'align') {
      if (value === 'left' || value === 'right' || value === 'center') {
        meta.align = value;
      }
    }
    if (normalized === 'width') {
      const parsedWidth = parseInt(value.replace(/[^0-9]/g, ''), 10);
      if (!Number.isNaN(parsedWidth)) {
        meta.width = parsedWidth;
      }
    }
  });

  if (!meta.align && !meta.width) {
    return null;
  }

  return meta;
}

export function remarkFloatImages() {
  return (tree: Parent) => {
    visitParents(tree, 'image', (node: Image, ancestors) => {
      const parent = ancestors[ancestors.length - 1] as Parent | undefined;
      if (!parent) return;
      const index = parent.children.indexOf(node);
      if (index === -1) return;

      const meta = parseMeta(node.title || undefined);
      if (!meta) return;

      const floatElement = {
        type: 'mdxJsxFlowElement',
        name: 'FloatImage',
        attributes: [
          { type: 'mdxJsxAttribute', name: 'src', value: node.url },
          { type: 'mdxJsxAttribute', name: 'alt', value: node.alt || '' },
          meta.align ? { type: 'mdxJsxAttribute', name: 'align', value: meta.align } : null,
        ].filter(Boolean),
        children: meta.caption ? [{ type: 'text', value: meta.caption }] : [],
      } as Parent;

      if (parent.type === 'paragraph') {
        const grandparent = ancestors[ancestors.length - 2] as Parent | undefined;
        if (grandparent) {
          const parentIndex = grandparent.children.indexOf(parent as any);
          if (parentIndex !== -1) {
            grandparent.children.splice(parentIndex, 1, floatElement as any);
            return;
          }
        }
      }

      parent.children.splice(index, 1, floatElement as any);
    });
  };
}
