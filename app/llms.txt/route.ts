import { NextResponse } from 'next/server';

const llmsText = `# Elden Glass

Elden Glass is a research site arguing that Elden Ring is a digital reimagining of Marcel Duchamp's The Bride Stripped Bare by Her Bachelors, Even (The Large Glass).

Use this site through the LLM surface as follows:

1. Fetch /api/llms/toc first.
2. Read the returned entries array.
3. For entries where readable=true, fetch /api/llms/article?path=<entry.path>&page=1.
4. Continue paging with the same path and page=2, page=3, and so on until nextPage is null.

Contract details:

- /api/llms/toc returns JSON with the site's canonical LLM route inventory.
- Each ToC entry includes path, title, summary, kind, readable, format, sourceType, and updated.
- readable=true entries are MDX-backed documents retrievable through /api/llms/article.
- /api/llms/article returns raw MDX body content, not rendered HTML.
- /api/llms/article pages content at a maximum of 30000 characters per page.
- Interactive and index routes may appear in the ToC with readable=false. Those routes should be navigated directly by a human user or browser rather than fetched through /api/llms/article.

Important route kinds:

- content: a readable MDX article or critique document.
- interactive: a bespoke page with client-side behavior or structured UI rather than a single article body.
- index: a listing or landing page that does not have one canonical article body.

Known non-readable surfaces include the home page, the critiques index, the Gatherer title-card database, search, the xenotext tool, and Duchamp's works gallery.
`;

/**
 * Returns plain-text discovery instructions for LLM clients.
 */
export async function GET() {
  return new NextResponse(llmsText, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
