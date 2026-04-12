import { Metadata } from 'next';
import { CalendarDays, Clock, BookOpen, ExternalLink } from 'lucide-react';
import { HeroMeta } from '@/components/site/hero-meta';

export const metadata: Metadata = {
  title: 'La Chose en Soie - Elden Ring Is The Large Glass',
  description:
    "Analysis of Duchamp's ready-made philosophy: from the Grand Verre to the chance encounter on the dissection table",
};

export default function LaChoseEnSoiePage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
              External Source
            </p>
          </div>
          <h1 className="page-hero-title">La Chose en Soie</h1>
          <p className="page-hero-description mb-4">
            <em>The Thing in Silk</em> — An analysis of Duchamp&apos;s ready-made philosophy,
            tracing the logical development from the <em>Grand Verre</em> to &quot;the chance
            encounter on the dissection table.&quot;
          </p>
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextSectionsEnglish/03_LaChoseEnSoie.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--accent-gold)] hover:underline"
          >
            <ExternalLink className="h-4 w-4" />
            Read original at zazie.at
          </a>
        </div>
        <HeroMeta
          items={[
            { label: 'Source', value: 'Revamp-Duchamp', icon: BookOpen },
            { label: 'Reading Time', value: '15 min', icon: Clock },
          ]}
        />
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2>The Ready-Made Genesis</h2>
        <p>
          Ready-mades emerge logically from the <em>Grand Verre</em>&apos;s principles. As Duchamp
          noted, glass transparency creates depth effects &quot;instead of boring backgrounds found
          in paintings.&quot;
        </p>
        <blockquote>
          <p>
            The ready-made essentially represents{' '}
            <strong>&quot;non-empty parts of glass with the glass removed.&quot;</strong>
          </p>
        </blockquote>

        <h2>Four-Dimensional Vision</h2>
        <p>
          Duchamp conceived objects within temporal perspective—their anticipated uses and
          functional contexts. This &quot;useful perspective&quot; becomes a conceptual trap,
          revealing the arbitrary constraints of utilitarian framing.
        </p>

        <h2>Bicycle Wheel (1913)</h2>
        <p>This inaugural work transcends typical ready-made semantics:</p>
        <blockquote>
          <p>
            It represents{' '}
            <strong>&quot;rationally, deliberately, systematized madness&quot;</strong> and
            constitutes surrealism&apos;s foundational manifesto—fundamentally a{' '}
            <strong>&quot;rebellion against usage.&quot;</strong>
          </p>
        </blockquote>

        <h2>La Rencontre Fortuite</h2>
        <p className="text-[var(--accent-gold)] italic">
          &quot;Beautiful as the chance encounter of a sewing machine and an umbrella on a
          dissection table.&quot; — Lautréamont, <em>Les Chants de Maldoror</em>
        </p>
        <p>
          Duchamp&apos;s collages breach predetermined syntactic conventions—the ready-made is a
          &quot;chance encounter&quot; that violates the grammar of use, placing objects outside
          their functional context to reveal the arbitrary nature of meaning itself.
        </p>

        <h2>Language Reform</h2>
        <p>
          Duchamp pursued grammatical restructuring to capture concrete specificity. He viewed puns
          as &quot;three-dimensional puns&quot; and titled ready-mades to provide &quot;verbal
          coloration.&quot;
        </p>
        <blockquote>
          <p>Words possess material substance like objects themselves.</p>
        </blockquote>

        <h2>Technical Syntax</h2>
        <p>
          Technology unfolds linguistically—components communicate through interface logic analogous
          to grammatical rules. Duchamp&apos;s collages breach these predetermined syntactic
          conventions.
        </p>

        <h2>The Foundational Principle</h2>
        <blockquote className="border-l-4 border-[var(--accent-gold)] bg-[rgb(var(--bg-secondary-rgb)/0.5)] p-4">
          <p className="text-xl">
            <strong>
              &quot;Each image on the glass has a precise function and nothing is added to fill
              empty space or please the eye.&quot;
            </strong>
          </p>
          <footer className="text-sm text-[var(--text-tertiary)] mt-2">
            —{' '}
            <a
              href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_ChaqueImage.htm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-gold)] hover:underline"
            >
              Revamp-Duchamp: Chaque Image
            </a>
          </footer>
        </blockquote>
        <p>
          Every visual element serves a deliberate purpose. There is no decorative excess or
          arbitrary ornamentation. The work follows strict conceptual logic rather than aesthetic
          convention.
        </p>

        <h2>Beyond Technical Determination</h2>
        <p>
          The essay culminates in philosophical meditation on how instrumental thinking corrupts
          human existence, suggesting transcendence through recognition that{' '}
          <strong>&quot;nothing laughs&quot; except humanity</strong>—marking the boundary between
          instrument and being.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Le Grand Verre Brisé</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextSectionsEnglish/05_LeGrandVerreBrise.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp
          </a>
        </p>

        <h3>The Breaking Incident</h3>
        <p>
          Two large glass plates were transported flat in a truck across Connecticut. The driver was
          unaware of their cargo. Over 90 kilometers, the plates were jostled and fractured.
        </p>

        <h3>Duchamp&apos;s Appreciation</h3>
        <blockquote>
          <p>
            <em>&quot;Elles ont une forme, une architecture symétrique.&quot;</em>
            <br />
            <strong>&quot;They possess form and symmetrical architecture.&quot;</strong>
          </p>
        </blockquote>
        <p>
          Duchamp viewed the cracks not as random destruction but as intentional patterns worthy of
          respect. The fractures function as{' '}
          <em>&quot;un réseau de lignes de fuite aléatoires&quot;</em>
          —networks of random flight lines—confirming artistic principles he developed theoretically
          elsewhere.
        </p>

        <h3>Deliberate Accident?</h3>
        <p>
          The text explores whether the breaking was accidental or deliberately orchestrated by
          Duchamp himself—suggesting he might have strategically damaged the work to enhance it. The
          shattering transformed The Large Glass into a more complete work by introducing chance
          elements that aligned with his radical vision.
        </p>

        <h3>L&apos;Oeuvre Inachevée</h3>
        <p>
          This accident validated his concept of generalized, random perspective—distinguishing his
          work from other perspective-explorers like M.C. Escher. Duchamp&apos;s deliberate
          incompleteness and openness to transformation influenced avant-garde movements,
          particularly the Situationist International, demonstrating that{' '}
          <strong>
            &quot;l&apos;oeuvre inachevée&quot; (the unfinished work) possesses a quality
            transcending completed products
          </strong>
          .
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Le Fil du Temps</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextSectionsEnglish/01_LeFilDuTemps.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — The Thread of Time
          </a>
        </p>

        <p>
          This essay examines Duchamp&apos;s revolutionary approach to representing temporal
          movement through painting, contrasting it with classical perspective and Cubism.
        </p>

        <h3>Critique of Perspective Systems</h3>
        <p>
          <strong>Classical Perspective:</strong> While appearing to grant the viewer freedom of
          movement, it actually constrains the mind to predetermined focal points established by the
          artist. The viewer&apos;s gaze, though seemingly liberated, must ultimately converge on
          the author&apos;s chosen vanishing point.
        </p>
        <p>
          <strong>Cubism:</strong> Represents a perspective centered on the object rather than
          space. It organizes multiple aspects of an object into unified synthesis, but restricts
          mental movement to circling around the thing itself—a{' '}
          <strong>&quot;non-movement,&quot;</strong> as Duchamp stated.
        </p>

        <h3>Duchamp&apos;s Innovation</h3>
        <p>
          Duchamp pursued <strong>&quot;a static representation of movement&quot;</strong> that
          escaped both systems. His <em>Nude Descending a Staircase, No. 2</em> exemplified this:
          the Cubist establishment rejected it precisely because nudes should remain static—the
          painting violated their theoretical boundaries by depicting actual temporal motion.
        </p>

        <h3>Key Philosophical Insight</h3>
        <p>
          Rather than capturing time frontally (classical) or absorbing perception into objects
          (Cubist), Duchamp&apos;s work allows{' '}
          <strong>time to traverse the canvas without trapping it</strong>. The painting becomes
          reflexive—the subject contemplates its own movement rather than representing external
          reality.
        </p>

        <h3>Final Vision</h3>
        <blockquote>
          <p>
            Simply <strong>&quot;a man who walks&quot;</strong>—an acknowledgment of life&apos;s
            improbable, miraculous capacity for genuine movement.
          </p>
        </blockquote>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>La Fissure de l&apos;Instant</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextSectionsEnglish/02_LaFissureDeL'Instant.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — The Crack of the Instant
          </a>
        </p>

        <p>
          This philosophical essay examines Duchamp&apos;s 1912 investigation into what transpires
          between successive chronophotographic images—essentially, what occurs between zero and one
          mathematically.
        </p>

        <h3>Mathematical Foundation</h3>
        <blockquote>
          <p>
            <em>
              &quot;Entre zéro et un une infinité non dénombrable d&apos;histoires racontables&quot;
            </em>
            <br />
            <strong>
              &quot;Between zero and one exists an uncountable infinity of narratives.&quot;
            </strong>
          </p>
        </blockquote>
        <p>
          This mirrors the mathematical principle that real numbers lack unique successors like
          integers do. The fissure—the crack—is infinitely deep.
        </p>

        <h3>Duchamp&apos;s 1912 Visual Series</h3>
        <ul>
          <li>
            <em>Le Roi et la Reine entourés de nus vites</em> — introduces temporal depth
          </li>
          <li>
            <em>Le Roi et la Reine traversés par des nus vites</em> — shows continuity of movement
          </li>
          <li>
            <em>Le Roi et la Reine traversés par des nus en vitesse</em> — reveals temporal
            architecture through random interaction
          </li>
        </ul>

        <h3>The Virgin-to-Bride Transformation</h3>
        <p>
          Duchamp explores this transition (potential to actual) through <em>Vierge n°1</em>,{' '}
          <em>Vierge n°2</em>, and <em>Mariée</em> (1912), culminating in{' '}
          <em>La Mariée mise à nu par les célibataires</em>. The transformation is{' '}
          <strong>irreversible</strong>, distinguishing virtual from actual states.
        </p>

        <h3>Inverted Perspective</h3>
        <p>
          Duchamp inverts classical perspective by positioning{' '}
          <strong>
            the moment of decision (effectivity) as focal point rather than background
          </strong>
          , emphasizing possibility over determinism.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Le Faucon et le Vrai</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/T_LeFauconEtLeVrai1.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — The Falcon and the True
          </a>
        </p>

        <p>
          In 1968, Duchamp created a sketch reworking Courbet&apos;s <em>Femme aux bas blancs</em>,
          incorporating an unexpected addition: a bird.
        </p>

        <h3>The Pun</h3>
        <blockquote>
          <p>
            &quot;This bird is bizarre indeed. And it is a hawk, too, which allows a play on words;
            this way, it is possible to see <strong>the true and the false</strong>.&quot;
          </p>
        </blockquote>
        <p>
          <strong>Le faucon</strong> (the falcon/hawk) puns with <strong>le faux</strong> (the
          false). Thus &quot;Le Faucon et le Vrai&quot; plays on &quot;Le Faux et le Vrai&quot; (The
          False and the True).
        </p>

        <h3>Multi-Layered Operation</h3>
        <ul>
          <li>
            <strong>Visual:</strong> The hawk introduces an anachronistic, surrealist element into a
            realist work
          </li>
          <li>
            <strong>Linguistic:</strong> The pun creates a third meaning between image and title
          </li>
          <li>
            <strong>Epistemological:</strong> The work explores how artworks construct meaning
            through mixture, appropriation, and conceptual contradiction
          </li>
        </ul>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Et Bien Que Dieu Soit Mort</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_EtBienQueDieu.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — And Although God Is Dead
          </a>
        </p>

        <p>A philosophical text exploring post-theological existence:</p>
        <blockquote>
          <p>
            Despite &quot;God&apos;s death,&quot; humanity remains objectified. Rather than
            liberation, this condition leaves us{' '}
            <strong>&quot;all things&quot; to one another</strong>—transformed into objects
            ourselves.
          </p>
        </blockquote>
        <p>
          Objectivity has become a purported virtue in this godless framework. Human passions
          persist, but desires have been &quot;breathed away&quot; by this objectification. We are
          <strong>
            {' '}
            &quot;weighted down&quot; with &quot;sadistic and masochistic&quot; apparatus
          </strong>
          —technological and structural constraints. Modern existence obscures whether anything
          &quot;animal&quot; remains beneath this reification.
        </p>
        <p>
          The text describes our condition with <strong>&quot;comic evidence&quot;</strong>—we are
          &quot;blinded&quot; by the &quot;mortal gravity&quot; of our own transformation into
          things.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>L&apos;Approche de Duchamp</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_LApprocheDeDuchamp.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — Duchamp&apos;s Approach
          </a>
        </p>

        <blockquote>
          <p>
            <em>&quot;L&apos;approche de Duchamp est d&apos;abord visuelle.&quot;</em>
            <br />
            <strong>&quot;Duchamp&apos;s approach is fundamentally visual.&quot;</strong>
          </p>
        </blockquote>
        <p>
          He <strong>&quot;voit immédiatement les mots sous leur aspect physique&quot;</strong>
          —perceives words immediately through their physical appearance. Language is not abstract
          symbol but material form. Words have bodies.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Time Just Passes</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/T_TimeJustPasses.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp
          </a>
        </p>

        <p>A key distinction between classical perspective and Duchamp&apos;s cinetic approach:</p>
        <blockquote>
          <p>
            In classical perspective, time is <strong>&quot;taken frontally&quot;</strong>
            —confronted directly, trapped within the frame. Duchamp&apos;s cinetics treats time
            differently: it <strong>crosses the canvas</strong> as a dynamic force.
          </p>
        </blockquote>
        <p>
          This liberates time from constraint. Rather than imprisoning temporal experience within
          static representation, the work allows it to flow through—referencing{' '}
          <em>Bicycle Wheel</em>
          and <em>Nude Descending a Staircase</em> as exemplars.
        </p>
        <blockquote className="border-l-4 border-[var(--accent-gold)] bg-[rgb(var(--bg-secondary-rgb)/0.5)] p-4">
          <p className="text-xl">
            <strong>&quot;Time is no trap anymore, it just passes.&quot;</strong>
          </p>
        </blockquote>
        <p>
          The essential insight: temporal freedom emerges through rejecting time as constraint,
          embracing instead its continuous, liberating passage through artistic space.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Duchamp Se Laisse Porter</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_DuchampSeLaissePorter.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — Duchamp Lets Himself Be Carried
          </a>
        </p>

        <p>
          Duchamp&apos;s artistic approach is fundamentally driven by logical and operational
          principles:
        </p>
        <blockquote>
          <p>
            Duchamp{' '}
            <strong>
              &quot;lets himself be carried by logic, by the operational, by the logic of{' '}
              <em>doing</em>&quot;
            </strong>{' '}
            in a way that{' '}
            <strong>
              &quot;transgresses without concern the agreed-upon dualities of abstract and
              concrete.&quot;
            </strong>
          </p>
        </blockquote>
        <p>
          His practice dissolves the traditional boundary between abstract conceptualization and
          concrete materiality—two categories typically treated as opposed in art discourse.
          Duchamp&apos;s method transcends established artistic conventions by prioritizing the{' '}
          <em>process</em> of making over predetermined categorical distinctions.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>La Roue de Duchamp</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_LaRoueDeDuchamp.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — Duchamp&apos;s Wheel
          </a>
        </p>

        <p>
          The <em>Bicycle Wheel</em> is characterized as intentionally irrational:
        </p>
        <blockquote className="border-l-4 border-[var(--accent-gold)] bg-[rgb(var(--bg-secondary-rgb)/0.5)] p-4">
          <p className="text-xl">
            <strong>&quot;Rationally, deliberately, systematically mad.&quot;</strong>
          </p>
        </blockquote>
        <p>
          This paradox—where madness itself becomes a deliberate artistic choice—elevates the work
          beyond a simple object to a conceptual threshold. The text asserts that this piece
          functions as
          <strong>
            {' '}
            &quot;the birth certificate of surrealism, its most rigorous and exemplary
            manifesto.&quot;
          </strong>
        </p>
        <p>
          By making &quot;madness&quot; systematic and rational, Duchamp questions what
          distinguishes sense from nonsense in art itself.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Mon But Était</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_MonButEtait.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — My Goal Was (from Duchamp-Sweeney interview)
          </a>
        </p>

        <blockquote className="border-l-4 border-[var(--accent-gold)] bg-[rgb(var(--bg-secondary-rgb)/0.5)] p-4">
          <p className="text-xl">
            <strong>
              &quot;My goal was a static representation of movement... Without any attempt to render
              cinematographic effects through painting.&quot;
            </strong>
          </p>
          <footer className="text-sm text-[var(--text-tertiary)] mt-2">
            — Duchamp, in conversation with Sweeney
          </footer>
        </blockquote>
        <p>
          This philosophy distinguishes Duchamp from Futurism and other movements attempting to
          visualize velocity through visual dynamism. Instead, it suggests conceptual or structural
          means of representing temporality—movement as intellectual rather than purely visual
          phenomenon.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>The Waterfall</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/T_TheWaterFall.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp
          </a>
        </p>

        <p>The waterfall serves as a multilayered metaphor central to Duchamp&apos;s philosophy:</p>
        <blockquote>
          <p>
            &quot;The waterfall is also a metaphor of time as it passes, and since time has been at
            the first rank of Duchamp&apos;s fundamental preoccupations.&quot;
          </p>
        </blockquote>
        <blockquote className="border-l-4 border-[var(--accent-gold)] bg-[rgb(var(--bg-secondary-rgb)/0.5)] p-4">
          <p className="text-xl">
            <strong>&quot;The waterfall is an image of what moves the world.&quot;</strong>
          </p>
        </blockquote>
        <p>
          Time was a primary concern throughout Duchamp&apos;s entire artistic career. The waterfall
          becomes symbolic of the fundamental force that animates existence—time as the essential
          principle underlying all transformation and worldly change.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Il Est Assez Facile</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_IlEstAssezFacile.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — It Is Easy Enough
          </a>
        </p>

        <blockquote className="border-l-4 border-[var(--accent-gold)] bg-[rgb(var(--bg-secondary-rgb)/0.5)] p-4">
          <p className="text-xl">
            <em>
              &quot;Ce qui sépare la Vierge de la Mariée est exactement de même nature que ce qui
              sépare le virtuel et l&apos;actuel.&quot;
            </em>
          </p>
          <p className="text-xl mt-2">
            <strong>
              &quot;What separates the Virgin from the Bride is exactly of the same nature as what
              separates the virtual from the actual.&quot;
            </strong>
          </p>
        </blockquote>
        <p>
          This establishes parallel relationships between two conceptual pairs: Virgin/Bride and
          Virtual/Actual. The oppositions share fundamental characteristics—a deeper metaphysical
          correspondence between states of being, potentiality, and actualization.
        </p>
        <p>
          The transformation from virgin to bride mirrors the ontological gap between potential and
          realized conditions—what might be versus what is.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Le Centre Est l&apos;Objet</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_LeCentreEstLObjet.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — The Center Is the Object
          </a>
        </p>

        <p>
          A definition of Cubism as{' '}
          <strong>&quot;a perspective whose center is the object&quot;</strong>—organizing the
          subject itself rather than surrounding space.
        </p>
        <blockquote>
          <p>
            Cubism proposes representing &quot;the diverse aspects of an object in a synthesis that
            integrates and unifies them.&quot; However, this unified vision permits only one mental
            operation: <strong>circling around objects conceptually</strong>.
          </p>
        </blockquote>
        <p>
          The text asserts that cubism proved <strong>&quot;effectively prophetic&quot;</strong>—its
          approach anticipating future developments in art and thought. Cubism functions less as a
          technical style and more as an epistemological framework: a specific way of knowing and
          representing reality by privileging the object as the organizing principle for perception.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>La Nature N&apos;Est Pas</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_LaNatureNEstPas.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — Nature Is Not
          </a>
        </p>

        <blockquote className="border-l-4 border-[var(--accent-gold)] bg-[rgb(var(--bg-secondary-rgb)/0.5)] p-4">
          <p className="text-xl">
            <em>
              &quot;La nature n&apos;est pas là pour faire quelque chose, elle n&apos;est pas là
              dans un but, elle n&apos;a pas de propos, pas de sens.&quot;
            </em>
          </p>
          <p className="text-xl mt-2">
            <strong>
              &quot;Nature is not there to do something, it is not there for a purpose, it has no
              intent, no meaning.&quot;
            </strong>
          </p>
        </blockquote>
        <p>
          Nature exists without utility or technical intent. This philosophical position rejects
          instrumental rationality—nature simply <em>is</em>, operating independently of human
          meaning-making or functional value systems.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>D&apos;Ailleurs</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_DAilleurs.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — Besides
          </a>
        </p>

        <blockquote className="border-l-4 border-[var(--accent-gold)] bg-[rgb(var(--bg-secondary-rgb)/0.5)] p-4">
          <p className="text-xl">
            <em>&quot;D&apos;ailleurs, c&apos;est toujours les autres qui meurent.&quot;</em>
          </p>
          <p className="text-xl mt-2">
            <strong>&quot;Besides, it&apos;s always the others who die.&quot;</strong>
          </p>
        </blockquote>
        <p>
          A darkly philosophical observation about mortality and distance—the psychological tendency
          to view death as something that happens to others. Themes of mortality denial, detachment
          from suffering, and existential perspective.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>La Mariée à Sa Base</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/TF_LaMarieeASaBase.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp — The Bride at Her Base Is an Engine
          </a>
        </p>

        <blockquote>
          <p>
            The Bride as fundamental engine—not merely a mechanical transmitter of power, but the
            embodiment of power itself: <em>&quot;cette puissance timide même&quot;</em>(
            <strong>&quot;this timid power itself&quot;</strong>).
          </p>
        </blockquote>
        <p>
          She is characterized as an <strong>&quot;essence d&apos;amour&quot;</strong> (essence of
          love) distributed throughout weak cylinders—love as the animating force of existence. The
          Bride represents both generative power and its shy manifestation, reconciling apparent
          contradictions between strength and timidity, mechanism and sensuality.
        </p>
        <p>
          The passage culminates in describing her as a virgin reaching the culmination of desire,
          her power serving the <em>&quot;épanouissement&quot;</em> (blossoming) of her constant
          vital spark. True power lies not in transmission but in being—the Bride <em>is</em> the
          power before it becomes functional.
        </p>

        <hr className="my-8 border-[var(--border-subtle)]" />

        <h2>Decide to Consider</h2>
        <p className="text-sm text-[var(--text-tertiary)] italic mb-4">
          <a
            href="http://www.zazie.at/Revamp-Duchamp/T_TextFragments/T_DecideToConsider.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-gold)] hover:underline"
          >
            Source: Revamp-Duchamp
          </a>
        </p>

        <blockquote>
          <p>
            &quot;It is easy to see how well this idea fits with the Ready-Made concept, which is
            also—literally—
            <strong>nothing else than a decision</strong>.&quot;
          </p>
        </blockquote>
        <p>
          Duchamp&apos;s Ready-Mades operate through curatorial choice—the artist&apos;s selection
          and presentation of found objects as art, rather than through manual craftsmanship or
          aesthetic transformation.
        </p>
        <p>
          Decision-making becomes the essential creative mechanism. Rather than making objects, the
          artist makes <em>choices</em> about what constitutes art—a paradigm shift from
          production-based to concept-based creation.
        </p>
      </section>
    </div>
  );
}
