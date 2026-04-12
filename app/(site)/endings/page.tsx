import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Endings as Post-War Japan - Elden Ring Is The Large Glass',
  description: 'The endings of Elden Ring as allegory for post-war Japan, through Terayama, Ibsen, and Mishima',
};

export default function EndingsPage() {
  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-8 lg:p-12">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)] mb-4">Analysis</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-[var(--text-primary)] mb-4">
            Endings as Post-War Japan
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Elden Ring as allegory for post-war Japan. The endings read through Shuji Terayama, Henrik Ibsen, and Yukio Mishima.
          </p>
        </div>
      </section>

      {/* The Allegory */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">The Allegory</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The whole game is a giant allegory for what Japan was like after the Pacific War, where America had dominated the political landscape and culture, but there were still foreign influences (Outer Gods) that had footholds, if only minor ones in Japan, like communism.
          </p>
          <p>
            The Erdtree is literally grafted onto the Greattree that would normally be the world tree in a world like Dark Souls. It is a parasitic organism that imposes a form of peace and order in the Lands Between, at least before the Shattering—in the same way that America conquered Japan and grafted its system of government onto its existing society. The Japanese constitution is written in English.
          </p>
          <p>
            Also: <strong>Marika</strong> is pronounced like <strong>&apos;Merica</strong>.
          </p>
        </div>
      </section>

      {/* The Outer Gods */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">The Outer Gods as Foreign Ideologies</h2>
        <div className="prose prose-invert max-w-none">
          <p><strong>The Greater Will</strong> = America — dominant, the imposed order, the &quot;peace&quot; maintained through structural control.</p>
          <p><strong>Other Outer Gods:</strong></p>
          <ul>
            <li>Communism (USSR/China influence) — a minor foothold, dangerous, treated as existential threat</li>
            <li>The Frenzied Flame = total revolution, burn the system entirely</li>
            <li>The Rot = decay from within, what happens when the imposed order fails to deliver</li>
            <li>The Dark Moon (Ranni&apos;s path) = withdrawal, sovereignty, cutting ties with ALL outer influence</li>
          </ul>
          <p>
            The demigods aren&apos;t rebels—they&apos;re factions within the American-dominated political landscape fighting for control of the same colonial apparatus. LDP vs Socialist Party, but all operating within the post-war constitution written in English.
          </p>
        </div>
      </section>

      {/* The Frenzied Flame */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">The Frenzied Flame: The Temple of the Golden Pavilion</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The Frenzied Flame ending is a direct reference to <strong>The Temple of the Golden Pavilion</strong>. Frenzy is very similar to schizophrenia, and the motivation of the man who burned down the temple is eerily similar to the Erdtree—in that he viewed it as a giant golden edifice that had enslaved his ancestors and dominated his whole life.
          </p>
          <p>
            <strong>Hayashi Yoken</strong> — the young monk who burned Kinkaku-ji in 1950, right in the middle of the American occupation.
          </p>
          <h3>The Parallels</h3>
          <p><strong>The Golden Pavilion / The Erdtree:</strong></p>
          <ul>
            <li>Overwhelming golden beauty</li>
            <li>Ancient, sacred, dominant</li>
            <li>Not just a structure but an <em>ideal</em> that crushes those who live under it</li>
            <li>Its perfection is the problem</li>
          </ul>
          <p><strong>Mizoguchi / The Tarnished who chooses Frenzy:</strong></p>
          <ul>
            <li>Alienated, stuttering (Mizoguchi), graceless (Tarnished)</li>
            <li>Obsessed with the beautiful thing that excludes them</li>
            <li>The structure has dominated their entire existence</li>
            <li>The only liberation is total destruction</li>
          </ul>
          <p><strong>The Madness:</strong></p>
          <p>
            Mishima writes Mizoguchi&apos;s act as emerging from a kind of psychotic break. The Frenzied Flame requires embracing the Three Fingers, losing yourself to chaos. It&apos;s not rational political action—it&apos;s the schizophrenic solution. When reform is impossible, when working within the system only perpetuates it, burning becomes the only authentic act.
          </p>
          <p>
            1950 — Japan under occupation, a monk burns the most beautiful thing in his world because he can&apos;t live under its shadow anymore.
          </p>
          <p><strong>The Frenzied Flame ending isn&apos;t evil. It&apos;s Hayashi Yoken&apos;s view.</strong></p>
        </div>
      </section>

      {/* Godfrey = Mishima */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Godfrey = Mishima</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            <strong>Godfrey</strong> represents <strong>Yukio Mishima</strong> — not the Frenzied Flame arsonist, but a different figure entirely.
          </p>
          <ul>
            <li>The warrior who served the system</li>
            <li>Exiled when his martial purpose was no longer needed</li>
            <li>Returns to reclaim power through strength</li>
            <li>Sheds his &quot;civilized&quot; name (Godfrey → Hoarah Loux) to become the primal warrior again</li>
            <li>Wants to <em>restore</em> through force, not destroy</li>
            <li>The nationalist who believed Japan lost its way, who formed his militia, who tried the coup</li>
          </ul>
          <p>
            Godfrey was made into a lord to serve Marika&apos;s order. When the conquering was done, the warrior was cast out. He returns believing he can reclaim it through combat—the martial spirit reasserting itself.
          </p>
          <p>
            Mishima believed post-war Japan had been spiritually neutered. He built his body, formed the Shield Society, tried to inspire restoration of the Emperor&apos;s divine status. When it failed, he returned to his &quot;primal&quot; identity through seppuku.
          </p>
          <p>
            Godfrey&apos;s boss fight—he literally tears off the golden regalia and becomes Hoarah Loux. The civilized mask falls. The barbarian underneath.
          </p>
        </div>
      </section>

      {/* The Dung Eater */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">The Dung Eater: Kegare and the Invisible Minority</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The Dung Eater&apos;s ending represents Japan&apos;s invisible minority and their cultural paranoia about impurity.
          </p>
          <h3>Kegare (穢れ)</h3>
          <p>
            Ritual impurity in Shinto belief. Not moral evil, but <em>contamination</em>. It comes from contact with death, blood, disease, childbirth, certain animals, certain occupations.
          </p>
          <p>
            Kegare is contagious. It spreads through contact, through lineage, through association. You can be purified through ritual (harae), but some forms of kegare were considered permanent—especially occupational kegare tied to bloodlines.
          </p>
          <p>
            The <strong>Burakumin</strong> were considered permanently kegare because their ancestors handled death (executioners, corpse handlers) or animal slaughter (butchers, tanners, leather workers). Even generations later, with no connection to those trades, the <em>ancestral contamination</em> followed them through family registries.
          </p>
          <h3>The Mending Rune of the Fell Curse</h3>
          <blockquote>
            &quot;Loathsome rune gestated by the Dung Eater. Used to restore the fractured Elden Ring when brandished by the Elden Lord. The reviled curse will last eternally, and the world&apos;s children, grandchildren, and every generation hence, will be its pustules. <strong>If Order is defiled entirely, defilement is defilement no more, and for every curse, a cursed blessing.</strong>&quot;
          </blockquote>
          <h3>The Ending Narration</h3>
          <blockquote>
            &quot;Our seed will look back upon us, and recall. The reviled curse that defined our age. The Blessing of Despair.&quot;
          </blockquote>
          <p>
            <strong>&quot;If Order is defiled entirely, defilement is defilement no more.&quot;</strong>
          </p>
          <p>
            That&apos;s the Burakumin logic exactly. The category of impurity only exists in relation to purity. If everyone is defiled—children, grandchildren, every generation—the distinction collapses. Kegare loses meaning when there&apos;s no clean to compare it to.
          </p>
          <p>
            &quot;For every curse, a cursed blessing.&quot; The taint becomes inheritance becomes identity becomes universal. Not liberation <em>from</em> the curse, but liberation <em>through</em> universalizing it.
          </p>
        </div>
      </section>

      {/* Ranni */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Ranni: A Doll&apos;s House</h2>
        <div className="prose prose-invert max-w-none">
          <h3>Terayama&apos;s Critique of Nora</h3>
          <p>
            Shuji Terayama wrote an essay making fun of the play <em>A Doll&apos;s House</em>, talking about how the main character walks out into the cold dark night into fear and doubt and loneliness believing that this will mean she is free, when before she had only been a doll for her father and then her husband. Terayama points out that she lives in a society where as a woman she can&apos;t even take out a line of credit and posits that she would likely have become a whore. She would still be a doll to men, but men who would care about her far less than her husband.
          </p>
          <h3>Ranni&apos;s Ending</h3>
          <blockquote>
            &quot;Mine will be an order not of gold, but the stars and moon of the chill night. I would keep them far from the earth beneath our feet. As it is now, life, and souls, and order are bound tightly together, but I would have them at a great remove. And have the certainties of sight, emotion, faith, and touch... All become impossibilities. Which is why I would abandon this soil, with mine order.&quot;
          </blockquote>
          <blockquote>
            &quot;Now cometh the age of the stars. A thousand year voyage under the wisdom of the Moon. Here beginneth the chill night that encompasses all, reaching the great beyond. Into fear, doubt, and loneliness... As the path stretcheth into darkness... My fair consort, eternal.&quot;
          </blockquote>
          <p>
            She names them explicitly: fear, doubt, loneliness, darkness. She&apos;s not blind to them. She believes they ARE freedom. That the absence of certainty—of sight, emotion, faith, touch—is what liberation feels like.
          </p>
          <ul>
            <li>No gods to guide you means fear.</li>
            <li>No order to structure you means doubt.</li>
            <li>No grace to connect you means loneliness.</li>
          </ul>
          <p>
            And she thinks that&apos;s <em>good</em>. The suffering is the proof that you&apos;re finally free. If it doesn&apos;t hurt, you&apos;re still a doll.
          </p>
          <h3>The Parallel</h3>
          <p>
            <strong>Nora</strong> walks out into the cold. Her children stay with the man she can&apos;t stand.
          </p>
          <p>
            <strong>Ranni</strong> walks out with her order. The Lands Between stays with... nothing. An impossible remove.
          </p>
          <p>
            Both frame abandonment as self-actualization. Both leave dependents to suffer the consequences of their &quot;freedom.&quot; Both get romanticized by people who don&apos;t want to see the selfishness at the core.
          </p>
          <p>
            This is why people twist themselves into knots trying to make her not be selfish. Nora literally abandons her children in the care of a man she can&apos;t stand to be with a moment longer. Ranni abandons the Lands Between, saying that the order will be at an impossible remove.
          </p>
          <h3>She Is Literally a Doll</h3>
          <p>
            Ranni killed her original flesh to escape her lineage—Marika&apos;s bloodline, the Golden Order&apos;s claim on her. She chose to become a puppet. A doll.
          </p>
          <p>
            And then she walks out into the cold dark night, into fear and loneliness, believing she&apos;s finally free.
          </p>
          <p>
            Terayama&apos;s Nora escaped being a doll for her father and husband... by becoming a doll for the streets.
          </p>
          <p>
            Ranni escaped being a vessel for the Greater Will... by becoming a literal doll who abandons everyone.
          </p>
          <p>
            FromSoft made the reference explicit. She <em>is</em> the doll. The doll who thinks walking out makes her not a doll anymore.
          </p>
          <h3>True Believer</h3>
          <p>
            She honestly believes she is doing the right thing. That&apos;s what makes it tragic, not villainous.
          </p>
          <p>
            Nora isn&apos;t evil. She genuinely believes leaving is the only moral choice. She can&apos;t be a real mother while she&apos;s still a doll—so she has to go, find herself, become real. She walks out believing she&apos;s doing the hard right thing.
          </p>
          <p>
            Ranni is the same. She genuinely believes removing the Order is liberation. That making sight, emotion, faith, and touch into impossibilities will free people from the Greater Will&apos;s grip. She&apos;s not malicious. She&apos;s earnest.
          </p>
          <p>
            True believers are more dangerous than cynics. Cynics know what they&apos;re doing. True believers walk into the snow and call it spring.
          </p>
          <h3>The Time Machine</h3>
          <p>
            There&apos;s another dimension to Ranni&apos;s doll body, one that connects to Alfred Jarry&apos;s pataphysics. In Jarry&apos;s &quot;How to Construct a Time Machine,&quot; the device works by isolating the body from duration—a &quot;machine of absolute rest&quot; that moves forward in time first, then backward.
          </p>
          <p>
            Ranni&apos;s doll is modeled after the <strong>Snow Witch</strong> who taught her. Not a random form—a specific vessel, inherited from her teacher. This is the pataphysical machine: by killing her flesh and becoming a doll, Ranni removed herself from the normal flow of life and death that the Golden Order governs. She isolated herself from duration.
          </p>
          <p>
            Her ending involves &quot;a thousand year voyage under the wisdom of the Moon.&quot; Time on a cosmic scale. The machine doesn&apos;t just walk out into the cold—it moves <em>through</em> time in ways flesh cannot.
          </p>
          <p>
            If Jarry&apos;s machine goes forward then backward, Ranni could have set events in motion that span eons in both directions. The Snow Witch teaching Ranni the cold sorceries. Ranni becoming the Snow Witch&apos;s form. The form continuing into the thousand-year voyage. Past and future wrapped in the same mechanism.
          </p>
          <p>
            The doll isn&apos;t just a puppet escaping her strings. It&apos;s a temporal vessel—a sieve that falls through reality and encounters itself on the other side. Ranni the doll teaching Ranni the girl to become Ranni the doll.
          </p>
          <p>
            This is what makes her confidence so unshakable. She&apos;s not guessing that her plan will work. She&apos;s already lived it, from inside a machine of absolute rest.
          </p>
        </div>
      </section>

      {/* Vessels */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Vessels: The Strumpet and the Saint</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            The Nora becoming a whore is synonymous with the description of Marika being a strumpet and whatever term was used to describe Melina as a potential vessel for the Rot God. This also parallels to how in Bloodborne the Outer God chooses a whore over the saint who had been groomed to be a vessel.
          </p>
          <p>
            <strong>Bloodborne:</strong> Oedon chooses Arianna the prostitute over Adella the saint. The Church groomed their nun, prepared her as the pure vessel. The Outer God picked the whore instead.
          </p>
          <p>
            <strong>Elden Ring:</strong> Marika is called a strumpet. Melina is positioned as potential vessel for the Rot. The Golden Order has its categories of purity, its proper succession, its groomed saints—but the Outer Gods don&apos;t care.
          </p>
          <p>
            The Outer Gods don&apos;t respect the hierarchy. The carefully prepared saint, the proper vessel, the pure lineage—passed over. The strumpet gets chosen. The whore becomes the mother of gods.
          </p>
          <h3>The Key</h3>
          <p>
            It&apos;s not that the Order&apos;s purity obsession is &quot;cope.&quot; It&apos;s that <strong>willingness to be a vessel is what allows it</strong>.
          </p>
          <p>
            The saint is groomed, prepared, trained—but that preparation is about control, about shaping the vessel to the Order&apos;s specifications. It&apos;s conditional willingness. Willingness to be what <em>they</em> want.
          </p>
          <p>
            The whore is already willing. Already open. Already practices being a vessel. Not pure, but <em>receptive</em>. The disposition is there—not because she&apos;s been shaped for it, but because she&apos;s chosen it.
          </p>
          <p>
            The Outer God doesn&apos;t care about the purity. It cares about the willingness to receive. The saint resists even as she submits—her purity is a kind of guard. The strumpet has no guard.
          </p>
          <p>
            Marika was willing. That&apos;s why she was chosen. Her strumpetry wasn&apos;t a flaw the Greater Will overlooked—it was the qualification.
          </p>
        </div>
      </section>

      {/* Heretics */}
      <section className="glass-card border border-[var(--border-subtle)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Terayama&apos;s Heretics</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            This parallels to Shuji Terayama&apos;s play <em>Heretics</em> (Jashumon), where it is revealed that the various characters are being controlled by other characters by strings, who are also in turn being controlled by strings. The main character realizes that to cut the strings would mean to remove his own power to move, so in the climax of the play, he instead pulls on the invisible strings and begins wrapping himself in them.
          </p>
          <h3>Two Responses to the Strings</h3>
          <p>
            <strong>Ranni&apos;s logic:</strong> The strings control me. I will cut the strings. I accept that this means I cannot move. Paralysis is freedom.
          </p>
          <p>
            <strong>Heretics&apos; logic:</strong> The strings control me. The strings also allow me to move. Cutting them cuts my own power. So instead—pull them. Wrap them around myself. Make the entanglement so total that there&apos;s no distinction between puppet and string.
          </p>
          <p>
            Ranni walks into the cold. Empty. Free in the sense of being nothing.
          </p>
          <p>
            The Heretics protagonist wraps himself in the strings until he <em>is</em> the strings. Not free from control—free <em>through</em> total enmeshment. The puppet who becomes the mechanism itself.
          </p>
        </div>
      </section>

      {/* Goldmask */}
      <section className="glass-card border border-[var(--border-emphasis)] bg-gradient-to-b from-[rgb(var(--bg-secondary-rgb)/0.9)] to-[rgb(var(--bg-secondary-rgb)/0.6)] p-6">
        <h2 className="font-serif text-2xl text-[var(--text-primary)] mb-4">Goldmask: The Only Good Ending</h2>
        <div className="prose prose-invert max-w-none">
          <p>
            Goldmask is the Heretics ending. He&apos;s the version of Nora that realizes that she actually had a really good life and she can never be not under the influence of someone&apos;s power. It&apos;s impossible.
          </p>
          <p>
            He stands there, arms outstretched, wrapped in contemplation of the Golden Order. Doesn&apos;t speak. Doesn&apos;t move. Just studies. Becomes the study.
          </p>
          <p>
            His ending—the <strong>Age of Perfect Order</strong>—doesn&apos;t reject the strings. It perfects them. The flaw wasn&apos;t the Order itself, it was the gods&apos; fickleness. Marika&apos;s betrayal. The puppeteer&apos;s weakness.
          </p>
          <p>
            Goldmask&apos;s solution: wrap yourself so completely in the logic of the Order that you can fix it from within. Remove the gods&apos; caprice but keep the structure. Let the strings run themselves.
          </p>
          <ul>
            <li>He doesn&apos;t cut the strings like Ranni.</li>
            <li>He doesn&apos;t burn it all like the Frenzied Flame.</li>
            <li>He doesn&apos;t curse everyone like the Dung Eater.</li>
          </ul>
          <p>
            He pulls the strings tighter and tighter through pure contemplation until he understands them completely, then removes the flawed puppeteer (the gods) and lets the mechanism operate on its own.
          </p>
          <p>
            His posture is the image: arms out, crucified on his own understanding, wrapped in golden light, silent. He became the strings.
          </p>
          <h3>The Nora Who Stayed</h3>
          <p>
            Goldmask is the Nora who doesn&apos;t leave.
          </p>
          <p>
            She looks at the door. She looks at the cold. She looks back at her house—flawed, yes. Her husband is imperfect. The structure made her a doll. But...
          </p>
          <p>
            She had a roof. She had her children. She was <em>cared for</em>, even if imperfectly. The alternative isn&apos;t freedom—it&apos;s the street, it&apos;s whoring, it&apos;s still being under someone&apos;s power except now they don&apos;t even pretend to love her.
          </p>
          <p>
            Goldmask looks at the Golden Order—parasitic, grafted, imposed. But functional. People live under it. The alternative isn&apos;t freedom—it&apos;s the Outer Gods, it&apos;s chaos, it&apos;s still being under something&apos;s power except now there&apos;s no structure at all.
          </p>
          <p>
            His realization: <em>You can never not be under someone&apos;s power.</em> That&apos;s the human condition. Puppet strings all the way up. The question isn&apos;t how to escape—escape is impossible. The question is how to make the strings work better.
          </p>
          <p>
            So he doesn&apos;t leave. He stays. He studies. He finds the flaw—not the Order, but the gods&apos; fickleness—and removes <em>that</em>. Keep the house, remove the caprice, let the structure run clean.
          </p>
          <h3>Why It&apos;s the Only Good Ending</h3>
          <ul>
            <li>Ranni abandons everyone and calls it freedom.</li>
            <li>Frenzied Flame destroys everything and calls it liberation.</li>
            <li>Dung Eater curses everyone and calls it equality.</li>
            <li>Default Elden Lord just... continues the broken system.</li>
          </ul>
          <p>
            <strong>Goldmask is the only one who actually fixes something.</strong>
          </p>
          <p>
            He accepts reality:
          </p>
          <ul>
            <li>Power structures are inevitable</li>
            <li>You cannot escape being under someone&apos;s influence</li>
            <li>The Order itself isn&apos;t evil—the gods&apos; caprice is</li>
            <li>Liberation is a fantasy that leads to the cold</li>
          </ul>
          <p>
            So he doesn&apos;t run. He doesn&apos;t burn. He doesn&apos;t curse. He perfects.
          </p>
          <p>
            In the post-war Japan frame: Goldmask is the pragmatist who says &quot;Yes, the American system was imposed. Yes, it&apos;s foreign. But it works. The problem isn&apos;t the constitution—it&apos;s the corrupt politicians, the capricious leaders. Remove the caprice, keep the structure, make it run clean.&quot;
          </p>
          <p>
            He&apos;s the only one who loves the Lands Between enough to stay and do the work. Everyone else is too busy with their grand gestures—walking into snow, burning golden pavilions, spreading curses.
          </p>
          <p>
            Goldmask just stands there. Studies. Understands. Fixes.
          </p>
          <p>
            <strong>The silent one got it right.</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
