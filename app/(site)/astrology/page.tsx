'use client';

import { Star, Sun, Moon, Orbit, Binary } from 'lucide-react';
import { EldenOrrery } from '@/components/astrology/elden-orrery';

export default function AstrologyPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Celestial Mechanics</p>
          </div>
          <h1 className="page-hero-title">
            Elden Ring&apos;s Astrology
          </h1>
          <p className="page-hero-description">
            As above, so below. The celestial structure of the Lands Between mirrors
            the cosmic relationships between stars, planets, and the forces that bind them.
          </p>
        </div>
      </section>

      {/* Interactive Orrery */}
      <section className="glass-card border border-[var(--border-emphasis)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Orbit className="h-6 w-6 text-[var(--accent-gold)]" />
          <h2 className="font-serif text-2xl text-[var(--text-primary)]">The Celestial Orrery</h2>
        </div>
        <EldenOrrery />
      </section>

      {/* The Binary System */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Binary className="h-6 w-6 text-[var(--accent-gold)]" />
          <h2 className="font-serif text-2xl text-[var(--text-primary)]">The Binary System</h2>
        </div>
        <div className="prose prose-invert max-w-none">
          <p>
            The <strong>TYCHOS model</strong> proposes that the Sun and Mars exist in a binary orbital
            relationship, with Earth positioned at the barycenter&mdash;the center of mass between the two
            celestial bodies. This isn&apos;t heliocentrism. It&apos;s not geocentrism. It&apos;s something stranger.
          </p>
          <p>
            In the Lands Between, we see the same structure reflected:
          </p>
          <ul>
            <li><strong>Radagon and Marika</strong> form a binary system&mdash;two gods in one body,
            each retaining their distinct will. One shatters. One repairs. Neither absorbs the other.</li>
            <li><strong>The Erdtree</strong> sits at the center, the axis mundi around which all rotates.</li>
            <li><strong>Radahn</strong> holds the stars in place through sheer gravitational will&mdash;the
            force that keeps celestial bodies in their orbits.</li>
          </ul>
          <p>
            This is the hermetic principle made literal: <em>as above, so below</em>. The cosmic structure
            of the heavens is replicated in the political and metaphysical structure of the world below.
          </p>
        </div>
      </section>

      {/* Radahn Holds the Stars */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Orbit className="h-6 w-6 text-orange-400" />
          <h2 className="font-serif text-2xl text-[var(--text-primary)]">Radahn Holds the Stars</h2>
        </div>
        <div className="prose prose-invert max-w-none">
          <p>
            Starscourge Radahn learned gravity magic specifically to keep riding his beloved horse Leonard,
            who couldn&apos;t bear his weight after he grew to giant size. But this power scaled beyond the
            personal&mdash;Radahn used his mastery of gravity to hold the stars themselves in place.
          </p>
          <p>
            This isn&apos;t metaphor. The stars in Elden Ring are literal celestial bodies with their own
            wills and destinies. Ranni&apos;s ending&mdash;the Age of Stars&mdash;requires Radahn&apos;s fall to
            even become possible. While he held them, the stars couldn&apos;t move. The celestial order was frozen.
          </p>
          <p>
            Radahn is gravity itself. The binding force. When you defeat him, the stars resume their motion.
            New paths open. Ranni can guide the world into a new age. Miquella, in the DLC, can attempt
            his own new order.
          </p>
          <p>
            <strong>Two bindings must break</strong> for true change:
          </p>
          <ol>
            <li>The Elden Ring (Marika shatters it)</li>
            <li>Radahn&apos;s gravitational hold (the Tarnished defeats him)</li>
          </ol>
          <p>
            One breaks the metaphysical law. The other breaks the celestial law. Both must fall for the
            stars to move again.
          </p>
        </div>
      </section>

      {/* True vs False Syzygy */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sun className="h-6 w-6 text-yellow-400" />
          <Moon className="h-6 w-6 text-blue-300" />
          <h2 className="font-serif text-2xl text-[var(--text-primary)]">True and False Syzygy</h2>
        </div>
        <div className="prose prose-invert max-w-none">
          <p>
            <strong>Syzygy</strong> in pataphysics means the conjunction of opposites&mdash;but crucially,
            a conjunction where both elements <em>retain their identity</em>. It&apos;s not fusion. It&apos;s not
            domination. It&apos;s two distinct wills in perpetual opposition within a unified form.
          </p>
          <p>
            <strong>Radagon and Marika are a TRUE syzygy.</strong> They share one body but retain completely
            separate wills. Marika shattered the Elden Ring. Radagon tried to repair it. Neither absorbed
            the other. Neither won. They exist in eternal opposition&mdash;two gods, one vessel, two wills.
          </p>
          <p>
            <strong>Miquella and Radahn are a FALSE syzygy.</strong> In the DLC, Miquella attempts to create
            a new divine pair with Radahn as his consort. But this isn&apos;t syzygy&mdash;it&apos;s <em>regression</em>
            disguised as conjunction. Miquella uses his charm to dominate Radahn&apos;s will, erasing Radahn&apos;s
            identity rather than preserving it. One absorbs the other. That&apos;s not conjunction&mdash;that&apos;s
            the Law of Regression wearing the mask of the Two becoming One.
          </p>
        </div>
      </section>

      {/* The Celestial Hierarchy */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Celestial Hierarchy</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The astrology of the Lands Between follows a clear hierarchical structure:
          </p>
          <ul>
            <li><strong>The Greater Will</strong> &mdash; The distant outer god, the cosmic force that sent
            the Elden Beast</li>
            <li><strong>The Elden Beast</strong> &mdash; The living incarnation of the Elden Ring, the
            vassal of the Greater Will</li>
            <li><strong>Marika/Radagon</strong> &mdash; The god-vessel, the binary system at the center</li>
            <li><strong>The Demigods</strong> &mdash; The offspring, the planets orbiting the central sun</li>
            <li><strong>The Stars</strong> &mdash; Other cosmic entities, held in place by Radahn&apos;s gravity</li>
            <li><strong>The Tarnished</strong> &mdash; The variable, the agent of change, the one who can
            break the orbits</li>
          </ul>
          <p>
            This structure mirrors both ancient cosmological models and the hermetic worldview that
            Miyazaki draws from. The macrocosm reflects the microcosm. The political structure of the
            Lands Between is a map of the heavens.
          </p>
        </div>
      </section>

      {/* Coming Soon placeholder sections */}
      <section className="glass-card border border-[var(--border-subtle)] border-dashed p-6 opacity-60">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Coming Soon</h2>
        <div className="prose prose-invert max-w-none">
          <ul>
            <li>The Carian Astrologers and their relationship to the stars</li>
            <li>Ranni&apos;s Dark Moon and lunar symbolism</li>
            <li>The relationship between outer gods and celestial bodies</li>
            <li>Gravity magic as cosmological binding</li>
            <li>The eclipse and its significance</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
