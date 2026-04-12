import { Metadata } from 'next';
import { CalendarDays, Clock, Target, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { HeroMeta } from '@/components/site/hero-meta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Understanding Pataphysics - Elden Ring Is The Large Glass',
  description: 'An introduction to pataphysics, the science of imaginary solutions, and how it applies to understanding Elden Ring as a digital artwork',
};

export default function PataphysicsPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-[var(--accent-blue)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Theoretical Framework</p>
          </div>
          <h1 className="page-hero-title">
            Understanding &apos;Pataphysics
          </h1>
          <p className="page-hero-description">
            The science of imaginary solutions, which symbolically attributes the properties of objects,
            described by their virtuality, to their lineaments. A key to understanding FromSoftware&apos;s artistic vision.
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Concept Origin', value: 'Alfred Jarry, 1893', icon: CalendarDays },
            { label: 'Reading Time', value: '12 min', icon: Clock },
            { label: 'Framework', value: 'Art Theory', icon: Target },
          ]}
        />
      </section>

      {/* Key Concepts Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/30">
          <CardHeader>
            <Sparkles className="h-6 w-6 text-[var(--accent-gold)] mb-2" />
            <CardTitle className="text-base">The Science of Exceptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              &apos;Pataphysics studies the laws governing exceptions and the universe supplementary to this one.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/30">
          <CardHeader>
            <Lightbulb className="h-6 w-6 text-[var(--accent-blue)] mb-2" />
            <CardTitle className="text-base">Imaginary Solutions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Solutions that exist in a realm beyond metaphysics, treating the virtual as real and the real as virtual.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30">
          <CardHeader>
            <BookOpen className="h-6 w-6 text-[var(--accent-purple)] mb-2" />
            <CardTitle className="text-base">Artistic Application</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              How Duchamp and FromSoftware use &apos;pataphysical principles to create layered, meaningful art.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2 id="what-is-pataphysics">What is &apos;Pataphysics?</h2>
        <p>
          &apos;Pataphysics (always with the apostrophe) was invented by French writer Alfred Jarry in 1893.
          It is defined as &quot;the science of imaginary solutions, which symbolically attributes the properties
          of objects, described by their virtuality, to their lineaments.&quot;
        </p>
        <p>
          In simpler terms, &apos;pataphysics is a philosophy that extends beyond metaphysics as far as
          metaphysics extends beyond physics. Where physics describes laws governing the physical world,
          and metaphysics describes laws governing abstract concepts, &apos;pataphysics describes the laws
          governing exceptions to these laws.
        </p>

        <h3>The Clinamen</h3>
        <p>
          Central to &apos;pataphysics is the concept of the <em>clinamen</em> - the minimal deviation that
          causes the unpredictable. In Epicurean physics, the clinamen was the slight swerve of atoms
          that allowed for free will and creativity. In &apos;pataphysics, it represents the exception
          that proves nothing, yet reveals everything.
        </p>

        <h2 id="duchamp-and-pataphysics">Duchamp and &apos;Pataphysics</h2>
        <p>
          Marcel Duchamp was deeply influenced by &apos;pataphysical thinking. His readymades, The Large Glass,
          and even his later works all embody &apos;pataphysical principles. The Fountain (a urinal signed
          &quot;R. Mutt&quot;) is perhaps the most famous &apos;pataphysical gesture in art history - an object whose
          meaning exists entirely in the conceptual realm.
        </p>
        <p>
          The Large Glass is explicitly a &apos;pataphysical machine. Its mechanisms - the chocolate grinder,
          the water mill, the malic molds - all operate according to imaginary physics. The Bride&apos;s
          domain exists in a dimension beyond the three we inhabit.
        </p>

        <h2 id="elden-ring-as-pataphysical">Elden Ring as &apos;Pataphysical Art</h2>
        <p>
          FromSoftware didn&apos;t just reference Duchamp - they created what may be the first true
          &apos;pataphysical video game. Consider how Elden Ring operates:
        </p>
        <ul>
          <li>Death is not an ending but a mechanical necessity - you must die to progress</li>
          <li>Time loops and contradicts itself - NPCs exist in impossible timelines</li>
          <li>Geography is symbolic rather than logical - connections serve meaning, not physics</li>
          <li>The lore is intentionally incomplete - understanding comes from absence</li>
        </ul>
        <p>
          These aren&apos;t design flaws or difficulty choices. They are &apos;pataphysical design decisions
          that mirror Duchamp&apos;s approach to art. The game operates according to imaginary solutions.
        </p>

        <h2 id="the-golden-bough">The Golden Bough Connection</h2>
        <p>
          James George Frazer&apos;s <em>The Golden Bough</em> (1890) catalogued myths and rituals from
          around the world, finding common patterns in seemingly unrelated cultures. This comparative
          mythology influenced both Jarry&apos;s &apos;pataphysics and Duchamp&apos;s art.
        </p>
        <p>
          Elden Ring draws heavily from this tradition. The Erdtree echoes the sacred trees of countless
          mythologies. The cycle of death and rebirth mirrors dying-and-rising god myths. FromSoftware
          has created a &apos;pataphysical mythology.
        </p>
      </section>

    </div>
  );
}
