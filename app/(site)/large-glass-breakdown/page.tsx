import { Metadata } from 'next';
import { CalendarDays, Clock, Quote } from 'lucide-react';

import { HeroMeta } from '@/components/site/hero-meta';

export const metadata: Metadata = {
  title: 'Selected Quotes on the Large Glass - Elden Ring Is The Large Glass',
  description: 'A selection of direct quotes from Duchamp\'s notes describing the components and geometry of The Bride Stripped Bare by Her Bachelors, Even.',
};

export default function LargeGlassBreakdownPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Quote className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Duchamp in His Own Words</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Selected Quotes on the Large Glass
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Direct quotes from Duchamp&apos;s notes describing the components and geometry of <em>The Bride Stripped Bare by Her Bachelors, Even</em>.
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Work Created', value: '1915-1923', icon: CalendarDays },
            { label: 'Reading Time', value: '4 min', icon: Clock },
            { label: 'Type', value: 'Source Quotes', icon: Quote },
          ]}
        />
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2>Geometric Definitions</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic">
          Source: Roberto Giunti, &quot;The Bachelor Stripped Bare by Cabri Géomètre, Even&quot; (2007), citing Duchamp&apos;s notes.
        </p>

        <h3>Bachelor Apparatus (General Forms)</h3>
        <blockquote>
          <p>
            &quot;The principal forms of the bachelor apparatus or utensil are imperfect: Rectangle, circle, square, parallelepiped, symmetrical handle; demisphere.&quot;
          </p>
        </blockquote>

        <h3>The Chocolate Grinder</h3>
        <blockquote>
          <p>&quot;The threads could also be related to the geometric concept of ruled surface.&quot;</p>
        </blockquote>
        <blockquote>
          <p>&quot;The rollers do not interpenetrate as the device is grinding.&quot;</p>
        </blockquote>

        <h3>The Water Mill</h3>
        <blockquote>
          <p>&quot;The wheels will rotate forward and backward, the paddles will be over and under, in front and back.&quot;</p>
        </blockquote>
        <blockquote>
          <p>&quot;The rotation of the water wheels was intended to enable the onanistic left-right motion of the Chariot.&quot;</p>
        </blockquote>

        <h3>The Sieves / Parasols</h3>
        <blockquote>
          <p>&quot;The spangles pass through the parasols A, C, D, E, F…B. and as they gradually arrive at D, E, F, … etc. they are straightened out.&quot;</p>
        </blockquote>
        <blockquote>
          <p>&quot;The group of these parasols forms a sort of labyrinth of the three directions.&quot;</p>
        </blockquote>

        <h3>The Chariot / Glider</h3>
        <blockquote>
          <p>&quot;The Chariot will turn inside out as if it were a glove.&quot;</p>
        </blockquote>

        <h3>The Bride&apos;s Realm (Upper Half)</h3>
        <blockquote>
          <p>&quot;In the Bride – the principal forms will be more or less large or small, no longer have mensurability in relation to their destination.&quot;</p>
        </blockquote>
        <blockquote>
          <p>&quot;Parabolas, hyperbolas (or volumes deriving from them) will lose all connotation of men-surated position.&quot;</p>
        </blockquote>

        <h3>The Fourth Dimension Formula</h3>
        <blockquote>
          <p><strong>Perspective + Transparency + Motion = Emulation of 4D spatiality</strong></p>
        </blockquote>
        <blockquote>
          <p>&quot;One must consult the book, and see the two together&quot; to remove &quot;the retinal aspect.&quot;</p>
        </blockquote>
      </section>

    </div>
  );
}
