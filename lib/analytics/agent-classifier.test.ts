/**
 * Tests for the AI agent / crawler User-Agent classifier.
 *
 * Run with `node --test lib/analytics/agent-classifier.test.ts`. Node
 * 22.6+ strips TypeScript types natively, so no transpile step is
 * required. The npm script `test:agent-classifier` wires this up.
 */

import { test } from 'node:test';
import { strict as assert } from 'node:assert';

import { classifyUserAgent } from './agent-classifier.ts';

// Representative real-world UA samples, abbreviated where the trailing
// contact-URL portion does not affect classification.
const UA = {
  claudeBot: 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +mailto:support@anthropic.com)',
  claudeSearchBot: 'Mozilla/5.0 (compatible; Claude-SearchBot/1.0; +https://anthropic.com)',
  claudeUser: 'Claude-User/1.0 (+https://www.anthropic.com)',
  gptBot:
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0; +https://openai.com/gptbot',
  oaiSearchBot:
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot',
  chatgptUser:
    'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot',
  perplexityBot:
    'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
  perplexityUser:
    'Mozilla/5.0 (compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)',
  googlebot: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  googleOther: 'GoogleOther',
  applebot: 'Mozilla/5.0 (compatible; Applebot/0.1; +http://www.apple.com/go/applebot)',
  ccBot: 'CCBot/2.0 (https://commoncrawl.org/faq/)',
  amazonbot:
    'Mozilla/5.0 (compatible; Amazonbot/0.1; +https://developer.amazon.com/support/amazonbot)',
  metaExternalAgent:
    'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)',
  metaExternalFetcher:
    'meta-externalfetcher/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)',
  facebookExternalHit: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  bingbot: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
  bytespider:
    'Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; spider-feedback@bytedance.com)',
  chrome:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  safari:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15',
  firefox: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:124.0) Gecko/20100101 Firefox/124.0',
  edge: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  curl: 'curl/8.5.0',
  msie6: 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
};

// --- Anthropic distinctions (acceptance criterion) ---

test('ClaudeBot is anthropic / training', () => {
  const r = classifyUserAgent(UA.claudeBot);
  assert.equal(r.agent_family, 'anthropic');
  assert.equal(r.agent_product, 'ClaudeBot');
  assert.equal(r.agent_mode, 'training');
  assert.equal(r.confidence, 'high');
  assert.equal(r.matched_token, 'ClaudeBot');
});

test('Claude-SearchBot is anthropic / search', () => {
  const r = classifyUserAgent(UA.claudeSearchBot);
  assert.equal(r.agent_family, 'anthropic');
  assert.equal(r.agent_product, 'Claude-SearchBot');
  assert.equal(r.agent_mode, 'search');
  assert.equal(r.matched_token, 'Claude-SearchBot');
});

test('Claude-User is anthropic / user_fetch', () => {
  const r = classifyUserAgent(UA.claudeUser);
  assert.equal(r.agent_family, 'anthropic');
  assert.equal(r.agent_product, 'Claude-User');
  assert.equal(r.agent_mode, 'user_fetch');
  assert.equal(r.matched_token, 'Claude-User');
});

test('Anthropic agents resolve to three distinct modes', () => {
  const modes = new Set([
    classifyUserAgent(UA.claudeBot).agent_mode,
    classifyUserAgent(UA.claudeSearchBot).agent_mode,
    classifyUserAgent(UA.claudeUser).agent_mode,
  ]);
  assert.equal(modes.size, 3);
});

// --- OpenAI distinctions (acceptance criterion) ---

test('GPTBot is openai / training', () => {
  const r = classifyUserAgent(UA.gptBot);
  assert.equal(r.agent_family, 'openai');
  assert.equal(r.agent_product, 'GPTBot');
  assert.equal(r.agent_mode, 'training');
});

test('OAI-SearchBot is openai / search', () => {
  const r = classifyUserAgent(UA.oaiSearchBot);
  assert.equal(r.agent_family, 'openai');
  assert.equal(r.agent_product, 'OAI-SearchBot');
  assert.equal(r.agent_mode, 'search');
});

