import {
  COOKIE_NAME,
  SESSION_SECONDS,
  createSession,
  verifyPassword,
} from '../../../../lib/pataphor-access.ts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
const MAX_BODY_BYTES = 4096;

function headers() {
  return new Headers({
    'Cache-Control': 'private, no-store, max-age=0',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin',
  });
}

function reject(status: number, message: string) {
  return new Response(message, { status, headers: headers() });
}

function browserOrigin(request: Request): URL | null {
  const url = new URL(request.url);
  const host = request.headers.get('host') ?? url.host;
  const origin = request.headers.get('origin');
  // Next can normalize request.url to its internal localhost listener. Host
  // retains the browser's authority; forwarded-host is deliberately ignored.
  if (!origin || !/^[a-zA-Z0-9.:[\]-]+$/.test(host)) return null;
  try {
    const expected = new URL(`${url.protocol}//${host}`);
    const supplied = new URL(origin);
    if (
      !['http:', 'https:'].includes(expected.protocol) ||
      supplied.origin !== origin ||
      supplied.origin !== expected.origin
    ) {
      return null;
    }
    return supplied;
  } catch {
    return null;
  }
}

function redirect(origin: URL, destination: string, cookie?: string) {
  const result = headers();
  result.set('Location', new URL(destination, origin).href);
  if (cookie) result.set('Set-Cookie', cookie);
  return new Response(null, { status: 303, headers: result });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const origin = browserOrigin(request);
  if (!origin || request.headers.get('sec-fetch-site') === 'cross-site') {
    return reject(403, 'Forbidden');
  }
  const local =
    process.env.NODE_ENV !== 'production' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(origin.hostname) &&
    origin.protocol === 'http:';
  const attributes = `Path=/pataphor; HttpOnly; SameSite=Strict${local ? '' : '; Secure'}`;
  if (url.searchParams.get('logout') === '1') {
    return redirect(origin, '/pataphor', `${COOKIE_NAME}=; Max-Age=0; ${attributes}`);
  }
  if (
    request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !==
    'application/x-www-form-urlencoded'
  ) {
    return reject(415, 'Unsupported media type');
  }
  const declaredLength = request.headers.get('content-length');
  if (
    declaredLength &&
    (!/^\d+$/.test(declaredLength) || Number(declaredLength) > MAX_BODY_BYTES)
  ) {
    return reject(413, 'Request too large');
  }
  const reader = request.body?.getReader();
  let body = '';
  let size = 0;
  const decoder = new TextDecoder();
  try {
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) {
          await reader.cancel();
          return reject(413, 'Request too large');
        }
        body += decoder.decode(value, { stream: true });
      }
      body += decoder.decode();
    }
  } catch {
    return reject(400, 'Invalid request');
  } finally {
    reader?.releaseLock();
  }
  const passwords = new URLSearchParams(body).getAll('password');
  if (passwords.length !== 1 || !(await verifyPassword(passwords[0]))) {
    return redirect(origin, '/pataphor?error=invalid');
  }
  return redirect(
    origin,
    '/pataphor',
    `${COOKIE_NAME}=${await createSession()}; Max-Age=${SESSION_SECONDS}; ${attributes}`
  );
}
