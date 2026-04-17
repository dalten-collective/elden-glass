import type { ReactNode } from 'react';

/**
 * A tinted bordered panel with a gold title line, used for short labelled
 * asides like "Contents Include" or "Key Themes". Explicitly resets the
 * font stack, margins, and list styling so children render dense and
 * sans-serif inside the surrounding prose-lg body without fighting
 * the typography plugin's cascade.
 */
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="!my-6 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] p-6 font-sans not-prose">
      <h3
        className="!mt-0 !mb-3 font-sans text-base font-semibold"
        style={{ color: 'var(--accent-gold)' }}
      >
        {title}
      </h3>
      <div
        className={[
          'font-sans text-sm text-[var(--text-secondary)] leading-relaxed',
          '[&_ul]:!list-disc [&_ul]:!pl-5 [&_ul]:!my-0 [&_ul]:space-y-2',
          '[&_ol]:!list-decimal [&_ol]:!pl-5 [&_ol]:!my-0 [&_ol]:space-y-2',
          '[&_li]:!my-0 [&_li]:font-sans marker:text-[var(--text-tertiary)]',
          '[&_p]:mb-3 [&_p:last-child]:mb-0 [&_p]:font-sans',
          '[&_strong]:text-[var(--text-primary)]',
          '[&_a]:text-[var(--accent-gold)] [&_a:hover]:underline',
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  );
}