test('ChatGPT-User is openai / user_fetch', () => {
  const r = classifyUserAgent(UA.chatgptUser);
  assert.equal(r.agent_family, 'openai');
  assert.equal(r.agent_product, 'ChatGPT-User');
  assert.equal(r.agent_mode, 'user_fetch');
});

test('OpenAI agents resolve to three distinct modes', () => {
  const modes = new Set([
    classifyUserAgent(UA.gptBot).agent_mode,
    classifyUserAgent(UA.oaiSearchBot).agent_mode,
    classifyUserAgent(UA.chatgptUser).agent_mode,
  ]);
  assert.equal(modes.size, 3);
});

// --- Other AX-relevant agents ---

test('PerplexityBot is perplexity / search', () => {
  const r = classifyUserAgent(UA.perplexityBot);
  assert.equal(r.agent_family, 'perplexity');
  assert.equal(r.agent_mode, 'search');
});

test('Perplexity-User is perplexity / user_fetch', () => {
  const r = classifyUserAgent(UA.perplexityUser);
  assert.equal(r.agent_family, 'perplexity');
  assert.equal(r.agent_mode, 'user_fetch');
});

test('Googlebot is google / general_search', () => {
  const r = classifyUserAgent(UA.googlebot);
  assert.equal(r.agent_family, 'google');
  assert.equal(r.agent_product, 'Googlebot');
  assert.equal(r.agent_mode, 'general_search');
});

test('GoogleOther is distinct from Googlebot', () => {
  const r = classifyUserAgent(UA.googleOther);
  assert.equal(r.agent_family, 'google');
  assert.equal(r.agent_product, 'GoogleOther');
});

test('Applebot is apple / general_search', () => {
  const r = classifyUserAgent(UA.applebot);
  assert.equal(r.agent_family, 'apple');
  assert.equal(r.agent_product, 'Applebot');
});

test('CCBot is common_crawl / training', () => {
  const r = classifyUserAgent(UA.ccBot);
  assert.equal(r.agent_family, 'common_crawl');
  assert.equal(r.agent_mode, 'training');
});

test('Amazonbot is amazon / general_search', () => {
  const r = classifyUserAgent(UA.amazonbot);
  assert.equal(r.agent_family, 'amazon');
  assert.equal(r.agent_mode, 'general_search');
});

test('meta-externalagent is meta / training', () => {
  const r = classifyUserAgent(UA.metaExternalAgent);
  assert.equal(r.agent_family, 'meta');
  assert.equal(r.agent_mode, 'training');
});

test('meta-externalfetcher is meta / user_fetch', () => {
  const r = classifyUserAgent(UA.metaExternalFetcher);
  assert.equal(r.agent_family, 'meta');
  assert.equal(r.agent_mode, 'user_fetch');
});

test('facebookexternalhit is meta / preview', () => {
  const r = classifyUserAgent(UA.facebookExternalHit);
  assert.equal(r.agent_family, 'meta');
  assert.equal(r.agent_mode, 'preview');
});

test('bingbot is microsoft / general_search', () => {
  const r = classifyUserAgent(UA.bingbot);
  assert.equal(r.agent_family, 'microsoft');
  assert.equal(r.agent_mode, 'general_search');
});

test('Bytespider is bytedance / training', () => {
  const r = classifyUserAgent(UA.bytespider);
  assert.equal(r.agent_family, 'bytedance');
  assert.equal(r.agent_mode, 'training');
});

// --- Browsers ---

test('Chrome on macOS is browser / Chrome', () => {
  const r = classifyUserAgent(UA.chrome);
  assert.equal(r.agent_family, 'browser');
  assert.equal(r.agent_product, 'Chrome');
  assert.equal(r.agent_mode, 'browser');
  assert.equal(r.confidence, 'medium');
});

test('Safari on macOS is browser / Safari (no Chrome match)', () => {
  const r = classifyUserAgent(UA.safari);
  assert.equal(r.agent_family, 'browser');
  assert.equal(r.agent_product, 'Safari');
});

test('Firefox is browser / Firefox', () => {
  const r = classifyUserAgent(UA.firefox);
  assert.equal(r.agent_family, 'browser');
  assert.equal(r.agent_product, 'Firefox');
});

test('Edge UA matches Edge before Chrome', () => {
  const r = classifyUserAgent(UA.edge);
  assert.equal(r.agent_family, 'browser');
  assert.equal(r.agent_product, 'Edge');
  assert.equal(r.matched_token, 'Edg/');
});

