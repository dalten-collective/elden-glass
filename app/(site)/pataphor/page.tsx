import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { Cap, Crackline, Eyebrow, Pane, Spec } from '@/components/delay';
import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { Button } from '@/components/ui/button';
import { accessConfigured, COOKIE_NAME, decryptArticle, hasAccess } from '@/lib/pataphor-access';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';
export const metadata: Metadata = {
  title: 'Pataphor · Private | Elden Glass',
  description: 'A password-protected section of Elden Glass.',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: '/pataphor' },
};

export default async function PataphorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const jar = await cookies();
  const admitted = await hasAccess(jar.get(COOKIE_NAME)?.value);
  const query = await searchParams;
  const invalid = query.error === 'invalid';
  let article: string | null = null;
  if (admitted) {
    const envelope = await readFile(
      path.join(process.cwd(), 'content/pages/pataphor.mdx.enc'),
      'utf8'
    );
    article = await decryptArticle(envelope);
  }

  return (
    <article className="space-y-10" data-private="true">
      <header>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <Eyebrow tone="gold">Elden Glass · Private section</Eyebrow>
          <Spec>pataphor</Spec>
        </div>
        <div className="mb-8">
          <Crackline seed="pataphor-private" tone="gold" />
        </div>
        <h1 className="page-hero-title">Pataphor</h1>
        <p className="page-hero-description mt-4">A running Large Glass.</p>
      </header>
      {article !== null ? (
        <>
          <form action="/api/pataphor/access?logout=1" method="post">
            <Button variant="outline" size="sm" type="submit">
              Close this private section
            </Button>
          </form>
          <MarkdownRenderer source={article} />
        </>
      ) : (
        <Pane solid className="max-w-xl space-y-6 p-6 md:p-10">
          <Eyebrow tone="gold">By invitation</Eyebrow>
          <h2 className="dig-page-title">The Glass is closed.</h2>
          <p className="dig-copy">
            Enter the password you were given to read this section. No account is required.
          </p>
          {accessConfigured() ? (
            <form action="/api/pataphor/access" method="post" className="space-y-4">
              <label className="eyebrow block" htmlFor="pataphor-password">
                Pataphor password
              </label>
              <input
                className="dig-input w-full"
                id="pataphor-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength={256}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? 'pataphor-error' : undefined}
              />
              {invalid && (
                <p id="pataphor-error" role="alert" className="dig-copy">
                  That password did not open the Glass. Please try again.
                </p>
              )}
              <Button type="submit">Open Pataphor</Button>
            </form>
          ) : (
            <p role="status" className="dig-copy">
              Private access is being configured. Please return later.
            </p>
          )}
          <Cap className="block">
            The rest of Elden Glass remains open. Please keep your invitation private.
          </Cap>
        </Pane>
      )}
    </article>
  );
}
