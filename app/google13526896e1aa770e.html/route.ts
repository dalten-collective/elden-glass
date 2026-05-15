const GOOGLE_SITE_VERIFICATION = 'google-site-verification: google13526896e1aa770e.html';

/**
 * Serves the exact Google Search Console verification response at the
 * root-level HTML token path.
 */
export function GET() {
  return new Response(GOOGLE_SITE_VERIFICATION, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
  });
}
