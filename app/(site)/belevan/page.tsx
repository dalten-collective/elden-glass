import { Metadata } from 'next';
import { Clock, User, Search, Eye } from 'lucide-react';
import Image from 'next/image';
import { HeroMeta } from '@/components/site/hero-meta';

export const metadata: Metadata = {
  title: 'Mónica Belevan - Elden Ring Is The Large Glass',
  description: 'The mysterious figure whose work helped illuminate the Duchamp-Elden Ring connection',
};

export default function BelevanPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-[var(--accent-purple)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Key Figure</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Mónica Belevan
          </h1>
          <div className="flex gap-4 text-sm">
            <a
              href="https://thebridestripped.substack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-gold)] hover:underline"
            >
              The Bride Stripped →
            </a>
            <a
              href="https://covidianaesthetics.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-gold)] hover:underline"
            >
              Covidian Aesthetics →
            </a>
          </div>
        </div>
        <HeroMeta
          items={[
            { label: 'Field', value: 'Art History', icon: Search },
            { label: 'Reading Time', value: '6 min', icon: Clock },
            { label: 'Focus', value: 'Duchamp Studies', icon: Eye },
          ]}
        />
      </section>

      {/* Daisugi Tree Discovery */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Daisugi Tree Discovery</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The discovery of Elden Ring&apos;s final secret took about five years, and began even before the game&apos;s release with an unrelated discovery involving the nature of the Dark Souls series. I had been offered an internship at Tlon, which was at the time the chief corporate vehicle for the Urbit project. It was an opportunity and honor I had not expected, so I was very nervous for my first day. During the bi-weekly all-hands meeting, after I was asked to introduce myself, the CEO turned the topic to the structure of Urbit&apos;s identity system. He brought up a picture, this picture to be precise, of a daisugi tree and asked if anyone could think of what the tree&apos;s structure could represent.
          </p>
          <p>
            Daisugi (台杉, &quot;platform cedar&quot;) is a centuries-old Japanese pollarding technique applied to Cryptomeria, the Japanese cedar. A mature tree is pollarded at the level of its basal canopy: the upper branches are cut away, leaving a living platform where the canopy once was. New vertical shoots grow upward from that platform, and they are trained to grow perfectly straight, so that in time each one becomes a long slender trunk in its own right. Every shoot is independent above the platform, but they all share the same trunk and root system below it. The CEO was using the image as an analogy for Urbit&apos;s hierarchy: each node sponsors the ones below it, and the nodes share a common root without being interchangeable. That was the part he wanted the room to see.
          </p>
          <p>
            I saw something else. It was literally my first day on the job and I was still too overawed to actually say it out loud. What I had just realized is that a daisugi is the shape of the Archtrees from Dark Souls, and that, as far as I knew, no one in the Souls community had made that connection.
          </p>
          <p>
            When the all-hands ended I immediately searched the wikis, the lore forums, and the longer YouTube essays. As far as I could find, no one had.
          </p>
        </div>
      </section>

      {/* Urbit and Dark Souls and the Fifth Wall */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Urbit and Dark Souls and the Fifth Wall</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            This project began about 5 years ago, before Elden Ring had even been released. I had been working for some time on an essay I was calling &quot;Urbit and Dark Souls and the Fifth Wall&quot;, the title being a tribute to the original name of David Wong&apos;s second book. I had wanted to write about how the Dark Souls, and by extension all of Miyazaki&apos;s games, were the first instance of a work of art managing to break the 5th wall. My argument would be based on what I had at the time believed was a universal understanding that the fifth wall is the barrier between The Observers (the audience members, the readers, the players) from one another, leading to different understandings, and therefore different works of art, as referenced in Duchamp&apos;s lecture. I had first read this definition years ago as written by David Wong, author of the Absurdist Lovecraftian horror masterpiece, &quot;John Dies at the End&quot;, and had assumed this was the fifth wall&apos;s standard definition. To my surprise, when I began doing research on the subject in preparation for the essay, I discovered that not only is it not the standard definition, but that there wasn&apos;t one at all. Five years ago there wasn&apos;t even a wikipedia page for the term, the page would simply redirect you to the entry for breaking the 4th wall. I searched for both David Wong&apos;s original writing on the subject, but found it had been lost to the shifting sands of the internet, presumably during the corporate raiding of Cracked.com.
          </p>
        </div>
      </section>

      {/* Article Preview Card */}
      <section>
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">The article that named it</h2>
        <a
          href="https://thebridestripped.substack.com/p/prudence-in-hell-023"
          target="_blank"
          rel="noopener noreferrer"
          className="block glass-card border border-[var(--border-subtle)] p-6 hover:border-[var(--accent-gold)] transition-colors"
        >
          <Image
            src="/images/black-box-theatre.jpg"
            alt="Black Box Theatre - illustration by Alonso"
            width={800}
            height={500}
            className="rounded-lg border border-[var(--border-subtle)] w-full h-auto mb-4"
          />
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-tertiary)] mb-1">Prudence in Hell 023</p>
          <h3 className="text-xl font-serif text-[var(--text-primary)] mt-0 mb-1">
            AMA 002 — On the 5th Wall and the Black Box Theatre Theory
          </h3>
          <p className="text-xs text-[var(--text-tertiary)] mb-4">Mónica Belevan · The Bride Stripped · May 2, 2022</p>
          <p className="text-sm text-[var(--text-secondary)] italic">
            &quot;The fourth wall is an operation known as metalepsis. The fifth wall is an emergent pataphor. We cannot
            break the fifth wall if it&apos;s already broken (unless, of course, we do so pataphysically).&quot;
          </p>
          <p className="mt-4 text-sm text-[var(--accent-gold)]">Read on The Bride Stripped →</p>
        </a>
      </section>

    </div>
  );
}
