#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_PROJECT_ID = '402828';
const DEFAULT_HOST = 'https://us.posthog.com';

loadDotenvFile('.env.local');
loadDotenvFile('.env');

const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
const projectId = process.env.POSTHOG_PROJECT_ID || DEFAULT_PROJECT_ID;
const posthogHost = (process.env.POSTHOG_QUERY_HOST || DEFAULT_HOST).replace(/\/$/, '');
const environment = process.env.POSTHOG_REPORT_ENV || 'production';

if (!apiKey) {
  console.error(
    'Missing POSTHOG_PERSONAL_API_KEY. Add it to .env.local or export it before running this report.'
  );
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

/**
 * Emits a markdown weekly traffic report from PostHog HogQL.
 */
async function main() {
  if (process.argv.includes('--agents')) return agentTrafficReport();

  const [human1d, human7d, human30d, agent7d, daily, topPages, referrers, agents, axPaths] =
    await Promise.all([
      humanSummary(1),
      humanSummary(7),
      humanSummary(30),
      agentSummary(7),
      queryRows(
        `
        SELECT
          toDate(timestamp) AS day,
          count() AS pageviews,
          count(DISTINCT person_id) AS visitors,
          count(DISTINCT properties['$session_id']) AS sessions
        FROM events
        WHERE event = '$pageview'
          AND properties['environment'] = {environment}
          AND timestamp >= now() - INTERVAL 14 DAY
        GROUP BY day
        ORDER BY day ASC
        `,
        { environment }
      ),
      queryRows(
        `
        SELECT
          coalesce(nullIf(properties['$pathname'], ''), path(properties['$current_url'])) AS path,
          count() AS pageviews,
          count(DISTINCT person_id) AS visitors
        FROM events
        WHERE event = '$pageview'
          AND properties['environment'] = {environment}
          AND timestamp >= now() - INTERVAL 7 DAY
        GROUP BY path
        ORDER BY pageviews DESC
        LIMIT 10
        `,
        { environment }
      ),
      queryRows(
        `
        SELECT
          coalesce(nullIf(properties['$referring_domain'], ''), 'direct') AS referrer,
          count() AS pageviews,
          count(DISTINCT person_id) AS visitors
        FROM events
        WHERE event = '$pageview'
          AND properties['environment'] = {environment}
          AND timestamp >= now() - INTERVAL 7 DAY
        GROUP BY referrer
        ORDER BY pageviews DESC
        LIMIT 10
        `,
        { environment }
      ),
      queryRows(
        `
        SELECT
          coalesce(nullIf(properties['agent_family'], ''), 'unknown') AS family,
          coalesce(nullIf(properties['agent_product'], ''), 'unknown') AS product,
          count() AS events,
          count(DISTINCT distinct_id) AS identity_buckets,
          max(timestamp) AS last_seen
        FROM events
        WHERE event = 'agent_classified'
          AND properties['environment'] = {environment}
          AND timestamp >= now() - INTERVAL 7 DAY
        GROUP BY family, product
        ORDER BY events DESC
        LIMIT 10
        `,
        { environment }
      ),
      queryRows(
        `
        SELECT
          coalesce(nullIf(properties['path'], ''), coalesce(nullIf(properties['request_path'], ''), 'unknown')) AS path,
          coalesce(nullIf(properties['route_family'], ''), 'unknown') AS route_family,
          count() AS requests
        FROM events
        WHERE event = 'ax_route_request'
          AND properties['environment'] = {environment}
          AND timestamp >= now() - INTERVAL 7 DAY
        GROUP BY path, route_family
        ORDER BY requests DESC
        LIMIT 15
        `,
        { environment }
      ),
    ]);

  console.log(`# Elden Glass Traffic Readout`);
  console.log('');
  console.log(`Generated: ${new Date().toISOString()}`);
  console.log(`Environment: ${environment}`);
  console.log('');
  console.log(`## Human Traffic`);
  console.log('');
  printSummaryTable([
    ['24h', human1d],
    ['7d', human7d],
    ['30d', human30d],
  ]);
  console.log('');
  console.log(`## Agent Traffic`);
  console.log('');
  printSummaryTable([['7d', agent7d]], ['requests', 'identity_buckets', 'last_seen']);
  console.log('');
  printTable('Daily Human Trend', daily, ['day', 'pageviews', 'visitors', 'sessions']);
  printTable('Top Human Pages, 7d', topPages, ['path', 'pageviews', 'visitors']);
  printTable('Human Referrers, 7d', referrers, ['referrer', 'pageviews', 'visitors']);
  console.log('Identity buckets group UA classifications; they are not unique visitors or bots.');
  printTable('Top Agent Identities, 7d', agents, [
    'family',
    'product',
    'events',
    'identity_buckets',
    'last_seen',
  ]);
  printTable('Top AX Paths, 7d', axPaths, ['path', 'route_family', 'requests']);
}

/**
 * Queries human pageview volume for the requested lookback window.
 */
async function humanSummary(days) {
  const rows = await queryRows(
    `
    SELECT
      count() AS pageviews,
      count(DISTINCT person_id) AS visitors,
      count(DISTINCT properties['$session_id']) AS sessions,
      max(timestamp) AS last_seen
    FROM events
    WHERE event = '$pageview'
      AND properties['environment'] = {environment}
      AND timestamp >= now() - INTERVAL ${Number(days)} DAY
    `,
    { environment }
  );
  return rows[0] || {};
}

/**
 * Queries agent event volume for the requested lookback window.
 */
async function agentSummary(days) {
  const rows = await queryRows(
    `
    SELECT
      count() AS requests,
      count(DISTINCT distinct_id) AS identity_buckets,
      max(timestamp) AS last_seen
    FROM events
    WHERE event = 'ax_route_request'
      AND properties['environment'] = {environment}
      AND timestamp >= now() - INTERVAL ${Number(days)} DAY
    `,
    { environment }
  );
  return rows[0] || {};
}

/**
 * Executes one HogQL query and maps returned rows to column names.
 */
async function queryRows(query, values = {}, requireComplete = false) {
  const response = await fetch(`${posthogHost}/api/projects/${projectId}/query/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: {
        kind: 'HogQLQuery',
        query,
        values,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`PostHog query failed (${response.status}): ${body}`);
  }

  const payload = await response.json();
  if (requireComplete && (payload.hasMore || !Array.isArray(payload.results))) {
    throw new Error('Incomplete PostHog query result; narrow the report date window.');
  }
  const columns = payload.columns || [];
  return (payload.results || []).map((row) =>
    Object.fromEntries(columns.map((column, index) => [column, row[index]]))
  );
}

/**
 * Loads simple KEY=value dotenv files without adding a runtime dependency.
 */
function loadDotenvFile(filename) {
  const filePath = path.join(process.cwd(), filename);
  if (!fs.existsSync(filePath)) return;

  for (const rawLine of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
  }
}

/**
 * Prints a summary table for lookback-window metrics.
 */
function printSummaryTable(rows, metrics = ['pageviews', 'visitors', 'sessions', 'last_seen']) {
  console.log(`| Window | ${metrics.join(' | ')} |`);
  console.log(`| --- | ${metrics.map(() => '---:').join(' | ')} |`);
  for (const [label, row] of rows) {
    console.log(`| ${label} | ${metrics.map((metric) => formatValue(row[metric])).join(' | ')} |`);
  }
}

/**
 * Prints a titled markdown table.
 */
function printTable(title, rows, columns) {
  console.log('');
  console.log(`## ${title}`);
  console.log('');
  if (rows.length === 0) {
    console.log('_No rows returned._');
    console.log('');
    return;
  }
  console.log(`| ${columns.join(' | ')} |`);
  console.log(`| ${columns.map(() => '---').join(' | ')} |`);
  for (const row of rows) {
    console.log(`| ${columns.map((column) => formatValue(row[column])).join(' | ')} |`);
  }
  console.log('');
}

/**
 * Escapes markdown table cells and keeps nullish values legible.
 */
function formatValue(value) {
  if (value === null || value === undefined || value === '') return '-';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[\r\n]/g, ' ')
    .replace(/\|/g, '\\|');
}

/** Print a historical agent report using the same rules as runtime capture. */
async function agentTrafficReport() {
  const { analyzeAgentRequests, agentReportWindow } = require('../lib/analytics/agent-report.ts');
  const window = agentReportWindow(
    process.env.POSTHOG_REPORT_START,
    process.env.POSTHOG_REPORT_END
  );
  // Group only request events. Paired classification events would double counts.
  const rows = await queryRows(
    `
    SELECT toDate(timestamp) AS day,
      properties['user_agent'] AS user_agent,
      properties['path'] AS path,
      (properties['agent_family'] = 'unknown'
        OR distinct_id LIKE 'agent:unknown:%'
        OR distinct_id LIKE 'agent_surface_unknown:%') AS recorded_unknown,
      count() AS requests
    FROM events
    WHERE event = 'ax_route_request'
      AND properties['environment'] = {environment}
      AND timestamp >= {start} AND timestamp < {end}
    GROUP BY day, user_agent, path, recorded_unknown
    ORDER BY day, path, user_agent
    LIMIT 50000
  `,
    { environment, ...window },
    true
  );
  if (rows.length >= 50000) throw new Error('Report row limit reached; narrow the date window.');
  const report = analyzeAgentRequests(rows, authoredPaths());
  if (process.argv.includes('--json')) {
    console.log(
      JSON.stringify({ environment, window, classification_version: 2, ...report }, null, 2)
    );
    return;
  }

  // Keep totals complete; ranked tables are explicitly limited for readability.
  console.log('# Elden Glass Agent Traffic');
  console.log(
    `\nEnvironment: ${environment}. UTC window: ${window.start} inclusive to ${window.end} exclusive.`
  );
  console.log(
    `\n${report.requests} recorded requests. ${report.recordedUnknown} recorded as unknown; ${report.remainingUnknown} remain unrecognized under classifier version 2.`
  );
  console.log(
    '\nCounts are requests, not people or successful reads. UA identities are self-reported. Authored paths are matched against this checkout, not a historical deployment.'
  );
  console.log(
    '\nThis replays captured rows only. Browser pageviews and requests omitted by capture are not reconstructed. Stored PostHog events are unchanged.'
  );
  const columns = ['label', 'requests', 'paths'];
  printTable('Products and stated modes', report.products, columns);
  printTable('Requested surfaces', report.surfaces, columns);
  printTable('Probe paths by claimed product and mode', report.probeProducts, columns);
  printTable('Daily requests', report.daily, columns);
  printTable('Previously unknown: reclassified products', report.unknownProducts, columns);
  printTable(
    'Previously unknown: largest daily product counts (top 30)',
    report.unknownDaily.slice(0, 30),
    columns
  );
  printTable('Still unrecognized: requested surfaces', report.unknownSurfaces, columns);
  printTable(
    'Still unrecognized: raw user agents (top 30)',
    report.unknownUserAgents.slice(0, 30),
    columns
  );
  printTable('Most requested paths (top 20)', report.topPaths.slice(0, 20), columns);
  printTable('User-fetch products and paths (top 20)', report.userFetchPaths.slice(0, 20), columns);
}

/** Match filesystem-derived authored URLs using the content system's slug convention. */
function authoredPaths() {
  const paths = new Set();
  for (const [directory, prefix] of [
    ['content/pages', ''],
    ['content/critiques', '/critiques'],
  ]) {
    if (!fs.existsSync(directory)) continue;
    for (const filename of fs.readdirSync(directory, { recursive: true })) {
      if (filename.endsWith('.mdx'))
        paths.add(`${prefix}/${filename.replaceAll(path.sep, '/').slice(0, -4)}`);
    }
  }
  return paths;
}
