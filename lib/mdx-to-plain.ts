/**
 * mdxToPlain — converts raw MDX source into clean plaintext for LLM
 * consumers. Strips frontmatter, strips comments, and walks the body
 * tag-by-tag converting known JSX components into their textual
 * equivalents.
 *
 * This powers two consumers:
 *   • /llms-full.txt — single-shot concatenation of every static page.
 *   • /api/llms/article — per-page JSON fetch (replaces body.raw).
 *
 * The transformer is pragmatic, not exhaustive. It handles the actual
 * components in the Elden Glass corpus with per-component handlers, and
 * falls back to "unwrap children / drop decoration" for unknown tags.
 * Perfect prose is not the goal; clean, JSX-free output that preserves
 * the prose substance is.
 *
 * Handler summary (input → output):
 *   <DropCap />, <Crackline />          → dropped
 *   <Lead>X</Lead>                       → X
 *   <Pane>X</Pane>, <Cap>X</Cap>, etc.   → X  (pass-through containers)
 *   <AttestCard …>X</AttestCard>         → X  (body kept, props dropped)
 *   <Plate no="i" caption="C">X</Plate>  → [Plate i — C]\n\nX
 *   <FloatImage src="s" alt="a">X</…>    → ![a](s)\n\nX
 *   <RuneFigure src="s" alt="a">X</…>    → ![a](s)\n\nX
 *   <MagnifierImage …>                   → like FloatImage
 *   <ManuscriptDisplay filename="f" />   → [Manuscript: f]
 *   <PullQuote attribution=…>X</…>       → > X\n> — attribution
 *   <Quote source="s">X</Quote>          → > X\n> — s
 *   <Callout title="t">X</Callout>       → **t**\n\nX
 *   <Correspondence n="1" glass="A" ring="B" />  → 1. A ↔ B
 *   <DefinitionItem term="t" definition="d" source="s">X</…>
 *                                        → **t** — "d" (s)\n\nX
 *   <Ref n="1" />                        → [^1]
 *   <Ref n="1" kind="roman" />           → [^i]
 *   <MarginNote>X</MarginNote>           → (margin: X)
 *   <AsideInline>X</AsideInline>         → (aside: X)
 *   <TitleCard id="x" />                 → [title card: x]
 *   <HashVerification … />               → dropped (widget)
 *   <EldenOrrery … />                    → dropped (widget)
 *   unknown <Tag … />                    → dropped
 *   unknown <Tag>X</Tag>                 → X (unwrap body)
 *
 * Markdown (headings, lists, links, emphasis, code fences) and plain
 * HTML inlines (<i>, <b>, <br>, <span>) are preserved untouched.
 */

/** The public entry point. */
export function mdxToPlain(raw: string, options: { slug?: string } = {}): string {
  let src = raw;

  // 1. Strip frontmatter — the MDX frontmatter block at the very top.
  src = src.replace(/^---\s*[\r\n][\s\S]*?[\r\n]---\s*[\r\n]/, '');

  // 2. Strip comments — MDX expression comments and HTML comments.
  src = src.replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
  src = src.replace(/<!--[\s\S]*?-->/g, '');

  // 3. Walk the body and replace JSX components with their textual form.
  //    Repeat until a pass produces no changes — this handles nested
  //    components (e.g. a Pane containing a Correspondence).
  let previous = '';
  let guard = 0;
  while (src !== previous && guard < 20) {
    previous = src;
    src = transformPass(src, options);
    guard += 1;
  }

  // 4. Normalize whitespace — collapse 3+ blank lines to 2, trim edges.
  src = src.replace(/\r\n/g, '\n');
  src = src.replace(/\n{3,}/g, '\n\n');
  src = src.trim();

  return src + '\n';
}

/**
 * One transformation pass over the source. Finds the first JSX component
 * open-tag (literal `<` followed by an uppercase letter) and rewrites
 * that occurrence. Returns the full mutated string so the caller can
 * loop until stable.
 */
