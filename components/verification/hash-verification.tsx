import Link from 'next/link';
import { ArrowUpRight, Download, ShieldCheck } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/site/copy-button';

interface HashVerificationProps {
  /** The SHA-256 hash of the source file. */
  documentHash: string;
  /** Filename of the source file under public/proofs/. */
  hashableFile: string;
  /** Human-readable sealing date (e.g. "November 17, 2025"). */
  sealedDate?: string;
  /** Filename of the OpenTimestamps proof under public/proofs/, if the file was Bitcoin-timestamped. */
  bitcoinOts?: string;
  /** EAS attestation UID, if the file was attested on Ethereum. */
  ethereumAttestation?: string;
  /** Short descriptive label for what this verification is attesting (e.g. "initial thesis"). */
  subject?: string;
}

/**
 * Renders the blockchain verification section for a sealed document. Supports
 * Bitcoin-only (OpenTimestamps), Ethereum-only (EAS), or both. The component
 * reads the filename fields from the caller and builds the correct download
 * links and external URLs. Step-by-step verification instructions are
 * conditionally rendered to match whichever chain(s) attest the document.
 */
export function HashVerification({
  documentHash,
  hashableFile,
  sealedDate,
  bitcoinOts,
  ethereumAttestation,
  subject = 'document',
}: HashVerificationProps) {
  const hashableFileUrl = `/proofs/${hashableFile}`;
  const otsFileUrl = bitcoinOts ? `/proofs/${bitcoinOts}` : null;
  const easUrl = ethereumAttestation
    ? `https://easscan.org/attestation/view/${ethereumAttestation}`
    : null;

  // Build the "sealed on X and/or Y" phrase based on which chains are present.
  const chainPhrase = [bitcoinOts ? 'Bitcoin' : null, ethereumAttestation ? 'Ethereum' : null]
    .filter(Boolean)
    .join(' and ');

  // Number the verification steps starting at 2 (step 1 is always "confirm the hash").
  let stepNumber = 2;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[rgb(var(--success-green-rgb)/0.1)] p-2 text-[var(--success-green)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Cryptographic Proof</CardTitle>
              <CardDescription>
                The {subject} was sealed on {chainPhrase}
                {sealedDate ? ` on ${sealedDate}` : ''}, before any public disclosure of the
                discovery.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-[var(--border-emphasis)] bg-[rgb(var(--bg-primary-rgb)/0.8)] p-4 font-mono text-sm text-[var(--accent-gold)]">
            <div className="flex items-center justify-between gap-4">
              <span className="uppercase text-[0.65rem] tracking-[0.3em] text-[var(--text-tertiary)]">
                SHA-256 Hash
              </span>
              <CopyButton value={documentHash} label="Copy hash" />
            </div>
            <p className="mt-3 break-all text-[var(--text-primary)]">{documentHash}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {easUrl && (
              <Button asChild>
                <Link
                  href={easUrl as any}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2"
                >
                  Ethereum attestation (EAS)
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            {otsFileUrl && (
              <Button asChild variant={easUrl ? 'outline' : 'default'}>
                <a href={otsFileUrl} download className="flex items-center gap-2">
                  Bitcoin OTS proof
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            )}
            <Button asChild variant="ghost">
              <a href={hashableFileUrl} download className="flex items-center gap-2">
                Hashable file
                <Download className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verify it yourself</CardTitle>
          <CardDescription>
            Two steps. Either one is enough to confirm the {subject} has not been altered since it
            was sealed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <section className="space-y-2">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              1. Confirm the hash matches the file
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              Download the hashable file and compute its SHA-256 hash. The result must match the
              hash above.
            </p>
            <div className="glass-card border border-dashed border-[var(--border-emphasis)] bg-[rgb(var(--bg-primary-rgb)/0.5)] p-4 text-xs">
              <pre className="overflow-x-auto text-[var(--text-secondary)]">{`curl -O https://eldenglass.com${hashableFileUrl}
shasum -a 256 ${hashableFile}`}</pre>
            </div>
          </section>

          {bitcoinOts && (
            <section className="space-y-2">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {stepNumber++}. Verify the Bitcoin timestamp
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Download the OpenTimestamps proof file and verify it against the hashable file with
                the <code className="text-[var(--accent-gold)]">ots</code> client. This proves the
                document existed at the Bitcoin block height recorded in the proof, which cannot be
                backdated.
              </p>
              <div className="glass-card border border-dashed border-[var(--border-emphasis)] bg-[rgb(var(--bg-primary-rgb)/0.5)] p-4 text-xs">
                <pre className="overflow-x-auto text-[var(--text-secondary)]">{`pip install opentimestamps-client
curl -O https://eldenglass.com${otsFileUrl}
ots verify -f ${hashableFile} ${bitcoinOts}`}</pre>
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">
                Or upload the <code>.ots</code> file at{' '}
                <Link
                  href={'https://opentimestamps.org/' as any}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--accent-gold)] underline"
                >
                  opentimestamps.org
                </Link>{' '}
                for browser-based verification.
              </p>
            </section>
          )}

          {ethereumAttestation && (
            <section className="space-y-2">
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {stepNumber++}. Verify the Ethereum attestation
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Visit the Ethereum Attestation Service (EAS) record linked above. It contains the
                document hash, the attester&apos;s signature, and the block timestamp.
              </p>
              <div className="glass-card border border-dashed border-[var(--border-emphasis)] bg-[rgb(var(--bg-primary-rgb)/0.5)] p-4 text-xs font-mono">
                <p className="text-[var(--text-tertiary)]">UID</p>
                <p className="break-all text-[var(--text-secondary)]">{ethereumAttestation}</p>
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
