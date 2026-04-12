import { Metadata } from 'next';
import { CalendarDays, Clock, Crown, Sparkles, Target, Brain } from 'lucide-react';
import { HeroMeta } from '@/components/site/hero-meta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Duchamp and Chess - Elden Ring Is The Large Glass',
  description:
    "How Duchamp's obsession with chess illuminates his artistic practice and connects to Elden Ring's game design",
};

export default function ChessPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
              Strategic Dimension
            </p>
          </div>
          <h1 className="page-hero-title">Duchamp and Chess</h1>
          <p className="page-hero-description">
            Duchamp famously abandoned art for chess in the 1920s. But was chess itself a
            continuation of his artistic practice by other means?
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Chess Career', value: '1918-1968', icon: CalendarDays },
            { label: 'Reading Time', value: '8 min', icon: Clock },
            { label: 'Significance', value: 'Art as Game', icon: Target },
          ]}
        />
      </section>

      {/* Key Concepts Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <Crown className="h-6 w-6 text-[var(--accent-gold)] mb-2" />
            <CardTitle className="text-base">Professional Player</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Duchamp competed at the national level for France and represented his country in Chess
              Olympiads.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <Brain className="h-6 w-6 text-[var(--accent-blue)] mb-2" />
            <CardTitle className="text-base">Strategic Thinking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              His approach to chess revealed the same combinatorial, &apos;pataphysical thinking as
              his art.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30">
          <CardHeader>
            <Sparkles className="h-6 w-6 text-[var(--accent-purple)] mb-2" />
            <CardTitle className="text-base">Art as Game</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Chess wasn&apos;t a departure from art - it was art pursued through another medium.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2>The Chess Years</h2>
        <p>
          Around 1918, Marcel Duchamp appeared to abandon visual art entirely in favor of chess. He
          played obsessively, studied endgame theory, competed in tournaments, and eventually
          represented France in the Chess Olympiad. His first wife allegedly glued his chess pieces
          to the board in frustration at his neglect of her.
        </p>
        <p>
          This apparent abandonment puzzled the art world. Why would one of the most innovative
          artists of the century give it all up for a board game?
        </p>

        <h3>Chess as Art</h3>
        <p>
          Duchamp himself explained: &quot;I have come to the personal conclusion that while all
          artists are not chess players, all chess players are artists.&quot; For him, chess was not
          a departure from art but a continuation of it - perhaps even its purest form.
        </p>
        <p>Chess embodied everything Duchamp valued in art:</p>
        <ul>
          <li>
            <strong>Pure concept:</strong> No material object, only moves and positions
          </li>
          <li>
            <strong>Combinatorial infinity:</strong> More possible games than atoms in the universe
          </li>
          <li>
            <strong>Strategic depth:</strong> Layers of meaning in every position
          </li>
          <li>
            <strong>Competition as collaboration:</strong> Two minds creating a unique game together
          </li>
          <li>
            <strong>Beauty in the abstract:</strong> Elegant solutions, surprising combinations
          </li>
        </ul>

        <h2>The Endgame Book</h2>
        <p>
          In 1932, Duchamp co-authored <em>Opposition and Sister Squares Are Reconciled</em> with
          Vitaly Halberstadt. This chess endgame study dealt with a highly theoretical situation
          that might occur only once in thousands of games. It was, in essence, a &apos;pataphysical
          chess book - studying exceptions so rare they bordered on the imaginary.
        </p>
        <p>
          The title itself is revealing: &quot;Opposition and Sister Squares Are Reconciled&quot;
          sounds more like a Duchamp artwork title than a chess manual. The book&apos;s cover was
          designed by Duchamp and is now considered a work of art in itself.
        </p>

        <h2>The Secret Work</h2>
        <p>
          What the art world didn&apos;t know was that Duchamp had been secretly working on
          <em>Étant donnés</em> since 1946 - a major installation that wouldn&apos;t be revealed
          until after his death in 1968. His &quot;abandonment&quot; of art was itself a deception.
        </p>
        <p>
          This reveals a crucial pattern: Duchamp was always working, but often on projects
          invisible to the public. His public persona as a &quot;retired artist&quot; was itself an
          artistic construction.
        </p>

        <h2>Duchamp and Beckett: Opposition and Sister Squares</h2>
        <p>
          Andrew Hugill&apos;s research reveals a profound connection between Duchamp and Samuel
          Beckett, centered on chess and its implications for both artists&apos; work.
        </p>

        <h3>Paris and Arcachon</h3>
        <p>
          Beckett encountered Duchamp in 1930s Paris through Mary Reynolds&apos; salon at 14 rue
          Hallé in Montparnasse. When Paris fell to Nazi occupation in 1940, both men fled to the
          coastal town of Arcachon, where they played chess regularly in seaside cafés. Beckett
          recalled with satisfaction competing against Duchamp, noting the master was &quot;always
          too good for him&quot; but appreciating the opportunity to play against such caliber.
        </p>

        <h3>&quot;All Chess Players Are Artists&quot;</h3>
        <p>
          Duchamp believed &quot;the chess pieces are the block alphabet which shapes thoughts&quot;
          and concluded that while not all artists play chess,{' '}
          <strong>&quot;all chess players are artists.&quot;</strong>
          For both Duchamp and Beckett, chess represented pure logic divorced from decorative
          excess— a framework for understanding human limitation and inevitable decline.
        </p>

        <h3>The Endgame Book&apos;s Design</h3>
        <p>
          Duchamp&apos;s 1932 book{' '}
          <em>L&apos;opposition et les cases conjuguées sont réconciliées</em>
          employed unconventional design elements:{' '}
          <strong>transparent pages that folded to show corresponding positions</strong>—directly
          echoing the Large Glass divided into two panels. The book explored positions of extreme
          rarity and theoretical purity, examining how kings navigate restricted squares through
          precise geometric principles.
        </p>

        <h3>Influence on Beckett&apos;s Work</h3>
        <p>Hugill traces Duchamp&apos;s influence through several Beckett works:</p>
        <ul>
          <li>
            <strong>Murphy (1938):</strong> Features a chess game where Mr. Endon mechanically
            repositions pieces while ignoring Murphy&apos;s moves—embodying Duchampian aesthetic
            indifference. Murphy&apos;s death involves a radiator contraption connected through
            glass tubing from a toilet below—mirroring Duchamp&apos;s obsession with linking water
            and gas imagery.
          </li>
          <li>
            <strong>Eleuthéria (1947):</strong> A character named Victor (Duchamp&apos;s nickname
            among friends) appears as a chess-playing protagonist who maintains mysterious absence
            while dominating others&apos; attention—paralleling how Duchamp managed artistic
            influence while avoiding artistic production.
          </li>
          <li>
            <strong>Endgame (1957):</strong> Hugill argues this play derives structural and thematic
            elements directly from Duchamp&apos;s endgame position. Hamm (black) and Clov (white)
            enact the principles from <em>Opposition and Sister Squares</em>. The play&apos;s
            geometric staging, with two windows representing &quot;poles,&quot; mirrors the chess
            position&apos;s spatial logic.
          </li>
        </ul>

        <h3>Duchamp&apos;s Validation</h3>
        <p>
          Duchamp himself validated the connection. On January 10, 1958, he attended{' '}
          <em>Endgame</em>
          in New York and wrote to Henry McBride:{' '}
          <strong>&quot;We saw, and loved, Endgame of Beckett.&quot;</strong>
        </p>

        <h3>Shared Philosophy</h3>
        <p>
          Both artists pursued <strong>aesthetic indifference as liberation</strong>—Duchamp from
          taste and artistic choice, Beckett from hope and resolution. For both, the chess endgame
          represented life&apos;s essential condition: few pieces remaining, rules governing every
          move, inevitable conclusion approaching.
        </p>

        <h2>The Bachelors: Pawns in Duchamp&apos;s Great Game</h2>
        <p>
          Bradley Bailey&apos;s research reveals a profound connection between the Nine Malic Molds
          and medieval chess symbolism—specifically, the allegorical pawns from chess moralities.
        </p>

        <h3>Chess as &quot;Mechanistic Sculpture&quot;</h3>
        <p>
          Duchamp described chess as <strong>&quot;a mechanistic sculpture&quot;</strong>
          —emphasizing how the game, like the Large Glass, operates through mental visualization
          rather than physical movement. &quot;The plasticity of the chess game&quot; fascinated
          him: invisible positions, potential moves, strategic possibilities existing purely in
          thought.
        </p>

        <h3>The Medieval Chess Moralities</h3>
        <p>
          Dominican monk Jacobus de Cessolis (c. 1275-1300) wrote <em>Liber de moribus Hominum</em>,
          using chessmen to teach moral and social lessons. His pawns represented eight vocations:
          <strong>
            laborers, smiths, weavers, merchants, physicians, innkeepers, city guards, and gamblers
          </strong>
          .
        </p>
        <p>
          These pawns operated as &quot;vehicles for narrative&quot; rather than individual
          characters, with strict iconographic guidelines determining their depiction. Placement on
          the board reflected occupational hierarchy—smiths positioned before knights because they
          crafted bridles and spurs.
        </p>

        <h3>The Nine Malic Molds Connection</h3>
        <p>Bailey proposes the Nine Malic Molds derive from this tradition. The connections:</p>
        <ul>
          <li>Both systems use male figures representing professions/social classes</li>
          <li>
            Both emphasize <strong>clothing/external attributes over individual identity</strong>
          </li>
          <li>
            The absence of visible uniform interiors (&quot;you can&apos;t see the actual
            form&quot;) mirrors how medieval pawns served as symbolic containers
          </li>
          <li>
            Like pawns removed during chess play, the molds suggest mortality and the leveling of
            class distinctions
          </li>
        </ul>

        <h3>Historical Sources</h3>
        <p>Bailey identifies probable sources for Duchamp&apos;s knowledge:</p>
        <ul>
          <li>
            Harold James Ruthven Murray&apos;s <em>A History of Chess</em> (1913)—published the same
            year Duchamp designed the Cemetery of Uniforms and Liveries
          </li>
          <li>
            Henry René d&apos;Allemagne&apos;s <em>Récréations et Passe-Temps</em> (1905)
          </li>
          <li>
            William Caxton&apos;s 1883 reprint of <em>Game and Playe of the Chesse</em> (originally
            1475)
          </li>
        </ul>

        <h3>The Body as Empty Vessel</h3>
        <p>
          Bailey traces the molds&apos; development from Duchamp&apos;s 1904-05 sketches through
          preparatory drawings (1911-1914). Earlier works like <em>Dimanche</em> (1909) explore the
          body as &quot;empty vessel&quot; or container—prefiguring the molds&apos; function as
          uniform repositories. The Bachelors are not individuals but{' '}
          <strong>costumes awaiting occupation</strong>.
        </p>

        <h2>Connection to Elden Ring</h2>
        <p>Duchamp&apos;s chess career is directly relevant to understanding Elden Ring:</p>
        <ul>
          <li>
            <strong>Game as Art:</strong> If Duchamp saw chess as art, then video games can be art.
            The medium doesn&apos;t matter - the ideas do.
          </li>
          <li>
            <strong>Strategic Depth:</strong> Elden Ring, like chess, rewards deep strategic
            thinking and pattern recognition
          </li>
          <li>
            <strong>Hidden Layers:</strong> Just as Duchamp&apos;s chess disguised ongoing artistic
            work, Elden Ring&apos;s gameplay disguises its artistic substance
          </li>
          <li>
            <strong>The Player as Artist:</strong> Chess requires two players to create a game;
            Elden Ring requires the player to complete the artwork
          </li>
        </ul>

        <h2>Games Within Games</h2>
        <p>
          Duchamp once said: &quot;I am still a victim of chess. It has all the beauty of art - and
          much more. It cannot be commercialized.&quot; This statement reveals his understanding of
          games as potentially purer artistic experiences than traditional art.
        </p>
        <p>
          Video games, like chess, require active participation. They cannot be passively consumed.
          The player must engage, strategize, fail, and learn. This participatory dimension was
          exactly what Duchamp valued in art.
        </p>

        <h2>&quot;A Problem With No Solution&quot;</h2>
        <p>
          Francis M. Naumann&apos;s research reveals how Duchamp embedded an unsolvable chess
          problem within a 1943 gallery announcement for &quot;Through the Big End of the Opera
          Glass&quot; at Julien Levy Gallery.
        </p>

        <h3>The Hidden Challenge</h3>
        <p>
          Duchamp hand-drew a cupid figure on the announcement&apos;s back cover, positioned
          upside-down with an arrow aimed toward a specific direction. Beneath the image, barely
          visible text read:
          <strong>&quot;White to Play and Win&quot;</strong> with a faintly printed chessboard
          beneath.
        </p>
        <p>
          Following Duchamp&apos;s instruction to &quot;Look through from other side against
          light,&quot; viewers could see the chess position clearly when held up to light. The
          cupid&apos;s arrow pointed toward the recommended pawn advance.
        </p>

        <h3>The Impossible Solution</h3>
        <p>
          Despite appearing solvable, the endgame problem yields{' '}
          <strong>no winning solution for White</strong>. Grand masters, prison inmates, and
          computer programs all failed to discover a winning path. Every variation analyzed leads to
          draws or stalemates.
        </p>

        <h3>&quot;There Is No Solution, Because There Is No Problem&quot;</h3>
        <p>
          Naumann connects the unsolvable problem to Duchamp&apos;s famous aphorism. He links this
          to Duchamp&apos;s unrequited feelings for Brazilian sculptor Maria Martins—suggesting the
          artwork demonstrates that certain human and artistic challenges resist resolution
          entirely.
        </p>
        <p>
          The chess problem becomes a &apos;pataphysical object: a puzzle that presents itself as
          solvable while being fundamentally impossible, an imaginary solution to an imaginary
          problem.
        </p>
      </section>
    </div>
  );
}