function transformPass(src: string, options: { slug?: string }): string {
  const openIdx = findNextComponentOpen(src);

  if (openIdx < 0) {
    return src;
  }

  const tagNameMatch = /^<([A-Z][A-Za-z0-9]*)/.exec(src.slice(openIdx));

  if (!tagNameMatch) {
    return src;
  }

  const tagName = tagNameMatch[1];
  const openTagEnd = findOpenTagEnd(src, openIdx);

  if (openTagEnd < 0) {
    // Malformed; bail by removing the stray `<` to avoid an infinite loop.
    return src.slice(0, openIdx) + src.slice(openIdx + 1);
  }

  const isSelfClosing = src[openTagEnd - 1] === '/';
  const attrsSrc = src.slice(openIdx + 1 + tagName.length, openTagEnd - (isSelfClosing ? 1 : 0));
  const attrs = parseAttrs(attrsSrc);

  if (isSelfClosing) {
    const replacement = renderComponent(tagName, attrs, '', options);
    return src.slice(0, openIdx) + replacement + src.slice(openTagEnd + 1);
  }

  // Paired tag — find the matching close `</Tag>`. Respects nesting of
  // same-named components by counting opens and closes.
  const closeIdx = findMatchingClose(src, openTagEnd + 1, tagName);

  if (closeIdx < 0) {
    // No matching close — treat as self-closing to avoid an infinite loop.
    const replacement = renderComponent(tagName, attrs, '', options);
    return src.slice(0, openIdx) + replacement + src.slice(openTagEnd + 1);
  }

  const body = src.slice(openTagEnd + 1, closeIdx);
  const closeTagEnd = closeIdx + `</${tagName}>`.length;
  const replacement = renderComponent(tagName, attrs, body, options);
  return src.slice(0, openIdx) + replacement + src.slice(closeTagEnd);
}

/** Finds the next `<Capital…` tag open; returns -1 if none. */
function findNextComponentOpen(src: string): number {
  const match = /<[A-Z][A-Za-z0-9]*/.exec(src);
  return match ? match.index : -1;
}

/**
 * Walks forward from an open `<` and returns the index of the `>` that
 * closes the open tag, respecting JSX expression braces (so `caption={
 * <>…</> }` doesn't prematurely close) and string quotes.
 */
function findOpenTagEnd(src: string, openIdx: number): number {
  let depth = 0;
  let inQuote: string | null = null;

  for (let i = openIdx + 1; i < src.length; i += 1) {
    const c = src[i];

    if (inQuote) {
      if (c === inQuote && src[i - 1] !== '\\') {
        inQuote = null;
      }
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      inQuote = c;
      continue;
    }

    if (c === '{') {
      depth += 1;
      continue;
    }

    if (c === '}') {
      depth -= 1;
      continue;
    }

    if (c === '>' && depth === 0) {
      return i;
    }
  }

  return -1;
}

/**
 * Finds the matching `</tagName>` starting at `from`, counting nested
 * `<tagName` opens and closes to respect depth. Returns the index of
 * the opening `<` of the matching close tag, or -1.
 */
function findMatchingClose(src: string, from: number, tagName: string): number {
  const openRe = new RegExp(`<${tagName}(?=[\\s/>])`, 'g');
  const closeRe = new RegExp(`</${tagName}>`, 'g');
  openRe.lastIndex = from;
  closeRe.lastIndex = from;

  let depth = 1;
  let nextOpen = openRe.exec(src);
  let nextClose = closeRe.exec(src);

  while (nextClose) {
    // If an open tag appears before this close tag, increase depth.
    while (nextOpen && nextOpen.index < nextClose.index) {
      depth += 1;
      nextOpen = openRe.exec(src);
    }

    depth -= 1;

    if (depth === 0) {
      return nextClose.index;
    }

    nextClose = closeRe.exec(src);
  }

  return -1;
}

type Attrs = Record<string, string | true>;

/**
 * Parses the attribute portion of a JSX open tag. Handles
 *   name="value"
 *   name='value'
 *   name={value}   — stores the raw expression
 *   name={`value`} — stores the inner template string when trivial
 *   name           — boolean shorthand, stored as `true`
 */
