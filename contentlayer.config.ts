import { defineDocumentType, makeSource } from 'contentlayer/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { remarkFloatImages } from './lib/remark-float-image';

const computedDateField = {
  type: 'date' as const,
  resolve: (doc: any) => doc.updated || doc.published || null,
};

export const InitialThesisDoc = defineDocumentType(() => ({
  name: 'InitialThesisDoc',
  filePathPattern: 'initial-thesis.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    subtitle: { type: 'string', required: false },
    updated: { type: 'date', required: true },
    documentHash: { type: 'string', required: true },
    ethereumAttestation: { type: 'string', required: true },
    hashableFile: { type: 'string', required: true },
    sealedDate: { type: 'string', required: false },
    readingMinutes: { type: 'number', required: false },
  },
  computedFields: {
    slug: { type: 'string', resolve: () => 'initial-thesis' },
    date: computedDateField,
  },
}));

export const TldrDoc = defineDocumentType(() => ({
  name: 'TldrDoc',
  filePathPattern: 'tldr.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    subtitle: { type: 'string', required: false },
    updated: { type: 'date', required: true },
    documentHash: { type: 'string', required: true },
    bitcoinOts: { type: 'string', required: true },
    hashableFile: { type: 'string', required: true },
    sealedDate: { type: 'string', required: false },
    readingMinutes: { type: 'number', required: false },
  },
  computedFields: {
    slug: { type: 'string', resolve: () => 'tldr' },
    date: computedDateField,
  },
}));

export const LivingThesisDoc = defineDocumentType(() => ({
  name: 'LivingThesisDoc',
  filePathPattern: 'living-thesis.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    updated: { type: 'date', required: true },
    readingMinutes: { type: 'number', required: false },
  },
  computedFields: {
    slug: { type: 'string', resolve: () => 'living-thesis' },
    date: computedDateField,
  },
}));

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

export const AboutDoc = defineDocumentType(() => ({
  name: 'AboutDoc',
  filePathPattern: 'about.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    role: { type: 'string', required: false },
    location: { type: 'string', required: false },
    updated: { type: 'date', required: true },
  },
  computedFields: {
    slug: { type: 'string', resolve: () => 'about' },
    date: computedDateField,
  },
}));

export const BibliographyDoc = defineDocumentType(() => ({
  name: 'BibliographyDoc',
  filePathPattern: 'bibliography.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    updated: { type: 'date', required: true },
  },
  computedFields: {
    slug: { type: 'string', resolve: () => 'bibliography' },
    date: computedDateField,
  },
}));

export const MasterListDoc = defineDocumentType(() => ({
  name: 'MasterListDoc',
  filePathPattern: 'master-list.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    updated: { type: 'date', required: true },
  },
  computedFields: {
    slug: { type: 'string', resolve: () => 'master-list' },
    date: computedDateField,
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
  documentTypes: [
    InitialThesisDoc,
    TldrDoc,
    LivingThesisDoc,
    Critique,
    AboutDoc,
    BibliographyDoc,
    MasterListDoc,
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
