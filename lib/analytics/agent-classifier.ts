/**
 * Server-safe AI agent / crawler User-Agent classifier.
 *
 * Maps a request User-Agent string to a small structured record
 * (`agent_family`, `agent_product`, `agent_mode`, `confidence`,
 * `matched_token`) that downstream analytics in `pb-ba4.5` can attach
 * to `ax_route_request` / `agent_classified` events without re-parsing
 * the UA in every route handler.
 *
 * Source notes (kept here intentionally; do not duplicate inline in
 * every rule below):
 *
 * - Anthropic — ClaudeBot / Claude-SearchBot / Claude-User:
 *   https://support.anthropic.com/en/articles/8896518
 * - OpenAI — GPTBot / OAI-SearchBot / ChatGPT-User:
 *   https://platform.openai.com/docs/bots
 * - Perplexity — PerplexityBot / Perplexity-User:
 *   https://docs.perplexity.ai/guides/bots
 * - Google — Googlebot, GoogleOther:
 *   https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
 * - Apple — Applebot:
 *   https://support.apple.com/en-us/HT204683
 * - Common Crawl — CCBot:
 *   https://commoncrawl.org/big-picture/frequently-asked-questions/
 * - Amazon — Amazonbot:
 *   https://developer.amazon.com/amazonbot
 * - Meta — meta-externalagent / meta-externalfetcher /
 *   facebookexternalhit:
 *   https://developers.facebook.com/docs/sharing/webmasters/web-crawlers
 * - Microsoft — bingbot:
 *   https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0
 * - ByteDance — Bytespider:
 *   https://user-agents.net/bots/bytespider
 *
 * `Google-Extended` and `Applebot-Extended` are robots.txt opt-out
 * tokens, not user-agent strings, so they are deliberately not entries
 * in this classifier. Real traffic from those programs surfaces with
 * the `Googlebot` / `Applebot` UAs, which are already classified.
 *
 * Unknown clients on AX surfaces classify as `unknown` rather than
 * being over-attributed to a heuristic family.
 */

/** Provider / organization the agent is attributed to. */
export type AgentFamily =
  | 'anthropic'
  | 'openai'
  | 'perplexity'
  | 'google'
  | 'apple'
  | 'common_crawl'
  | 'amazon'
  | 'meta'
  | 'microsoft'
  | 'bytedance'
  | 'browser'
  | 'unknown';

/** What the agent is doing on the wire, as documented by its operator. */
export type AgentMode =
  | 'training' // bulk crawl for AI training corpus
  | 'search' // index for an AI / answer engine
  | 'user_fetch' // fetched on behalf of a single user prompt
  | 'general_search' // traditional web-search engine indexer
  | 'preview' // link unfurling / social-card preview
  | 'browser' // ordinary web browser
  | 'unknown';

export type AgentConfidence = 'high' | 'medium' | 'low' | 'none';

export type AgentClassification = {
  agent_family: AgentFamily;
  /** Operator-published product name, e.g. 'ClaudeBot'; '' when unknown. */
  agent_product: string;
  agent_mode: AgentMode;
  confidence: AgentConfidence;
  /** Original-cased token that triggered the match, or null. */
  matched_token: string | null;
};

type AgentRule = {
  /** Substring to look for; matched case-insensitively. */
  token: string;
  family: AgentFamily;
  product: string;
  mode: AgentMode;
};

