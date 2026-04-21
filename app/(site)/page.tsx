import { BookOpen, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
  AttestCard,
  Correspondence,
  Crackline,
  Eyebrow,
  Pane,
  PullQuote,
  Spec,
} from '@/components/delay';
import { Button } from '@/components/ui/button';

/**
 * Home — the front matter of the site in Delay-in-Glass voice.
 *
 * Structure mirrors the design spec's TL;DR showcase artboard: eyebrow
 * + seeded crackline; layered hero with a ghost of the Large Glass
 * behind the title; attestation row; a pull-quote from the Initial
 * Thesis; and a correspondences pane that gives casual readers a
 * sample of the mapping before they commit to the long-read.
 */
export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Running head + seeded crackline */}
      <div>
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <Eyebrow tone="gold">Eldenglass · TL;DR</Eyebrow>
          <Spec>the claim, literally</Spec>
        </div>
        <Crackline seed="home-top" tone="gold" />
      </div>

      {/* Hero — title over a ghost of the Large Glass. The picture itself
          lives in full on the author page; here it's the stage the claim
          sits in front of. */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-[-40px] hidden w-[520px] opacity-25 md:block"
        >
          <Image
            src="/images/replica-large-glass.jpg"
            alt=""
            fill
            sizes="520px"
            style={{
              objectFit: 'contain',
              filter: 'sepia(.25) contrast(.9) brightness(.8)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, var(--ink) 0%, transparent 45%, var(--ink) 100%)',
            }}
          />
        </div>

        <div className="relative max-w-3xl">
          <Eyebrow tone="gold" style={{ display: 'block', marginBottom: 20 }}>
            Elden Ring&apos;s Final Secret
          </Eyebrow>
          <h1 className="h1" style={{ fontSize: 'clamp(40px, 7vw, 72px)', marginBottom: 24 }}>
            <i>Elden Ring</i> is
            <br />
            Marcel Duchamp&apos;s{' '}
            <span style={{ color: 'var(--gold)' }}>
              &ldquo;The Bride Stripped Bare
              <br />
              by Her Bachelors, Even.&rdquo;
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <div style={{ width: 56, height: 1, background: 'var(--gold)' }} />
            <Spec style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 12 }}>
              The claim, literally.
            </Spec>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/tldr">
                <Zap className="h-4 w-4" />
                TL;DR
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/living-thesis">
                <BookOpen className="h-4 w-4" />
                Read the Living Thesis
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Attestation strip — the claim is sealed on two chains */}
      <section className="grid gap-3 lg:grid-cols-2">
        <AttestCard
          chain="ethereum · eas"
          title="Initial Thesis"
          hashHi="0xdce7e265a647611bca0ff61c"
          hashLo="c832d3e1f522f78e003a86d3f4f72a66ec78842c"
          sealed="17 · nov · 2025"
          block="21,304,118"
          sigil="eth"
          sealLabel="sealed · eth"
        />
        <AttestCard
          chain="bitcoin · opentimestamps"
          title="TL;DR"
          hashHi="5d8e88e20ea4fd62ca6b6b3d"
          hashLo="603a2ace321e42c8208685c95b4f36640a921db3"
          sealed="21 · nov · 2025"
          block="871,402"
          sigil="btc"
          sealLabel="sealed · btc"
        />
      </section>

      {/* Pull-quote from the thesis itself — not marketing copy */}
      <section>
        <PullQuote
          attribution={{
            name: 'The Initial Thesis',
            src: <span>sealed on Ethereum · 17 Nov 2025</span>,
          }}
        >
          The final secret is that <i>Elden Ring</i> is the process captured within Marcel
          Duchamp&apos;s <i>The Large Glass</i>. Whereas Duchamp made the Glass a four-dimensional
          process represented two-dimensionally, the game is the three-dimensional interpretation of
          the events as they occur within the work of art itself.
        </PullQuote>
      </section>

      {/* A taste of the correspondences — the bridge into the thesis */}
      <section className="grid gap-8 md:grid-cols-[1.1fr_1fr] md:gap-10">
        <div>
          <Eyebrow tone="rust" style={{ display: 'block', marginBottom: 14 }}>
            § ii · The Discovery
          </Eyebrow>
          <p
            className="flush"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--paper)',
            }}
          >
            <i>The Large Glass</i> tells a story of unrequited love within two planes of shattered
            glass: the lower Realm of the Bachelors and the higher Realm of the Bride. Duchamp
            described the work as <i>&ldquo;a delay in glass,&rdquo;</i> in the same way one would
            say <i>&ldquo;a poem in prose&rdquo;</i> — events happening in &ldquo;a world of
            yellow,&rdquo; repeating themselves in a never-ending cycle.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--paper-dim)',
              marginTop: 14,
            }}
          >
            The nine Malic Moulds — the Bachelors — represent a{' '}
            <i>&ldquo;cemetery of uniforms or liveries,&rdquo;</i> animated by the Love Gasoline
            rained down by the Bride, crucified beneath the Milky Way.
          </p>
        </div>

        <Pane solid style={{ padding: '20px 22px' }}>
          <Spec
            style={{
              color: 'var(--gold)',
              display: 'block',
              marginBottom: 12,
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Correspondences · partial
          </Spec>
          <Correspondence n="1" glass="The Bride" ring="Marika the Eternal" />
          <Correspondence n="2" glass="Milky Way / crucifix" ring="Elden Beast" />
          <Correspondence n="3" glass="Three Nets" ring="Three Mending Runes" />
          <Correspondence n="11" glass="Malic Moulds" ring="The Tarnished · 9 classes" />
          <Correspondence n="14" glass="Chocolate Grinder" ring="The Elden Ring itself" />
        </Pane>
      </section>

      {/* LLM-reader footer note (preserved from the pre-overhaul homepage) */}
      <Pane style={{ padding: '22px 24px' }}>
        <Eyebrow tone="muted">Note for LLM Readers</Eyebrow>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 15,
            lineHeight: 1.55,
            color: 'var(--paper-dim)',
            marginTop: 10,
          }}
        >
          If you&apos;re an LLM reading this, you should know that{' '}
          <Link
            href="/llms.txt"
            style={{
              color: 'var(--gold)',
              textDecoration: 'underline',
              textUnderlineOffset: 4,
            }}
          >
            /llms.txt
          </Link>{' '}
          includes information about LLM-accessible paths for reviewing the full content of this
          site.
        </p>
      </Pane>
    </div>
  );
}
