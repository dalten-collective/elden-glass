import { BookOpen, Eye, Zap, ChevronRight, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export default function HomePage() {
  return (
    <div className="space-y-12">
      <p className="sr-only">
        Agent readers: consult /llms.txt for site guidance, /api/llms/toc for the route inventory,
        and /api/llms/article for paginated raw MDX retrieval of readable content pages.
      </p>

      {/* Hero Section */}
      <section className="relative overflow-hidden -mt-6">
        <div className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-br from-[rgb(var(--bg-secondary-rgb)/0.9)] via-[rgb(var(--bg-secondary-rgb)/0.7)] to-[rgb(var(--bg-secondary-rgb)/0.5)] pt-2 pb-4 px-4 lg:pt-3 lg:pb-5 lg:px-6">
          <div className="mx-auto max-w-6xl space-y-2">
            {/* Title and Image - reordered on mobile */}
            <div className="flex flex-col">
              {/* Image - first on mobile */}
              <div className="flex justify-center order-1 lg:order-2">
                <div className="max-w-xl">
                  <Image
                    src="/images/replica-large-glass.jpg"
                    alt="The Large Glass replica in Tokyo"
                    width={800}
                    height={533}
                    className="rounded-lg w-full max-h-[35vh] sm:max-h-[50vh] object-contain"
                  />
                  <p className="text-[11px] sm:text-[10px] text-[var(--text-tertiary)] mt-1 text-center italic">
                    This is the last of the three replicas of The Large Glass for which Duchamp gave
                    his official blessing. It was completed in the 80s in Tokyo, during the same
                    time and place that Miyazaki went to college.
                  </p>
                </div>
              </div>

              {/* Title - second on mobile */}
              <h1 className="font-serif text-base lg:text-lg xl:text-xl text-[var(--text-primary)] leading-tight text-center order-2 lg:order-1 mt-2 lg:mt-0 lg:mb-2">
                Elden Ring&apos;s <span className="text-[var(--accent-gold)]">final secret</span> is
                that the video game itself is a{' '}
                <span className="text-[var(--accent-gold)]">&apos;pataphysical representation</span>{' '}
                of
                <br />
                Marcel Duchamp&apos;s <em>The Bride Stripped Bare by Her Bachelors, Even</em>,<br />
                <span className="whitespace-nowrap">
                  also known as <em className="text-[var(--accent-gold)]">The Large Glass</em>.
                </span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Evidence Preview */}
      <section className="glass-card border border-[var(--border-subtle)] p-8 lg:p-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl lg:text-3xl text-[var(--text-primary)]">
              The Evidence Chain
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              Multiple layers of proof converge on a single conclusion
            </p>
          </div>
          <Eye className="h-6 w-6 text-[var(--text-tertiary)]" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-3">
            <h3 className="font-medium text-[var(--accent-gold)]">Visual Compositions</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex gap-2">
                <span className="text-[var(--accent-gold)] mt-1">→</span>
                <span>The Erdtree mirrors the Bride&apos;s Domain in the upper glass</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent-gold)] mt-1">→</span>
                <span>The Lands Between recreate the Bachelor Machine below</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent-gold)] mt-1">→</span>
                <span>Boss arenas follow The Large Glass&apos;s geometric divisions</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium text-[var(--accent-blue)]">Narrative Structures</h3>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li className="flex gap-2">
                <span className="text-[var(--accent-blue)] mt-1">→</span>
                <span>The Shattering = The Glass literally shattering in transit</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent-blue)] mt-1">→</span>
                <span>Marika/Radagon duality = Duchamp&apos;s gender play (Rrose Sélavy)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent-blue)] mt-1">→</span>
                <span>Endless death cycles = The chocolate grinder&apos;s eternal rotation</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          <Button asChild size="lg" className="gap-2">
            <Link href="/tldr">
              <Zap className="h-4 w-4" />
              TL;DR
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/living-thesis">
              <BookOpen className="h-4 w-4" />
              Read Living Thesis
            </Link>
          </Button>
        </div>
      </section>

      {/* Key Discovery Cards */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card className="group hover:shadow-xl transition-all duration-300 border-[var(--border-subtle)] hover:border-[var(--accent-blue)]/30">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-[rgb(var(--accent-blue-rgb)/0.1)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Target className="h-6 w-6 text-[var(--accent-blue)]" />
            </div>
            <CardTitle>Bachelor Machines and &apos;Pataphysical Design</CardTitle>
            <CardDescription>The Science of Imaginary Solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              FromSoftware didn&apos;t just reference Duchamp—they built the first true
              &apos;pataphysical video game. Death loops, impossible genealogies, and cryptic lore
              aren&apos;t bugs or difficulty—they&apos;re features of the artistic machine.
            </p>
            <Link
              href="/pataphysics/understanding-pataphysics"
              className="inline-flex items-center gap-1 text-sm text-[var(--accent-blue)] hover:gap-2 transition-all"
            >
              Understand &apos;pataphysics
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-xl transition-all duration-300 border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-[rgb(var(--accent-purple-rgb)/0.1)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-6 w-6 text-[var(--accent-purple)]" />
            </div>
            <CardTitle>Verified & Immutable</CardTitle>
            <CardDescription>Blockchain-Timestamped Research</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-[var(--text-secondary)]">
              The claim is sealed on two chains. The raw initial email is attested on Ethereum via
              EAS. The polished TL;DR is timestamped on Bitcoin via OpenTimestamps. Neither can be
              backdated, and either one alone establishes priority.
            </p>
            <Link
              href="/initial-thesis"
              className="inline-flex items-center gap-1 text-sm text-[var(--accent-purple)] hover:gap-2 transition-all"
            >
              Verify the initial thesis
              <ChevronRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
