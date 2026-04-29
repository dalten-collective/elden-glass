import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';

import { captureAxRouteRequest } from '@/lib/analytics/server-capture';

/**
 * Next.js routing proxy entry. Runs before each matched request and
 * fans the request metadata into server-side AX analytics capture.
 *
 * Hands the path / method / user-agent / referer of every matched
 * request to `captureAxRouteRequest` and immediately returns
 * `NextResponse.next()`. The capture call internally:
 *
 *   - No-ops when `POSTHOG_API_KEY` / `POSTHOG_HOST` are unset or
 *     `ANALYTICS_DISABLED=1` is set, so this file is safe to leave
 *     mounted in any environment.
 *   - Skips `static_asset` and `unknown` route families.
 *   - Skips browser-classified clients on human-facing surfaces, so an
 *     ordinary browser pageview is not double-counted against the
 *     client-side `human_pageview` event. AX-only surfaces (llms.txt,
 *     api/llms/*, feeds, sitemap, robots.txt) are always captured.
 *
 * The matcher excludes Next.js internals and known static-asset roots so
 * those requests never enter the proxy in the first place. Policy
 * refinements live in lib/analytics/server-capture.ts so the rules are
 * testable in isolation.
 *
 * Proxy files always run on the Node.js runtime in Next.js 16, so the
 * analytics fetch and process.env reads behave identically here and in
 * route handlers — no runtime field on the config export.
 */
export function proxy(request: NextRequest, event: NextFetchEvent) {
  // Attach the capture promise to the request lifecycle via waitUntil.
  // The response is not blocked on the analytics fetch (waitUntil holds
  // the function instance open until the promise settles), but the
  // promise is guaranteed to flush rather than being dropped when the
  // proxy returns. Failures inside the capture path are swallowed there
  // and never surface to the user.
  event.waitUntil(
    captureAxRouteRequest({
      method: request.method,
      path: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent'),
      referrer: request.headers.get('referer'),
    })
  );

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on every request except Next.js internals and known
    // static-asset roots. Within matched paths, route-family filtering
    // in server-capture decides what actually emits an event.
    '/((?!_next/static|_next/image|favicon\\.ico|images/|proofs/|fonts/).*)',
  ],
};
