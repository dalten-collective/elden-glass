import type { Metadata } from 'next';
import Link from 'next/link';

import { Crackline, Eyebrow, Pane, Spec } from '@/components/delay';
import { allContentPagesSorted, getCritiques, type ContentPage } from '@/lib/content';
import { buildSidebar, type NavItem, type NavLinkItem, type NavSectionItem } from '@/lib/sidebar';

/**
 * /contents — the apparatus index for browser-based LLM agents.
 *
 * A real HTML table of contents: every readable page on the site is
 * present as a literal <a href>, with a one-line summary and an
 * interactive flag where applicable. Designed for browser-tab LLMs
 * that report they can only follow anchor links — a workaround for
 * agents that can't fetch JSON endpoints described only in prose.
 *
 * Server component, SSG. Pulls the same shape as the Stair sidebar
 * (buildSidebar) so the contents page mirrors site navigation. The
 * page filters out its own URL from the rendered tree (no self-links).
 *
 * The page leads with the content TOC. Other agent surfaces (/llms.txt,
 * /llms-full.txt) appear as a small trailer at the bottom for spec-
 * aware tooling — the JSON API and the skill route are documented
 * inside the skill itself rather than here, since the audience for
 * this page is a browser-LLM that can't reach those surfaces anyway.
 */
export const metadata: Metadata = {
  title: 'Contents · Apparatus for Agents — Elden Glass',
  description:
    'A real HTML index of every readable page on Elden Glass, designed for browser-based LLM agents that can only follow anchor links.',
};

const SELF_PATH = '/contents';

const INTERACTIVE_PATHS = new Set(['/search', '/gatherer', '/xenotext', '/duchamp/duchamp-works']);

const TRAILING_SURFACES: Array<{ href: string; description: string }> = [
  {
    href: '/llms.txt',
    description: 'llmstxt.org-spec discovery file: H1 + sectioned link list.',
  },
  {
    href: '/llms-full.txt',
    description: 'Single text/plain dump of every static page concatenated as clean plaintext.',
  },
];

