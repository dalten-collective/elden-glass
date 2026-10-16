import { createCipheriv, randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

// Explicit authoring command only; never run from build/dev hooks.
const key = Buffer.from(process.env.PATAPHOR_CONTENT_KEY || '', 'base64');
if (key.length !== 32 || key.toString('base64') !== process.env.PATAPHOR_CONTENT_KEY) {
  throw new Error('PATAPHOR_CONTENT_KEY must be a canonical base64-encoded 32-byte key');
}
const source = await readFile('secrets/pataphor.mdx');
if (!source.length || source.length > 1_000_000) {
  throw new Error('Private MDX must contain between 1 and 1,000,000 bytes');
}
const iv = randomBytes(12);
const cipher = createCipheriv('aes-256-gcm', key, iv);
const content = Buffer.concat([cipher.update(source), cipher.final()]);
await writeFile(
  'content/pages/pataphor.mdx.enc',
  JSON.stringify({
    version: 1,
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    content: content.toString('base64'),
  }) + '\n'
);
console.log('Sealed private Pataphor MDX. Only the encrypted file belongs in Git.');
