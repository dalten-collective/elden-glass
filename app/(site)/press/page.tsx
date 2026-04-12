import { Metadata } from 'next';
import Link from 'next/link';
import { Download, Mail, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Press Kit - Elden Glass',
  description: 'Press resources for coverage of the Elden Ring / Large Glass discovery.',
};

export default function PressPage() {
  return (
    <div className="space-y-12 max-w-4xl">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="font-serif text-4xl text-[var(--text-primary)]">Press Kit</h1>
        <p className="page-hero-description">
          Resources for journalists and content creators covering the discovery that
          Elden Ring is a digital reimagining of Marcel Duchamp&apos;s The Large Glass.
        </p>
      </header>

      {/* Quick Facts */}
      <section className="glass-card border border-[var(--border-emphasis)] p-6 space-y-4">
        <h2 className="font-serif text-2xl text-[var(--accent-gold)]">Quick Facts</h2>
        <ul className="space-y-3 text-[var(--text-secondary)]">
          <li className="flex gap-3">
            <span className="text-[var(--accent-gold)]">What:</span>
            <span>
              Elden Ring is revealed to be a complete &apos;pataphysical reimagining of Marcel
              Duchamp&apos;s 1915-1923 artwork &quot;The Bride Stripped Bare by Her Bachelors, Even&quot;
              (The Large Glass).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--accent-gold)]">Who:</span>
            <span>
              Discovery made by TGB, a researcher combining art history, game studies,
              and &apos;pataphysical analysis.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--accent-gold)]">When:</span>
            <span>
              Discovery documented and blockchain-timestamped in 2024.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[var(--accent-gold)]">Verification:</span>
            <span>
              The prime document is cryptographically hashed and recorded on Bitcoin
              and Ethereum blockchains, ensuring the discovery cannot be backdated.
            </span>
          </li>
        </ul>
      </section>

      {/* Key Angles */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">Story Angles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border border-[var(--border-subtle)] rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-[var(--accent-gold)]">For Gaming Press</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              FromSoftware&apos;s cryptic storytelling reaches new depths. Every element of
              Elden Ring—from boss design to environmental storytelling—maps to Duchamp&apos;s
              mechanical bride fantasy.
            </p>
          </div>
          <div className="border border-[var(--border-subtle)] rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-[var(--accent-blue)]">For Art Press</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              A video game as serious art—not as aspiration but as achieved reality.
              The Large Glass finally finds its true medium: interactive digital space.
            </p>
          </div>
          <div className="border border-[var(--border-subtle)] rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-[var(--accent-purple)]">For Tech Press</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              AI-assisted research uncovers century-old artistic connection. The
              discovery originated from a conversation with ChatGPT that spiraled
              into serious scholarship.
            </p>
          </div>
          <div className="border border-[var(--border-subtle)] rounded-lg p-4 space-y-2">
            <h3 className="font-medium text-[var(--text-secondary)]">For Cultural Press</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              The bachelor machine myth—technology, desire, and death—returns in
              the most played game of 2022. What does this say about our moment?
            </p>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">Downloads</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/initial-thesis"
            className="flex items-center gap-3 p-4 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-gold)] transition-colors"
          >
            <FileText className="h-8 w-8 text-[var(--accent-gold)]" />
            <div>
              <div className="font-medium text-[var(--text-primary)]">Prime Document</div>
              <div className="text-xs text-[var(--text-tertiary)]">
                The original discovery, verified
              </div>
            </div>
          </Link>

          <Link
            href="/living-thesis"
            className="flex items-center gap-3 p-4 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-gold)] transition-colors"
          >
            <FileText className="h-8 w-8 text-[var(--accent-blue)]" />
            <div>
              <div className="font-medium text-[var(--text-primary)]">Living Document</div>
              <div className="text-xs text-[var(--text-tertiary)]">
                Expanded analysis, updated
              </div>
            </div>
          </Link>

          <a
            href="/images/replica-large-glass.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-gold)] transition-colors"
          >
            <ImageIcon className="h-8 w-8 text-[var(--accent-purple)]" />
            <div>
              <div className="font-medium text-[var(--text-primary)]">Large Glass Image</div>
              <div className="text-xs text-[var(--text-tertiary)]">
                Tokyo replica, high-res
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Key Links */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">Key Pages</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/living-thesis" className="flex items-center gap-2 text-[var(--accent-gold)] hover:underline">
              <ExternalLink className="h-4 w-4" />
              The Discovery Story
            </Link>
          </li>
          <li>
            <Link href="/bachelor-machines" className="flex items-center gap-2 text-[var(--accent-gold)] hover:underline">
              <ExternalLink className="h-4 w-4" />
              Bachelor Machines Explained
            </Link>
          </li>
          <li>
            <Link href="/what-is-pataphysics" className="flex items-center gap-2 text-[var(--accent-gold)] hover:underline">
              <ExternalLink className="h-4 w-4" />
              What Is &apos;Pataphysics?
            </Link>
          </li>
          <li>
            <Link href="/card-database" className="flex items-center gap-2 text-[var(--accent-gold)] hover:underline">
              <ExternalLink className="h-4 w-4" />
              Evidence Database (3800+ entries)
            </Link>
          </li>
        </ul>
      </section>

      {/* Contact */}
      <section className="glass-card border border-[var(--border-emphasis)] p-6 space-y-4">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">Contact</h2>
        <p className="text-[var(--text-secondary)]">
          For interviews, additional materials, or questions:
        </p>
        <a
          href="mailto:press@eldenglass.com"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-gold)] text-[var(--bg-primary)] rounded-lg hover:opacity-90 transition-opacity"
        >
          <Mail className="h-4 w-4" />
          press@eldenglass.com
        </a>
        <p className="text-xs text-[var(--text-tertiary)]">
          Response time: Usually within 24 hours.
        </p>
      </section>

      {/* Citation */}
      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">Citation</h2>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-4 font-mono text-sm text-[var(--text-secondary)]">
          TGB. &quot;Elden Ring Is The Large Glass: A &apos;Pataphysical Analysis.&quot;
          Elden Glass, 2024. https://eldenglass.com
        </div>
      </section>
    </div>
  );
}