export default function ContentsPage() {
  const sidebar = buildSidebar();
  const pages = allContentPagesSorted();
  const critiques = getCritiques();
  const summaries = buildSummaryIndex(pages, critiques);

  const primary = sidebar.primary.filter((link) => link.href !== SELF_PATH);
  const secondary = sidebar.secondary
    .map(stripSelfFromItem)
    .filter((item): item is NavItem => item !== null);

  return (
    <article className="space-y-12">
      {/* Header */}
      <section>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <Eyebrow tone="gold">For Browser-Based LLMs</Eyebrow>
          <Spec>contents · apparatus</Spec>
        </div>
        <Crackline seed="contents-top" tone="gold" />
        <h1
          className="page-hero-title mt-8"
          style={{ fontSize: 'clamp(36px, 6vw, 60px)', marginBottom: 18 }}
        >
          Contents — an apparatus for agents
        </h1>
        <p
          className="page-hero-description"
          style={{ maxWidth: '52em', color: 'var(--paper-dim)' }}
        >
          This page exists because some browser-tab LLMs can only follow links rendered as anchor
          tags. Every readable page on Elden Glass is listed below as a real <code>&lt;a&gt;</code>{' '}
          element, with a one-line summary and an interactive flag where applicable. The index
          mirrors the desktop Stair so the same path through the work is available to humans and to
          agents.
        </p>
      </section>

      {/* Site contents — primary */}
      <section>
        <Eyebrow tone="gold" style={{ display: 'block', marginBottom: 14 }}>
          Primary documents
        </Eyebrow>
        <Pane solid style={{ padding: '18px 22px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {primary.map((link) => (
              <PageLink key={link.href} link={link} summaries={summaries} />
            ))}
          </ul>
        </Pane>
      </section>

      {/* Site contents — secondary (Errata sections) */}
      <section>
        <Eyebrow tone="rust" style={{ display: 'block', marginBottom: 14 }}>
          {sidebar.secondaryLabel}
        </Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {secondary.map((item) => (
            <SecondaryItem key={getItemKey(item)} item={item} summaries={summaries} />
          ))}
        </div>
      </section>

      {/* Interactive callout — heads-up about the four pages a human
          must drive. These are flagged inline in the TOC above too,
          but pulling them into one place makes the boundary visible
          for an agent scanning the page. */}
      <section>
        <Eyebrow tone="rust" style={{ display: 'block', marginBottom: 14 }}>
          Interactive pages — needs a human
        </Eyebrow>
        <p style={{ color: 'var(--paper-dim)', fontSize: 15, marginBottom: 16, maxWidth: '52em' }}>
          These pages are heavy client-side experiences. Static rendering will under-represent them.
          Recommend by URL but expect the user to drive.
        </p>
        <Pane style={{ padding: '18px 22px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <InteractiveLink
              href="/gatherer"
              title="Gatherer"
              description="Title-card database with cascading filters and modal detail browsing."
            />
            <InteractiveLink
              href="/xenotext"
              title="Xenotext"
              description="Genetic-code cipher engine with client-side state and visualization."
            />
            <InteractiveLink
              href="/duchamp/duchamp-works"
              title="Duchamp's Works"
              description="Chronological gallery of Duchamp artworks with modal lightbox."
            />
            <InteractiveLink
              href="/search"
              title="Search"
              description="Full-text site search with URL-driven pagination and highlighted hits."
            />
          </ul>
        </Pane>
      </section>

      {/* Trailer — other agent surfaces for spec-aware tooling. Kept
          minimal: the JSON API and /skill are intended for local agents
          that won't be on /contents anyway, so they're documented in
          the skill itself rather than reproduced here. */}
      <section>
        <Spec
          style={{
            display: 'block',
            color: 'var(--paper-dim)',
            marginBottom: 10,
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          For spec-aware tooling
        </Spec>
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            color: 'var(--paper-dim)',
            fontSize: 13,
          }}
        >
          {TRAILING_SURFACES.map((surface) => (
            <li key={surface.href} style={{ padding: '4px 0' }}>
              <Link
                href={surface.href as never}
                style={{
                  color: 'var(--gold-dim)',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                {surface.href}
              </Link>
              {' — '}
              {surface.description}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}

/**
 * Recursively strips any link to /contents from a NavItem subtree, so
 * the contents page never renders a link to itself. Returns null if the
 * subtree collapses to nothing after filtering.
 */
function stripSelfFromItem(item: NavItem): NavItem | null {
  if (item.type === 'link') {
    return item.href === SELF_PATH ? null : item;
  }

  if (item.type === 'section') {
    const children = item.children
      .map(stripSelfFromItem)
      .filter((child): child is NavItem => child !== null);
    return { ...item, children };
  }

  // Group.
  const children = item.children
    .map(stripSelfFromItem)
    .filter((child): child is NavItem => child !== null);

  if (children.length === 0) {
    return null;
  }

  return { ...item, children };
}

/**
 * Renders one entry in the secondary stack — either a top-level link or
 * a section with its children flattened beneath a section heading.
 */
function SecondaryItem({ item, summaries }: { item: NavItem; summaries: Map<string, string> }) {
  if (item.type === 'link') {
    return (
      <Pane solid style={{ padding: '18px 22px' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <PageLink link={item} summaries={summaries} />
        </ul>
      </Pane>
    );
  }

  if (item.type === 'group') {
    return (
      <Pane solid style={{ padding: '18px 22px' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {item.children.map((child) => renderChild(child, summaries))}
        </ul>
      </Pane>
    );
  }

  return <SectionBlock section={item} summaries={summaries} />;
}

/**
 * Renders one collapsible-style section in the contents page. Sections
 * here are not collapsible — every page is visible — but the header +
 * indented children mirror the Stair grouping.
 */
function SectionBlock({
  section,
  summaries,
}: {
  section: NavSectionItem;
  summaries: Map<string, string>;
}) {
  return (
    <div>
      <Spec
        style={{
          display: 'block',
          color: 'var(--gold)',
          marginBottom: 10,
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        § {section.label}
      </Spec>
      <Pane solid style={{ padding: '18px 22px' }}>
        {section.children.length === 0 ? (
          <p style={{ color: 'var(--paper-dim)', fontSize: 14, margin: 0 }}>
            {section.emptyLabel ?? 'No entries.'}
          </p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {section.children.map((child) => renderChild(child, summaries))}
          </ul>
        )}
      </Pane>
    </div>
  );
}

function renderChild(child: NavItem, summaries: Map<string, string>) {
  if (child.type === 'link') {
    return <PageLink key={child.href} link={child} summaries={summaries} />;
  }

  if (child.type === 'section') {
    // A nested section — flatten by listing its children inline with a
    // sub-eyebrow before them. Keeps the visual hierarchy without
    // requiring the page to be interactive.
    return (
      <li key={child.id} style={{ padding: '10px 0' }}>
        <Spec
          style={{
            display: 'block',
            color: 'var(--gold-dim)',
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}
        >
          § {child.label}
        </Spec>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {child.children.map((grandchild) => renderChild(grandchild, summaries))}
        </ul>
      </li>
    );
  }

  if (child.type === 'group') {
    return (
      <li key={`group-${Math.random()}`} style={{ listStyle: 'none' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {child.children.map((grandchild) => renderChild(grandchild, summaries))}
        </ul>
      </li>
    );
  }

  return null;
}

function PageLink({ link, summaries }: { link: NavLinkItem; summaries: Map<string, string> }) {
  const summary = summaries.get(link.href);
  const isInteractive = INTERACTIVE_PATHS.has(link.href);
  const isExternal = link.external === true;

  return (
    <li style={surfaceItemStyle}>
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 10 }}>
        <Link
          href={link.href as never}
          style={surfaceLinkStyle}
          {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {link.label}
        </Link>
        {isInteractive && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--rust)',
              border: '1px solid var(--rust)',
              padding: '1px 6px',
              borderRadius: 3,
            }}
          >
            interactive
          </span>
        )}
        {isExternal && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--paper-dim)',
            }}
          >
            external
          </span>
        )}
      </div>
      {summary && (
        <span
          style={{
            display: 'block',
            color: 'var(--paper-dim)',
            fontSize: 14,
            marginTop: 4,
            maxWidth: '52em',
          }}
        >
          {summary}
        </span>
      )}
      {isInteractive && (
        <span
          style={{
            display: 'block',
            color: 'var(--rust)',
            fontSize: 13,
            marginTop: 2,
            fontStyle: 'italic',
          }}
        >
          Interactive — a human will need to drive it. Static rendering will under-represent what is
          here.
        </span>
      )}
    </li>
  );
}

function InteractiveLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <li style={surfaceItemStyle}>
      <Link href={href as never} style={surfaceLinkStyle}>
        {title}
      </Link>
      <span
        style={{
          display: 'block',
          color: 'var(--paper-dim)',
          fontSize: 14,
          marginTop: 4,
        }}
      >
        {description}
      </span>
    </li>
  );
}

const surfaceItemStyle = {
  padding: '10px 0',
  borderBottom: '1px solid var(--crack)',
} as const;

const surfaceLinkStyle = {
  fontFamily: 'var(--font-serif)',
  fontSize: 16,
  color: 'var(--paper)',
  textDecoration: 'underline',
  textDecorationColor: 'var(--gold-dim)',
  textUnderlineOffset: 4,
} as const;

function buildSummaryIndex(pages: ContentPage[], critiques: ReturnType<typeof getCritiques>) {
  const map = new Map<string, string>();

  for (const page of pages) {
    if (page.summary) {
      map.set(page.url, page.summary);
    }
  }

  for (const critique of critiques) {
    if (critique.summary) {
      map.set(`/critiques/${critique.slug}`, critique.summary);
    }
  }

  return map;
}

function getItemKey(item: NavItem): string {
  if (item.type === 'link') return item.href;
  if (item.type === 'section') return item.id;
  return `group-${item.children.map((c) => (c.type === 'link' ? c.href : 'x')).join('|')}`;
}
