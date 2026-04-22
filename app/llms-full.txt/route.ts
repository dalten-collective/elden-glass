import { NextResponse } from 'next/server';

import { allContentPagesSorted, getCritiques } from '@/lib/content';
import { mdxToPlain } from '@/lib/mdx-to-plain';

/**
 * /llms-full.txt — the llmstxt.org spec's recommended companion to
 * /llms.txt. A single text/plain response that concatenates the clean
 * plaintext body of every readable page on the site, separated by a
 * `# <url>` heading and a horizontal rule. Designed for agents that
 * prefer to slurp the whole corpus into a single message rather than
 * follow per-page links.
 *
 * Bodies are run through mdxToPlain so the output is JSX-free.
 *
 * Force-static so the file is generated once per deploy rather than
 * per request.
 */
export const dynamic = 'force-static';

const SUMMARY = [
  '# Elden Glass — full content dump',
  '',
  "> A research site arguing that FromSoftware's Elden Ring is a literal",
  "> performance of Marcel Duchamp's The Bride Stripped Bare by Her",
  '> Bachelors, Even (The Large Glass).',
  '',
  '> This file is the llmstxt.org-spec companion to /llms.txt — every',
  '> readable page concatenated as clean plaintext, JSX stripped. For',
  '> per-page navigation use /contents (HTML) or /api/llms/toc (JSON).',
  '',
].join('\n');

export async function GET() {
  const sections: string[] = [SUMMARY];

  for (const doc of allContentPagesSorted()) {
    sections.push(`# ${doc.url}`);
    sections.push(`> ${doc.title}`);
    if (doc.summary) {
      sections.push(`> ${doc.summary}`);
    }
    sections.push('');
    sections.push(mdxToPlain(doc.body.raw, { slug: doc.slug }));
    sections.push('---');
    sections.push('');
  }

  for (const critique of getCritiques()) {
    const url = `/critiques/${critique.slug}`;
    sections.push(`# ${url}`);
    sections.push(`> ${critique.title}`);
    if (critique.summary) {
      sections.push(`> ${critique.summary}`);
    }
    sections.push('');
    sections.push(mdxToPlain(critique.body.raw, { slug: critique.slug }));
    sections.push('---');
    sections.push('');
  }

  return new NextResponse(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
