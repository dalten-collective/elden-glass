import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import GithubSlugger from 'github-slugger';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { remarkFloatImages } from './lib/remark-float-image';

export function extractHeadings(raw: string): Array<{ level: 2 | 3; text: string; id: string }> {
  const slugger = new GithubSlugger();
  const matches = Array.from(raw.matchAll(/^(#{2,3})\s+(.+)$/gm));

  return matches.map((m) => ({
    level: m[1].length as 2 | 3,
    text: m[2].trim(),
    id: slugger.slug(m[2].trim()),
  }));
}

const computedDateField = {
  type: 'date' as const,
  resolve: (doc: any) => doc.updated || doc.published || null,
};

export const Critique = defineDocumentType(() => ({
  name: 'Critique',
  filePathPattern: 'critiques/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    targetUrl: { type: 'string', required: true },
    targetTitle: { type: 'string', required: true },
    published: { type: 'date', required: true },
    updated: { type: 'date', required: true },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx?$/, ''),
    },
    date: computedDateField,
  },
}));

export const ContentPage = defineDocumentType(() => ({
  name: 'ContentPage',
  filePathPattern: 'pages/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    updated: { type: 'date', required: true },
    subtitle: { type: 'string', required: false },
    eyebrow: { type: 'string', required: false },
    readingMinutes: { type: 'number', required: false },
    navMeta: { type: 'string', required: false },
    documentHash: { type: 'string', required: false },
    hashableFile: { type: 'string', required: false },
    sealedDate: { type: 'string', required: false },
    ethereumAttestation: { type: 'string', required: false },
    bitcoinOts: { type: 'string', required: false },
    verificationSubject: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^pages\//, ''),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/${doc._raw.flattenedPath.replace(/^pages\//, '')}`,
    },
    date: computedDateField,
    headings: {
      type: 'json',
      resolve: (doc) => extractHeadings(doc.body.raw),
    },
  },
}));

export const StagingContentPage = defineDocumentType(() => ({
  name: 'StagingContentPage',
  filePathPattern: 'pages-staging/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    summary: { type: 'string', required: true },
    updated: { type: 'date', required: true },
    subtitle: { type: 'string', required: false },
    eyebrow: { type: 'string', required: false },
    readingMinutes: { type: 'number', required: false },
    navMeta: { type: 'string', required: false },
    documentHash: { type: 'string', required: false },
    hashableFile: { type: 'string', required: false },
    sealedDate: { type: 'string', required: false },
    ethereumAttestation: { type: 'string', required: false },
    bitcoinOts: { type: 'string', required: false },
    verificationSubject: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath.replace(/^pages-staging\//, ''),
    },
    url: {
      type: 'string',
      resolve: (doc) => `/preview/${doc._raw.flattenedPath.replace(/^pages-staging\//, '')}`,
    },
    date: computedDateField,
    headings: {
      type: 'json',
      resolve: (doc) => extractHeadings(doc.body.raw),
    },
  },
}));

export const VocabDoc = defineDocumentType(() => ({
  name: 'VocabDoc',
  filePathPattern: 'vocab/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    section: { type: 'string', required: true },
    updated: { type: 'date', required: true },
    // Optional hero-meta fields so pages that render a vocab doc can pull
    // their hero labels from frontmatter instead of hardcoding them. Used
    // by /bachelor-machines/terms for its Source / Machines / Vocabulary
    // tiles; other vocab files can leave them unset.
    subtitle: { type: 'string', required: false },
    source: { type: 'string', required: false },
    machineCount: { type: 'string', required: false },
    vocabularyCount: { type: 'string', required: false },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx?$/, ''),
    },
    date: computedDateField,
  },
}));

export default makeSource({
  contentDirPath: 'content',
  // Exclude author-facing docs and helper READMEs that don't match any
  // document type; without this, contentlayer logs a "couldn't determine
  // the document type" warning on every dev-server boot.
  contentDirExclude: ['README.md', 'critique-images'],
  onMissingOrIncompatibleData: 'fail',
  documentTypes: [
    Critique,
    ContentPage,
    StagingContentPage,
    VocabDoc,
  ],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          // Append an anchor link after each heading. The default behavior
          // (wrap) wraps the entire heading text in an <a>, which swallows
          // clicks on title-card-term spans inside headings and prevents
          // their rollover handlers from firing. Using `append` with an
          // explicit visible glyph ('#') keeps the anchor functional as
          // a click target without intercepting the heading content.
          behavior: 'append',
          properties: {
            className: ['heading-anchor'],
            'aria-label': 'Link to this heading',
          },
          content: {
            type: 'text',
            value: '#',
          },
        },
      ],
    ],
  },
});
