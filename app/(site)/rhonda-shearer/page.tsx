import { Metadata } from 'next';
import { Clock, User, Search, Microscope, Eye } from 'lucide-react';
import Link from 'next/link';
import { HeroMeta } from '@/components/site/hero-meta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Rhonda Shearer - Elden Ring Is The Large Glass',
  description: 'The researcher who revolutionized our understanding of Duchamp\'s readymades and artistic practice',
};

export default function RhondaShearerPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Key Scholar</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Rhonda Shearer
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            The researcher whose groundbreaking work revealed that Duchamp&apos;s &quot;readymades&quot;
            were often carefully crafted fakes - transforming our understanding of his entire project.
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Field', value: 'Art Research', icon: Search },
            { label: 'Reading Time', value: '8 min', icon: Clock },
            { label: 'Method', value: 'Forensic Analysis', icon: Microscope },
          ]}
        />
      </section>

      {/* Key Concepts Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <Microscope className="h-6 w-6 text-[var(--accent-gold)] mb-2" />
            <CardTitle className="text-base">Forensic Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Shearer applied scientific methods to examine Duchamp&apos;s objects, revealing hidden craftsmanship.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <Eye className="h-6 w-6 text-[var(--accent-blue)] mb-2" />
            <CardTitle className="text-base">The Fake Readymades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Many &quot;found objects&quot; were actually hand-made, deliberately crafted to appear mass-produced.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30">
          <CardHeader>
            <Search className="h-6 w-6 text-[var(--accent-purple)] mb-2" />
            <CardTitle className="text-base">Paradigm Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Her findings forced a complete reconsideration of Duchamp&apos;s relationship to craftsmanship and deception.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Biography Section */}
      <section className="glass-card border border-[var(--border-subtle)] p-8">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">About Rhonda Roland Shearer</h2>
        <div className="prose prose-lg prose-invert max-w-none">
          <p>
            Born in 1954 in Aurora, Illinois, <strong>Rhonda Roland Shearer</strong> is a multidisciplinary artist,
            researcher, and cultural advocate who built a career bridging art, science, and journalism.
          </p>

          <h3>Art Science Research Laboratory</h3>
          <p>
            In 1996, Shearer co-founded the <strong>Art Science Research Laboratory</strong> in New York City with
            renowned paleontologist <strong>Stephen Jay Gould</strong>. The organization operates as a 501(c)(3)
            nonprofit dedicated to exploring intersections between artistic and scientific inquiry.
          </p>
          <p>
            This collaboration proved essential: Gould brought evolutionary biology&apos;s emphasis on empirical
            evidence and skepticism toward received narratives, while Shearer contributed deep knowledge of art
            history and forensic examination techniques.
          </p>

          <h3>Tout-Fait: The Marcel Duchamp Studies Online Journal</h3>
          <p>
            Shearer founded and edited <strong>Tout-Fait: The Marcel Duchamp Studies Online Journal</strong>,
            a peer-reviewed publication that became a crucial resource for Duchamp scholars worldwide.
          </p>

          <h3>Key Publications</h3>
          <p>
            Her most influential work on Duchamp includes the two-part essay series
            <em>&quot;Marcel Duchamp&apos;s Impossible Bed and Other &apos;Not&apos; Readymade Objects&quot;</em>,
            which systematically demonstrates that many of Duchamp&apos;s supposedly found objects
            were carefully crafted to appear mass-produced.
          </p>
        </div>
      </section>

      {/* Links to Essays */}
      <section className="glass-card border border-[var(--border-subtle)] p-8">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Impossible Bed Essays</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/rhonda-shearer-archive"
            className="group p-6 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-gold)]/50 transition-colors"
          >
            <h3 className="font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-gold)]">
              Part I: The Impossible Bed (Archive)
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Marcel Duchamp&apos;s &quot;Impossible Bed&quot; and Poincare&apos;s influence.
              Full essay with original illustrations from marcelduchamp.org.
            </p>
          </Link>
          <Link
            href="/impossible-bed"
            className="group p-6 border border-[var(--border-subtle)] rounded-lg hover:border-[var(--accent-gold)]/50 transition-colors"
          >
            <h3 className="font-medium text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-gold)]">
              Part II: Discovery Theory
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              A Possible Route of Influence From Art To Science.
              Key definitions and concepts extracted from the essay.
            </p>
          </Link>
        </div>
      </section>

    </div>
  );
}
