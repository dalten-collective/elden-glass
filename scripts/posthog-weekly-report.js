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
          count(DISTINCT distinct_id) AS actors,
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
  printSummaryTable([['7d', agent7d]], ['events', 'actors', 'last_seen']);
  console.log('');
  printTable('Daily Human Trend', daily, ['day', 'pageviews', 'visitors', 'sessions']);
  printTable('Top Human Pages, 7d', topPages, ['path', 'pageviews', 'visitors']);
  printTable('Human Referrers, 7d', referrers, ['referrer', 'pageviews', 'visitors']);
  printTable('Top Agent Identities, 7d', agents, [
    'family',
    'product',
    'events',
    'actors',
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
      count() AS events,
      count(DISTINCT distinct_id) AS actors,
      max(timestamp) AS last_seen
    FROM events
    WHERE event IN ('agent_classified', 'ax_route_request')
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
async function queryRows(query, values = {}) {
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
  return String(value).replace(/\|/g, '\\|');
}
