import { Metadata } from 'next';
import { CalendarDays, Clock, TreeDeciduous, BookOpen, Sparkles, Globe } from 'lucide-react';
import { HeroMeta } from '@/components/site/hero-meta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'The Golden Bough - Elden Ring Is The Large Glass',
  description: 'How Frazer\'s comparative mythology connects to both Duchamp\'s art and Elden Ring\'s mythological framework',
};

export default function GoldenBoughPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <TreeDeciduous className="h-5 w-5 text-[var(--accent-gold)]" />
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">Mythological Source</p>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            The Golden Bough
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            James George Frazer&apos;s monumental study of magic, religion, and mythology - a key source
            for understanding the deep structures underlying both Duchamp&apos;s art and Elden Ring.
          </p>
        </div>
        <HeroMeta
          items={[
            { label: 'Published', value: '1890', icon: CalendarDays },
            { label: 'Reading Time', value: '10 min', icon: Clock },
            { label: 'Type', value: 'Comparative Mythology', icon: BookOpen },
          ]}
        />
      </section>

      {/* Key Concepts Cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <TreeDeciduous className="h-6 w-6 text-[var(--accent-gold)] mb-2" />
            <CardTitle className="text-base">The Sacred Tree</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              The central image: the priest who guards the sacred grove at Nemi, who can only be replaced by his killer.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/30">
          <CardHeader>
            <Globe className="h-6 w-6 text-[var(--accent-blue)] mb-2" />
            <CardTitle className="text-base">Universal Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Frazer identified common mythological patterns across cultures: dying gods, sacred kings, fertility rites.
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all border-[var(--border-subtle)] hover:border-[var(--accent-purple)]/30">
          <CardHeader>
            <Sparkles className="h-6 w-6 text-[var(--accent-purple)] mb-2" />
            <CardTitle className="text-base">Magic to Religion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--text-secondary)]">
              Frazer traced humanity&apos;s evolution from sympathetic magic through religion to science.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Main Content */}
      <section className="prose prose-lg prose-invert max-w-none">
        <h2>About The Golden Bough</h2>
        <p>
          <em>The Golden Bough: A Study in Comparative Religion</em> (later subtitled <em>A Study in Magic and Religion</em>)
          was first published in 1890 by Scottish anthropologist James George Frazer. It grew from two volumes
          to twelve in subsequent editions, becoming one of the most influential works of comparative mythology.
        </p>
        <p>
          The title refers to an ancient Italian legend: at the sanctuary of Diana at Nemi, a runaway slave
          could become priest-king by breaking a branch from a sacred tree and killing the current priest
          in single combat. Frazer used this strange custom as a lens to examine sacred kingship, dying-and-rising
          gods, and fertility rituals across world cultures.
        </p>

        <h3>Key Themes</h3>
        <ul>
          <li><strong>The Dying God:</strong> Figures like Osiris, Attis, Adonis, and Dionysus who die and are reborn</li>
          <li><strong>Sacred Kingship:</strong> Kings who embody divine power and must die to renew the land</li>
          <li><strong>Sympathetic Magic:</strong> The belief that like affects like, that images can influence their subjects</li>
          <li><strong>The Scapegoat:</strong> Ritual transfer of evil or misfortune to a victim</li>
          <li><strong>Fire Festivals:</strong> Cyclical celebrations marking death and rebirth</li>
        </ul>

        <h2>Influence on Modernist Art</h2>
        <p>
          The Golden Bough profoundly shaped modernist thought. T.S. Eliot explicitly referenced it in
          <em>The Waste Land</em>. Joseph Campbell&apos;s <em>Hero with a Thousand Faces</em> built on Frazer&apos;s
          comparative method. The book made artists aware of deep mythological structures underlying culture.
        </p>
        <p>
          The symbolists and surrealists drew on Frazer&apos;s catalog of magical thinking. Marcel Duchamp,
          deeply read in occult and anthropological literature, would have encountered these ideas directly
          or through his intellectual milieu.
        </p>

        <h2>Miyazaki&apos;s Sociology</h2>
        <p>
          Hidetaka Miyazaki studied sociology at Keio University before entering the game industry.
          This is not incidental. <em>The Golden Bough</em> is foundational to the sociological and
          anthropological study of religion - Frazer&apos;s comparative method shaped how we understand
          myth, ritual, and sacred structures across cultures.
        </p>
        <p>
          Every FromSoftware &quot;Souls&quot; game is, in a fundamental sense, the journey of the Golden Bough:
          the cyclical death and renewal of sacred kingship, the fire that must be linked or allowed to fade,
          the endless succession of chosen undead who must kill gods to claim their power. Dark Souls,
          Bloodborne, Sekiro, Elden Ring - each is a ritual enactment of Frazer&apos;s core thesis.
        </p>

        <h2>The Sacred Parasite</h2>
        <p>
          One of The Golden Bough&apos;s most famous passages concerns mistletoe - how &quot;primitive&quot; peoples
          entrusted their souls to this plant they believed sacred. What Frazer reveals, with characteristic
          Victorian irony, is that mistletoe is a parasite. The sacred object venerated as a source of life
          is actually feeding on its host tree.
        </p>
        <p>
          This insight directly influenced H.P. Lovecraft&apos;s cosmic horror: the anthropological terror that
          our sacred structures mask something older, stranger, and indifferent to human meaning.
        </p>
        <p>
          The Erdtree <em>is</em> mistletoe. It is presented as the sacred source of grace, the axis around
          which the Lands Between revolve. But the game reveals that the Erdtree is grafted onto something
          older - the Great Tree, the Crucible, the primal life force that existed before the Greater Will&apos;s
          order. The golden tree that promises eternal life is a parasite feeding on what came before.
        </p>
        <p>
          The people of the Lands Between believe their souls return to the Erdtree upon death - this is why
          the dead are buried among its roots. The Erdtree is quite literally the repository of souls, the
          External Soul of an entire civilization. When the cycle of death was broken, souls stopped returning
          properly, and Those Who Live in Death emerged - not truly alive, not truly dead.
        </p>

        <h3>The Haligtree: Mistletoe on Mistletoe</h3>
        <p>
          Frazer notes that the most sacred mistletoe was considered to be mistletoe that grew on top of
          other mistletoe - a second-order parasite, doubly removed from the host tree. This is the Haligtree.
        </p>
        <p>
          Miquella&apos;s Haligtree is &quot;Unalloyed Gold&quot; - an attempt to grow a NEW sacred tree, purer than the
          Erdtree, free from the Greater Will&apos;s influence. But structurally, it&apos;s a parasite on a parasite.
          A golden bough growing from the golden bough. The most sacred form of the sacred plant, according
          to Frazer&apos;s own framework - and yet it too is corrupted, infested with rot, a failed transcendence.
        </p>

        <h2>The Erdtree Connection</h2>
        <p>
          The Erdtree in Elden Ring is a direct descendant of Frazer&apos;s sacred trees:
        </p>
        <ul>
          <li>It stands at the center of the world, like the World Tree of Norse mythology</li>
          <li>It governs the cycle of death and rebirth</li>
          <li>To become Elden Lord, one must defeat the current guardian</li>
          <li>The tree is dying, and the land withers with it</li>
          <li>Various endings involve different relationships to the tree&apos;s power</li>
        </ul>
        <p>
          This is not mere inspiration - it&apos;s a deliberate deployment of mythological structures that
          Frazer identified as universal. FromSoftware has created a &apos;pataphysical mythology.
        </p>

        <h2>The Tarnished as Priest-King</h2>
        <p>
          The player&apos;s role in Elden Ring mirrors Frazer&apos;s priest at Nemi. You are an outsider
          (the runaway slave) who must defeat the current powers (break the bough) to claim rulership.
          The cycle of death and return echoes the dying god motif. Your journey is a ritual enactment
          of the deepest human myths.
        </p>
        <p>
          The easiest ending to achieve - the one requiring no special quests, no hidden paths - is the
          Age of Fracture. You become Elden Lord, but you do not mend the golden order. The ring remains
          shattered. The throne you claim is diminished.
        </p>
        <p>
          This is Frazer&apos;s ritual in its purest form. You are the priest-king of Nemi, holding the sacred
          grove until the next Tarnished comes to break the bough and take your place. No transcendence,
          no escape from the cycle - just succession. The game&apos;s default state is not victory but
          continuation: you are Elden Lord only as long as it takes for another to claim your throne.
        </p>

        <h2>Chapter-by-Chapter Analysis</h2>
        <p>
          What follows is a systematic analysis of The Golden Bough&apos;s major chapters and their connections
          to Elden Ring. Miyazaki didn&apos;t just read Frazer - he made the book playable.
        </p>

        <h3>Chapter 1: The King of the Wood</h3>
        <p>
          The foundational chapter describes the priest at Nemi who guards a sacred grove with drawn sword,
          constantly vigilant, who can only be replaced by being killed. &quot;Grey hairs might seal his death-warrant&quot; -
          any weakness invites challenge.
        </p>
        <ul>
          <li><strong>The Priest at Nemi → The Demigods:</strong> Each shardbearer guards their domain until a Tarnished comes to take it. Godrick&apos;s grafting desperation, Rennala&apos;s grief-madness, Radahn&apos;s rot - these are the grey hairs that mark them for death.</li>
          <li><strong>The Runaway Slave → The Tarnished:</strong> Only an escaped slave could break the bough and challenge the king. The Tarnished are explicitly those who lost the grace of the Erdtree - exiles who return.</li>
          <li><strong>The Sacred Tree → The Erdtree:</strong> Its thorns bar entry until you&apos;ve proven yourself. The &quot;golden bough&quot; you must break is killing the demigods and burning the Erdtree.</li>
          <li><strong>Diana and Virbius → Marika and Radagon:</strong> The goddess and her consort, literally fused. The god-queen and her spouse whose separation shattered the order.</li>
          <li><strong>Egeria the Water-Nymph → Melina:</strong> The guide who counsels the Tarnished, who offers herself as kindling.</li>
        </ul>

        <h3>Chapters 2-4: Priestly Kings and Magic</h3>
        <p>
          Frazer establishes that in ancient societies, kingship and priesthood were inseparable. The king was
          a religious figure who performed sacrifices, mediated between humans and gods, and was often considered
          divine. He distinguishes between magic (which commands) and religion (which supplicates).
        </p>
        <ul>
          <li><strong>Divine Kings → The Demigods:</strong> Their divinity is literal, not metaphorical. Marika is both Queen and Goddess. The Golden Order is both political and religious.</li>
          <li><strong>King&apos;s Health = Land&apos;s Health:</strong> The Shattering. When the Elden Ring broke and the demigods fell into war, the Lands Between fell into rot, decay, and madness.</li>
          <li><strong>Magic vs Religion → Sorceries vs Incantations:</strong> The magician commands nature through fixed laws; the priest supplicates personal gods. The academy&apos;s sorceries (INT) vs the Golden Order&apos;s incantations (FTH) - Frazer&apos;s fundamental distinction made into game mechanics.</li>
          <li><strong>Arcane as Science:</strong> In Japanese, Arcane (ARC) literally means &quot;the secrets of the gods&quot; - but functionally it&apos;s the science stat. It governs complex status effects, build-up triggers, and discovery mechanics. It requires the most technical understanding of how the game actually works, and rewards empirical mastery over faith or academic study. In Bloodborne, Arcane existed but Faith did not (a game about cosmic horror has no gods to pray to). In Dark Souls 3, it was called Luck. Frazer&apos;s progression - magic to religion to science - is encoded in the stat system.</li>
          <li><strong>&quot;The haughty self-sufficiency of the magician... could not but revolt the priest&quot;</strong> → The war between the Carian Academy and the Golden Order.</li>
        </ul>

        <h3>Chapter 3: Sympathetic Magic and the Item System</h3>
        <p>
          Frazer divides sympathetic magic into two branches: <strong>Homeopathic Magic</strong> (like produces like)
          and <strong>Contagious Magic</strong> (things once connected remain connected). Elden Ring&apos;s entire item
          system is built on these principles.
        </p>

        <h4>Homeopathic Magic: Like Produces Like</h4>
        <p>
          &quot;From the first of these principles, namely the Law of Similarity, the magician infers that he can
          produce any effect he desires merely by imitating it.&quot;
        </p>
        <ul>
          <li><strong>Greases:</strong> Blood Grease applies blood to your weapon → weapon causes bleed buildup. Fire Grease applies fire → fire damage. Magic Grease, Poison Grease, Rot Grease - each applies the imitation of an element to produce that element&apos;s effect. Pure homeopathic magic.</li>
          <li><strong>Pots and Consumables:</strong> Fire Pots imitate fire to produce fire. Poison Pots, Sleep Pots, etc. The thrown object resembles its effect.</li>
          <li><strong>Spirit Ashes:</strong> You summon an <em>imitation</em> of a creature - a spirit, a copy - and it produces the creature&apos;s effects. The Mimic Tear is the ultimate expression: an imitation of yourself.</li>
          <li><strong>Sorceries:</strong> Carian sorceries create phantom swords, phantom bows - imitations of weapons that produce real damage. The image produces the effect of what it imitates.</li>
        </ul>

        <h4>Talismans as Homeopathic Magic</h4>
        <p>
          Talismans embody the &quot;like produces like&quot; principle through their forms, images, and associations:
        </p>
        <ul>
          <li><strong>Claw Talisman:</strong> Shaped like a claw → increases jump attack damage. The image of striking produces the effect of striking harder.</li>
          <li><strong>Arrow&apos;s Reach Talisman:</strong> An arrow → increases arrow range. The image of the projectile enhances the projectile.</li>
          <li><strong>Arrow&apos;s Sting Talisman:</strong> An arrow → increases arrow damage. Same principle, different aspect.</li>
          <li><strong>Green Turtle Talisman:</strong> A turtle (slow, steady, enduring) → increases stamina recovery. The turtle&apos;s qualities transfer to the bearer.</li>
          <li><strong>Blue Dancer Charm:</strong> Image of a dancer → increases damage when lightly equipped. The dancer&apos;s agility becomes your agility.</li>
          <li><strong>Crucible Talismans (Knot, Feather, Scale):</strong> Each contains an aspect of the primordial Crucible → produces that aspect. The Feather grants flight (dodge extension), the Scale grants defense, the Knot grants tail attacks.</li>
          <li><strong>Scorpion Charms:</strong> Shaped like scorpions → boost elemental damage but lower defense. The scorpion is deadly but fragile; so becomes the wearer.</li>
          <li><strong>Dragoncrest Talismans:</strong> Dragon imagery → dragon-like resistance to physical damage. The dragon&apos;s toughness becomes yours.</li>
          <li><strong>Warrior Jar Shard:</strong> Piece of a warrior jar → increases skill damage. The warrior&apos;s fragment carries the warrior&apos;s prowess.</li>
          <li><strong>Bull-Goat&apos;s Talisman:</strong> Image of the bull-goat → increases poise. The beast&apos;s stubbornness transfers to you.</li>
          <li><strong>Spear Talisman:</strong> A spear → increases counter damage (spears excel at counters). The weapon&apos;s nature becomes your advantage.</li>
          <li><strong>Godskin Swaddling Cloth:</strong> Cloth that swaddled something → heals on successive hits. The nurturing association produces nurturing effects.</li>
        </ul>
        <p>
          This is Frazer&apos;s homeopathic magic in pure form: the image, form, or symbolic association of an object
          produces effects that resemble what it depicts. A claw strikes. A turtle endures. A dancer moves freely.
          The game&apos;s entire talisman system operates on magical correspondence, not material causation.
        </p>

        <h4>Complete Talisman Analysis: The Encyclopedia of Like-Produces-Like</h4>
        <p>
          The following is a comprehensive analysis of how each talisman in Elden Ring embodies Frazer&apos;s
          homeopathic magic principle. Every single one operates on magical correspondence.
        </p>

        <h5>Animal Talismans: Creature Essence Transfer</h5>
        <ul>
          <li><strong>Green Turtle Talisman:</strong> Turtle → stamina recovery. The tortoise is slow but enduring; its steadiness becomes your stamina.</li>
          <li><strong>Longtail Cat Talisman:</strong> Cat → immunity to fall damage. Cats always land on their feet; so do you.</li>
          <li><strong>Bull-Goat&apos;s Talisman:</strong> Bull-goat → raises poise. The stubborn beast cannot be staggered; neither can you.</li>
          <li><strong>Ancestral Spirit&apos;s Horn:</strong> Spirit creature&apos;s horn → FP restoration on kills. The ancestral spirits drew life from the land; you draw FP from the dead.</li>
          <li><strong>Companion Jar:</strong> Living jar → raises pot potency. Jars understand jars; carrying one makes your thrown pots deadlier.</li>
          <li><strong>Gold Scarab:</strong> Golden beetle → increases runes obtained. The scarab hoards precious things; it attracts more gold to you.</li>
          <li><strong>Silver Scarab:</strong> Silver beetle → raises item discovery. The scarab finds treasures; it helps you find them too.</li>
        </ul>

        <h5>Scorpion Charms: Deadly but Fragile</h5>
        <p>
          Every Scorpion Charm raises attack but lowers defense. The scorpion is venomous but easily crushed - the form dictates the trade-off:
        </p>
        <ul>
          <li><strong>Fire Scorpion Charm:</strong> Scorpion (elemental) → fire attack up, damage negation down.</li>
          <li><strong>Lightning Scorpion Charm:</strong> Scorpion (elemental) → lightning attack up, damage negation down.</li>
          <li><strong>Magic Scorpion Charm:</strong> Scorpion (elemental) → magic attack up, damage negation down.</li>
          <li><strong>Sacred Scorpion Charm:</strong> Scorpion (elemental) → holy attack up, damage negation down.</li>
        </ul>

        <h5>Drake Talismans: Dragon Protection</h5>
        <p>
          Dragons are elementally resistant; their image produces elemental resistance:
        </p>
        <ul>
          <li><strong>Dragoncrest Shield Talismans (+1, +2, Greatshield):</strong> Dragon crest → physical damage negation. Dragons have thick scales.</li>
          <li><strong>Flamedrake Talismans (+1, +2):</strong> Fire drake → fire damage negation. Fire dragons are immune to flame.</li>
          <li><strong>Boltdrake Talismans (+1, +2):</strong> Lightning drake → lightning damage negation.</li>
          <li><strong>Spelldrake Talismans (+1, +2):</strong> Magic drake → magical damage negation.</li>
          <li><strong>Haligdrake Talismans (+1, +2):</strong> Holy drake → holy damage negation.</li>
          <li><strong>Pearldrake Talismans (+1, +2):</strong> Pearl-hued drake → non-physical damage negation. The pearl&apos;s purity rejects all elements.</li>
        </ul>

        <h5>Weapon Talismans: The Form Enhances the Function</h5>
        <p>
          Each weapon-shaped talisman enhances what that weapon DOES best:
        </p>
        <ul>
          <li><strong>Claw Talisman:</strong> Claw → jump attack damage. Claws strike from above.</li>
          <li><strong>Dagger Talisman:</strong> Dagger → critical hit damage. Daggers are for backstabs and ripostes.</li>
          <li><strong>Spear Talisman:</strong> Spear → counter attack damage. Spears punish those who strike first.</li>
          <li><strong>Axe Talisman:</strong> Axe → charged attack damage. Axes are swung with power.</li>
          <li><strong>Hammer Talisman:</strong> Hammer → stamina damage against blocking enemies. Hammers smash through guards.</li>
          <li><strong>Lance Talisman:</strong> Lance → mounted attack damage. Lances are for horseback.</li>
          <li><strong>Curved Sword Talisman:</strong> Curved sword → guard counter damage. Curved swords excel at quick ripostes.</li>
          <li><strong>Twinblade Talisman:</strong> Twinblade → final hit of chain attacks. Twinblades are about the combo finisher.</li>
          <li><strong>Arrow&apos;s Reach Talisman:</strong> Arrow → increases bow range. The arrow flies further.</li>
          <li><strong>Arrow&apos;s Sting Talisman:</strong> Arrow → increases arrow/bolt damage. The arrow pierces deeper.</li>
        </ul>

        <h5>Feathered and Winged: Flight and Lightness</h5>
        <ul>
          <li><strong>Crucible Feather Talisman:</strong> Feather → improved dodge rolling (but increased damage). The bird&apos;s flight becomes your evasion, but feathers are fragile.</li>
          <li><strong>Blue-Feathered Branchsword:</strong> Blue feather → defense up when HP is low. The bird takes flight when threatened.</li>
          <li><strong>Red-Feathered Branchsword:</strong> Red feather → attack up when HP is low. The wounded bird strikes fiercely.</li>
          <li><strong>Winged Sword Insignia:</strong> Winged emblem → attack power rises with successive attacks. Wings beat faster and faster.</li>
          <li><strong>Rotten Winged Sword Insignia:</strong> Corrupted wings → GREATLY raises attack with successive attacks. The rot makes it more powerful (Malenia&apos;s curse = strength).</li>
        </ul>

        <h5>Amber Medallions: Crystallized Vitality</h5>
        <p>
          Amber is fossilized tree resin - preserved life force. The color determines what it preserves:
        </p>
        <ul>
          <li><strong>Crimson Amber Medallions (+1, +2):</strong> Red/blood-colored amber → maximum HP. Red = blood = life.</li>
          <li><strong>Cerulean Amber Medallions (+1, +2):</strong> Blue amber → maximum FP. Blue = mind = magic reserves.</li>
          <li><strong>Viridian Amber Medallions (+1, +2):</strong> Green amber → maximum stamina. Green = vitality = endurance.</li>
        </ul>

        <h5>Seed Talismans: Growth and Restoration</h5>
        <ul>
          <li><strong>Crimson Seed Talisman:</strong> Red seed → better HP flask restoration. Seeds grow into life; red seeds restore life.</li>
          <li><strong>Cerulean Seed Talisman:</strong> Blue seed → better FP flask restoration. Blue seeds restore mind.</li>
        </ul>

        <h5>Horn Charms: Beast Resistance</h5>
        <p>
          Horns are defensive appendages on hardy beasts:
        </p>
        <ul>
          <li><strong>Immunizing Horn Charm (+1):</strong> Horn → raises immunity. The beast shakes off poison.</li>
          <li><strong>Clarifying Horn Charm (+1):</strong> Horn → raises focus. The beast&apos;s mind is unclouded.</li>
          <li><strong>Stalwart Horn Charm (+1):</strong> Horn → raises robustness. The beast endures cold and blood loss.</li>
          <li><strong>Mottled Necklace (+1):</strong> Multiple horns strung together → raises immunity, focus, AND robustness. A collection of beast protections.</li>
        </ul>

        <h5>Icon and Heirloom Talismans: Invoking the Named</h5>
        <p>
          Objects associated with powerful beings transfer that being&apos;s traits:
        </p>
        <ul>
          <li><strong>Radagon Icon:</strong> Radagon&apos;s image → shorter cast times. Radagon was known for swift, decisive action.</li>
          <li><strong>Radagon&apos;s Scarseal/Soreseal:</strong> Radagon&apos;s seal → raises physical stats but increases damage taken. His power at his price - the scar/sore reminds you that power costs.</li>
          <li><strong>Marika&apos;s Scarseal/Soreseal:</strong> Marika&apos;s seal → raises mental stats but increases damage taken. The goddess&apos;s power leaves its mark.</li>
          <li><strong>Godfrey Icon:</strong> First Elden Lord&apos;s image → enhances charged spells/skills. Godfrey was patient, powerful, deliberate.</li>
          <li><strong>Stargazer Heirloom:</strong> From one who gazed at stars → raises intelligence. Contemplation of the cosmos sharpens the mind.</li>
          <li><strong>Prosthesis-Wearer Heirloom:</strong> From Millicent&apos;s line → raises dexterity. The prosthesis-wearer learned precise control.</li>
          <li><strong>Starscourge Heirloom:</strong> From Radahn → raises strength. The Starscourge held back the heavens through sheer might.</li>
          <li><strong>Two Fingers Heirloom:</strong> From the Two Fingers → raises faith. The Fingers are agents of the Greater Will&apos;s faith.</li>
        </ul>

        <h5>Assassin&apos;s Talismans: The Killer&apos;s Edge</h5>
        <ul>
          <li><strong>Assassin&apos;s Crimson Dagger:</strong> Assassin&apos;s red blade → critical hits restore HP. The assassin drinks life from their kills.</li>
          <li><strong>Assassin&apos;s Cerulean Dagger:</strong> Assassin&apos;s blue blade → critical hits restore FP. The assassin draws power from precision strikes.</li>
          <li><strong>Crepus&apos;s Vial:</strong> Legendary assassin&apos;s tool → silences all movement. Crepus was never heard coming.</li>
          <li><strong>Concealing Veil:</strong> Veil → conceals wearer when crouching. A veil hides what&apos;s beneath it.</li>
        </ul>

        <h5>Crucible Talismans: The Primordial Aspects</h5>
        <p>
          The Crucible was the primordial soup where all life mixed. Each talisman contains one aspect:
        </p>
        <ul>
          <li><strong>Crucible Feather Talisman:</strong> Bird aspect → enhanced dodging. The bird flew free.</li>
          <li><strong>Crucible Scale Talisman:</strong> Scale aspect → reduced critical damage taken. The beast had thick hide.</li>
          <li><strong>Crucible Knot Talisman:</strong> Tail/horn aspect → reduced headshot damage. The knotted creature was protected.</li>
        </ul>

        <h5>Shield Talismans: Defense Takes Form</h5>
        <ul>
          <li><strong>Greatshield Talisman:</strong> Shield image → improved guard ability. The shield blocks.</li>
          <li><strong>Ritual Shield Talisman:</strong> Sacred shield → defense up when HP is full. The ritual protects the pure.</li>
          <li><strong>Ritual Sword Talisman:</strong> Sacred sword → attack up when HP is full. The ritual empowers the whole.</li>
        </ul>

        <h5>Sorcery and Faith Talismans: Power of Study and Devotion</h5>
        <ul>
          <li><strong>Graven-School Talisman:</strong> Sculpted heads of sorcerers → raises sorcery potency. The collected wisdom enhances spells.</li>
          <li><strong>Graven-Mass Talisman:</strong> MASS of sculpted heads → GREATLY raises sorcery potency. More heads = more power.</li>
          <li><strong>Faithful&apos;s Canvas Talisman:</strong> Painted devotion → raises incantation potency. The faithful&apos;s expression strengthens prayers.</li>
          <li><strong>Flock&apos;s Canvas Talisman:</strong> Painting of the devoted flock → GREATLY raises incantation potency. A congregation&apos;s faith is stronger than one.</li>
          <li><strong>Carian Filigreed Crest:</strong> Carian royal emblem → lowers FP cost of skills. The Carians were masters of efficiency.</li>
          <li><strong>Primal Glintstone Blade:</strong> Raw glintstone → spells cost less FP but max HP reduced. The primal stone is efficient but dangerous.</li>
          <li><strong>Old Lord&apos;s Talisman:</strong> Ancient lord&apos;s symbol → extends spell duration. The old lord&apos;s power lingered.</li>
          <li><strong>Moon of Nokstella:</strong> The underground city&apos;s moon → more memory slots. Nokstella&apos;s sorcerers knew many spells.</li>
        </ul>

        <h5>Arsenal and Equipment Load: Bearing the Weight</h5>
        <ul>
          <li><strong>Arsenal Charm (+1):</strong> Military symbol → higher equip load. Warriors carry more gear.</li>
          <li><strong>Great-Jar&apos;s Arsenal:</strong> The Great Jar&apos;s gift → vastly higher equip load. The Great Jar held an army&apos;s worth within.</li>
          <li><strong>Blue Dancer Charm:</strong> Dancer image → attack up when lightly equipped. Dancers move unburdened; their freedom is strength.</li>
          <li><strong>Erdtree&apos;s Favor (+1, +2):</strong> Erdtree blessing → raises HP, stamina, AND equip load. The tree&apos;s grace is comprehensive.</li>
        </ul>

        <h5>Exultation Talismans: Joy in Suffering</h5>
        <p>
          These talismans depict beings who find power in affliction:
        </p>
        <ul>
          <li><strong>Lord of Blood&apos;s Exultation:</strong> Mohg&apos;s symbol → attack up when blood loss occurs nearby. The Lord of Blood celebrates hemorrhage.</li>
          <li><strong>Kindred of Rot&apos;s Exultation:</strong> Rot creature&apos;s symbol → attack up when rot/poison occurs nearby. The rot kindred feed on decay.</li>
        </ul>

        <h5>Warrior Legacy Talismans: Dead Champions&apos; Gifts</h5>
        <ul>
          <li><strong>Warrior Jar Shard:</strong> Piece of warrior jar → boosts skill damage. The jar contained warriors; their spirit remains.</li>
          <li><strong>Shard of Alexander:</strong> Piece of Alexander specifically → GREATLY boosts skill damage. The Iron Fist&apos;s determination persists.</li>
          <li><strong>Millicent&apos;s Prosthesis:</strong> Her artificial arm → raises dexterity, attack grows with successive hits. Millicent adapted and overcame.</li>
        </ul>

        <h5>Death and Sacrifice Talismans</h5>
        <ul>
          <li><strong>Prince of Death&apos;s Pustule/Cyst:</strong> Godwyn&apos;s growth → raises vitality. Godwyn cannot die; his flesh grants resistance to death.</li>
          <li><strong>Sacrificial Twig:</strong> Twig from sacred tree → lost instead of runes on death. The sacrifice takes your place.</li>
          <li><strong>Blessed Dew Talisman:</strong> Holy dew → slowly restores HP. The Erdtree&apos;s moisture heals.</li>
          <li><strong>Godskin Swaddling Cloth:</strong> Cloth that wrapped godflesh → successive attacks heal. The intimate contact with divine flesh transfers healing properties.</li>
          <li><strong>Taker&apos;s Cameo:</strong> Rykard&apos;s symbol → HP restored on enemy defeat. The devouring serpent consumes life.</li>
        </ul>

        <h5>Roar and Breath: The Beast Within</h5>
        <ul>
          <li><strong>Roar Medallion:</strong> Roaring beast image → enhances roars and breath attacks. The beast&apos;s power in its voice.</li>
          <li><strong>Perfumer&apos;s Talisman:</strong> Perfumer&apos;s tool → raises perfume potency. The craftsman&apos;s symbol enhances the craft.</li>
        </ul>

        <h5>Woe and Curse Talismans: Negative Correspondences</h5>
        <p>
          Some talismans embody negative qualities that produce negative effects - still homeopathic magic:
        </p>
        <ul>
          <li><strong>Shabriri&apos;s Woe:</strong> Shabriri&apos;s curse → constantly draws enemy attention. Shabriri drew only hatred.</li>
          <li><strong>Daedicar&apos;s Woe:</strong> Daedicar&apos;s suffering → increases damage taken. The woe is transferred to the wearer.</li>
          <li><strong>Entwining Umbilical Cord:</strong> Cord that bound mother and child → changes demeanor. The connection persists, transforming behavior.</li>
        </ul>

        <h5>Mirror Talismans: Appearance as Reality</h5>
        <ul>
          <li><strong>Furled Finger&apos;s Trick-Mirror:</strong> Mirror → appear as Host of Fingers. You see what the mirror shows.</li>
          <li><strong>Host&apos;s Trick-Mirror:</strong> Mirror → appear as cooperator. Reflection determines appearance.</li>
        </ul>
        <p>
          Every talisman in Elden Ring operates on the principle of homeopathic magic: the image, form,
          or symbolic association of the object produces an effect corresponding to what it represents.
          Frazer would recognize every single one.
        </p>

        <h4>Contagious Magic: Once Connected, Always Connected</h4>
        <p>
          &quot;From the second of these principles, namely the Law of Contact or Contagion, the magician infers
          that whatever he does to a material object will affect equally the person with whom the object was
          once in contact.&quot;
        </p>
        <ul>
          <li><strong>Talismans:</strong> Objects that were once connected to power retain that power. The Erdtree&apos;s Favor talisman contains a blessing from the Erdtree - contact with the sacred transfers its properties. Every talisman is contagious magic: an object that touched something powerful and retained the connection.</li>
          <li><strong>Great Runes:</strong> Pieces of the shattered Elden Ring. They were once part of the whole, and they retain their connection to it. Activating them at Divine Towers - places that still connect to the Erdtree&apos;s power - restores their function.</li>
          <li><strong>Ashes of War:</strong> Skills extracted from weapons or warriors. The technique was once connected to its source, and that connection persists - you can now apply it to a new weapon.</li>
          <li><strong>Remembrances:</strong> The demigod&apos;s soul-essence, once part of them, still connected to their power. Consuming it transfers their abilities to you through that connection.</li>
          <li><strong>Godrick&apos;s Grafting:</strong> The most literal contagious magic. Godrick attaches arms, dragon heads - body parts that were once connected to their owners&apos; strength. He believes (correctly, in this world) that the connection persists.</li>
          <li><strong>Deathroot:</strong> Godwyn&apos;s death spreading through the Erdtree&apos;s roots. His corpse touched the roots; now everything the roots touch is infected with his death. Contagion through contact.</li>
          <li><strong>Bloodflame:</strong> Mohg&apos;s blood magic. Blood that touched the Formless Mother retains that connection - it burns with her power.</li>
        </ul>

        <h4>The Crafting System as Applied Magic</h4>
        <p>
          Crafting in Elden Ring is explicitly sympathetic magic. You combine materials based on their
          sympathetic properties:
        </p>
        <ul>
          <li><strong>Blood-related materials → Bleed effects:</strong> Bloodrose + beast blood = blood grease. The materials that resemble or touched blood produce blood effects.</li>
          <li><strong>Fire materials → Fire effects:</strong> Smoldering Butterfly + mushroom = fire pot. Things associated with fire produce fire.</li>
          <li><strong>Rot materials → Rot effects:</strong> Aeonian Butterfly (from Malenia&apos;s rot) produces rot. The butterfly was infected; it carries the infection forward.</li>
        </ul>
        <p>
          The entire crafting cookbook system is Frazer&apos;s sympathetic magic systematized into recipes.
          It&apos;s not chemistry - it&apos;s magical correspondence made playable.
        </p>

        <h3>Chapters 6-8: Magicians as Kings, Departmental Kings</h3>
        <p>
          The evolution from magician to chief to sacred king. Frazer describes &quot;departmental kings&quot; - the King of Fire,
          King of Water, King of Rain - who rule specific aspects of nature rather than political territories.
        </p>
        <ul>
          <li><strong>Magician → Chief → King:</strong> The Golden Order&apos;s founding. Marika was an Empyrean chosen by the Greater Will - power crystallized into political structure.</li>
          <li><strong>Departmental Kings → The Demigods&apos; Domains:</strong> Rykard is the Lord of Blasphemy (fire/devouring). Rennala rules the moon and rebirth. Radahn held the stars. Mohg commands blood. Each is a departmental king of a shattered cosmos.</li>
          <li><strong>&quot;When a vacancy occurs, all eligible men flee and hide&quot;</strong> → The Tarnished don&apos;t want to be Elden Lord - they&apos;re compelled by grace. Ranni explicitly rejects her destiny.</li>
        </ul>

        <h3>Chapters 10-12: Tree Worship and Sacred Marriage</h3>
        <p>
          Communities bring a sacred tree to the village amid rejoicing. The tree brings fertility, blessing.
          The May-King and May-Queen embody the tree spirit. Divine marriages were performed to ensure fertility.
        </p>
        <ul>
          <li><strong>The May-Tree → The Erdtree:</strong> The great tree at the center that radiates blessing outward. The minor Erdtrees scattered across the land. Sites of Grace spreading from the central tree.</li>
          <li><strong>Tree Dressed as Woman → Marika in the Erdtree:</strong> The goddess literally inhabiting the tree. The tree IS the queen.</li>
          <li><strong>Divine Marriage for Fertility:</strong> Marika&apos;s marriages to Godfrey (mortal champion) and Radagon. These unions produced the demigods who maintain the order.</li>
          <li><strong>Dionysus Married to the Queen:</strong> At Athens the god was annually married to ensure the vines&apos; fertility. The Erdtree&apos;s blessing as divine fertility. The demigods as fruits of the sacred tree.</li>
        </ul>

        <h3>Chapter 14: Succession to the Kingdom</h3>
        <p>
          Kingship transmitted through marriage, not blood. The king was a man of another clan who married
          the hereditary princess. He must leave his people and live with his wife&apos;s people.
        </p>
        <ul>
          <li><strong>Kingship Through Marriage → Godfrey:</strong> A foreign warrior (Hoarah Loux, a barbarian chieftain) who married into divinity through Marika. The kingdom passes not by blood but by reaching the goddess.</li>
          <li><strong>&quot;He must leave the home of his birth&quot; → The Tarnished&apos;s Exile:</strong> Godfrey was exiled. All Tarnished were exiled. To return and claim the throne, you must come from outside.</li>
        </ul>

        <h3>Chapter 24: The Killing of the Divine King</h3>
        <p>
          The central thesis of The Golden Bough: &quot;The man-god must be killed as soon as he shows symptoms
          that his powers are beginning to fail, and his soul must be transferred to a vigorous successor
          before it has been seriously impaired by the threatened decay.&quot;
        </p>
        <ul>
          <li><strong>Why Kill the King? → The Entire Game:</strong> The demigods and creatures of the Lands Between can die - they simply don&apos;t age or die naturally. They live forever unless killed. You KILL them to claim their runes while they still have strength. That&apos;s why you get Remembrances. The game mechanically enacts Frazer&apos;s central thesis.</li>
          <li><strong>The Shilluk King&apos;s Fertility → The Stagnation:</strong> The king was killed when he could no longer satisfy his wives because his fertility was the land&apos;s fertility. In the Lands Between, everyone has lived so long they&apos;ve gone insane. The reason no one reproduces anymore isn&apos;t mystical infertility - it&apos;s that the entire population is inconceivably old, maddened by centuries of existence without death&apos;s renewal.</li>
          <li><strong>&quot;When he can no longer reproduce his kind, it is time for him to die&quot;:</strong> The demigods produce no new children. Miquella and Malenia are cursed - unable to grow, frozen in time. The entire order has aged past the point of renewal. The sign that it must be violently replaced.</li>
          <li><strong>Combat to the Death → Boss Fights:</strong> &quot;Any son of a king had the right to fight the king in possession.&quot; The demigods war among themselves. The Tarnished as potential successors who fight each of them.</li>
          <li><strong>The Zulu King and Grey Hair → Godrick&apos;s Grafting:</strong> A Zulu king must have no wrinkles or grey hair. Godrick&apos;s grafting is a desperate attempt to stay strong, to not show weakness. The demigods&apos; corruptions are the grey hairs - signs they must be replaced.</li>
        </ul>

        <h3>Chapters 29-31: The Myth of Adonis</h3>
        <p>
          &quot;Under the names of Osiris, Tammuz, Adonis, and Attis, the peoples of Egypt and Western Asia
          represented the yearly decay and revival of life... a god who annually died and rose again from the dead.&quot;
        </p>
        <ul>
          <li><strong>The Dying and Rising God → The Tarnished:</strong> You die and rise repeatedly. The demigods embody this too - Godwyn&apos;s death is &quot;unnatural&quot; precisely because he died in soul but not body.</li>
          <li><strong>Tammuz/Adonis as Divine Spouse → Radagon:</strong> The youthful spouse of the great mother goddess who must die so the cycle continues.</li>
          <li><strong>&quot;During her absence... all life was threatened with extinction&quot; → The Shattering:</strong> When Ishtar went to the underworld, reproduction stopped. When Marika broke the ring and was imprisoned, the cycle of death and rebirth broke.</li>
          <li><strong>The River Runs Red → The Scarlet Rot:</strong> &quot;Every year the face of nature was dyed with his sacred blood.&quot; Mohg&apos;s blood dynasty. The literal bloodstains across the Lands Between.</li>
        </ul>

        <h3>Chapters 48-51: Eating the God</h3>
        <p>
          One of Frazer&apos;s most disturbing sections: the ritual consumption of sacred beings to absorb their power.
          &quot;The Kamilaroi of New South Wales ate the liver as well as the heart of a brave man to get his courage.
          In Tonquin also there is a popular superstition that the liver of a brave man makes brave any who partake of it.&quot;
        </p>
        <ul>
          <li><strong>Consuming the Brave Man → Remembrances:</strong> You kill the demigods and consume their Remembrances at the Roundtable Hold. Enia literally extracts their power for you. Eating Malenia&apos;s remembrance gives you her sword or her rot. Eating Radahn&apos;s gives you his gravity or his rain of arrows. You absorb their qualities by consuming their essence.</li>
          <li><strong>The Heart and Liver:</strong> Frazer notes these organs specifically held courage and vital essence. In Elden Ring, you don&apos;t just take a trophy - you CONSUME. The Remembrance system is cannibalistic communion made into game mechanics.</li>
          <li><strong>Communion with the Divine:</strong> Frazer traces this practice from &quot;savage&quot; cannibalism to the Christian Eucharist - eating the body of the god to partake in divinity. The Tarnished consuming demigod Remembrances is exactly this: eating god-flesh to become more godlike.</li>
          <li><strong>Runes as Consumed Souls:</strong> Every enemy you kill drops runes - fragments of the Elden Ring, pieces of soul. You absorb them into yourself. The entire leveling system is ritual consumption of the dead.</li>
        </ul>

        <h3>Saturn and the Golden Age</h3>
        <p>
          Saturn, the god of sowing and husbandry, was said to have ruled during a fabled Golden Age.
          Frazer writes: &quot;His reign was the fabled Golden Age: the earth brought forth abundantly: no sound
          of war or discord troubled the happy world: no baleful love of lucre worked like poison in the blood
          of the industrious and contented peasantry.&quot;
        </p>
        <ul>
          <li><strong>Saturn → Marika:</strong> Marika&apos;s order is literally called the <em>Golden</em> Order. The Erdtree glows <em>gold</em>. The age before the Shattering was an age of peace, prosperity, and divine blessing - Saturn&apos;s reign made literal. Marika IS Saturn: the divine ruler whose golden age must eventually end.</li>
          <li><strong>The Dark Shadow:</strong> &quot;Yet the bright tradition of his reign was crossed by a dark shadow: his altars are said to have been stained with the blood of human victims.&quot; The Golden Order too has its dark shadow - the Land of Shadow, the Hornsent genocide, the violence that founded the peace. Every golden age is built on blood.</li>
          <li><strong>&quot;At last the good god, the kindly king, vanished suddenly&quot;:</strong> Saturn disappeared. Marika shattered the Elden Ring and was imprisoned within the Erdtree. The golden ruler who built paradise becomes the broken god at its center.</li>
        </ul>

        <h3>Chapter 57: Public Scapegoats</h3>
        <p>
          Evil is concentrated into a material vehicle - animal, object, or human - which is then expelled
          or destroyed, carrying away the community&apos;s sins and diseases.
        </p>
        <ul>
          <li><strong>The Human Scapegoat → The Tarnished:</strong> They were expelled from the Lands Between, stripped of grace, sent into exile. Now they return - but their function is still to absorb the sins/corruptions of the land.</li>
          <li><strong>&quot;He is paraded through the streets... that he might carry off the sin&quot; → The Tarnished&apos;s Journey:</strong> You travel through every region, absorbing the corruption - rot, madness, death, blood - until you reach the center to either perpetuate or transform the order.</li>
          <li><strong>The Ship That Carries Away Evil → Ranni&apos;s Ending:</strong> Sailing away into the stars. The Age of Stars as a ship carrying away the old order entirely.</li>
          <li><strong>Godwyn as Scapegoat:</strong> The first demigod to die - but his death was USED. His body buried beneath the Erdtree, his death distributed through the land as deathroot. The scapegoat for an order that had abolished death.</li>
        </ul>

        <h3>Chapter 66: The External Soul</h3>
        <p>
          This chapter explains everything about how Elden Ring works mechanically. The soul can be stored
          OUTSIDE the body - in an egg, in a bird, in a tree, in a chest at the bottom of the sea - and as
          long as it&apos;s safe there, the person is immortal.
        </p>
        <ul>
          <li><strong>The Erdtree as Collective External Soul:</strong> The people of the Lands Between believe their souls return to the Erdtree on death - that&apos;s why the dead are buried in its roots. The tree is literally the External Soul of an entire civilization.</li>
          <li><strong>The Great Runes as Fragmented Souls:</strong> The demigods&apos; power is literally fragmented and stored in physical objects. When you take their rune, you take part of their soul/power.</li>
          <li><strong>The Elden Ring as External Soul:</strong> Marika&apos;s soul is the Elden Ring itself - shattered and distributed among her children.</li>
          <li><strong>Godwyn&apos;s Split Death:</strong> His soul died but his body lived, because in this cosmology soul and body can be separated. This is why Those Who Live in Death exist - souls that couldn&apos;t return to the tree properly.</li>
          <li><strong>&quot;In the egg is my heart&quot; → Nested Power:</strong> The Elden Ring was in Marika, who is in the Erdtree, which is grafted on the Great Tree, which draws from the Crucible. Runes within demigods within the order within the tree.</li>
          <li><strong>Koshchei the Deathless → The Demigods:</strong> &quot;My death is in an egg, in a duck, in a hare, in a chest, in the sea.&quot; They can be killed, but they don&apos;t die naturally - their external souls (runes) must be claimed.</li>
          <li><strong>The Hero Squeezes the Egg → Boss Fights and Remembrances:</strong> As you damage the demigod, you&apos;re really after their rune. Taking the Remembrance is taking the egg. Crushing it at the Roundtable gives you their power.</li>
        </ul>

        <h2>Summary: The Golden Bough Made Playable</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border-subtle)]">
              <th className="text-left py-2 pr-4">Golden Bough Concept</th>
              <th className="text-left py-2">Elden Ring Implementation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">The Priest at Nemi</td>
              <td className="py-2">Demigods guarding domains; Tarnished as challenger</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Kill the king while strong</td>
              <td className="py-2">Boss fights - claim runes before natural death</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">The runaway slave</td>
              <td className="py-2">Tarnished - exiled, graceless, returning to claim power</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Sacred Tree</td>
              <td className="py-2">The Erdtree</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Mistletoe as sacred parasite</td>
              <td className="py-2">Erdtree grafted on the Great Tree/Crucible</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Mistletoe on mistletoe (most sacred)</td>
              <td className="py-2">The Haligtree - Unalloyed Gold, second-order parasite</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Divine Marriage</td>
              <td className="py-2">Marika + Godfrey/Radagon; Tarnished becoming consort</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">King&apos;s health = land&apos;s health</td>
              <td className="py-2">The Shattering corrupts all regions</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Magician vs Priest</td>
              <td className="py-2">Sorceries (INT) vs Incantations (FTH)</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Magic → Religion → Science</td>
              <td className="py-2">Arcane (ARC) - &quot;secrets of the gods&quot; = empirical mastery</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Homeopathic Magic (like → like)</td>
              <td className="py-2">Greases, pots, spirit ashes, phantom sorceries</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Contagious Magic (contact persists)</td>
              <td className="py-2">Talismans, Great Runes, Ashes of War, grafting, deathroot</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Dying god (Adonis/Osiris)</td>
              <td className="py-2">Godwyn; the Tarnished dying and returning</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Eating the God (cannibalistic communion)</td>
              <td className="py-2">Remembrances consumed for power; runes as absorbed souls</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">The External Soul</td>
              <td className="py-2">Great Runes, Remembrances, shattered Elden Ring</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Saturn&apos;s Golden Age</td>
              <td className="py-2">The Golden Order - Marika as Saturn</td>
            </tr>
            <tr className="border-b border-[var(--border-subtle)]">
              <td className="py-2 pr-4">Scapegoat</td>
              <td className="py-2">Tarnished absorbing the land&apos;s corruption</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Age of Fracture</td>
              <td className="py-2">Default ending = the cycle continues</td>
            </tr>
          </tbody>
        </table>

        <h2>Shadow of the Erdtree: The Hidden Rites</h2>
        <p>
          The DLC reveals what the Golden Order buried - literally and mythologically. The Land of Shadow
          is Frazer&apos;s repressed sacred history made playable.
        </p>

        <h3>The Land of Shadow as the Underworld</h3>
        <p>
          In The Golden Bough, every sacred grove has its dark twin - the underworld, the land of the dead,
          the place where the goddess descends to find her dying consort. The Land of Shadow is this realm:
          hidden behind the Erdtree, accessible only through Miquella&apos;s dreaming body, containing the
          secrets Marika wanted buried.
        </p>
        <ul>
          <li><strong>Ishtar&apos;s Descent → Miquella&apos;s Journey:</strong> In the Tammuz myth, Ishtar descends to the underworld to retrieve her dead lover. Miquella descends into the Land of Shadow, shedding parts of himself at each step, to reach something - or someone - at the bottom.</li>
          <li><strong>The Katabasis:</strong> The Greek term for descent to the underworld. Orpheus descending for Eurydice. The Tarnished following Miquella&apos;s path downward, through increasingly dark and ancient places.</li>
        </ul>

        <h3>Messmer the Impaler: The Hidden Son</h3>
        <p>
          Frazer documents countless myths of the divine son who is hidden, exiled, or killed to protect
          the throne. Moses in the bulrushes. Oedipus exposed on the hillside. The dangerous prince whose
          existence threatens the current order.
        </p>
        <ul>
          <li><strong>The Exiled Prince:</strong> Messmer is Marika&apos;s son, hidden in the Land of Shadow, commanding the armies that purged the Hornsent. He is the secret history of the Golden Order - the violence that made it possible.</li>
          <li><strong>Fire as Purification:</strong> Frazer extensively documents fire festivals as rites of purification - burning away the old to make way for the new. Messmer&apos;s fire burned the old civilization to ash so Marika&apos;s order could rise.</li>
          <li><strong>The Son Who Must Die:</strong> Like Adonis, like Tammuz, Messmer is the divine son fated to die. The player kills him not to destroy the order but to uncover what it buried.</li>
        </ul>

        <h3>The Hornsent: The People Before</h3>
        <p>
          Frazer&apos;s work is fundamentally about what came before - the &quot;primitive&quot; practices that underlie
          civilized religion. The Hornsent are this: the civilization that existed before Marika, with their
          own sacred tree (the Scadutree), their own rituals, their own relationship to death and divinity.
        </p>
        <ul>
          <li><strong>The Conquered Sacred:</strong> When one religion conquers another, the old gods become demons. The Hornsent&apos;s practices - whatever they were - became abominations in the Golden Order&apos;s telling.</li>
          <li><strong>The Jar People:</strong> Frazer documents countless cultures that stored souls, spirits, or power in vessels. The jars of the Hornsent are external souls - containers for something sacred that the Golden Order found abhorrent.</li>
          <li><strong>Ritual Sacrifice:</strong> The Divine Beast Dancing Lion, the furnace golems, the shadow-realm&apos;s creatures - hints at what rites the Hornsent practiced, and why Marika sent Messmer to end them.</li>
        </ul>

        <h3>The Scadutree: The Shadow Tree</h3>
        <p>
          If the Erdtree is the sacred tree of Nemi, the Scadutree is its shadow - the dark twin, the
          inverse, the tree that holds what the golden tree cannot contain.
        </p>
        <ul>
          <li><strong>The Tree of Death:</strong> Frazer notes that sacred trees often come in pairs - one for life, one for death. The Scadutree is where souls go that the Erdtree rejects.</li>
          <li><strong>Scadutree Fragments:</strong> The blessing system of the DLC. You consume pieces of the shadow tree to grow stronger in this realm - just as the base game has you consume pieces of the golden order.</li>
          <li><strong>The Roots Go Deep:</strong> Both trees share roots. The shadow and the light are connected at the base. What Marika tried to separate was never truly separate.</li>
        </ul>

        <h3>Miquella&apos;s Apotheosis</h3>
        <p>
          The DLC&apos;s true subject is Miquella&apos;s attempt to become a god - not through the Greater Will&apos;s
          order, but through something else. This is Frazer&apos;s magician becoming king becoming god.
        </p>
        <ul>
          <li><strong>Shedding the Self:</strong> Miquella discards his body parts - his love, his charm, his gender, his past. Each thing shed is power gained. This is the ritual death that precedes divine rebirth.</li>
          <li><strong>The New Consort:</strong> Miquella chooses Radahn as his consort - brainwashing the demigod into serving as his vessel for divine marriage. The sacred marriage, but corrupted, forced, wrong.</li>
          <li><strong>The God That Failed:</strong> Like the Haligtree, Miquella&apos;s apotheosis fails. The player stops it. The new order - Miquella&apos;s kinder, gentler godhood - is aborted. The question the DLC leaves: was that a good thing?</li>
        </ul>

        <h3>St. Trina: The Feminine Divine</h3>
        <p>
          Frazer documents the goddess who is also the god - divine figures who cross or transcend gender,
          who contain both principles. Miquella/St. Trina is exactly this.
        </p>
        <ul>
          <li><strong>The Sleep Goddess:</strong> St. Trina brings sleep - the little death, the nightly descent to the underworld. Her lilies induce dreams. She is the liminal deity, existing between states.</li>
          <li><strong>The Androgyne:</strong> Frazer notes that many ancient deities were androgynous or able to shift gender. Miquella IS St. Trina - the beautiful boy is also the maiden of sleep. Two aspects of one divine principle.</li>
          <li><strong>The Goddess Who Is the God:</strong> Just as Marika IS Radagon, Miquella IS Trina. The pattern repeats. The divine in the Lands Between is always doubled, always containing its opposite.</li>
        </ul>

        <h3>DLC Summary: What Frazer Helps Us See</h3>
        <p>
          The DLC is the return of the repressed - Frazer&apos;s &quot;savage&quot; substratum breaking through the
          civilized surface. Everything Marika buried comes back: her hidden son, the people she
          exterminated, the shadow of her golden tree, the violence that founded her order. And at the
          center, her child Miquella trying to build something new on the same bloody foundations -
          and failing, because the cycle demands it.
        </p>
      </section>

    </div>
  );
}
