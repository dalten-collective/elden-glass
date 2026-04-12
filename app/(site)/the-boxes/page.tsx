import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "The Boxes | Elden Glass",
  description: "Duchamp's supplementary publications for The Large Glass: The Green Box (1934) and The White Box (1967)",
};

export default function TheBoxesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-serif text-3xl lg:text-4xl text-[var(--accent-gold)] mb-4">
        The Boxes
      </h1>
      <p className="text-[var(--text-secondary)] mb-8 text-lg">
        Duchamp never intended The Large Glass to stand alone. He created supplementary publications—boxes containing facsimiles of his notes, sketches, and calculations—that together form the complete work. Without the boxes, The Large Glass is merely an enigmatic image. With them, it becomes a conceptual apparatus.
      </p>

      {/* The Green Box */}
      <section className="mb-12" id="green-box">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 mb-6">
          The Green Box (La Boîte Verte) — 1934
        </h2>

        <div className="space-y-6 text-[var(--text-secondary)]">
          <p>
            Published in an edition of 320, The Green Box contains 94 loose documents—notes, drawings, and photographs—that Duchamp compiled between 1911 and 1915 while planning The Large Glass. The documents are facsimiles, reproduced to match the originals exactly: same paper, same ink, same tears and stains.
          </p>

          <div className="bg-[var(--bg-tertiary)] p-6 rounded-lg border border-[var(--border-subtle)]">
            <h3 className="text-[var(--accent-gold)] font-medium mb-3">Contents Include:</h3>
            <ul className="space-y-2 text-sm">
              <li>• The &quot;Preface&quot; establishing the work&apos;s conceptual framework (&quot;Given: 1. The Waterfall, 2. The Illuminating Gas&quot;)</li>
              <li>• Detailed descriptions of the Bride&apos;s mechanism (timid-power, blossoming, desire-magneto)</li>
              <li>• The bachelor apparatus operations (malic molds, chocolate grinder, sieves)</li>
              <li>• Laws of &quot;Playful Physics&quot; (oscillating density, emancipated metal, friction reintegrated)</li>
              <li>• Specifications for Readymades and notes on chance operations</li>
              <li>• The &quot;Litanies of the Chariot&quot; (Slow life. Vicious circle. Onanism.)</li>
              <li>• Technical drawings and perspective calculations</li>
            </ul>
          </div>

          <p>
            The Green Box doesn&apos;t explain The Large Glass—it complicates it. The notes are deliberately fragmentary, pseudo-scientific, riddled with private jokes and invented terminology. Reading them alongside the artwork creates not clarity but productive confusion: each element opens onto further questions.
          </p>

          <blockquote className="border-l-2 border-[var(--accent-gold)] pl-4 italic text-[var(--text-tertiary)]">
            &quot;It is merely a way of succeeding in no longer thinking that the thing in question is a picture—to make a delay of it in the most general way possible... a delay in glass as you would say a poem in prose or a spittoon in silver.&quot;
            <span className="block mt-2 text-sm not-italic">— Marcel Duchamp, Green Box note on &quot;Delay in Glass&quot;</span>
          </blockquote>

          <p>
            The term &quot;Green Box&quot; comes from its green flocked cardboard cover. Duchamp supervised every detail of production, ensuring the facsimiles matched his original scraps precisely. The box is itself a work of art: an anti-book, a scattered archive, notes that must be shuffled and recombined rather than read sequentially.
          </p>

          <div className="mt-6">
            <Link
              href="/vocab#the-green-box-duchamps-notes"
              className="text-[var(--accent-gold)] hover:underline"
            >
              → See Green Box Vocabulary definitions
            </Link>
          </div>
        </div>
      </section>

      {/* The White Box */}
      <section className="mb-12" id="white-box">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 mb-6">
          The White Box (À l&apos;Infinitif) — 1967
        </h2>

        <div className="space-y-6 text-[var(--text-secondary)]">
          <p>
            Published one year before Duchamp&apos;s death, The White Box (also called &quot;À l&apos;Infinitif&quot; or &quot;In the Infinitive&quot;) contains 79 additional notes, mostly from 1912-1920. Where The Green Box focused on The Large Glass&apos;s iconography and mechanics, The White Box explores its mathematical and philosophical foundations.
          </p>

          <div className="bg-[var(--bg-tertiary)] p-6 rounded-lg border border-[var(--border-subtle)]">
            <h3 className="text-[var(--accent-gold)] font-medium mb-3">Key Themes:</h3>
            <ul className="space-y-2 text-sm">
              <li>• <strong>The Fourth Dimension</strong> — Extensive notes on n-dimensional geometry and its artistic applications</li>
              <li>• <strong>The Infrathin (Inframince)</strong> — The barely perceptible difference between two nearly identical things</li>
              <li>• <strong>Perspective</strong> — Mathematical calculations for &quot;rehabilitated perspective&quot;</li>
              <li>• <strong>The Possible</strong> — Notes on possibility as a physical medium (&quot;The possible is an infrathin&quot;)</li>
              <li>• <strong>Appearance and Apparition</strong> — Distinctions between how things look and how they manifest</li>
              <li>• <strong>Gravity and the Center of Gravity</strong> — Physics as metaphor and method</li>
            </ul>
          </div>

          <p>
            The title &quot;À l&apos;Infinitif&quot; refers to the grammatical infinitive—the unconjugated verb form (to be, to have, to make). Duchamp&apos;s notes often use infinitives, describing actions in their pure potential state rather than as completed events. The infinitive is possibility before actualization, the verb before it commits to a tense.
          </p>

          <blockquote className="border-l-2 border-[var(--accent-gold)] pl-4 italic text-[var(--text-tertiary)]">
            &quot;The possible is only a physical &apos;caustic&apos; [vitriol] burning all aesthetics or callistics.&quot;
            <span className="block mt-2 text-sm not-italic">— Marcel Duchamp, White Box note</span>
          </blockquote>

          <h3 className="text-[var(--text-primary)] font-medium mt-8 mb-4">The Fourth Dimension</h3>
          <p>
            The White Box reveals Duchamp&apos;s serious engagement with n-dimensional mathematics. For Duchamp, the fourth dimension wasn&apos;t mystical but geometrical: just as a 3D object casts a 2D shadow, a 4D object would cast a 3D shadow. The Bride exists in four dimensions; what we see in The Large Glass is her three-dimensional projection.
          </p>
          <p className="mt-4">
            This explains the Bride&apos;s strange form—she&apos;s not poorly drawn but dimensionally reduced, a higher being flattened into our perceptual range. The bachelors, by contrast, are thoroughly three-dimensional, trapped in measurable space while the Bride operates from beyond it.
          </p>

          <h3 className="text-[var(--text-primary)] font-medium mt-8 mb-4">The Infrathin</h3>
          <p>
            Duchamp&apos;s most elusive concept appears throughout The White Box. The infrathin (inframince) is the smallest possible difference—the warmth left in a seat just vacated, the sound of corduroy trousers rubbing together, the difference between two things cast from the same mold.
          </p>
          <p className="mt-4">
            The infrathin exists at the threshold of perception, where distinction almost vanishes but doesn&apos;t quite. It&apos;s the space between identical twins, between a word and its echo, between the present moment and the one just past. Duchamp collected examples obsessively, finding in them a physics of the imperceptible.
          </p>

          <div className="bg-[var(--bg-tertiary)] p-6 rounded-lg border border-[var(--border-subtle)] mt-6">
            <h3 className="text-[var(--accent-gold)] font-medium mb-3">Examples of the Infrathin:</h3>
            <ul className="space-y-2 text-sm italic text-[var(--text-tertiary)]">
              <li>&quot;The warmth of a seat (which has just been left) is infrathin.&quot;</li>
              <li>&quot;Velvet trousers—their whistling sound (in walking) by brushing of the two legs is an infrathin separation signaled by sound.&quot;</li>
              <li>&quot;When the tobacco smoke smells also of the mouth which exhales it, the two odors marry by infrathin.&quot;</li>
              <li>&quot;Subway gates—the people who go through at the very last moment / infrathin.&quot;</li>
              <li>&quot;The possible is an infrathin. The possibility of several tubes of color becoming a Seurat is the concrete &apos;explanation&apos; of the possible as infrathin.&quot;</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Relationship Between the Boxes */}
      <section className="mb-12" id="relationship">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-2 mb-6">
          The Boxes as System
        </h2>

        <div className="space-y-6 text-[var(--text-secondary)]">
          <p>
            Together, The Green Box and The White Box transform The Large Glass from a static artwork into an ongoing process of interpretation. The boxes are not explanations but expansions—each note opens new questions rather than closing old ones.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-[var(--bg-tertiary)] p-6 rounded-lg border border-[var(--border-subtle)]">
              <h3 className="text-[var(--accent-gold)] font-medium mb-3">Green Box (1934)</h3>
              <ul className="space-y-1 text-sm">
                <li>• 94 documents</li>
                <li>• Iconographic focus</li>
                <li>• Describes the apparatus</li>
                <li>• Invented terminology</li>
                <li>• &quot;Playful physics&quot;</li>
                <li>• Published during Duchamp&apos;s lifetime peak</li>
              </ul>
            </div>
            <div className="bg-[var(--bg-tertiary)] p-6 rounded-lg border border-[var(--border-subtle)]">
              <h3 className="text-[var(--accent-gold)] font-medium mb-3">White Box (1967)</h3>
              <ul className="space-y-1 text-sm">
                <li>• 79 documents</li>
                <li>• Mathematical focus</li>
                <li>• Describes the theory</li>
                <li>• Fourth dimension</li>
                <li>• The infrathin</li>
                <li>• Published near Duchamp&apos;s death</li>
              </ul>
            </div>
          </div>

          <p className="mt-6">
            Duchamp also created the <strong>Boîte-en-valise</strong> (Box in a Suitcase, 1935-1941), a portable museum containing miniature reproductions of his major works. But where the valise reproduces artworks, the Green and White Boxes reproduce <em>process</em>—the thinking behind the work rather than the work itself.
          </p>

          <p>
            For our purposes, The Green Box is essential. Its terminology—delay in glass, timid-power, blossoming, malic molds, illuminating gas, the litanies of the chariot—provides the vocabulary for understanding how Elden Ring encodes The Large Glass. The game doesn&apos;t just reference the image; it implements the system described in Duchamp&apos;s notes.
          </p>
        </div>
      </section>

    </div>
  );
}