function parseAttrs(src: string): Attrs {
  const attrs: Attrs = {};
  let i = 0;

  while (i < src.length) {
    // Skip whitespace.
    while (i < src.length && /\s/.test(src[i])) {
      i += 1;
    }
    if (i >= src.length) break;

    const nameMatch = /^([A-Za-z_][A-Za-z0-9_-]*)/.exec(src.slice(i));
    if (!nameMatch) {
      i += 1;
      continue;
    }

    const name = nameMatch[1];
    i += name.length;

    // Skip whitespace after name.
    while (i < src.length && /\s/.test(src[i])) {
      i += 1;
    }

    if (src[i] !== '=') {
      attrs[name] = true;
      continue;
    }

    i += 1; // consume '='

    while (i < src.length && /\s/.test(src[i])) {
      i += 1;
    }

    const quote = src[i];

    if (quote === '"' || quote === "'") {
      const end = src.indexOf(quote, i + 1);
      if (end < 0) break;
      attrs[name] = src.slice(i + 1, end);
      i = end + 1;
      continue;
    }

    if (quote === '{') {
      // Find matching `}` with nested-brace support.
      let depth = 1;
      let j = i + 1;
      let innerQuote: string | null = null;

      while (j < src.length && depth > 0) {
        const c = src[j];

        if (innerQuote) {
          if (c === innerQuote && src[j - 1] !== '\\') {
            innerQuote = null;
          }
          j += 1;
          continue;
        }

        if (c === '"' || c === "'" || c === '`') {
          innerQuote = c;
          j += 1;
          continue;
        }

        if (c === '{') depth += 1;
        else if (c === '}') depth -= 1;
        j += 1;
      }

      const expr = src.slice(i + 1, j - 1).trim();
      attrs[name] = extractStringFromExpr(expr);
      i = j;
      continue;
    }

    // Unexpected — skip this char.
    i += 1;
  }

  return attrs;
}

/**
 * Pulls a plain string out of a JSX expression if the expression is a
 * trivial string/template literal. Otherwise returns the raw expression
 * so downstream renderers can decide what to do.
 */
