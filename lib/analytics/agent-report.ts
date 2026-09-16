import { classifyUserAgent } from './agent-classifier.ts';
import { normalizePath, routeFamilyForPath } from './route-family.ts';

/** Aggregated ax_route_request rows; requests is the event count, not visitors. */
export type AgentRequestRow = {
  day: string;
  user_agent: string | null;
  path: string;
  requests: number;
  recorded_unknown: boolean;
};

/** One report grouping, with a count of distinct requested paths. */
export type AgentReportGroup = {
  label: string;
  requests: number;
  paths: number;
};

/** Reclassification of historical requests, without modifying stored events. */
export function analyzeAgentRequests(rows: AgentRequestRow[], contentPaths: ReadonlySet<string>) {
  const classified = rows.map((row) => ({
    ...row,
    ...classifyUserAgent(row.user_agent),
    route_family: routeFamilyForPath(row.path),
  }));
  const recordedUnknown = classified.filter((row) => row.recorded_unknown);
  const remainingUnknown = recordedUnknown.filter((row) => row.agent_family === 'unknown');
  const count = (items: AgentRequestRow[]) => items.reduce((sum, row) => sum + row.requests, 0);

  // Local content matching describes the checkout used to run the report.
  // It cannot establish that a historic request returned an article successfully.
  return {
    requests: count(classified),
    recordedUnknown: count(recordedUnknown),
    remainingUnknown: count(remainingUnknown),
    products: groupRequests(
      classified,
      (row) => `${row.agent_family} / ${row.agent_product || 'unknown'} / ${row.agent_mode}`
    ),
    surfaces: groupRequests(classified, (row) =>
      contentPaths.has(normalizePath(row.path)) ? 'authored_path_in_checkout' : row.route_family
    ),
    daily: groupRequests(classified, (row) => row.day).sort((a, b) =>
      a.label.localeCompare(b.label)
    ),
    unknownProducts: groupRequests(
      recordedUnknown,
      (row) => row.agent_product || '(unrecognized UA)'
    ),
    unknownDaily: groupRequests(
      recordedUnknown,
      (row) => `${row.day} / ${row.agent_product || '(unrecognized UA)'}`
    ),
    unknownSurfaces: groupRequests(remainingUnknown, (row) => row.route_family),
    unknownUserAgents: groupRequests(
      remainingUnknown,
      (row) => row.user_agent || '(no recorded UA)'
    ),
    topPaths: groupRequests(classified, (row) => row.path),
    probeProducts: groupRequests(
      classified.filter((row) => row.route_family === 'probe'),
      (row) => `${row.agent_product || '(unrecognized UA)'} / ${row.agent_mode}`
    ),
    userFetchPaths: groupRequests(
      classified.filter((row) => row.agent_mode === 'user_fetch'),
      (row) => `${row.agent_product} / ${row.path}`
    ),
  };
}

/** Group weighted request rows while counting paths independently of weight. */
function groupRequests<T extends AgentRequestRow>(
  rows: T[],
  label: (row: T) => string
): AgentReportGroup[] {
  const groups = new Map<string, { requests: number; paths: Set<string> }>();
  for (const row of rows) {
    const key = label(row);
    const group = groups.get(key) ?? { requests: 0, paths: new Set<string>() };
    group.requests += row.requests;
    group.paths.add(row.path);
    groups.set(key, group);
  }
  return Array.from(groups, ([key, group]) => ({
    label: key,
    requests: group.requests,
    paths: group.paths.size,
  })).sort((a, b) => b.requests - a.requests || a.label.localeCompare(b.label));
}

/** Resolve a UTC, half-open report window, defaulting to 30 complete days. */
export function agentReportWindow(start?: string, end?: string, now = new Date()) {
  const endDate = end ?? now.toISOString().slice(0, 10);
  const startDate =
    start ?? new Date(Date.parse(endDate) - 30 * 86400000).toISOString().slice(0, 10);
  for (const value of [startDate, endDate]) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
      !Number.isFinite(Date.parse(value)) ||
      new Date(value).toISOString().slice(0, 10) !== value
    ) {
      throw new Error('Report dates must be valid YYYY-MM-DD dates.');
    }
  }
  if (startDate >= endDate) throw new Error('Report start must precede its exclusive end date.');
  return { start: startDate, end: endDate };
}
