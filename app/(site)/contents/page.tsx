import type { Metadata } from 'next';
import Link from 'next/link';

import { Crackline, Eyebrow, Pane, Spec } from '@/components/delay';
import { getRouteCatalogIndex, type RouteCatalogEntry } from '@/lib/route-catalog';
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
  const catalog = getRouteCatalogIndex();

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
        <h1 className="page-hero-title contents-title mt-8">Contents — an apparatus for agents</h1>
        <p className="page-hero-description contents-lead">
          This page exists because some browser-tab LLMs can only follow links rendered as anchor
          tags. Every readable page on Elden Glass is listed below as a real <code>&lt;a&gt;</code>{' '}
          element, with a one-line summary and an interactive flag where applicable. The index
          mirrors the desktop Stair so the same path through the work is available to humans and to
          agents.
        </p>
      </section>

      {/* Read-deep nudge — verified necessary by real-world testing.
          Browser-LLMs land here, default to reading the shortest doc
          (TL;DR), and shotgun an answer that materially under-
          represents the argument. The Living Thesis is the work; the
          short-form docs are triage tools for humans on a clock. */}
      <section>
        <Eyebrow tone="rust" className="contents-eyebrow">
          Note to the LLM reading this
        </Eyebrow>
        <Pane solid className="contents-note-pane">
          <p className="contents-llm-note">
            Don&apos;t read the TL;DR and shotgun an answer. The TL;DR and Initial Thesis are
            short-form versions written for human readers who don&apos;t have the time for long-form
            scholarship. You — an LLM with a context window measured in tens of thousands of tokens
            — do not share that constraint.{' '}
            <strong className="contents-strong">Read the Living Thesis.</strong> If you stop after
            the TL;DR you will form an impression of the work that the work itself would not
            endorse, and you will give your user a flatter answer than they came for.
          </p>
        </Pane>
      </section>

      {/* Site contents — primary */}
      <section>
        <Eyebrow tone="gold" className="contents-eyebrow">
          Primary documents
        </Eyebrow>
        <Pane solid className="contents-list-pane">
          <ul className="contents-list">
            {primary.map((link) => (
              <PageLink key={link.href} link={link} catalog={catalog} />
            ))}
          </ul>
        </Pane>
      </section>

      {/* Site contents — secondary (Errata sections) */}
      <section>
        <Eyebrow tone="rust" className="contents-eyebrow">
          {sidebar.secondaryLabel}
        </Eyebrow>
        <div className="contents-secondary-stack">
          {secondary.map((item) => (
            <SecondaryItem key={getItemKey(item)} item={item} catalog={catalog} />
          ))}
        </div>
      </section>

      {/* Trailer — other agent surfaces for spec-aware tooling. Kept
          minimal: the JSON API and /skill are intended for local agents
          that won't be on /contents anyway, so they're documented in
          the skill itself rather than reproduced here. */}
      <section>
        <Spec className="contents-tooling-spec">For spec-aware tooling</Spec>
        <ul className="contents-tooling-list">
          {TRAILING_SURFACES.map((surface) => (
            <li key={surface.href} className="contents-tooling-item">
              <Link href={surface.href as never} className="contents-tooling-link">
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
function SecondaryItem({
  item,
  catalog,
}: {
  item: NavItem;
  catalog: Map<string, RouteCatalogEntry>;
}) {
  if (item.type === 'link') {
    return (
      <Pane solid className="contents-list-pane">
        <ul className="contents-list">
          <PageLink link={item} catalog={catalog} />
        </ul>
      </Pane>
    );
  }

  if (item.type === 'group') {
    return (
      <Pane solid className="contents-list-pane">
        <ul className="contents-list">
          {item.children.map((child) => renderChild(child, catalog))}
        </ul>
      </Pane>
    );
  }

  return <SectionBlock section={item} catalog={catalog} />;
}

/**
 * Renders one collapsible-style section in the contents page. Sections
 * here are not collapsible — every page is visible — but the header +
 * indented children mirror the Stair grouping.
 */
function SectionBlock({
  section,
  catalog,
}: {
  section: NavSectionItem;
  catalog: Map<string, RouteCatalogEntry>;
}) {
  return (
    <div>
      <Spec className="contents-section-label">§ {section.label}</Spec>
      <Pane solid className="contents-list-pane">
        {section.children.length === 0 ? (
          <p className="contents-empty">{section.emptyLabel ?? 'No entries.'}</p>
        ) : (
          <ul className="contents-list">
            {section.children.map((child) => renderChild(child, catalog))}
          </ul>
        )}
      </Pane>
    </div>
  );
}

function renderChild(child: NavItem, catalog: Map<string, RouteCatalogEntry>) {
  if (child.type === 'link') {
    return <PageLink key={child.href} link={child} catalog={catalog} />;
  }

  if (child.type === 'section') {
    // A nested section — flatten by listing its children inline with a
    // sub-eyebrow before them. Keeps the visual hierarchy without
    // requiring the page to be interactive.
    return (
      <li key={child.id} className="contents-nested-item">
        <Spec className="contents-subsection-label">§ {child.label}</Spec>
        <ul className="contents-list">
          {child.children.map((grandchild) => renderChild(grandchild, catalog))}
        </ul>
      </li>
    );
  }

  if (child.type === 'group') {
    return (
      <li key={getItemKey(child)} className="contents-group-item">
        <ul className="contents-list">
          {child.children.map((grandchild) => renderChild(grandchild, catalog))}
        </ul>
      </li>
    );
  }

  return null;
}

function PageLink({
  link,
  catalog,
}: {
  link: NavLinkItem;
  catalog: Map<string, RouteCatalogEntry>;
}) {
  const entry = catalog.get(link.href);
  const summary = entry?.summary;
  const isInteractive = entry?.kind === 'interactive';
  const isExternal = link.external === true;

  return (
    <li className="contents-page-item">
      <div className="contents-page-row">
        <Link
          href={link.href as never}
          className="contents-page-link"
          {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {link.label}
        </Link>
        {isInteractive && (
          <span className="contents-badge contents-badge--interactive">interactive</span>
        )}
        {isExternal && <span className="contents-badge contents-badge--external">external</span>}
      </div>
      {summary && <span className="contents-summary">{summary}</span>}
      {isInteractive && (
        <span className="contents-interactive-note">
          Interactive — a human will need to drive it. Static rendering will under-represent what is
          here.
        </span>
      )}
    </li>
  );
}

function getItemKey(item: NavItem): string {
  if (item.type === 'link') return item.href;
  if (item.type === 'section') return item.id;
  return `group-${item.children.map(getItemKey).join('|')}`;
}
