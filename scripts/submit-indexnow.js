#!/usr/bin/env node

const DEFAULT_ORIGIN = 'https://eldenringisthelargeglass.com';
const DEFAULT_INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const INDEXNOW_KEY = 'cb05d35765734697acbac8a8a77f4b68';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const origin = (
  process.env.INDEXNOW_ORIGIN ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  DEFAULT_ORIGIN
).replace(/\/$/, '');
const endpoint = process.env.INDEXNOW_ENDPOINT || DEFAULT_INDEXNOW_ENDPOINT;
const sitemapUrl = process.env.INDEXNOW_SITEMAP_URL || `${origin}/sitemap.xml`;
const keyLocation = process.env.INDEXNOW_KEY_LOCATION || `${origin}/${INDEXNOW_KEY}.txt`;
const limit = readLimit();

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

/**
 * Submits the live sitemap URLs to IndexNow.
 */
async function main() {
  const urls = await fetchSitemapUrls();
  const selectedUrls = limit ? urls.slice(0, limit) : urls;
  const payload = {
    host: new URL(origin).host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: selectedUrls,
  };

  console.log(
    JSON.stringify(
      {
        dryRun,
        endpoint,
        sitemapUrl,
        keyLocation,
        urlCount: selectedUrls.length,
      },
      null,
      2
    )
  );

  if (selectedUrls.length === 0) {
    throw new Error(`No URLs found in ${sitemapUrl}`);
  }

  if (dryRun) {
    console.log(selectedUrls.join('\n'));
    return;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(
      `IndexNow submission failed (${response.status} ${response.statusText}): ${body}`
    );
  }

  console.log(`IndexNow accepted ${selectedUrls.length} URLs (${response.status}).`);
}

/**
 * Reads sitemap loc values from the configured origin.
 */
async function fetchSitemapUrls() {
  const response = await fetch(sitemapUrl);

  if (!response.ok) {
    throw new Error(`Could not fetch sitemap (${response.status}): ${sitemapUrl}`);
  }

  const xml = await response.text();
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) =>
    decodeXml(match[1].trim())
  );
  const host = new URL(origin).host;

  return urls.filter((url) => {
    try {
      return new URL(url).host === host;
    } catch {
      return false;
    }
  });
}

/**
 * Parses --limit=N for safe test submissions.
 */
function readLimit() {
  const limitArg = process.argv.slice(2).find((arg) => arg.startsWith('--limit='));
  if (!limitArg) return null;

  const value = Number(limitArg.replace('--limit=', ''));
  if (!Number.isInteger(value) || value < 1) {
    throw new Error('--limit must be a positive integer');
  }

  return value;
}

/**
 * Decodes the XML entities expected in sitemap loc values.
 */
function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