// --- Unknowns / legacy / malformed ---

test('null UA is unknown', () => {
  const r = classifyUserAgent(null);
  assert.equal(r.agent_family, 'unknown');
  assert.equal(r.agent_mode, 'unknown');
  assert.equal(r.confidence, 'none');
  assert.equal(r.matched_token, null);
});

test('undefined UA is unknown', () => {
  const r = classifyUserAgent(undefined);
  assert.equal(r.agent_family, 'unknown');
});

test('empty string UA is unknown', () => {
  const r = classifyUserAgent('');
  assert.equal(r.agent_family, 'unknown');
});

test('whitespace-only UA is unknown', () => {
  const r = classifyUserAgent('   \t\n');
  assert.equal(r.agent_family, 'unknown');
});

test('curl identifies a script without attributing an operator', () => {
  const r = classifyUserAgent(UA.curl);
  assert.equal(r.agent_family, 'unattributed');
  assert.equal(r.agent_mode, 'script');
});

test('legacy IE6 UA is unknown (no recognized engine token)', () => {
  const r = classifyUserAgent(UA.msie6);
  assert.equal(r.agent_family, 'unknown');
});

test('case-insensitive match for AI tokens (lower-cased ClaudeBot)', () => {
  const r = classifyUserAgent('mozilla/5.0 (compatible; claudebot/1.0)');
  assert.equal(r.agent_family, 'anthropic');
  assert.equal(r.agent_product, 'ClaudeBot');
  assert.equal(r.matched_token, 'ClaudeBot');
});

test('arbitrary string with no known token is unknown', () => {
  const r = classifyUserAgent('SomeRandomScraper/9.9 (please stop)');
  assert.equal(r.agent_family, 'unknown');
});

test('named crawlers take precedence over embedded browser tokens', () => {
  for (const [token, family, mode] of [
    ['AhrefsBot/7.0', 'ahrefs', 'seo'],
    ['AwarioBot/1.0', 'awario', 'monitoring'],
    ['SeznamBot/4.0', 'seznam', 'general_search'],
    ['SemrushBot/7~bl', 'semrush', 'seo'],
    ['DuckDuckBot/1.1', 'duckduckgo', 'general_search'],
    ['ExaSearchBot/1.0', 'exa', 'search'],
    ['DataForSeoBot/1.0', 'dataforseo', 'seo'],
    ['Twitterbot/1.0', 'twitter', 'preview'],
    ['Slackbot-LinkExpanding 1.0', 'slack', 'preview'],
  ]) {
    const result = classifyUserAgent(
      `Mozilla/5.0 AppleWebKit/537.36 Chrome/124.0 Safari/537.36 ${token}`
    );
    assert.equal(result.agent_family, family, token);
    assert.equal(result.agent_mode, mode, token);
  }
});

test('generic software and audit labels do not imply an AI provider or human owner', () => {
  for (const [ua, mode] of [
    ['jscrawler/0.1', 'crawl'],
    ['heritrix/3.14.2 +https://www.image-meta.com', 'crawl'],
    ['Codex-agent-experience-audit/1.0', 'audit'],
    ['Python-urllib/3.14', 'script'],
    ['python-requests/2.0', 'script'],
    ['NetworkingExtension/8624.5 Network/5812 iOS/26.6.1', 'client'],
  ]) {
    const result = classifyUserAgent(ua);
    assert.equal(result.agent_family, 'unattributed', ua);
    assert.equal(result.agent_mode, mode, ua);
    assert.equal(result.confidence, 'medium', ua);
  }
  assert.equal(classifyUserAgent('ImageMetaBot/1.0 Image-Classification').agent_mode, 'crawl');
});

test('iPhone embedded WebKit is browser-like while native networking is not JS evidence', () => {
  assert.equal(
    classifyUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 26_6) AppleWebKit/605.1.15 Mobile/23G71 Twitter for iPhone/12.20'
    ).agent_mode,
    'browser'
  );
  assert.equal(
    classifyUserAgent('com.apple.WebKit.Networking/21624 Network/5812 macOS/26.6.2').agent_mode,
    'client'
  );
});
