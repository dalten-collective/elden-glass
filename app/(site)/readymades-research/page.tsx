import { Metadata } from 'next';
import { BookOpen, ExternalLink, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Readymades Research - Toutfait.com Articles - Elden Ring Is The Large Glass',
  description: 'Comprehensive collection of scholarly articles about Duchamp\'s readymades from Toutfait: The Marcel Duchamp Studies Online Journal',
};

interface Article {
  title: string;
  author?: string;
  date?: string;
  url: string;
  description: string;
}

const readymadesArticles: Article[] = [
  {
    title: 'On Readymades by/of Marcel Duchamp',
    author: 'Evan Bender',
    date: 'December 1, 2007',
    url: 'https://www.toutfait.com/on-readymades-byof-marcel-duchamp/',
    description: 'Responds to Rhonda Shearer\'s investigative work questioning whether Duchamp\'s readymades were actually unmodified commercial objects. Argues that Duchamp\'s documented habit of modifying objects and providing misleading information created intentional layers of confusion.',
  },
  {
    title: '(Ab)Using Marcel Duchamp: The Concept of the Readymade in Post-War and Contemporary American Art',
    author: 'Thomas Girst',
    date: 'April 1, 2003',
    url: 'https://www.toutfait.com/abusing-marcel-duchamp-the-concept-of-the-readymade-in-post-war-and-contemporary-american-art/',
    description: 'Examines how Duchamp\'s readymade concept was interpreted and misused by post-war and contemporary American artists. Argues that while Duchamp intended readymades as a limited, personal experiment, subsequent generations adopted them as justification for "anything goes" approaches.',
  },
  {
    title: 'Von Readymades und "Asstricks"',
    author: 'Thomas Girst',
    date: 'April 1, 2003',
    url: 'https://www.toutfait.com/von-readymades-und-asstricks/',
    description: 'German-language article exploring readymades and Duchamp\'s artistic strategies.',
  },
  {
    title: 'The Unfindable Readymade',
    author: 'Hector Obalk',
    date: 'May 1, 2000',
    url: 'https://www.toutfait.com/the-unfindable-readymade/',
    description: 'Argues that Duchamp\'s readymades are not artworks themselves, but rather conceptual speculation about art. Contends that readymades operate as philosophical thought experiments exploring identity and difference in mass-produced objects.',
  },
  {
    title: 'Unmaking the Museum: Marcel Duchamp\'s Readymades in Context',
    author: 'Kristina Seekamp',
    date: 'December 1, 2005',
    url: 'https://www.toutfait.com/unmaking-the-museum-marcel-duchamps-readymades-in-context/',
    description: 'Online exhibition of Marcel Duchamp\'s Readymades emphasizing "the physical impact of the Readymades" and examining how they functioned within actual museum spaces. Argues that understanding requires considering them as tangible objects positioned to intervene in and challenge traditional art museum context.',
  },
  {
    title: 'Marcel Duchamp: A Readymade Case for Collecting Objects of Our Cultural Heritage along with Works of Art',
    author: 'Rhonda Roland Shearer',
    date: 'December 1, 2000',
    url: 'https://www.toutfait.com/marcel-duchamp-a-readymade-case-for-collecting-objects-of-our-cultural-heritage-along-with-works-of-art/',
    description: 'Examines how collecting historical everyday objects alongside artworks provides crucial context for understanding Duchamp\'s practice. Through detailed analysis, demonstrates that many alleged mass-produced, store-bought objects cannot be located in historical records, suggesting substantial artistic intervention.',
  },
  {
    title: 'Why the Hatrack is and/or is not Readymade: With Interactive Software, Animations, and Videos',
    author: 'Rhonda Roland Shearer (with Gregory Alvarez, Robert Slawinski, Vittorio Marchi, and Stephen Jay Gould)',
    date: 'December 1, 2000',
    url: 'https://www.toutfait.com/why-the-hatrack-is-andor-is-not-readymade-with-interactive-software-animations-and-videos-for-readers-to-explore/',
    description: 'Extensive multimedia essay challenging the conventional understanding of readymades as simple, unaltered mass-produced objects. Through detailed geometric analysis and 3D modeling, demonstrates that Duchamp employed a revolutionary "rehabilitated perspective" technique combining multiple photographic viewpoints.',
  },
  {
    title: 'Photographic Masquerades: The Readymade Femininity of Greta Garbo and Marcel Duchamp',
    author: 'Miriam Jordan-Haladyn and Julian Jason Haladyn',
    date: 'May 8, 2019',
    url: 'https://www.toutfait.com/photographic-masquerades-the-readymade-femininity-of-greta-garbo-and-marcel-duchamp/',
    description: 'Examines Greta Garbo as Mata Hari and Duchamp as Rrose Sélavy to analyze how femininity functions as a cultural readymade. Argues that gender operates as a performative masquerade constructed through photographic conventions rather than as authentic biological reality.',
  },
  {
    title: 'Straight Forks and Pneumatic Tires: Historicizing Duchamp\'s Bicycle Wheel of (1913)',
    author: 'John S. Allen',
    date: 'April 1, 2003',
    url: 'https://www.toutfait.com/straight-forks-and-pneumatic-tireshistoricizing-duchamps-bicycle-wheel-of-1913/',
    description: 'Provides technical corrections to historical claims about bicycle design in relation to Duchamp\'s famous readymade sculpture. Explores mechanical differences between fork designs and tire technologies.',
  },
  {
    title: 'What Makes the Bicycle Wheel a Readymade?',
    author: 'Yassine Ghalem',
    date: 'May 1, 2000',
    url: 'https://www.toutfait.com/what-makes-the-bicycle-wheel-a-readymade/',
    description: 'Questions whether Duchamp\'s Bicycle Wheel truly qualifies as a readymade. Recalls Duchamp explaining he created the work by mounting a wheel on a stool to simulate movement and warmth of a fire, questioning how this differs from artistic assemblage.',
  },
  {
    title: 'Between Gadget and Re-made: The Revolving History of the Bicycle Wheel',
    author: 'Lars Blunck (translated by Jan Wagner)',
    date: 'December 1, 2000',
    url: 'https://www.toutfait.com/between-gadget-and-re-made-the-revolving-history-of-the-bicycle-wheel/',
    description: 'Explores how Duchamp\'s Bicycle Wheel transformed from a personal studio object into a museum artifact. Analyzes the tension between the artwork\'s intended interactive nature and museums\' protective display practices.',
  },
  {
    title: 'Duchamp\'s Gendered Plumbing: A Family Business?',
    author: 'Jack Spector',
    date: 'December 1, 2005',
    url: 'https://www.toutfait.com/duchamps-gendered-plumbing-a-family-business/',
    description: 'Examines Fountain (1917) as a work that deliberately plays with gender ambiguity through the inversion and modification of a standard urinal. Connects this androgynous artwork to Duchamp\'s family dynamics and his female alter ego, Rrose Sélavy.',
  },
  {
    title: 'What if Heidegger used Fountain instead of van Gogh\'s Shoes to launch the Origin of a Work of Art?',
    author: 'Paul O\'Halloran',
    date: 'August 18, 2020',
    url: 'https://www.toutfait.com/what-if-heidegger-used-fountain-instead-of-van-goghs-shoes-to-launch-the-origin-of-a-work-of-art/',
    description: 'Examines whether Martin Heidegger\'s influential theory of artistic origin can adequately explain Duchamp\'s Fountain. Argues that Heidegger\'s phenomenological approach fails because Fountain derives significance from collaborative performance and artistic intention rather than the physical urinal itself.',
  },
  {
    title: '\'Paris Air\' or \'Holy Ampule\'?',
    author: 'Robert',
    date: 'December 1, 1999',
    url: 'https://www.toutfait.com/paris-air-or-holy-ampule/',
    description: 'Examines "Air de Paris" (1919), proposing it may be modeled after the Holy Ampule used in French coronation ceremonies. Scrutinizes the authenticity of various versions, noting discrepancies between labeled volumes and actual measurements.',
  },
  {
    title: 'Duchamp Bottles Belle Greene: Just Desserts For His Canning',
    author: 'Not specified',
    date: 'Not specified',
    url: 'https://www.toutfait.com/duchamp-bottles-belle-greene-just-desserts-for-his-canning/',
    description: 'Article exploring connections between Duchamp and Belle Greene related to bottle-themed readymades.',
  },
  {
    title: 'Modernist (Im)mobilities: Marcel Duchamp, Samuel Beckett, and the Avant-Garde Bike',
    author: 'Jake Kennedy',
    date: 'December 1, 2005',
    url: 'https://www.toutfait.com/modernist-immobilitiesmarcel-duchamp-samuel-beckett-and-the-avant-garde-bike/',
    description: 'Explores connections between Duchamp, Beckett, and bicycle-related works.',
  },
  {
    title: 'Marcel Duchamp: Money Is No Object - The Art of Defying the Art Market',
    author: 'Not specified',
    date: 'Not specified',
    url: 'https://www.toutfait.com/marcel-duchamp-money-is-no-object-the-art-of-defying-the-art-market/',
    description: 'Examines Duchamp\'s relationship with the art market and how readymades challenged commercial art values.',
  },
  {
    title: 'Unpacking the Boîte-en-valise: Playing off Duchampian Deferral and Derrida\'s "différance"',
    author: 'Yishan Lam',
    date: 'May 1, 2005',
    url: 'https://www.toutfait.com/unpacking-the-boate-en-valiseplaying-off-duchampian-deferral-and-derridas-diffarance/',
    description: 'Explores Duchamp\'s portable museum box and its relationship to readymades through Derridean philosophical framework.',
  },
  {
    title: 'Bicycle Wheel Stool',
    author: 'Not specified',
    date: 'Not specified',
    url: 'https://www.toutfait.com/bicycle-wheel-stool/',
    description: 'Article focused on the Bicycle Wheel readymade.',
  },
  {
    title: 'Response to "Straight Forks and Pneumatic Tires..."',
    author: 'Not specified',
    date: 'Not specified',
    url: 'https://www.toutfait.com/response-to-straight-forks-and-pneumatic-tireshistoricizing-duchamps-bicycle-wheel-of-1913/',
    description: 'Response article to Allen\'s technical analysis of the Bicycle Wheel.',
  },
  {
    title: 'Reply to Kline\'s response to "Straight Forks and Pneumatic Tires..."',
    author: 'Not specified',
    date: 'Not specified',
    url: 'https://www.toutfait.com/reply-to-klines-response-to-straight-forks-and-pneumatic-tireshistoricizing-duchamps-bicycle-wheel-of-1913/',
    description: 'Further response in the scholarly debate about the Bicycle Wheel\'s technical details.',
  },
];

export default function ReadymadesResearchPage() {
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
            Readymades Research
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Scholarly articles about Duchamp&apos;s readymades from Toutfait: The Marcel Duchamp Studies Online Journal
          </p>
        </div>
      </section>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[var(--accent-gold)]" />
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
            the premier online journal for Marcel Duchamp studies. These articles explore various aspects of
            Duchamp&apos;s revolutionary readymades, from technical analysis to philosophical implications.
          </p>
          <p className="text-[var(--text-secondary)]">
            The research represented here ranges from challenging the basic assumption that readymades were
            unmodified found objects (Shearer, Obalk) to exploring their cultural and philosophical significance
            (Girst, O&apos;Halloran). This collection is essential reading for understanding the complexity beneath
            what appears to be a simple artistic gesture.
          </p>
        </CardContent>
      </Card>

      {/* Articles List */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
          {readymadesArticles.length} Articles on Readymades
        </h2>

        <div className="space-y-4">
          {readymadesArticles.map((article, index) => (
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

    </div>
  );
}
