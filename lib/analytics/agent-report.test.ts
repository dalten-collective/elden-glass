import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { analyzeAgentRequests, agentReportWindow, type AgentRequestRow } from './agent-report.ts';

test('historical reclassification preserves weighted totals and unique paths', () => {
  const rows: AgentRequestRow[] = [
    {
      day: '2026-09-04',
      user_agent: null,
      path: '/admin.php',
      requests: 257,
      recorded_unknown: true,
    },
    {
      day: '2026-09-04',
      user_agent: 'AhrefsBot/7.0',
      path: '/tldr',
      requests: 8,
      recorded_unknown: true,
    },
    {
      day: '2026-09-05',
      user_agent: 'AhrefsBot/7.0',
      path: '/tldr',
      requests: 3,
      recorded_unknown: true,
    },
    {
      day: '2026-09-05',
      user_agent: 'Claude-User/1.0',
      path: '/tldr',
      requests: 2,
      recorded_unknown: false,
    },
  ];
  const report = analyzeAgentRequests(rows, new Set(['/tldr']));
  assert.equal(report.requests, 270);
  assert.equal(report.recordedUnknown, 268);
  assert.equal(report.remainingUnknown, 257);
  assert.deepEqual(
    report.unknownProducts.find((row) => row.label === 'AhrefsBot'),
    { label: 'AhrefsBot', requests: 11, paths: 1 }
  );
  assert.deepEqual(report.unknownSurfaces, [{ label: 'probe', requests: 257, paths: 1 }]);
  assert.deepEqual(report.userFetchPaths, [
    { label: 'Claude-User / /tldr', requests: 2, paths: 1 },
  ]);
  assert.equal(
    report.surfaces.find((row) => row.label === 'authored_path_in_checkout')?.requests,
    13
  );
});

test('report distinguishes assets, telemetry and unverified site paths', () => {
  const rows = ['/duchamp/art.jpg', '/_eg/mark/i/v0/e/', '/invented-page'].map((path) => ({
    day: '2026-09-13',
    user_agent: null,
    path,
    requests: 1,
    recorded_unknown: true,
  }));
  assert.deepEqual(
    analyzeAgentRequests(rows, new Set()).surfaces.map((row) => row.label),
    ['site_path', 'static_asset', 'telemetry']
  );
});

test('authored matching accepts a trailing slash while preserving the recorded path', () => {
  const report = analyzeAgentRequests(
    [
      {
        day: '2026-09-14',
        user_agent: 'curl/8.0',
        path: '/tldr/',
        requests: 2,
        recorded_unknown: true,
      },
    ],
    new Set(['/tldr'])
  );
  assert.deepEqual(report.surfaces, [
    { label: 'authored_path_in_checkout', requests: 2, paths: 1 },
  ]);
  assert.equal(report.topPaths[0].label, '/tldr/');
});

test('a claimed user-fetch agent can be requesting credential paths', () => {
  const report = analyzeAgentRequests(
    [
      {
        day: '2026-08-17',
        user_agent: 'Perplexity-User/1.0',
        path: '/.ssh/id_ecdsa',
        requests: 2,
        recorded_unknown: false,
      },
    ],
    new Set()
  );
  assert.deepEqual(report.probeProducts, [
    { label: 'Perplexity-User / user_fetch', requests: 2, paths: 1 },
  ]);
  assert.equal(report.products[0].label, 'perplexity / Perplexity-User / user_fetch');
});

test('default window covers 30 complete UTC days and accepts an explicit window', () => {
  assert.deepEqual(agentReportWindow(undefined, undefined, new Date('2026-09-16T18:00:00Z')), {
    start: '2026-08-17',
    end: '2026-09-16',
  });
  assert.deepEqual(agentReportWindow('2026-08-24', '2026-08-25'), {
    start: '2026-08-24',
    end: '2026-08-25',
  });
  assert.throws(() => agentReportWindow('2026-02-30', '2026-03-02'));
  assert.throws(() => agentReportWindow('2026-09-16', '2026-09-16'));
  assert.throws(() => agentReportWindow(undefined, 'invalid'));
});
