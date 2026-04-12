import { Metadata } from 'next';
import { BookOpen, ExternalLink, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Chess Research - Toutfait.com Articles - Elden Ring Is The Large Glass',
  description: 'Comprehensive collection of scholarly articles about Duchamp\'s involvement with chess from Toutfait: The Marcel Duchamp Studies Online Journal',
};

interface Article {
  title: string;
  author?: string;
  date?: string;
  url: string;
  description: string;
}

const chessArticles: Article[] = [
  {
    title: 'Opposition and Sister Squares: Marcel Duchamp and Samuel Beckett',
    author: 'Andrew Hugill, Bath Spa University, UK',
    date: 'July 1, 2013',
    url: 'https://www.toutfait.com/opposition-and-sister-squares-marcel-duchamp-and-samuel-beckett/',
    description: 'Investigates the artistic and personal connection between Duchamp and Beckett, particularly through their shared passion for chess. Traces their acquaintance in 1930s Paris and argues that Duchamp\'s chess endgame treatise significantly influenced the dramatic structure and symbolism of Beckett\'s play Endgame.',
  },
  {
    title: 'Re-evaluating the Art & Chess of Marcel Duchamp',
    author: 'Ian Randall',
    date: 'December 1, 2007',
    url: 'https://www.toutfait.com/re-evaluating-the-art-chess-of-marcel-duchamp/',
    description: 'Examines the largely overlooked connection between Marcel Duchamp\'s artistic practice and his serious involvement with chess. Challenges the conventional narrative that dismisses Duchamp\'s chess engagement as a peculiar diversion, instead arguing that chess functioned as a coherent intellectual and creative pursuit integral to understanding his broader artistic philosophy.',
  },
  {
    title: 'Wittgenstein Plays Chess with Duchamp or How Not to Do Philosophy: Wittgenstein on Mistakes of Surface and Depth',
    author: 'Steven B. Gerrard',
    date: 'April 1, 2003',
    url: 'https://www.toutfait.com/wittgenstein-plays-chess-with-duchamp-or-how-not-to-do-philosophywittgenstein-on-mistakes-of-surface-and-depth/',
    description: 'Explores how Ludwig Wittgenstein\'s approach to philosophical problems parallels Marcel Duchamp\'s artistic methodology, using chess and visual art as central metaphors. Through analysis of Duchamp\'s Trébuchet, argues that genuine philosophical understanding comes from changing our perspective on familiar phenomena.',
  },
  {
    title: 'The Bachelors: Pawns in Duchamp\'s Great Game',
    author: 'Bradley Bailey',
    date: 'December 1, 2000',
    url: 'https://www.toutfait.com/the-bachelors-pawns-in-duchamps-great-game/',
    description: 'Examines Marcel Duchamp\'s "The Large Glass," proposing that the Nine Malic Molds were inspired by allegorical chess pieces from medieval morality sermons. Explores how the chess moralities of Jacobus de Cessolis, particularly allegorical depictions of pawns representing different professions, may have directly influenced Duchamp\'s conception of the molds.',
  },
  {
    title: 'A Problem With No Solution',
    author: 'Francis M. Naumann',
    date: 'February 1, 2008',
    url: 'https://www.toutfait.com/a-problem-with-no-solution/',
    description: 'Examines Duchamp\'s 1943 design for a gallery exhibition announcement that conceals a chess endgame puzzle. Duchamp hand-drew a cupid aiming an arrow to hint at the solution, which points to an unsolvable position where "White to Play and Win" cannot actually achieve victory. Explores how this deliberately impossible chess problem mirrors Duchamp\'s philosophy.',
  },
];

export default function ChessResearchPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Research Archive</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Chess Research
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Scholarly articles about Duchamp&apos;s chess career and its artistic significance from Toutfait: The Marcel Duchamp Studies Online Journal
          </p>
        </div>
      </section>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-[var(--accent-gold)]" />
            About This Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-[var(--text-secondary)]">
            This page collects scholarly articles from <a
              href="https://www.toutfait.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-gold)] hover:underline inline-flex items-center gap-1"
            >
              Toutfait.com <ExternalLink className="h-3 w-3" />
            </a>,
            the premier online journal for Marcel Duchamp studies. These articles explore Duchamp&apos;s profound
            engagement with chess—not as a hobby or diversion, but as an integral part of his artistic practice.
          </p>
          <p className="text-[var(--text-secondary)]">
            The research represented here reveals chess as central to understanding Duchamp&apos;s conceptual approach
            to art. From his influence on Samuel Beckett (Hugill) to the medieval chess moralities embedded in
            the Large Glass (Bailey), these articles demonstrate that Duchamp&apos;s &quot;abandonment&quot; of art for chess
            was itself an artistic statement.
          </p>
          <p className="text-sm text-[var(--text-tertiary)] italic">
            &quot;I have come to the personal conclusion that while all artists are not chess players, all chess
            players are artists.&quot; — Marcel Duchamp
          </p>
        </CardContent>
      </Card>

      {/* Articles List */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
          {chessArticles.length} Articles on Chess
        </h2>

        <div className="space-y-4">
          {chessArticles.map((article, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-start justify-between gap-4">
                  <span className="flex-1">{article.title}</span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[var(--accent-gold)] opacity-50 group-hover:opacity-100 transition-opacity"
                    aria-label="Open article in new tab"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </CardTitle>
                {(article.author || article.date) && (
                  <div className="text-sm text-[var(--text-tertiary)] space-y-1">
                    {article.author && <p>By {article.author}</p>}
                    {article.date && <p>{article.date}</p>}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--text-secondary)]">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[var(--accent-gold)] hover:underline mt-3"
                >
                  Read article <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Themes */}
      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Chess as Artistic Practice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              Duchamp didn&apos;t abandon art for chess—he pursued art through chess. The game embodied everything
              he valued: pure concept, combinatorial infinity, strategic depth, and beauty in the abstract.
            </p>
            <p>
              His 1932 book on chess endgames, <em>Opposition and Sister Squares Are Reconciled</em>, dealt
              with positions so rare they bordered on the &apos;pataphysical—the science of imaginary solutions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Medieval Chess Symbolism</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              Bailey&apos;s research reveals how medieval chess moralities—allegorical sermons using chess pieces
              to represent social classes—directly influenced the Nine Malic Molds in the Large Glass.
            </p>
            <p>
              The Bachelors function as pawns in Duchamp&apos;s &quot;great game,&quot; their uniforms serving as empty
              vessels just as medieval pawns served as symbolic containers for moral instruction.
            </p>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}
