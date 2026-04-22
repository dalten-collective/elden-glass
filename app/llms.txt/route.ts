import { NextResponse } from 'next/server';

import { allContentPagesSorted, getCritiques } from '@/lib/content';
import { buildSidebar, type NavItem, type NavLinkItem, type NavSectionItem } from '@/lib/sidebar';

/**
 * /llms.txt — the llmstxt.org-spec discovery file.
 *
 * Replaces the previous procedural-prose blob with a proper sectioned
 * link list: H1 + blockquote summary + ## sections of [link](url):
 * description entries. The link list is built dynamically from the
 * site's content tree and sidebar, so editing content updates this
 * file automatically.
 *
 * The companion /llms-full.txt holds the full content dumps; this file
 * is just the index. Both follow the spec at https://llmstxt.org.
 */
export const dynamic = 'force-static';

const SITE_URL = 'https://eldenglass.com';

const SUMMARY = `> A scholarly-pataphysical research site arguing that FromSoftware's Elden Ring is a literal performance of Marcel Duchamp's The Bride Stripped Bare by Her Bachelors, Even (The Large Glass). Discovery attested on Ethereum (EAS) on 17 Nov 2025 and timestamped on Bitcoin (OpenTimestamps) on 21 Nov 2025.

> Voice: serious about the argument, willing to take imaginary solutions seriously, suspicious of pattern-matching shortcuts.`;

const AGENT_SURFACES: Array<{ path: string; description: string }> = [
  {
    path: '/contents',
    description:
      'Browser-friendly HTML index of every readable page. Use when you can fetch HTML but not JSON endpoints.',
  },
  {
    path: '/llms-full.txt',
    description:
      'Single text/plain dump of every static page concatenated as clean plaintext (JSX stripped). Use for one-shot context.',
  },
  {
    path: '/skill',
    description:
      'Claude Code-style installable skill with reader profiles by interest and JSON API documentation. Use if your harness supports skills.',
  },
  {
    path: '/api/llms/toc',
    description:
      'JSON inventory: { site, generatedAt, entries: [...] } with kind, summary, readability, and metadata for every route. The strictest, canonical surface — prefer this when you can.',
  },
  {
    path: '/api/llms/article',
    description:
      'Per-page clean plaintext. Query params: path, page. 30000-char pages; iterate until nextPage is null. The strictest, canonical surface — prefer this when you can.',
  },
];

export async function GET() {
  const sidebar = buildSidebar();
  const summaries = buildSummaryIndex();

  const lines: string[] = [];
  lines.push('# Elden Glass');
  lines.push('');
  lines.push(SUMMARY);
  lines.push('');

  // Primary documents — the headline reading list.
  lines.push('## Primary');
  lines.push('');
  for (const link of sidebar.primary) {
    if (link.href === '/') continue; // The home page is the file's context, not a destination.
    appendLink(lines, link, summaries);
  }
  lines.push('');

  // Agent-surface endpoints — these are the meta-API.
  lines.push('## For agents');
  lines.push('');
  for (const surface of AGENT_SURFACES) {
    lines.push(`- [${surface.path}](${SITE_URL}${surface.path}): ${surface.description}`);
  }
  lines.push('');

  // Each Errata section gets its own H2, mirroring the Stair sidebar.
  for (const item of sidebar.secondary) {
    appendSecondaryItem(lines, item, summaries);
  }

  // Optional — deep cuts and orienting reads.
  lines.push('## Optional');
  lines.push('');
  lines.push(`- [Author profile](${SITE_URL}/author/about): the site's curator (~dashus-navnul).`);
  lines.push(
    `- [Bibliography](${SITE_URL}/scratch-writings/bibliography): primary sources used throughout the work.`
  );
  lines.push('');

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

function appendSecondaryItem(lines: string[], item: NavItem, summaries: Map<string, string>): void {
  if (item.type === 'link') {
    // A bare link in the secondary stack — emit as a standalone "## Label" with one entry.
    lines.push(`## ${item.label}`);
    lines.push('');
    appendLink(lines, item, summaries);
    lines.push('');
    return;
  }

  if (item.type === 'group') {
    for (const child of item.children) {
      appendSecondaryItem(lines, child, summaries);
    }
    return;
  }

  appendSectionAsH2(lines, item, summaries);
}

function appendSectionAsH2(
  lines: string[],
  section: NavSectionItem,
  summaries: Map<string, string>
): void {
  lines.push(`## ${section.label}`);
  lines.push('');

  if (section.children.length === 0) {
    lines.push(`> ${section.emptyLabel ?? 'No entries.'}`);
    lines.push('');
    return;
  }

  for (const child of section.children) {
    if (child.type === 'link') {
      appendLink(lines, child, summaries);
    } else if (child.type === 'section') {
      // Nested section — emit children inline with a sub-bullet header.
      lines.push(`- **${child.label}**`);
      for (const grand of child.children) {
        if (grand.type === 'link') {
          appendLink(lines, grand, summaries, '  ');
        }
      }
    } else if (child.type === 'group') {
      for (const grand of child.children) {
        if (grand.type === 'link') {
          appendLink(lines, grand, summaries);
        }
      }
    }
  }

  lines.push('');
}

function appendLink(
  lines: string[],
  link: NavLinkItem,
  summaries: Map<string, string>,
  indent = ''
): void {
  const url = link.external ? link.href : `${SITE_URL}${link.href}`;
  const summary = summaries.get(link.href);
  const trailer = summary ? `: ${summary}` : '';
  lines.push(`${indent}- [${link.label}](${url})${trailer}`);
}

/** Builds a url → summary map from every readable doc on the site. */
function buildSummaryIndex(): Map<string, string> {
  const map = new Map<string, string>();

  for (const doc of allContentPagesSorted()) {
    if (doc.summary) {
      map.set(doc.url, doc.summary);
    }
  }

  for (const critique of getCritiques()) {
    if (critique.summary) {
      map.set(`/critiques/${critique.slug}`, critique.summary);
    }
  }

  return map;
}
