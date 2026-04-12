import { Metadata } from 'next';
import { CalendarDays, Clock, Package, Sparkles, Lightbulb, HelpCircle } from 'lucide-react';
import { HeroMeta } from '@/components/site/hero-meta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'The Readymades - Elden Ring Is The Large Glass',
  description: 'Understanding Duchamp\'s revolutionary readymades and their connection to Elden Ring\'s artistic approach',
};

export default function ReadymadesPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Art Historical Context</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            The Readymades
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Duchamp&apos;s revolutionary gesture: selecting everyday objects and declaring them art.
            Or was it something more complex?
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Period', value: '1913-1923', icon: CalendarDays },
            { label: 'Reading Time', value: '10 min', icon: Clock },
            { label: 'Significance', value: 'Foundational', icon: Sparkles },
          ]}
        />
      </section>

      {/* Key Concepts Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <Package className="h-6 w-6 text-[var(--accent-gold)] mb-2" />
            <CardTitle className="text-base">Found Objects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Everyday objects selected and presented as art - or so the standard narrative claims.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <HelpCircle className="h-6 w-6 text-[var(--accent-blue)] mb-2" />
            <CardTitle className="text-base">Conceptual Shift</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              The idea that art could be defined by context and intention, not craft or aesthetics.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30">
          <CardHeader>
            <Lightbulb className="h-6 w-6 text-[var(--accent-purple)] mb-2" />
            <CardTitle className="text-base">Hidden Complexity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Recent research suggests the readymades were far more deliberately crafted than believed.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2>The Standard Narrative</h2>
        <p>
          In 1913, Marcel Duchamp mounted a bicycle wheel on a kitchen stool. In 1914, he purchased
          a bottle rack from a Paris department store. In 1917, he submitted a urinal signed &quot;R. Mutt&quot;
          to an art exhibition. These acts supposedly launched conceptual art by demonstrating that
          the artist&apos;s choice, not their craft, could define art.
        </p>
        <p>
          This narrative has been repeated countless times: Duchamp freed art from the burden of making,
          showing that ideas mattered more than execution. The readymades became the foundation for
          much of contemporary art practice.
        </p>

        <h3>The Major Readymades</h3>
        <ul>
          <li><strong>Bicycle Wheel (1913):</strong> A bicycle wheel mounted on a stool</li>
          <li><strong>Bottle Rack (1914):</strong> A commercial bottle-drying rack</li>
          <li><strong>In Advance of the Broken Arm (1915):</strong> A snow shovel</li>
          <li><strong>Fountain (1917):</strong> A urinal turned on its back</li>
          <li><strong>Hat Rack (1917):</strong> A wooden hat rack</li>
          <li><strong>Comb (1916):</strong> A steel dog comb</li>
          <li><strong>Traveler&apos;s Folding Item (1916):</strong> A typewriter cover</li>
        </ul>

        <h2>The Complications</h2>
        <p>
          Research by Rhonda Shearer and others has complicated this picture considerably. Many of the
          &quot;readymades&quot; show evidence of modification or fabrication. The bottle rack doesn&apos;t match
          any known commercial product. The hat rack appears to be custom-made. Even the famous
          Fountain may not be what it claims to be.
        </p>
        <p>
          This suggests that Duchamp wasn&apos;t simply selecting objects - he was creating elaborate
          simulations of mass-produced items, then presenting them as &quot;found.&quot; The deception
          itself was part of the art.
        </p>

        <h2>Assisted Readymades</h2>
        <p>
          Duchamp also created &quot;assisted readymades&quot; - found objects that were modified:
        </p>
        <ul>
          <li><strong>Pharmacy (1914):</strong> A commercial print with added color dots</li>
          <li><strong>Apolinère Enameled (1916-17):</strong> A modified advertisement</li>
          <li><strong>L.H.O.O.Q. (1919):</strong> The Mona Lisa with a mustache and goatee</li>
          <li><strong>Why Not Sneeze Rose Sélavy? (1921):</strong> A birdcage with marble &quot;sugar cubes&quot;</li>
        </ul>
        <p>
          These complicate the notion that readymades were purely about selection rather than creation.
        </p>

        <h2>Relevance to Elden Ring</h2>
        <p>
          Understanding the readymades helps illuminate Elden Ring&apos;s artistic strategy:
        </p>
        <ul>
          <li>
            <strong>Surface vs. Reality:</strong> Like the readymades appearing mass-produced while
            being crafted, Elden Ring appears to be &quot;just a video game&quot; while containing deeper structures
          </li>
          <li>
            <strong>Context as Meaning:</strong> The readymades showed that context determines meaning;
            Elden Ring uses the context of Souls games to create expectations it then subverts
          </li>
          <li>
            <strong>The Creative Act:</strong> Duchamp said the viewer completes the artwork;
            Elden Ring requires the player&apos;s engagement to reveal its full meaning
          </li>
        </ul>

        <h2>The Deception as Art</h2>
        <p>
          If Duchamp&apos;s readymades were actually fabrications disguised as found objects, then
          deception itself becomes an artistic medium. The work exists in the gap between what
          we think we&apos;re seeing and what is actually there.
        </p>
        <p>
          This same principle may apply to Elden Ring: what appears to be a conventional fantasy
          game is actually a sophisticated art object operating on multiple levels simultaneously.
        </p>
      </section>

    </div>
  );
}
