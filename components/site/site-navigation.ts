import type { SidebarData } from '@/lib/content';

export type NavLinkItem = {
  type: 'link';
  href: string;
  label: string;
  meta?: string;
  external?: boolean;
};

export type NavSectionItem = {
  type: 'section';
  id: string;
  label: string;
  children: NavItem[];
  emptyLabel?: string;
};

export type NavGroupItem = {
  type: 'group';
  children: NavItem[];
};

export type NavItem = NavLinkItem | NavSectionItem | NavGroupItem;

export type SiteNavigation = {
  primary: NavLinkItem[];
  secondaryLabel: string;
  secondary: NavItem[];
};

/**
 * Builds the site navigation tree once so desktop and mobile menus stay in
 * lockstep instead of drifting apart.
 */
export function getSiteNavigation(data: SidebarData): SiteNavigation {
  return {
    primary: [
      { type: 'link', href: '/', label: 'Home Page' },
      {
        type: 'link',
        href: '/living-thesis',
        label: 'Living Thesis',
        meta: formatShortDate(data.livingThesis.updated),
      },
      {
        type: 'link',
        href: '/master-list',
        label: 'Master List',
        meta: `${data.masterList.count} correspondences`,
      },
      { type: 'link', href: '/tldr', label: 'TL;DR', meta: 'Bitcoin' },
      { type: 'link', href: '/initial-thesis', label: 'Initial Thesis', meta: 'Ethereum' },
    ],
    secondaryLabel: 'Errata',
    secondary: [
      { type: 'link', href: '/gatherer', label: 'Elden Ring Item Cards' },
      {
        type: 'section',
        id: 'scratch-writings',
        label: 'Scratch Writings',
        children: [
          { type: 'link', href: '/belevan', label: 'Belevan, Mónica' },
          {
            type: 'link',
            href: '/large-glass-breakdown',
            label: 'Selected Quotes on the Large Glass',
          },
          { type: 'link', href: '/duchamp-biography', label: 'Duchamp Biography' },
          { type: 'link', href: '/endings', label: 'Endings as Post-War Japan' },
          { type: 'link', href: '/golden-bough', label: 'The Golden Bough' },
          { type: 'link', href: '/bibliography', label: 'Bibliography & Resources' },
        ],
      },
      {
        type: 'section',
        id: 'pataphysics',
        label: 'Pataphysics',
        children: [
          { type: 'link', href: '/pataphysics', label: 'Understand Pataphysics' },
          { type: 'link', href: '/pataphysics/pataphysics-engine', label: "A 'Pataphysics Engine" },
          { type: 'link', href: '/what-is-pataphysics', label: 'What is Pataphysics?' },
          { type: 'link', href: '/vocab', label: 'Pataphysics Vocabulary' },
        ],
      },
      {
        type: 'section',
        id: 'xenotext-theory',
        label: 'The Xenotext Theory',
        children: [
          { type: 'link', href: '/xenotext', label: 'Xenotext Cipher', meta: 'Interactive' },
          { type: 'link', href: '/xenotext-theory', label: 'The Xenotext Theory' },
          {
            type: 'group',
            children: [
              {
                type: 'link',
                href: '/xenotext-theory#uncontrollable-meaning',
                label: 'Uncontrollable Meaning',
              },
              {
                type: 'link',
                href: '/xenotext-theory#flower-crucible-erdtree',
                label: 'Flower Crucible & Erdtree',
              },
              { type: 'link', href: '/xenotext-theory#flower-maidens', label: 'Flower Maidens' },
            ],
          },
        ],
      },
      {
        type: 'section',
        id: 'cosmology',
        label: 'Cosmology',
        children: [
          { type: 'link', href: '/daisugi-cosmology', label: 'The Daisugi Tree' },
          { type: 'link', href: '/astrology', label: "Elden Ring's Astrology" },
        ],
      },
      {
        type: 'section',
        id: 'bachelor-machines',
        label: 'Bachelor Machines',
        children: [
          { type: 'link', href: '/bachelor-machines', label: 'Understanding Bachelor Machines' },
          { type: 'link', href: '/chocolate-grinder', label: 'The Chocolate Grinder' },
          { type: 'link', href: '/bachelor-machines/terms', label: 'Catalog & Vocabulary' },
          {
            type: 'link',
            href: 'https://www.eurogamer.net/an-obituary-for-the-architecture-of-dark-souls-eternally-dying-land',
            label: 'Eternally Dying Land',
            external: true,
          },
        ],
      },
      {
        type: 'section',
        id: 'duchamp',
        label: 'Duchamp',
        children: [
          { type: 'link', href: '/rhonda-shearer', label: 'Rhonda Shearer' },
          {
            type: 'group',
            children: [
              { type: 'link', href: '/impossible-bed', label: 'The Impossible Bed' },
              { type: 'link', href: '/rhonda-shearer-archive', label: 'Rhonda Shearer Archive' },
            ],
          },
          { type: 'link', href: '/readymades', label: 'The Readymades' },
          {
            type: 'group',
            children: [
              { type: 'link', href: '/readymades-research', label: 'Readymades Research' },
              { type: 'link', href: '/la-chose-en-soie', label: 'La Chose en Soie' },
            ],
          },
          { type: 'link', href: '/chess', label: 'Chess' },
          {
            type: 'group',
            children: [{ type: 'link', href: '/chess-research', label: 'Chess Research' }],
          },
          { type: 'link', href: '/the-boxes', label: 'The Boxes' },
          {
            type: 'group',
            children: [
              { type: 'link', href: '/the-boxes#green-box', label: 'The Green Box (1934)' },
              { type: 'link', href: '/the-boxes#white-box', label: 'The White Box (1967)' },
            ],
          },
          { type: 'link', href: '/duchamp-works', label: 'Duchamp Works' },
        ],
      },
      {
        type: 'section',
        id: 'critiques',
        label: 'Critiques',
        children: [
          { type: 'link' as const, href: '/critiques', label: 'Critiques Index' },
          ...data.critiques.map((critique) => ({
            type: 'link' as const,
            href: `/critiques/${critique.slug}`,
            label: critique.title,
          })),
        ],
        emptyLabel: 'No critiques yet.',
      },
      {
        type: 'section',
        id: 'author',
        label: 'Author',
        children: [{ type: 'link', href: '/about', label: data.about.title }],
      },
    ],
  };
}

/**
 * Formats an ISO date string as a short month/day label (e.g. "Apr 11").
 * Parses the date components directly to avoid timezone offset bugs that
 * would otherwise cause a UTC-midnight date to display as the prior day.
 */
function formatShortDate(iso: string): string {
  const dateOnly = iso.split('T')[0];
  const [, monthStr, dayStr] = dateOnly.split('-');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthIndex = Number(monthStr) - 1;
  const day = Number(dayStr);
  return `${months[monthIndex] ?? ''} ${day}`;
}
