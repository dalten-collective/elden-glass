import { Metadata } from 'next';
import { PenSquare, ExternalLink, CalendarDays, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCritiques } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Critiques & Responses - Elden Ring Is The Large Glass',
  description: 'Detailed analyses and responses to existing Elden Ring scholarship through the lens of the Duchamp discovery',
};

export default function CritiquesPage() {
  const critiques = getCritiques();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)] mb-4">Critical Analysis</p>
          <h1 className="page-hero-title">
            Critiques & Responses
          </h1>
          <p className="page-hero-description leading-relaxed">
            This section addresses existing Elden Ring scholarship and community theories. Each critique demonstrates
            how the Duchamp framework recontextualizes and often resolves apparent contradictions in the lore.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Why These Critiques Matter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              The Elden Ring community has produced brilliant analyses, but most approach the game
              through traditional fantasy or mythological lenses. These miss the fundamental artistic
              framework FromSoftware employed.
            </p>
            <p>
              By understanding Elden Ring as The Large Glass, apparent contradictions resolve into
              deliberate &apos;pataphysical paradoxes—features, not bugs, of the artistic machine.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Methodology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              Each critique follows a structured approach:
            </p>
            <ul className="space-y-1 ml-4">
              <li>• Summarize the original interpretation</li>
              <li>• Identify points of agreement</li>
              <li>• Show where the Duchamp lens provides clarity</li>
              <li>• Demonstrate how &apos;pataphysics resolves contradictions</li>
            </ul>
            <p className="text-xs text-[var(--text-tertiary)] pt-2">
              All responses maintain scholarly respect while advancing the discourse.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Critiques List */}
      <section className="space-y-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)]">Published Critiques</h2>

        {critiques.length > 0 ? (
          <div className="grid gap-6">
            {critiques.map((critique) => (
              <Card key={critique.slug} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-[var(--accent-gold)] transition-colors">
                        <Link href={`/critiques/${critique.slug}`} className="inline-flex items-center gap-2">
                          {critique.title}
                          <ArrowRight className="h-4 w-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Response to: <span className="text-[var(--text-primary)]">{critique.targetTitle}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
                      <CalendarDays className="h-4 w-4" />
                      <span>{new Date(critique.updated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    {critique.summary}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="sm">
                      <Link href={`/critiques/${critique.slug}`}>
                        <PenSquare className="h-4 w-4 mr-2" />
                        Read Analysis
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={critique.targetUrl as any} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Original
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <PenSquare className="h-12 w-12 mx-auto mb-4 text-[var(--text-tertiary)]" />
              <p className="text-[var(--text-secondary)]">No critiques published yet.</p>
              <p className="text-sm text-[var(--text-tertiary)] mt-2">
                Critical responses to existing scholarship are forthcoming.
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Coming Soon */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h3 className="font-medium text-[var(--text-primary)] mb-3">Planned Critiques</h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Future analyses will address major community theories and academic interpretations:
        </p>
        <ul className="grid gap-2 text-sm text-[var(--text-tertiary)] md:grid-cols-2">
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)]">→</span>
            <span>The &quot;George R.R. Martin wrote everything&quot; misconception</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)]">→</span>
            <span>Berserk parallels vs. Duchamp framework</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)]">→</span>
            <span>The alchemy interpretation and its limitations</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--accent-gold)]">→</span>
            <span>Why Marika&apos;s motivations seem contradictory</span>
          </li>
        </ul>
      </section>

    </div>
  );
}