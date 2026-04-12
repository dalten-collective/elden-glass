'use client';

import { Flame, TreeDeciduous, GitBranch, Sword } from 'lucide-react';

export default function DaisugiCosmologyPage() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <TreeDeciduous className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Cosmological Structure</p>
          </div>
          <h1 className="page-hero-title">
            The Daisugi Cosmology
          </h1>
          <p className="page-hero-description">
            The candelabra tree that spans all of Miyazaki&apos;s worlds. Multiple flames on branching arms, each burning down.
          </p>
        </div>
      </section>

      {/* The Daisugi Structure */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Shape of All Worlds</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            <strong>Daisugi</strong> is a Japanese forestry technique where multiple trees are cultivated from a single base.
            The trunk is pruned, and new shoots grow vertically from the cuts. Harvest without killing the source.
            The same base produces wood generation after generation.
          </p>
          <p>
            This is the shape of Miyazaki&apos;s cosmology. Not a single world, but a <em>structure</em> of worlds.
            Multiple branches rising from one trunk, each with its own flame slowly burning down.
          </p>
          <p>
            The archtrees in Ash Lake. The columns surrounding Placidusax&apos;s arena. The pale pillars in the Elden Beast&apos;s
            golden void. The structure beneath the Hunter&apos;s Dream. They all look the same because they <em>are</em> the same.
            Different views of the same tree from different branches.
          </p>
        </div>
      </section>

      {/* The Candelabra */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Flame className="h-6 w-6 text-orange-400" />
          <h2 className="font-serif text-2xl text-[var(--text-primary)]">The Candle Tree</h2>
        </div>
        <div className="prose prose-invert max-w-none">
          <p>
            Candelabras are a recurring motif across the games, especially in Elden Ring. The <strong>Candle Tree Shield</strong>
            names it directly. Multiple candles on branching arms from a single base&mdash;the daisugi with fire.
          </p>
          <p>
            Each world is a candle on the tree. Its own flame, slowly burning down:
          </p>
          <ul>
            <li>The First Flame in Lordran, fading through cycles</li>
            <li>The Erdtree&apos;s golden light in the Lands Between</li>
            <li>Whatever burns in Bloodborne&apos;s nightmare realms</li>
          </ul>
          <p>
            The flames gutter. Ages end. The question every game asks: do you relight the candle? Let it die?
            Flee to another branch and start a new flame there?
          </p>
        </div>
      </section>

      {/* The Dragon God */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Dragon God</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            Before any external force, the tree had a natural guardian. The dragon god. One of the Everlasting Dragons
            that tended the branches and their flames. Not imposing order&mdash;simply <em>being</em> what dragons are.
            The archtrees and stone dragons are one system, symbiotic or even the same organism.
          </p>
          <p>
            The Lands Between before the Erdtree wasn&apos;t empty. It had a naturally evolved order, like Ravnica from
            Magic: The Gathering&mdash;a reference Miyazaki has drawn from. The dragon god ruled this system. Placidusax,
            the Dragonlord, served as its vessel.
          </p>
          <p>
            This wasn&apos;t imposed structure. It was organic emergence. The crucible, the primordial forms, the dragons&mdash;all
            native to the world, growing naturally on their branch of the tree.
          </p>
        </div>
      </section>

      {/* The Great Serpent Hunts */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <Sword className="h-6 w-6 text-red-400" />
          <h2 className="font-serif text-2xl text-[var(--text-primary)]">The Great Serpent Hunts</h2>
        </div>
        <div className="prose prose-invert max-w-none">
          <p>
            The <strong>Serpent-Hunter</strong>&mdash;the weapon you use against Rykard&mdash;names them directly in its item text.
            The Great Serpent Hunts. Not subtext. Not inference. Named, capitalized, historical.
          </p>
          <p>
            This is the same weapon wielded by the Nameless King in Dark Souls 3. Gwyn&apos;s firstborn son, erased from history
            for siding with the dragons. He was a hunter who switched sides&mdash;raised to kill dragons, he took the weapon
            of extinction and turned it to their defense.
          </p>
          <p>
            The same weapon in both games because the same war happened across both worlds. Gwyn didn&apos;t just wage war in
            Lordran. He scoured the dragons <em>across all branches</em> of the daisugi tree. A multiversal hunt.
          </p>
          <p>
            The dragon god fled from branch to branch, trying to outrun Gwyn&apos;s crusade. Each time it landed somewhere,
            Gwyn&apos;s reach eventually found it. It ended up in the Lands Between&mdash;and then fled again, before the
            Golden Order ever arrived.
          </p>
        </div>
      </section>

      {/* Placidusax's Vigil */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">Placidusax&apos;s Vigil</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            Placidusax waits in Farum Azula, frozen in time outside time. His arena is surrounded by columns that
            resemble the archtrees&mdash;the same visual language as Ash Lake, the Elden Beast arena, the Hunter&apos;s Dream platform.
          </p>
          <p>
            He&apos;s waiting at a junction point. The door his god left through. The space looks like where his god fled{' '}
            <em>to</em> because that&apos;s the connection between branches.
          </p>
          <p>
            But his god was already gone before the Greater Will arrived. The dragon god fled the Lands Between&mdash;still
            running from Gwyn&apos;s hunt&mdash;and <em>then</em> the Golden Order moved in on the empty branch.
          </p>
          <p>
            Placidusax wasn&apos;t left behind during a conquest. His god fled, and he stayed to wait, and then something else
            entirely showed up and took over. He&apos;s been frozen waiting for a god that left before the enemy he sees even arrived.
          </p>
          <p>
            The Stone Dragon in Ash Lake&mdash;sitting at the bottom of a dying branch, in a stump of an archtree, completely
            passive&mdash;that&apos;s where the running finally stopped. Not because it was safe, but because there was nowhere
            left to go.
          </p>
        </div>
      </section>

      {/* The Mistletoe */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <div className="flex items-center gap-3 mb-6">
          <GitBranch className="h-6 w-6 text-[var(--accent-gold)]" />
          <h2 className="font-serif text-2xl text-[var(--text-primary)]">The Mistletoe</h2>
        </div>
        <div className="prose prose-invert max-w-none">
          <p>
            The Greater Will isn&apos;t a conqueror. It&apos;s <strong>mistletoe</strong>&mdash;a parasite that attaches to trees
            and drains their life force. Evergreen while the host withers.
          </p>
          <p>
            It didn&apos;t light a new candle on the branch. It attached itself to an existing flame and started <em>feeding</em>.
            The Erdtree isn&apos;t a flame&mdash;it&apos;s the visible body of the parasite wrapped around the Greattree. The gold
            isn&apos;t light, it&apos;s the mistletoe staying lush while it drains the host.
          </p>
          <p>
            The Greater Will found a branch where the natural guardian had already fled and the flame was untended.
            Easy infection. The Lands Between wasn&apos;t conquered&mdash;it was abandoned and then colonized.
          </p>
          <p>
            That&apos;s why the Greater Will doesn&apos;t create. It only imposes, constrains, harvests. Parasites don&apos;t grow
            their own energy. They take.
          </p>
          <p>
            Gwyn breaks the branches with war. The Greater Will feeds on what&apos;s left.
          </p>
        </div>
      </section>

      {/* The Pattern */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-6">The Recurring Story</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            Miyazaki keeps telling the same story across all his games:
          </p>
          <ol>
            <li>Something natural exists on a branch of the tree</li>
            <li>Something external conquers or infects it</li>
            <li>The conquest is called &quot;order&quot; or &quot;fire&quot; or &quot;dream&quot;</li>
            <li>The natural thing becomes &quot;heresy&quot; or &quot;rot&quot; or &quot;chaos&quot;</li>
            <li>The candle burns down</li>
            <li>Someone must choose what comes next</li>
          </ol>
          <p>
            The daisugi isn&apos;t a metaphor. It&apos;s the literal shape of the cosmology. The archtrees are the structure.
            The candelabra is the image. Each game is a different branch, a different flame, a different angle on the same tree.
          </p>
          <p>
            When Rykard fed himself to the God-Devouring Serpent, he was siding with the hunted. When the Nameless King
            turned against his father, he was defending the tree from those who would break it. When the Tarnished
            becomes Elden Lord, they inherit a branch already drained by mistletoe.
          </p>
          <p>
            The dragon god, wherever it rests now, has watched this pattern repeat across worlds. Gwyn&apos;s war.
            The Greater Will&apos;s infection. Every cycle another candle guttering while something external feeds on the light.
          </p>
        </div>
      </section>
    </div>
  );
}
