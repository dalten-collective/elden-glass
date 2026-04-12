import { Metadata } from 'next';
import { Clock, CircleDot, Target, Compass } from 'lucide-react';
import Link from 'next/link';
import { HeroMeta } from '@/components/site/hero-meta';

export const metadata: Metadata = {
  title: 'The Chocolate Grinder - Elden Ring Is The Large Glass',
  description: 'The Elden Ring symbol is the Chocolate Grinder from The Large Glass viewed from above',
};

function EvidencePoint({ id, title, description }: { id: string; title: string; description: string }) {
  return (
    <div className="border-l-4 border-[var(--accent-gold)]/50 pl-6 py-2">
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono text-[var(--accent-gold)] bg-[var(--accent-gold)]/10 px-2 py-1 rounded">
          {id}
        </span>
        <div>
          <h4 className="font-medium text-[var(--text-primary)] mb-1">{title}</h4>
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function ChocolateGrinderPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <CircleDot className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Visual Evidence</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            The Chocolate Grinder
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            The Elden Ring symbol - the iconic image on every cover and loading screen -
            is Duchamp&apos;s Chocolate Grinder viewed from directly above.
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Evidence Type', value: 'Visual/Geometric', icon: Compass },
            { label: 'Reading Time', value: '5 min', icon: Clock },
            { label: 'Confidence', value: 'High', icon: Target },
          ]}
        />
      </section>

      {/* The Evidence */}
      <section className="glass-card border border-[var(--border-subtle)] p-8">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">Evidence Points</h2>
        <div className="space-y-6">
          <EvidencePoint
            id="CG-1"
            title="Top-down view correspondence"
            description="The Elden Ring symbol on the cover is the Chocolate Grinder viewed from top-down. The cylindrical grinding mechanism, when seen from above, produces the exact radial pattern of the Elden Ring."
          />
          <EvidencePoint
            id="CG-2"
            title="Great Rune correspondence"
            description="Each Great Rune corresponds to parts of the Chocolate Grinder mechanism. The segments, the central axis, the rotating elements - all map to specific Great Runes."
          />
          <EvidencePoint
            id="CG-3"
            title="Geometric proof"
            description="Godrick's and Morgott's anchor runes only make geometric sense as a top-down view of cylindrical grinder structure. The 'anchors' are the legs of the grinder seen from above."
          />
        </div>
      </section>

      {/* Visual Explanation */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2>The Chocolate Grinder in The Large Glass</h2>
        <p>
          The Chocolate Grinder is the central apparatus in the Bachelor domain of The Large Glass.
          Duchamp based it on an actual chocolate grinding machine he saw in a confectioner&apos;s window
          in Rouen, France. In The Large Glass, it represents the self-grinding, self-sufficient
          mechanism of bachelor desire.
        </p>
        <p>
          Duchamp famously said of it: <em>&quot;The bachelor grinds his chocolate himself.&quot;</em>
          This phrase encapsulates the onanistic, self-referential nature of the bachelor machine -
          it produces nothing but its own operation.
        </p>

        <h2>The Elden Ring Symbol</h2>
        <p>
          When you rotate Duchamp&apos;s Chocolate Grinder 90 degrees to view it from directly above,
          the iconic Elden Ring symbol emerges. The three cylindrical drums become the radiating
          segments. The central axis becomes the core ring. The supporting legs become the anchor points.
        </p>
        <p>
          This isn&apos;t coincidence or vague similarity - it&apos;s geometric correspondence. The Great Runes,
          which are fragments of the Elden Ring, map to specific parts of the Grinder mechanism.
        </p>

        <h2>Why This Matters</h2>
        <p>
          If the central symbol of the game - the thing in the title, on every cover, in every
          loading screen - is Duchamp&apos;s Chocolate Grinder, then the connection is not peripheral.
          It&apos;s foundational. The game is literally named after a component of The Large Glass.
        </p>
        <p>
          The Chocolate Grinder is where the Bachelors process their desire. The Elden Ring is
          where the Tarnished process theirs. Same mechanism, different medium.
        </p>
      </section>

      {/* Connection to Other Evidence */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="text-sm uppercase tracking-[0.25em] text-[var(--text-tertiary)] mb-4">Related Evidence</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Link href="/bachelor-machines" className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <span className="text-[var(--accent-gold)] opacity-50 group-hover:opacity-100">→</span>
            The Bachelor Machine concept
          </Link>
          <Link href="/large-glass-breakdown" className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <span className="text-[var(--accent-gold)] opacity-50 group-hover:opacity-100">→</span>
            Full Large Glass breakdown
          </Link>
          <Link href="/master-list" className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <span className="text-[var(--accent-gold)] opacity-50 group-hover:opacity-100">→</span>
            Complete evidence list
          </Link>
          <Link href="/living-thesis" className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors">
            <span className="text-[var(--accent-gold)] opacity-50 group-hover:opacity-100">→</span>
            How this was discovered
          </Link>
        </div>
      </section>

    </div>
  );
}
