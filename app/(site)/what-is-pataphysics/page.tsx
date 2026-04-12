import { Metadata } from 'next';
import { CalendarDays, Clock, HelpCircle, BookOpen, Sparkles, Lightbulb } from 'lucide-react';
import { HeroMeta } from '@/components/site/hero-meta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'What is Pataphysics? - Elden Ring Is The Large Glass',
  description: 'An introduction to pataphysics, Alfred Jarry\'s science of imaginary solutions, and its relevance to understanding art',
};

export default function WhatIsPataphysicsPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-[var(--accent-blue)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Foundation</p>
          </div>
          <h1 className="page-hero-title">
            What is &apos;Pataphysics?
          </h1>
          <p className="page-hero-description">
            &apos;Pataphysics is the science of imaginary solutions, which symbolically attributes
            the properties of objects, described by their virtuality, to their lineaments.
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Origin', value: 'Alfred Jarry, 1893', icon: CalendarDays },
            { label: 'Reading Time', value: '8 min', icon: Clock },
            { label: 'Type', value: 'Philosophy', icon: BookOpen },
          ]}
        />
      </section>

      {/* Key Concepts Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/30">
          <CardHeader>
            <Sparkles className="h-6 w-6 text-[var(--accent-gold)] mb-2" />
            <CardTitle className="text-base">Beyond Metaphysics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              As metaphysics extends beyond physics, &apos;pataphysics extends beyond metaphysics into the realm of the imaginary.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/30">
          <CardHeader>
            <Lightbulb className="h-6 w-6 text-[var(--accent-blue)] mb-2" />
            <CardTitle className="text-base">Science of Exceptions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              While science studies laws, &apos;pataphysics studies the laws governing exceptions - the universe supplementary to this one.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30">
          <CardHeader>
            <BookOpen className="h-6 w-6 text-[var(--accent-purple)] mb-2" />
            <CardTitle className="text-base">The Apostrophe</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              The apostrophe in &apos;pataphysics is essential - it avoids a vulgar pun and marks the word as belonging to a special category.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2>Origins in Alfred Jarry</h2>
        <p>
          &apos;Pataphysics was invented by French writer Alfred Jarry (1873-1907), first appearing in his
          schoolboy farce <em>Ubu Roi</em> and later elaborated in <em>Exploits and Opinions of
          Dr. Faustroll, Pataphysician</em> (written 1898, published 1911).
        </p>
        <p>
          Jarry defined it as: &quot;the science of imaginary solutions, which symbolically attributes
          the properties of objects, described by their virtuality, to their lineaments.&quot; This
          deliberately obscure definition is itself a &apos;pataphysical gesture.
        </p>

        <h3>The Clinamen</h3>
        <p>
          Central to &apos;pataphysics is the concept of the <em>clinamen</em> - borrowed from Epicurean
          philosophy. The clinamen is the unpredictable swerve of atoms that allows for free will and
          creativity. In &apos;pataphysics, it represents the exception that proves nothing yet reveals everything.
        </p>

        <h3>Key Principles</h3>
        <ul>
          <li>Every event in the universe is exceptional</li>
          <li>Laws are correlations of exceptions (even if more frequent)</li>
          <li>The particular is more valuable than the general</li>
          <li>Imaginary solutions are the only real solutions</li>
          <li>The virtual is as real as the actual</li>
        </ul>

        <h2>Influence on Modern Art</h2>
        <p>
          &apos;Pataphysics profoundly influenced 20th century art movements:
        </p>
        <ul>
          <li><strong>Dada:</strong> The absurdist, anti-art movement drew directly from Jarry</li>
          <li><strong>Surrealism:</strong> André Breton acknowledged the &apos;pataphysical tradition</li>
          <li><strong>Situationism:</strong> Guy Debord&apos;s détournement has &apos;pataphysical roots</li>
          <li><strong>OuLiPo:</strong> The literary group was explicitly &apos;pataphysical</li>
          <li><strong>Fluxus:</strong> Continued the tradition of &apos;pataphysical performance</li>
        </ul>

        <h2>Duchamp and &apos;Pataphysics</h2>
        <p>
          Marcel Duchamp never formally joined the Collège de &apos;Pataphysique, but his work
          embodies &apos;pataphysical principles more completely than perhaps any other artist.
          The readymades, The Large Glass, and Étant donnés all operate according to imaginary physics.
        </p>
        <p>
          The Fountain (1917) is the quintessential &apos;pataphysical object: a urinal that becomes art
          not through physical transformation but through conceptual relocation. It exists in the
          universe supplementary to this one.
        </p>

        <h2>Why This Matters for Elden Ring</h2>
        <p>
          Understanding &apos;pataphysics is essential for understanding Elden Ring as art. The game
          doesn&apos;t just tell a story - it creates an imaginary solution to the problem of meaning
          in video games. Its incomplete lore, cyclical structure, and impossible geography are
          &apos;pataphysical design choices.
        </p>
      </section>

    </div>
  );
}
