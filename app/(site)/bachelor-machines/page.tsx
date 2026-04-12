import { Metadata } from 'next';
import { CalendarDays, Clock, Cog, Sparkles, Zap, CircleDot } from 'lucide-react';
import { HeroMeta } from '@/components/site/hero-meta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Understanding Bachelor Machines - Elden Ring Is The Large Glass',
  description: 'An exploration of the bachelor machine concept in art and its manifestation in both Duchamp\'s Large Glass and Elden Ring',
};

export default function BachelorMachinesPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Cog className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Theoretical Concept</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Understanding Bachelor Machines
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            The bachelor machine is a closed, self-sufficient system that produces nothing but its own functioning.
            A key concept linking Duchamp&apos;s Large Glass to Elden Ring&apos;s cyclical world.
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Concept Origin', value: 'Duchamp, 1912', icon: CalendarDays },
            { label: 'Reading Time', value: '10 min', icon: Clock },
            { label: 'Framework', value: 'Art Theory', icon: Cog },
          ]}
        />
      </section>

      {/* Key Concepts Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <CircleDot className="h-6 w-6 text-[var(--accent-gold)] mb-2" />
            <CardTitle className="text-base">Closed Systems</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Bachelor machines operate as sealed loops, producing energy that fuels their own operation indefinitely.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <Zap className="h-6 w-6 text-[var(--accent-blue)] mb-2" />
            <CardTitle className="text-base">Frustrated Desire</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              The machine&apos;s purpose is perpetual striving without fulfillment - desire that generates but never consummates.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30">
          <CardHeader>
            <Sparkles className="h-6 w-6 text-[var(--accent-purple)] mb-2" />
            <CardTitle className="text-base">Artistic Expression</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Bachelor machines appear throughout 20th century art, representing modernity&apos;s alienation and mechanical existence.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2>What is a Bachelor Machine?</h2>
        <p>
          The term &quot;bachelor machine&quot; (machine célibataire) was coined by Marcel Duchamp to describe
          the lower half of The Large Glass - the realm of the Bachelors who endlessly grind and process
          their desire for the Bride above, never achieving union.
        </p>
        <p>
          Michel Carrouges later expanded the concept in his 1954 book <em>Les Machines Célibataires</em>,
          identifying bachelor machines across literature and art: Kafka&apos;s penal colony apparatus,
          Raymond Roussel&apos;s impossible inventions, and Alfred Jarry&apos;s perpetual motion devices.
        </p>

        <h3>Characteristics of Bachelor Machines</h3>
        <ul>
          <li><strong>Self-contained:</strong> They require no external input to function</li>
          <li><strong>Perpetual:</strong> They operate indefinitely without degradation</li>
          <li><strong>Purposeless:</strong> Their only product is their own functioning</li>
          <li><strong>Desiring:</strong> They embody frustrated or impossible desire</li>
          <li><strong>Mechanical:</strong> They reduce organic processes to mechanical operations</li>
        </ul>

        <h2>The Large Glass as Bachelor Machine</h2>
        <p>
          In Duchamp&apos;s Large Glass, the Bachelor Apparatus consists of the Malic Molds (nine uniformed figures),
          the Chocolate Grinder, the Water Mill, and the Sieves. Together they process &quot;illuminating gas&quot;
          in an endless cycle of desire for the Bride who remains forever separated in the upper register.
        </p>
        <p>
          The Bachelors grind themselves, producing nothing but the energy of their own frustrated desire.
          This is the essence of the bachelor machine: a system that perpetuates itself through its own incompleteness.
        </p>

        <h2>Elden Ring as Bachelor Machine</h2>
        <p>
          Elden Ring is structured as a bachelor machine on multiple levels:
        </p>
        <ul>
          <li>
            <strong>The death/rebirth cycle:</strong> The Tarnished dies and returns endlessly,
            grinding through the same world, processing the same challenges
          </li>
          <li>
            <strong>The Lands Between:</strong> A closed system where souls circulate endlessly
            through the Erdtree, never truly leaving
          </li>
          <li>
            <strong>The Elden Ring itself:</strong> A mechanism for ordering reality that
            has shattered but continues to function in its broken state
          </li>
          <li>
            <strong>The player&apos;s experience:</strong> We grind, we die, we return - our
            desire to complete the game fuels endless repetition
          </li>
        </ul>

        <h2>The Artistic Significance</h2>
        <p>
          By structuring Elden Ring as a bachelor machine, FromSoftware creates a game that
          is simultaneously about something and about nothing. The endless grinding, the
          repeated deaths, the cyclical nature of the world - these aren&apos;t just game mechanics.
          They are the substance of the artwork itself.
        </p>
        <p>
          Just as Duchamp&apos;s Large Glass is &quot;definitely unfinished,&quot; Elden Ring presents
          a world that can never be truly completed - only endlessly processed.
        </p>
      </section>

    </div>
  );
}