// Order matters: more specific tokens must come before less specific
// ones that would match the same UA (e.g., `Claude-SearchBot` before
// `ClaudeBot`, `OAI-SearchBot` and `ChatGPT-User` before `GPTBot`).
const AGENT_RULES: AgentRule[] = [
  // Anthropic
  { token: 'Claude-SearchBot', family: 'anthropic', product: 'Claude-SearchBot', mode: 'search' },
  { token: 'Claude-User', family: 'anthropic', product: 'Claude-User', mode: 'user_fetch' },
  { token: 'ClaudeBot', family: 'anthropic', product: 'ClaudeBot', mode: 'training' },
  // OpenAI
  { token: 'OAI-SearchBot', family: 'openai', product: 'OAI-SearchBot', mode: 'search' },
  { token: 'ChatGPT-User', family: 'openai', product: 'ChatGPT-User', mode: 'user_fetch' },
  { token: 'GPTBot', family: 'openai', product: 'GPTBot', mode: 'training' },
  // Perplexity
  {
    token: 'Perplexity-User',
    family: 'perplexity',
    product: 'Perplexity-User',
    mode: 'user_fetch',
  },
  { token: 'PerplexityBot', family: 'perplexity', product: 'PerplexityBot', mode: 'search' },
  // Google
  { token: 'GoogleOther', family: 'google', product: 'GoogleOther', mode: 'general_search' },
  { token: 'Googlebot', family: 'google', product: 'Googlebot', mode: 'general_search' },
  // Apple
  { token: 'Applebot', family: 'apple', product: 'Applebot', mode: 'general_search' },
  // Common Crawl
  { token: 'CCBot', family: 'common_crawl', product: 'CCBot', mode: 'training' },
  // Amazon
  { token: 'Amazonbot', family: 'amazon', product: 'Amazonbot', mode: 'general_search' },
  // Meta — token names are lower-cased per the UA strings Meta publishes.
  { token: 'meta-externalagent', family: 'meta', product: 'Meta-ExternalAgent', mode: 'training' },
  {
    token: 'meta-externalfetcher',
    family: 'meta',
    product: 'Meta-ExternalFetcher',
    mode: 'user_fetch',
  },
  { token: 'facebookexternalhit', family: 'meta', product: 'FacebookExternalHit', mode: 'preview' },
  // Microsoft
  { token: 'bingbot', family: 'microsoft', product: 'Bingbot', mode: 'general_search' },
  // ByteDance
  { token: 'Bytespider', family: 'bytedance', product: 'Bytespider', mode: 'training' },
];

// Browser detection is intentionally conservative. Edge / Opera UAs
// also contain `Chrome/` and `Safari/`, so the more specific tokens
// are listed first; pure Safari is matched only as a last resort.
const BROWSER_RULES: AgentRule[] = [
  { token: 'Edg/', family: 'browser', product: 'Edge', mode: 'browser' },
  { token: 'OPR/', family: 'browser', product: 'Opera', mode: 'browser' },
  { token: 'Firefox/', family: 'browser', product: 'Firefox', mode: 'browser' },
  { token: 'Chrome/', family: 'browser', product: 'Chrome', mode: 'browser' },
  { token: 'Safari/', family: 'browser', product: 'Safari', mode: 'browser' },
];

const UNKNOWN: AgentClassification = {
  agent_family: 'unknown',
  agent_product: '',
  agent_mode: 'unknown',
  confidence: 'none',
  matched_token: null,
};

/**
 * Classify a User-Agent string.
 *
 * Empty or nullish input and UAs that do not match any known token
 * collapse to `unknown` rather than being over-attributed to a
 * heuristic family. Browsers match with `medium` confidence because
 * the UA is trivially spoofable; named AI / crawler tokens match
 * with `high` confidence because the operators publish them.
 */
export function classifyUserAgent(rawUserAgent: string | null | undefined): AgentClassification {
  if (rawUserAgent == null) return UNKNOWN;
  const ua = rawUserAgent.trim();
  if (ua.length === 0) return UNKNOWN;

  const lower = ua.toLowerCase();

  for (const rule of AGENT_RULES) {
    if (lower.includes(rule.token.toLowerCase())) {
      return {
        agent_family: rule.family,
        agent_product: rule.product,
        agent_mode: rule.mode,
        confidence: 'high',
        matched_token: rule.token,
      };
    }
  }

  for (const rule of BROWSER_RULES) {
    if (ua.includes(rule.token)) {
      return {
        agent_family: rule.family,
        agent_product: rule.product,
        agent_mode: rule.mode,
        confidence: 'medium',
        matched_token: rule.token,
      };
    }
  }

  return UNKNOWN;
}
