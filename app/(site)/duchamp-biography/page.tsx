import { Metadata } from 'next';
import { CalendarDays, Clock, User, Package, Crown, Microscope } from 'lucide-react';
import Link from 'next/link';
import { HeroMeta } from '@/components/site/hero-meta';
import { UnfinishedBadge } from '@/components/site/unfinished-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Duchamp: Biography & Legacy - Elden Ring Is The Large Glass',
  description:
    'The life and lasting influence of Marcel Duchamp, from his early works to his impact on contemporary art',
};

export default function DuchampBiographyPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
              Artist Profile
            </p>
          </div>
          <h1 className="page-hero-title">Duchamp: Biography &amp; Legacy</h1>
          <p className="page-hero-description">
            Marcel Duchamp (1887-1968) revolutionized art in the 20th century. Understanding his
            life and methods is essential for understanding what FromSoftware has accomplished.
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Lived', value: '1887-1968', icon: CalendarDays },
            { label: 'Reading Time', value: '15 min', icon: Clock },
            { label: 'Type', value: 'Biography', icon: User },
          ]}
        />
      </section>

      <UnfinishedBadge />

      {/* Period Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <Package className="h-6 w-6 text-[var(--accent-gold)] mb-2" />
            <CardTitle className="text-base">Preliminary Works</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              1911-1918: From Cubism through the preliminary studies for The Large Glass.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/30">
          <CardHeader>
            <Package className="h-6 w-6 text-[var(--accent-blue)] mb-2" />
            <CardTitle className="text-base">The Readymades Era</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              1915-1920: The revolutionary period of Fountain, Bottle Rack, and conceptual art.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30">
          <CardHeader>
            <Crown className="h-6 w-6 text-[var(--accent-purple)] mb-2" />
            <CardTitle className="text-base">Chess &amp; Beyond</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              1920-1968: The &quot;retirement&quot; that secretly produced Étant donnés.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2>Preliminary Works (1911-1918)</h2>
        <p>Content to be written...</p>

        <h2>The Readymades As An Era (1915-1920)</h2>
        <p>Content to be written...</p>

        <h2>Rhonda Shearer</h2>
        <p>
          For a detailed examination of Rhonda Shearer&apos;s groundbreaking research into the
          readymades, see the <Link href="/rhonda-shearer">dedicated page</Link>.
        </p>

        <h2>Chess</h2>
        <p>
          For an in-depth exploration of Duchamp&apos;s chess career and its artistic significance,
          see the <Link href="/chess">dedicated page</Link>.
        </p>
      </section>

      {/* Key Figures */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="text-sm uppercase tracking-[0.25em] text-[var(--text-tertiary)] mb-4">
          Key Scholars &amp; Figures
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Link
            href="/rhonda-shearer"
            className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
          >
            <Microscope className="h-4 w-4 text-[var(--accent-gold)] opacity-50 group-hover:opacity-100" />
            Rhonda Shearer - Readymade Research
          </Link>
          <Link
            href="/belevan"
            className="group flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors"
          >
            <User className="h-4 w-4 text-[var(--accent-gold)] opacity-50 group-hover:opacity-100" />
            Mónica Belevan - &apos;Pataphysical Analysis
          </Link>
        </div>
      </section>
    </div>
  );
}
