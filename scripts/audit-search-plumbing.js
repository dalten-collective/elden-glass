#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const matter = require('gray-matter');

const root = process.cwd();
const checkMode = process.argv.includes('--check');
const findings = [];

auditFileContains('app/layout.tsx', [
  ['metadataBase', 'Root metadata declares metadataBase for absolute social URLs.'],
  ['alternates:', 'Root metadata declares alternates.'],
  ['canonical:', 'Root metadata declares a canonical URL.'],
  ['openGraph:', 'Root metadata declares Open Graph defaults.'],
  ['twitter:', 'Root metadata declares Twitter card defaults.'],
  ['application/ld+json', 'Root layout emits structured WebSite metadata.'],
]);

auditFileContains('app/(site)/[...slug]/page.tsx', [
  ['alternates:', 'Content pages declare canonical metadata.'],
  ['openGraph:', 'Content pages declare Open Graph article metadata.'],
  ['twitter:', 'Content pages declare Twitter metadata.'],
  ['Article', 'Content pages emit Article structured data.'],
]);

auditFileContains('app/sitemap.ts', [
  ['getRouteCatalog', 'Sitemap is generated from the route catalog.'],
]);

auditFileContains('app/robots.ts', [
  ['sitemap:', 'Robots route advertises the sitemap.'],
  ["'/api/llms/'", 'Robots route allows LLM API discovery.'],
  ["'/api/'", 'Robots route disallows generic API crawling.'],
]);

auditContentFrontmatter();

printReport();

if (checkMode && findings.some((finding) => finding.level === 'FAIL')) {
  process.exit(1);
}

/**
 * Checks that a file contains a set of expected search/metadata signals.
 */
function auditFileContains(relativePath, expectations) {
  const filePath = path.join(root, relativePath);
  if (!fs.existsSync(filePath)) {
    addFinding('FAIL', relativePath, 'File is missing.');
    return;
  }

  const source = fs.readFileSync(filePath, 'utf8');
  for (const [needle, message] of expectations) {
    addFinding(source.includes(needle) ? 'PASS' : 'FAIL', relativePath, message);
  }
}

/**
 * Reviews MDX frontmatter that search snippets and route-catalog outputs use.
 */
function auditContentFrontmatter() {
  const pagesDir = path.join(root, 'content/pages');
  const files = listMdxFiles(pagesDir);
  const keySlugs = new Set(['living-thesis', 'tldr', 'master-list', 'author/about']);

  let complete = 0;
  let shortSummaries = 0;

  for (const filePath of files) {
    const relativePath = path.relative(root, filePath);
    const parsed = matter(fs.readFileSync(filePath, 'utf8'));
    const slug = path
      .relative(pagesDir, filePath)
      .replace(/\\/g, '/')
      .replace(/\.mdx?$/, '');

    for (const field of ['title', 'summary', 'updated']) {
      if (!parsed.data[field]) {
        addFinding('FAIL', relativePath, `Missing ${field} frontmatter.`);
      }
    }

    if (parsed.data.title && parsed.data.summary && parsed.data.updated) {
      complete += 1;
    }

    if (typeof parsed.data.summary === 'string' && parsed.data.summary.length < 80) {
      shortSummaries += 1;
      addFinding('WARN', relativePath, 'Summary is short for search-result snippets.');
    }

    if (keySlugs.has(slug)) {
      addFinding(
        parsed.data.title && parsed.data.summary && parsed.data.updated ? 'PASS' : 'FAIL',
        relativePath,
        `Key route /${slug} has title, summary, and updated metadata.`
      );
      keySlugs.delete(slug);
    }
  }

  for (const missingSlug of keySlugs) {
    addFinding('FAIL', `content/pages/${missingSlug}.mdx`, 'Key route file is missing.');
  }

  addFinding(
    'PASS',
    'content/pages',
    `${complete} MDX content pages have title, summary, and updated frontmatter.`
  );

  if (shortSummaries === 0) {
    addFinding('PASS', 'content/pages', 'No content summaries are shorter than 80 characters.');
  }
}

/**
 * Recursively lists MDX files under a directory.
 */
function listMdxFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listMdxFiles(entryPath);
      return entry.isFile() && /\.mdx?$/.test(entry.name) ? [entryPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

/**
 * Adds one audit finding.
 */
function addFinding(level, scope, message) {
  findings.push({ level, scope, message });
}

/**
 * Prints the audit in markdown for easy issue comments.
 */
function printReport() {
  const counts = findings.reduce(
    (acc, finding) => {
      acc[finding.level] += 1;
      return acc;
    },
    { PASS: 0, WARN: 0, FAIL: 0 }
  );

  console.log('# Search Plumbing Audit');
  console.log('');
  console.log(`PASS: ${counts.PASS}`);
  console.log(`WARN: ${counts.WARN}`);
  console.log(`FAIL: ${counts.FAIL}`);
  console.log('');
  console.log('| Level | Scope | Finding |');
  console.log('| --- | --- | --- |');
  for (const finding of findings) {
    console.log(
      `| ${finding.level} | \`${finding.scope}\` | ${finding.message.replace(/\|/g, '\\|')} |`
    );
  }
}