function extractStringFromExpr(expr: string): string {
  // Template literal: `…`
  if (expr.startsWith('`') && expr.endsWith('`')) {
    return expr.slice(1, -1);
  }

  // Single or double quoted string.
  if (
    (expr.startsWith('"') && expr.endsWith('"')) ||
    (expr.startsWith("'") && expr.endsWith("'"))
  ) {
    return expr.slice(1, -1);
  }

  // Numeric literal — return as-is.
  if (/^-?[0-9.]+$/.test(expr)) {
    return expr;
  }

  // Object literal — try to pluck a `name` field if present.
  const nameField = /\bname\s*:\s*['"`]([^'"`]+)['"`]/.exec(expr);
  if (nameField) {
    return nameField[1];
  }

  // Fragment / JSX — strip tags and keep any bare text.
  if (expr.includes('<')) {
    const bareText = expr
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (bareText) return bareText;
  }

  return expr;
}

const ROMAN_PAIRS: Array<[number, string]> = [
  [1000, 'm'],
  [900, 'cm'],
  [500, 'd'],
  [400, 'cd'],
  [100, 'c'],
  [90, 'xc'],
  [50, 'l'],
  [40, 'xl'],
  [10, 'x'],
  [9, 'ix'],
  [5, 'v'],
  [4, 'iv'],
  [1, 'i'],
];

function toRoman(value: string): string {
  const n = Number.parseInt(value, 10);
  if (!Number.isFinite(n) || n <= 0) return value;
  let remaining = n;
  let out = '';
  for (const [v, s] of ROMAN_PAIRS) {
    while (remaining >= v) {
      out += s;
      remaining -= v;
    }
  }
  return out;
}

/** Render a known component to plaintext, or fall back to unwrap/drop. */
function renderComponent(
  tag: string,
  attrs: Attrs,
  body: string,
  options: { slug?: string }
): string {
  const _slug = options.slug; // reserved for future per-slug tweaks
  void _slug;

  switch (tag) {
    // Pure decoration — drop.
    case 'DropCap':
    case 'Crackline':
    case 'HashVerification':
    case 'EldenOrrery':
    case 'HeroMeta':
    case 'VocabSearch':
      return '';

    // Pass-through containers — keep body, drop wrapper.
    case 'Lead':
    case 'Pane':
    case 'Cap':
    case 'Eyebrow':
    case 'Spec':
    case 'AttestCard':
    case 'CalloutRow':
    case 'EvidenceGroup':
    case 'GoldText':
    case 'ConceptCard':
    case 'EvidencePoint':
    case 'LinkPreview':
    case 'RuneGrid':
      return body;

    // Figures.
    case 'Plate': {
      const no = stringAttr(attrs, 'no') ?? 'i';
      const caption = stringAttr(attrs, 'caption');
      const head = caption ? `[Plate ${no} — ${caption}]` : `[Plate ${no}]`;
      return `\n\n${head}\n\n${body}\n\n`;
    }

    case 'FloatImage':
    case 'RuneFigure':
    case 'MagnifierImage': {
      const src = stringAttr(attrs, 'src') ?? '';
      const alt = stringAttr(attrs, 'alt') ?? '';
      const image = src ? `![${alt}](${src})` : '';
      return `\n\n${image}\n\n${body}\n\n`;
    }

    case 'ManuscriptDisplay': {
      const filename = stringAttr(attrs, 'filename') ?? '';
      return `\n\n[Manuscript: ${filename}]\n\n`;
    }

    // Quotation.
    case 'PullQuote': {
      const attribution = stringAttr(attrs, 'attribution');
      const quoted = body
        .trim()
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
      return `\n\n${quoted}${attribution ? `\n> — ${attribution}` : ''}\n\n`;
    }

    case 'Quote': {
      const source = stringAttr(attrs, 'source');
      const quoted = body
        .trim()
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
      return `\n\n${quoted}${source ? `\n> — ${source}` : ''}\n\n`;
    }

    case 'Callout': {
      const title = stringAttr(attrs, 'title');
      const head = title ? `**${title}**\n\n` : '';
      return `\n\n${head}${body}\n\n`;
    }

    // Data rows.
    case 'Correspondence': {
      const n = stringAttr(attrs, 'n') ?? '';
      const glass = stringAttr(attrs, 'glass') ?? '';
      const ring = stringAttr(attrs, 'ring') ?? '';
      return `\n${n}. ${glass} ↔ ${ring}\n`;
    }

    case 'DefinitionItem': {
      const term = stringAttr(attrs, 'term') ?? '';
      const definition = stringAttr(attrs, 'definition') ?? '';
      const source = stringAttr(attrs, 'source');
      const head = `**${term}** — "${definition}"${source ? ` ${source}` : ''}`;
      return `\n\n${head}\n\n${body}\n\n`;
    }

    // Inline.
    case 'Ref': {
      const n = stringAttr(attrs, 'n') ?? '';
      const sub = stringAttr(attrs, 'sub') ?? '';
      const kind = stringAttr(attrs, 'kind');
      const num = kind === 'roman' ? toRoman(n) : n;
      return `[^${num}${sub}]`;
    }

    case 'MarginNote':
      return ` (margin: ${body.trim()}) `;

    case 'AsideInline':
      return ` (aside: ${body.trim()}) `;

    case 'TitleCard': {
      const id = stringAttr(attrs, 'id') ?? '';
      return `[title card: ${id}]`;
    }

    // Fallback: unknown tags — unwrap if paired, drop if self-closing.
    default:
      return body;
  }
}

/** Narrows an attribute to a plain string, returning undefined otherwise. */
function stringAttr(attrs: Attrs, name: string): string | undefined {
  const value = attrs[name];
  if (typeof value === 'string') return value;
  return undefined;
}
