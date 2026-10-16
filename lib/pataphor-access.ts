/** Node/server-only access policy. Keep imports out of client components. */
import {
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'node:crypto';

export const COOKIE_NAME = 'pataphor_access';
export const SESSION_SECONDS = 12 * 60 * 60;
const SESSION_DOMAIN = 'pataphor-private-exhibition/session/v1';

function decodeBase64(value: unknown, size?: number): Buffer {
  if (
    typeof value !== 'string' ||
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)
  ) {
    throw new Error('Invalid sealed content');
  }
  const decoded = Buffer.from(value, 'base64');
  if (decoded.toString('base64') !== value || (size !== undefined && decoded.length !== size)) {
    throw new Error('Invalid sealed content');
  }
  return decoded;
}

function settings() {
  const password = process.env.PATAPHOR_PASSWORD;
  const encodedKey = process.env.PATAPHOR_CONTENT_KEY;
  if (!password || password.length < 16 || password.length > 1024 || !encodedKey) return null;
  try {
    return { password, key: decodeBase64(encodedKey, 32) };
  } catch {
    return null;
  }
}

export function accessConfigured(): boolean {
  return settings() !== null;
}

function sessionSignature(payload: string, config: NonNullable<ReturnType<typeof settings>>) {
  // Domain separation keeps signing material distinct from the AES content key.
  // Including the password also revokes existing sessions when it is rotated.
  const signingKey = createHmac('sha256', config.key)
    .update(SESSION_DOMAIN)
    .update('\0')
    .update(config.password)
    .digest();
  return createHmac('sha256', signingKey).update(payload).digest();
}

export async function verifyPassword(input: string): Promise<boolean> {
  const config = settings();
  if (!config || input.length > 1024) return false;
  const digest = (value: string) => createHash('sha256').update(value).digest();
  return timingSafeEqual(digest(input), digest(config.password));
}

export async function createSession(): Promise<string> {
  const config = settings();
  if (!config) throw new Error('Private access is not configured');
  const issued = Math.floor(Date.now() / 1000);
  const payload = `v1.${issued}.${issued + SESSION_SECONDS}.${randomBytes(16).toString('hex')}`;
  return `${payload}.${sessionSignature(payload, config).toString('hex')}`;
}

export async function hasAccess(cookie: string | undefined): Promise<boolean> {
  if (!cookie || cookie.length > 256) return false;
  const match = /^v1\.(\d{10})\.(\d{10})\.([a-f0-9]{32})\.([a-f0-9]{64})$/.exec(cookie);
  if (!match) return false;
  const issued = Number(match[1]);
  const expires = Number(match[2]);
  const now = Math.floor(Date.now() / 1000);
  if (issued > now || expires <= now || expires - issued !== SESSION_SECONDS) return false;
  const config = settings();
  if (!config) return false;
  const payload = cookie.slice(0, cookie.lastIndexOf('.'));
  return timingSafeEqual(Buffer.from(match[4], 'hex'), sessionSignature(payload, config));
}

/** Call only after hasAccess succeeds; never expose the plaintext via a public API. */
export async function decryptArticle(envelopeString: string): Promise<string> {
  const config = settings();
  if (!config) throw new Error('Private access is not configured');
  if (envelopeString.length > 2_000_000) throw new Error('Invalid sealed content');
  const envelope: unknown = JSON.parse(envelopeString);
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) {
    throw new Error('Invalid sealed content');
  }
  const sealed = envelope as Record<string, unknown>;
  if (sealed.version !== 1 || Object.keys(sealed).sort().join(',') !== 'content,iv,tag,version') {
    throw new Error('Invalid sealed content');
  }
  const decipher = createDecipheriv('aes-256-gcm', config.key, decodeBase64(sealed.iv, 12));
  decipher.setAuthTag(decodeBase64(sealed.tag, 16));
  const plaintext = Buffer.concat([
    decipher.update(decodeBase64(sealed.content)),
    decipher.final(),
  ]);
  return new TextDecoder('utf-8', { fatal: true }).decode(plaintext);
}
