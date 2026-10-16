import { afterEach, beforeEach, test } from 'node:test';
import { strict as assert } from 'node:assert';
import { createCipheriv, randomBytes } from 'node:crypto';
import {
  COOKIE_NAME,
  SESSION_SECONDS,
  accessConfigured,
  createSession,
  decryptArticle,
  hasAccess,
  verifyPassword,
} from '../pataphor-access.ts';
import { POST } from '../../app/api/pataphor/access/route.ts';

const environment = ['PATAPHOR_PASSWORD', 'PATAPHOR_CONTENT_KEY', 'NODE_ENV'] as const;
const saved = new Map<string, string | undefined>();
const runtimeEnvironment: Record<string, string | undefined> = process.env;
const originalNow = Date.now;
let password = '';
let key = Buffer.alloc(32);

beforeEach(() => {
  for (const name of environment) saved.set(name, process.env[name]);
  password = randomBytes(24).toString('hex');
  key = randomBytes(32);
  process.env.PATAPHOR_PASSWORD = password;
  process.env.PATAPHOR_CONTENT_KEY = key.toString('base64');
  runtimeEnvironment.NODE_ENV = 'production';
});

afterEach(() => {
  Date.now = originalNow;
  for (const name of environment) {
    const value = saved.get(name);
    if (value === undefined) delete runtimeEnvironment[name];
    else runtimeEnvironment[name] = value;
  }
});

function request(body = `password=${password}`, extra: Record<string, string> = {}) {
  return new Request('https://eldenringisthelargeglass.com/api/pataphor/access', {
    method: 'POST',
    headers: {
      origin: 'https://eldenringisthelargeglass.com',
      'content-type': 'application/x-www-form-urlencoded',
      ...extra,
    },
    body,
  });
}

function seal(plaintext: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const content = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return {
    version: 1,
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    content: content.toString('base64'),
  };
}

test('correct password succeeds and wrong or overlong passwords fail', async () => {
  assert.equal(accessConfigured(), true);
  assert.equal(await verifyPassword(password), true);
  assert.equal(await verifyPassword('incorrect'), false);
  assert.equal(await verifyPassword('x'.repeat(1025)), false);
});

test('sessions are signed, nonce-bearing and reject tampering or malformed values', async () => {
  const token = await createSession();
  assert.equal(await hasAccess(token), true);
  assert.notEqual(await createSession(), token);
  assert.equal(await hasAccess(token.slice(0, -1) + (token.endsWith('f') ? 'e' : 'f')), false);
  for (const value of [undefined, '', 'v1.invalid', 'x'.repeat(257)]) {
    assert.equal(await hasAccess(value), false);
  }
});

test('expired and future-issued sessions fail', async () => {
  const token = await createSession();
  Date.now = () => originalNow() + SESSION_SECONDS * 1000;
  assert.equal(await hasAccess(token), false);
  Date.now = () => originalNow() - 10_000;
  assert.equal(await hasAccess(token), false);
});

test('rotating password or content key revokes existing sessions', async () => {
  const token = await createSession();
  process.env.PATAPHOR_PASSWORD = randomBytes(24).toString('hex');
  assert.equal(await hasAccess(token), false);
  process.env.PATAPHOR_PASSWORD = password;
  process.env.PATAPHOR_CONTENT_KEY = randomBytes(32).toString('base64');
  assert.equal(await hasAccess(token), false);
});

test('missing, short or malformed settings fail closed', async () => {
  const token = await createSession();
  for (const value of [undefined, '', 'not-base64', Buffer.alloc(31).toString('base64')]) {
    if (value === undefined) delete process.env.PATAPHOR_CONTENT_KEY;
    else process.env.PATAPHOR_CONTENT_KEY = value;
    assert.equal(accessConfigured(), false);
    assert.equal(await hasAccess(token), false);
    assert.equal(await verifyPassword(password), false);
    await assert.rejects(createSession());
    await assert.rejects(decryptArticle('{}'));
  }
  process.env.PATAPHOR_CONTENT_KEY = key.toString('base64');
  process.env.PATAPHOR_PASSWORD = 'short';
  assert.equal(await hasAccess(token), false);
  assert.equal(await verifyPassword('short'), false);
});

test('AES-GCM decrypts authenticated UTF-8 and rejects modified ciphertext, tag or key', async () => {
  const plaintext = `# Synthetic private article\n\n${randomBytes(24).toString('hex')} — test only.`;
  const envelope = seal(plaintext);
  assert.equal(await decryptArticle(JSON.stringify(envelope)), plaintext);
  for (const field of ['content', 'tag'] as const) {
    const damaged = Buffer.from(envelope[field], 'base64');
    damaged[0] ^= 1;
    await assert.rejects(
      decryptArticle(JSON.stringify({ ...envelope, [field]: damaged.toString('base64') }))
    );
  }
  process.env.PATAPHOR_CONTENT_KEY = randomBytes(32).toString('base64');
  await assert.rejects(decryptArticle(JSON.stringify(envelope)));
});

