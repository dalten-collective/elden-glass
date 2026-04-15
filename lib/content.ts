import * as contentlayerGenerated from 'contentlayer/generated';
import {
  allInitialThesisDocs,
  allTldrDocs,
  allLivingThesisDocs,
  allCritiques,
  allAboutDocs,
  allBibliographyDocs,
  allMasterListDocs,
  allVocabDocs,
  type Critique,
  type InitialThesisDoc,
  type TldrDoc,
  type LivingThesisDoc,
  type AboutDoc,
  type BibliographyDoc,
  type MasterListDoc,
  type VocabDoc,
} from 'contentlayer/generated';

const WORDS_PER_MINUTE = 220;

type ContentPageHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

export type ContentPage = {
  body: { raw: string; code: string };
  headings: ContentPageHeading[];
  readingMinutes?: number;
  slug: string;
  url: string;
  title: string;
  summary: string;
  updated: string;
  subtitle?: string;
  eyebrow?: string;
  navMeta?: string;
  documentHash?: string;
  hashableFile?: string;
  sealedDate?: string;
  ethereumAttestation?: string;
  bitcoinOts?: string;
};

export type StagingContentPage = {
  body: { raw: string; code: string };
  headings: ContentPageHeading[];
  readingMinutes?: number;
  slug: string;
  url: string;
  title: string;
  summary: string;
  updated: string;
  subtitle?: string;
  eyebrow?: string;
  navMeta?: string;
  documentHash?: string;
  hashableFile?: string;
  sealedDate?: string;
  ethereumAttestation?: string;
  bitcoinOts?: string;
};

const allContentPages =
  (
    contentlayerGenerated as typeof contentlayerGenerated & {
      allContentPages?: ContentPage[];
    }
  ).allContentPages ?? [];

const allStagingContentPages =
  (
    contentlayerGenerated as typeof contentlayerGenerated & {
      allStagingContentPages?: StagingContentPage[];
    }
  ).allStagingContentPages ?? [];

function minutesFromBody(raw: string, fallback = 6) {
  const words = raw.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE)) || fallback;
}

function withComputedReadingTime<T extends { body: { raw: string }; readingMinutes?: number }>(doc: T) {
  return {
    ...doc,
    readingMinutes: doc.readingMinutes ?? minutesFromBody(doc.body.raw),
  };
}

/**
 * Adds a computed reading time to a ContentPage when frontmatter does not
 * already provide one.
 */
export function withReadingTime(doc: ContentPage): ContentPage & { readingMinutes: number } {
  return withComputedReadingTime(doc);
}

export function getInitialThesisDocument(): InitialThesisDoc & { readingMinutes: number } {
  const doc = allInitialThesisDocs[0];
  if (!doc) {
    throw new Error('Initial Thesis document is missing. Add content/initial-thesis.mdx');
  }
  return withComputedReadingTime(doc);
}

export function getTldrDocument(): TldrDoc & { readingMinutes: number } {
  const doc = allTldrDocs[0];
  if (!doc) {
    throw new Error('TL;DR document is missing. Add content/tldr.mdx');
  }
  return withComputedReadingTime(doc);
}

export function getLivingThesisDocument(): LivingThesisDoc & { readingMinutes: number } {
  const doc = allLivingThesisDocs[0];
  if (!doc) {
    throw new Error('Living Thesis document is missing. Add content/living-thesis.mdx');
  }
  return withComputedReadingTime(doc);
}

/**
 * Returns a content page by its filesystem-derived slug.
 */
export function getContentPageBySlug(slug: string): ContentPage | null {
  return allContentPages.find((page) => page.slug === slug) ?? null;
}

/**
 * Returns content pages in deterministic slug order.
 */
