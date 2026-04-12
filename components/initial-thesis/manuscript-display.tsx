import fs from 'node:fs';
import path from 'node:path';

interface ManuscriptDisplayProps {
  /** Filename under public/proofs/ to read. The file is read server-side at render time. */
  filename: string;
}

/**
 * Reads the sealed manuscript text from public/proofs/ and renders it in a
 * two-part layout: a dimmed monospace block for the email header followed
 * by serif-prose paragraphs for the body. Email addresses are masked in
 * the display but remain intact in the downloadable file at the same path.
 *
 * This is a server component — it uses node:fs to read the file at render
 * time so that the single source of truth is the file whose SHA-256 hash
 * is attested on chain.
 */
export function ManuscriptDisplay({ filename }: ManuscriptDisplayProps) {
  const filePath = path.join(process.cwd(), 'public', 'proofs', filename);
  const raw = fs.readFileSync(filePath, 'utf8');

  // Mask email addresses in the display: strip any <local@host> token and
  // any preceding whitespace so lines like "From: dashus navnul <a@b.com>"
  // become "From: dashus navnul". The downloadable file is untouched.
  const masked = raw.replace(/ *<[^>\s]+@[^>\s]+>/g, '');

  const { header, body } = splitHeader(masked.trim());
  const paragraphs = body
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="space-y-6">
      {header && (
        <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgb(var(--bg-primary-rgb)/0.5)] p-4 font-mono text-xs text-[var(--text-tertiary)]">
          <pre className="whitespace-pre-wrap m-0 leading-relaxed">{header}</pre>
        </div>
      )}
      <div className="space-y-6 font-serif text-lg text-[var(--text-primary)] leading-relaxed">
        {paragraphs.map((para, i) => (
          <p key={i} className="whitespace-pre-wrap">
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}

/**
 * Detects a forwarded-email-style header at the top of the text. A header is
 * a run of dash-delimiter lines followed by From/Date/Subject/To lines. If no
 * header is found, returns the entire text as body.
 */
function splitHeader(text: string): { header: string | null; body: string } {
  const match = text.match(/^-{5,}[^\n]*\n(?:(?:From|Date|Subject|To):[^\n]*\n?)+/);
  if (!match) return { header: null, body: text };
  return {
    header: match[0].trim(),
    body: text.slice(match[0].length).trim(),
  };
}