test('sealed article format rejects unknown versions, malformed encodings and IV lengths', async () => {
  const envelope = seal('Synthetic fixture');
  for (const value of [
    null,
    [],
    {},
    { ...envelope, version: 2 },
    { ...envelope, content: '!' },
    { ...envelope, iv: '' },
    { ...envelope, tag: '' },
    { ...envelope, extra: true },
  ]) {
    await assert.rejects(decryptArticle(JSON.stringify(value)));
  }
  await assert.rejects(decryptArticle('x'.repeat(2_000_001)));
});

test('successful login redirects and sets a secure path-scoped private cookie', async () => {
  const result = await POST(request());
  assert.equal(result.status, 303);
  assert.equal(result.headers.get('location'), 'https://eldenringisthelargeglass.com/pataphor');
  const cookie = result.headers.get('set-cookie') ?? '';
  for (const fragment of [
    COOKIE_NAME + '=',
    'Max-Age=43200',
    'Path=/pataphor;',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
  ]) {
    assert.ok(cookie.includes(fragment));
  }
  assert.match(result.headers.get('cache-control') ?? '', /no-store/);
  assert.match(result.headers.get('x-robots-tag') ?? '', /noindex/);
  assert.equal(await hasAccess(cookie.split(';')[0].slice(COOKIE_NAME.length + 1)), true);
});

test('wrong or duplicate passwords redirect without creating a session', async () => {
  for (const body of ['password=wrong', `password=${password}&password=${password}`, '']) {
    const result = await POST(request(body));
    assert.equal(result.status, 303);
    assert.match(result.headers.get('location') ?? '', /\/pataphor\?error=invalid$/);
    assert.equal(result.headers.get('set-cookie'), null);
  }
});

test('foreign, missing and cross-site origins are refused', async () => {
  assert.equal((await POST(request(undefined, { origin: 'https://example.com' }))).status, 403);
  assert.equal((await POST(request(undefined, { 'sec-fetch-site': 'cross-site' }))).status, 403);
  const absent = request();
  absent.headers.delete('origin');
  assert.equal((await POST(absent)).status, 403);
});

test('Next internal localhost URL uses the validated browser Host for origin and redirects', async () => {
  for (const [internal, host, origin] of [
    ['http://localhost:3107', '127.0.0.1:3107', 'http://127.0.0.1:3107'],
    [
      'https://localhost:3000',
      'eldenringisthelargeglass.com',
      'https://eldenringisthelargeglass.com',
    ],
  ]) {
    const result = await POST(
      new Request(`${internal}/api/pataphor/access`, {
        method: 'POST',
        headers: { host, origin, 'content-type': 'application/x-www-form-urlencoded' },
        body: `password=${password}`,
      })
    );
    assert.equal(result.status, 303);
    assert.equal(result.headers.get('location'), `${origin}/pataphor`);
  }
});

test('Host validation rejects foreign origins, malformed authorities and spoofed forwarding headers', async () => {
  const cases: Record<string, string>[] = [
    { host: 'example.com' },
    { host: 'eldenringisthelargeglass.com@evil.example' },
    { host: 'eldenringisthelargeglass.com/path' },
    { host: 'eldenringisthelargeglass.com:bad' },
    { host: 'localhost:3000', 'x-forwarded-host': 'eldenringisthelargeglass.com' },
    { origin: 'http://eldenringisthelargeglass.com', 'x-forwarded-proto': 'http' },
    { origin: 'https://eldenringisthelargeglass.com/path' },
    { origin: 'null' },
  ];
  for (const extra of cases) {
    assert.equal((await POST(request(undefined, extra))).status, 403);
  }
});

test('unsupported content types and oversized declared or actual bodies are refused', async () => {
  assert.equal((await POST(request('{}', { 'content-type': 'application/json' }))).status, 415);
  assert.equal((await POST(request('', { 'content-length': '99999' }))).status, 413);
  assert.equal((await POST(request('', { 'content-length': 'invalid' }))).status, 413);
  assert.equal((await POST(request('password=' + 'x'.repeat(5000)))).status, 413);
});

test('logout clears only the section cookie and requires a same-origin POST', async () => {
  const url = 'https://eldenringisthelargeglass.com/api/pataphor/access?logout=1';
  const result = await POST(
    new Request(url, {
      method: 'POST',
      headers: { origin: 'https://eldenringisthelargeglass.com' },
    })
  );
  assert.equal(result.status, 303);
  assert.match(
    result.headers.get('set-cookie') ?? '',
    /pataphor_access=; Max-Age=0; Path=\/pataphor;/
  );
  assert.equal((await POST(new Request(url, { method: 'POST' }))).status, 403);
});