export function allContentPagesSorted(): ContentPage[] {
  return allContentPages.slice().sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Returns a staging content page by its filesystem-derived slug.
 */
export function getStagingContentPageBySlug(slug: string): StagingContentPage | null {
  return allStagingContentPages.find((page) => page.slug === slug) ?? null;
}

/**
 * Returns staging content pages in deterministic slug order.
 */
export function allStagingContentPagesSorted(): StagingContentPage[] {
  return allStagingContentPages.slice().sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Counts the top-level bullet points in the master list. Each correspondence
 * is written as `- **<label>**: ...` so the count matches lines that start
 * with the exact `- **` pattern. This is the single source of truth for
 * how many correspondences exist; it is exposed through SidebarData so
 * the sidebar label and the page header always agree.
 */
export function getMasterListCount(): number {
  const doc = allMasterListDocs[0];
  if (!doc) return 0;
  const matches = doc.body.raw.match(/^- \*\*/gm);
  return matches ? matches.length : 0;
}

export function getAboutDocument(): AboutDoc {
  const doc = allAboutDocs[0];
  if (!doc) {
    throw new Error('About document is missing. Add content/about.mdx');
  }
  return doc;
}

export function getBibliographyDocument(): BibliographyDoc {
  const doc = allBibliographyDocs[0];
  if (!doc) {
    throw new Error('Bibliography document is missing. Add content/bibliography.mdx');
  }
  return doc;
}

export function getMasterListDocument(): MasterListDoc {
  const doc = allMasterListDocs[0];
  if (!doc) {
    throw new Error('Master List document is missing. Add content/master-list.mdx');
  }
  return doc;
}

/**
 * Returns the bachelor machine catalog document — the MDX source behind
 * the /bachelor-machines/terms page. This page used to be hardcoded JSX;
 * it is now rendered from content/vocab/bachelor-machines.mdx so Luke
 * can edit the full catalog (machine tables + critical vocabulary +
 * expanded definitions) without touching React code.
 */
export function getBachelorMachinesCatalog(): VocabDoc {
  const doc = allVocabDocs.find((d) => d.slug === 'bachelor-machines');
  if (!doc) {
    throw new Error('Bachelor machine catalog is missing. Add content/vocab/bachelor-machines.mdx');
  }
  return doc;
}

/**
 * Returns the 'Pataphysics Vocabulary document — the MDX source behind
 * the /vocab page. Same migration story as getBachelorMachinesCatalog:
 * what used to be ~2,000 lines of hardcoded JSX with inline DefinitionItem
 * components is now content/vocab/pataphysics.mdx, which uses the
 * DefinitionItem MDX component registered in markdown-renderer.tsx.
 */
export function getPataphysicsVocabulary(): VocabDoc {
  const doc = allVocabDocs.find((d) => d.slug === 'pataphysics');
  if (!doc) {
    throw new Error("'Pataphysics Vocabulary is missing. Add content/vocab/pataphysics.mdx");
  }
  return doc;
}

export function getCritiques(): Array<Critique & { readingMinutes: number }> {
  return allCritiques
    .slice()
    .sort(
      (a: Critique, b: Critique) => new Date(b.updated).getTime() - new Date(a.updated).getTime()
    )
    .map((critique) => withComputedReadingTime(critique));
}

export function getCritiqueBySlug(slug: string) {
  const match = allCritiques.find((critique: Critique) => critique.slug === slug);
  return match ? withComputedReadingTime(match) : null;
}

export type SidebarData = {
  tldr: {
    title: string;
    updated: string;
    hash: string;
  };
  initialThesis: {
    title: string;
    updated: string;
    hash: string;
  };
  livingThesis: {
    title: string;
    updated: string;
  };
  masterList: {
    title: string;
    count: number;
  };
  critiques: Array<{ title: string; slug: string; updated: string }>;
  about: {
    title: string;
  };
  bibliography: {
    title: string;
  };
};

export function getSidebarData(): SidebarData {
  const tldr = getTldrDocument();
  const initialThesis = getInitialThesisDocument();
  const livingThesis = getLivingThesisDocument();
  const masterList = getMasterListDocument();
  const masterListCount = getMasterListCount();
  const about = getAboutDocument();
  const bibliography = getBibliographyDocument();
  const critiques = getCritiques();

  return {
    tldr: {
      title: tldr.title,
      updated: tldr.updated,
      hash: tldr.documentHash,
    },
    initialThesis: {
      title: initialThesis.title,
      updated: initialThesis.updated,
      hash: initialThesis.documentHash,
    },
    livingThesis: {
      title: livingThesis.title,
      updated: livingThesis.updated,
    },
    masterList: {
      title: masterList.title,
      count: masterListCount,
    },
    about: {
      title: about.title,
    },
    bibliography: {
      title: bibliography.title,
    },
    critiques: critiques.map((critique: Critique & { readingMinutes: number }) => ({
      title: critique.title,
      slug: critique.slug,
      updated: critique.updated,
    })),
  };
}
