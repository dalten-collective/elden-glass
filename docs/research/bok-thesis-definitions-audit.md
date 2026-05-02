# Bök Thesis Definition Mining Audit

Source: `development/sandbox/pataphor-nick-rlm-package-conformance/sources/bok-pataphysics-thesis.txt`

This report mines Christian Bök's 1997 dissertation, _'Pataphysics: The Poetics of an Imaginary Science_, for definition-like passages relevant to the Elden Glass title-card system. The OCR is noisy, so the list below is an editorial audit aid rather than an automatically authoritative glossary.

## Extraction summary

- Raw definition-like candidates found: 109
- Pataphysics-relevant candidates retained below: 97
- Search patterns used: `is a/an/the`, `are a/an/the`, `refers to`, `called`, `calls`, `defined as`, `definition of`.
- Coverage is checked against `data/title-cards.json` by title, term, aliases, and description text.

## Editorial shortlist: definitions worth checking against title cards

These are the cleanest definition passages found after multiple searches through the OCR text. They should be treated as the practical working list for title-card coverage.

| Term                  | Thesis definition / normalized wording                                                                                                                                                                                    | Current card status                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 'Pataphysics          | A supplement to metaphysics that studies cases not of conception but of exception: variance/anomalos, alliance/syzygia, and deviance/clinamen. Also named as the science of imaginary solutions and arbitrary exceptions. | Covered by `'Pataphysics`, `Imaginary Solutions`, `The Exception`, `Anomalos`, `Syzygia`, `Clinamen`.        |
| Imaginary solution    | Jarry's name for the anti-philosophical practice of mistaking possibilities for veritabilities, explaining a supplementary universe through arbitrary exceptions.                                                         | Covered by `Imaginary Solutions` and `Science of Imaginary Solutions`.                                       |
| Anomalos              | The first declension of exception: variance, the anomaly of aporia, the repressed part of a rule that ensures the rule does not work.                                                                                     | Covered by `Anomalos (Bök: Variance)` and `Anomaly`.                                                         |
| Syzygia / Syzygy      | The second declension of exception: alliance, the syzygy of chiasm. Normally a celestial alignment; in Bök/Jarry, a conjunction that is neither united nor parted for more than an instant.                               | Covered by `Syzygia (Bök: Alliance)` and Syzygy cards.                                                       |
| Clinamen              | The third declension of exception: deviance, the swerve, the smallest possible aberration that can make the greatest potential difference.                                                                                | Covered by Clinamen cards.                                                                                   |
| Royal science         | A standardized metaphysics deployed by the state in clathrate/Cartesian space, putting truth to work for solid instrumental imperatives, law and order.                                                                   | Covered by `Royal Science`.                                                                                  |
| Nomad science         | A bastardized metaphysics deployed against the state in aggregate/Riemannian space, putting truth at risk through fluid experimental operatives, trial and error.                                                         | Covered by `Nomad Science`.                                                                                  |
| Paradigm              | A nomic language-game that proves/improves its consistency and efficiency by solving problems and revoking anomaly for the sake of the normal and known.                                                                  | Covered by `Paradigm`.                                                                                       |
| Paralogy              | A ludic language-game that approves/proves its inconsistency and inefficiency by convolving problems and invoking anomaly for the abnormal and unknown.                                                                   | Covered by `Paralogy`.                                                                                       |
| Poetic wisdom         | Vico's credible impossibility, an error that demands belief and can provide the premise for a new science.                                                                                                                | Covered by `Poetic Wisdom`.                                                                                  |
| Philosophy of as if   | Vaihinger's formulation: science for a quasi/pseudo reality that mistakes possibilities for veritabilities.                                                                                                               | Not yet a direct title card. Candidate if expanding Bök science/philosophy coverage.                         |
| Ethernity             | Jarry's NOWHERE/SOMEWHERE, an interzone where signs conjure the real through the ur of simulation.                                                                                                                        | Covered by Ethernity cards, but the Bök-specific “ur of simulation” angle may deserve an alias or expansion. |
| Ur                    | Borges/Bök term for an ectype without prototype, an object produced by suggestion or hope.                                                                                                                                | Not yet a direct title card. Strong candidate.                                                               |
| Bachelor machine      | A deviant/desiring machine, an erotic anti-reproductive device, an erotic form of Malthusianism.                                                                                                                          | Covered by `Bachelor Machine` and related bachelor-machine cards.                                            |
| Compars               | Deleuze/Guattari term: a quantal geometry of position, the monadic atomicum/stomicum.                                                                                                                                     | Not yet a direct title card. Candidate only if the nomad-science layer matters.                              |
| Dispars               | Deleuze/Guattari term: a fractal geometry of momentum, the nomadic clinamen.                                                                                                                                              | Not yet a direct title card. Candidate only if the nomad-science layer matters.                              |
| Anoulipism            | Le Lionnais's analysis of past constraints.                                                                                                                                                                               | Covered by `Anoulipism (Vocabulary)`.                                                                        |
| Synthoulipism         | Le Lionnais's synthesis of future potential constraints.                                                                                                                                                                  | Covered by `Synthoulipism`.                                                                                  |
| Oulipo                | Ouvroir de littérature potentielle: workshop of potential literature, preferring collective potential over individual experimental product.                                                                               | Covered by Oulipo cards.                                                                                     |
| Canadian "Pataphysics | Canadian double-apostrophe Pataphysics, quoting European 'Pataphysics while parodying Canadian autonomy and European hegemony.                                                                                            | Covered by `Canadian "Pataphysics`, but may benefit from Bök source metadata.                                |
| Rational geomancy     | TRG term for reorganizing literary energy patterns, treating interpretation as a system of alignment.                                                                                                                     | Not yet a direct title card. Candidate for Canadian "Pataphysics expansion.                                  |
| Psychopaleontology    | Truhlar's theory that societies unconsciously determine biological destinies through the procreative force of their languages.                                                                                            | Not yet a direct title card. Candidate for Canadian "Pataphysics expansion.                                  |
| Probable systems      | bpNichol's “probe-able” systems: preliminary experiments for a possible science, probable because they can be probed rather than proven.                                                                                  | Covered indirectly by `Probable Systems`; may need expansion.                                                |
| Lucid writing         | Bök's term for exploratory reflexivity of pattern, modeled on lucid dreaming, not transparent message transmission.                                                                                                       | Covered by `Lucid Writing`.                                                                                  |
| Stratification        | A royal process of capture arranging disparate parts into large-scale orders of solidity, subject to nomad deterritorialization.                                                                                          | Not yet a direct title card. Candidate only if Deleuze/Guattari substrate is needed.                         |

## High-confidence definitions and title-card coverage

|  Line | Candidate term                                           | Extracted definition/passsage                                                                                                                                                                                                                                        | Existing title-card coverage                                                                                                                                                                   |
| ----: | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    95 | The Poetics of an Imaainarv Science                      | survey that attempts to describe a hypothetic philosophp- the avant-garde pseudo-science imagined by Alfred Jarry.                                                                                                                                                   | pata-nowlege (Nowlege)<br>pata-vocab-b4-hypothetics (Hypothetics)<br>pata-vocab-b2-notation (Notation)<br>pata-vocab-bok-paradigm (Paradigm)                                                   |
|    99 | 'Pataphysics                                             | supplement to metaphysics, accenting it, then replacing it, in order to create a philosophic alternative, whose discipline can study cases, not of conception, but of exception: variance (anomalos), alliance (syzygia), and deviance (clinamen).                   | pata-pataphysics ('Pataphysics)<br>pata-spiral (The Spiral)<br>pata-clinamen (Clinamen (Core Thesis))<br>pata-syzygy (Syzygy (Core Thesis))                                                    |
|   274 | jurassic" no longer seems wholly absurd                  | since w e can now imagine a futuristic apocalypse, in which cloning might allow a human tu coexist with a resurrected tyrannosaur-j u s t as cinema has cloned the image of an actual thespian and spliced it with the image of an unreal sauropod).                 | **No direct card hit**                                                                                                                                                                         |
|   485 | lucifuaus                                                | hoax, while the Meaaloponera foetens is a fact, "[tlhe Jurassic infects its visitor with doubts-little curlicues of misgiving--that proceed to infest all[ .                                                                                                         | **No direct card hit**                                                                                                                                                                         |
|   669 | metaphysics                                              | branch of fantastic literature" ( 1 4 ) , the narrator of this fantasy pretends to believe in such an imaginary philosophy, quoting fictitious references to it i n gazettes and treatises.                                                                          | pata-tautology (Tautology)<br>pata-intraphysics (Intraphysics (Core Concept))<br>pata-quantum-pataphysics (Quantum Pataphysics)<br>pata-the-exception (The Exception)                          |
|   698 | by the name of '~ataahssics                              | the science of imaginary solutions and arbitrary exceptions ( 1 9 6 5 : 1 9 2 ) .                                                                                                                                                                                    | 61ca4aa454259 (Glintstone Dragon Adula)<br>2b96779d95062 (Glintstone Dragon Smarag)<br>98555aad800b5 (Roderika)<br>5c11d28f98b6b (Roderika, Spirit Tuner)                                      |
|   725 | a "philosophy of as if                                   | xvii), w i l f u l l y mistaking possibilities for veritabilities.                                                                                                                                                                                                   | **No direct card hit**                                                                                                                                                                         |
|  1077 | 'pataphysical enterprises that do not                    | the tradition of Jarry, but nevertheless represent some of the exceptions to the genealogy that this survey posits.                                                                                                                                                  | **No direct card hit**                                                                                                                                                                         |
|  1239 | Metaphysics                                              | supreme ruse because it makes us believe in t h e true; 'pataphysics is a superior ruse because it lets us pretend to be untrue.                                                                                                                                     | pata-tautology (Tautology)<br>pata-intraphysics (Intraphysics (Core Concept))<br>pata-quantum-pataphysics (Quantum Pataphysics)<br>pata-the-exception (The Exception)                          |
|  1370 | royal science                                            | standardized metaphysics: A it is deployed by the state throughout a clathrate, Cartesian space, putting truth to work on behalf of solid, instrumental imperatives ( l a w and order).                                                                              | pata-vocab-bok-royal-science (Royal Science)<br>pata-vocab-bok-nomad-science (Nomad Science)                                                                                                   |
|  1381 | A nomad science                                          | it is deployed against the state throughout an aggregate, Riemannian space, putting truth & risk on behalf of fluid, experimental operatives (trial and error).                                                                                                      | pata-vocab-bok-royal-science (Royal Science)<br>pata-vocab-bok-nomad-science (Nomad Science)                                                                                                   |
|  1398 | a paradigm                                               | 1970:10), a nomic language-game that must systematically (im)prove its own consistency and efficiency by solving problems, yevokinfi anomsly for the sake of what 16 is normal and known.                                                                            | pata-vocab-bok-paradigm (Paradigm)                                                                                                                                                             |
|  1411 | a p a r a l o ~                                          | ~ a ludic language-game that must systematically (ap)prove its own inconsistency and inefficiency by convolving problems, invokinq anomaly for the sake of what is abnormal and unknown.                                                                             | **No direct card hit**                                                                                                                                                                         |
|  1515 | Science                                                  | complex tissue o f hybrid tensions, its metaphors not only reflectinq each other, but also refracting each other.                                                                                                                                                    | gamic-allegory (Gamic Allegory / Other Act)<br>pata-sensism (Sensism / Sensist)<br>pata-pataphysics ('Pataphysics)<br>pata-epiphenomena (Epiphenomena)                                         |
|  1528 | science                                                  | bricolage of figures, an assemblage of devices, none of which fit together perfectly--but unlike poetry, science must nevertheless subject its tropes to a system, whose imperatives of both verity and reality normally forbid any willing suspension o f disbel... | gamic-allegory (Gamic Allegory / Other Act)<br>pata-sensism (Sensism / Sensist)<br>pata-pataphysics ('Pataphysics)<br>pata-epiphenomena (Epiphenomena)                                         |
|  1740 | that is required of it                                   | possibility of talking about it" (40).                                                                                                                                                                                                                               | 7a211e82991ab (Hoslow's Petal Whip)<br>pata-gidouille (Gidouille (Core Object))<br>pata-vocab-b1-gidouille (Gidouille (Vocabulary))                                                            |
|  2131 | The poetry literally                                     | botanic garden, in which germinates the romantic metaphor that poetry is organic.                                                                                                                                                                                    | pata-caesura (Caesura)<br>pata-pataquericals (Pataquericals)<br>pata-vocab-b4-combinatorialism (Combinatorialism)<br>pata-vocab-b4-cent-mille-milliards (Cent Mille Milliards de Poèmes)       |
|  2465 | Science                                                  | tautological extravagance, for which Ubu, "a figure of genius, r e p l e t e with that which has absorbed everything, transgressed everything, [.                                                                                                                    | gamic-allegory (Gamic Allegory / Other Act)<br>pata-sensism (Sensism / Sensist)<br>pata-pataphysics ('Pataphysics)<br>pata-epiphenomena (Epiphenomena)                                         |
|  2521 | that t h e poet                                          | 'makerY--active," inventing the world post facto while observing the world a priori (301).                                                                                                                                                                           | pata-nowlege (Nowlege)<br>pata-analogical-thought (Analogical Thought)<br>pata-caesura (Caesura)<br>pata-pataquericals (Pataquericals)                                                         |
|  2765 | u h n writes that "a p a r a d i g i                     | criterion for choosing problems that, while the paradigm is t a k e n for granted, can be assumed to have solutions" (1970:37).                                                                                                                                      | pata-analogical-thought (Analogical Thought)<br>pata-caesura (Caesura)                                                                                                                         |
|  2782 | uovo scienza                                             | poetic wisdom that might study poetic wisdom (and t h u s such a science almost appears to preempt 'pataphysics itself).                                                                                                                                             | pata-vocab-bok-poetic-wisdom (Poetic Wisdom)                                                                                                                                                   |
|  2789 | because nature                                           | inhuman creation, we can never know its truth; but unlike Jarry, Vico believes that, b e c a u s e culture is a human creation, we can know its truth.                                                                                                               | the-inexchangeable (The Inexchangeable)<br>pata-caesura (Caesura)                                                                                                                              |
|  2814 | t r u t h itself                                         | filth)-ohence, Ubu in the heraldic allegory of Caesar Antichrist performs a reverse alchemy, in which to rise above sin i s to fa11 from grace.                                                                                                                      | **No direct card hit**                                                                                                                                                                         |
|  3081 | science                                                  | n a l y s i s r a t h e r than literature, i s it not?" (Jarry:1989:106) " J o a n was guizzical, studied 'pataphysical science in the home, l a t e nights al1 alone with a test-tube.                                                                              | gamic-allegory (Gamic Allegory / Other Act)<br>pata-sensism (Sensism / Sensist)<br>pata-pataphysics ('Pataphysics)<br>pata-epiphenomena (Epiphenomena)                                         |
|  3094 | Tlhe mind                                                | ['lpataphysical camera[ Set the[.                                                                                                                                                                                                                                    | **No direct card hit**                                                                                                                                                                         |
|  3128 | 'pataphysics                                             | surrational perspective t h a t h s s had an extensive, yet f orgotten, influence upon the canonic history of radical poetics.                                                                                                                                       | pata-pataphysics ('Pataphysics)<br>pata-spiral (The Spiral)<br>pata-clinamen (Clinamen (Core Thesis))<br>pata-syzygy (Syzygy (Core Thesis))                                                    |
|  3170 | s i n c e even truth                                     | language-game that carr never efface its s t a t u a as a language-game.                                                                                                                                                                                             | pata-semantic-proliferation (Semantic Proliferation)                                                                                                                                           |
|  3385 | because 'pataphysics                                     | alleged science o f indifference, such a science can never support any political intention--unless it supports al1 of them.                                                                                                                                          | pata-clinamen (Clinamen (Core Thesis))<br>pata-syzygy (Syzygy (Core Thesis))<br>pata-imaginary-solutions (Imaginary Solutions)<br>pata-the-exception (The Exception)                           |
|  3575 | these                                                    | basis of al1 our judgments and ' knowledge ' ," absolutely no escape[ .                                                                                                                                                                                              | machinic-dispositif (Machinic Dispositif)<br>the-inexchangeable (The Inexchangeable)<br>seven-theses-countercinema (Seven Theses on Countercinema)<br>fafafe249df2b (Glintstone Scarab)        |
|  3812 | that the absurdity of tautology                          | A s Daumal avers, "['plataphysical arguments do not necessarily set up systems designed to demonstrate the truth of this or that proposition;" insteed, "[tlhey generally develop as vicîous circles and bring the human spirit to a limit-state of stupor and sc... | machinic-dispositif (Machinic Dispositif)<br>structural-homology (Structural Homology)<br>theory-of-pretending (Theory of Pretending)<br>5d08ab80d8688 (Elden Ring)                            |
|  3876 | that it                                                  | facade of a facade, behind which there is nothingW--only the black abyss of total doubt (Hale 145).                                                                                                                                                                  | 87a2e356ddf1e (Sacrificial Twig)<br>pata-the-sieve (The Sieve (Faustroll Object))<br>pata-gidouille (Gidouille (Core Object))<br>pata-the-scroll (The Scroll)                                  |
|  3883 | Ethernitv                                                | a "NOWHERE, or SOMEWHERE, which is the same thing" ( 1 9 6 5 : 248)--an interzone where the reference of a sign does not describe, but conjures, the existence of the real through the ur of simulation.                                                             | **No direct card hit**                                                                                                                                                                         |
|  3885 | which                                                    | same thing" ( 1 9 6 5 : 248)--an interzone where the reference of a sign does not describe, but conjures, the existence of the real through the ur of simulation.                                                                                                    | bachelor-machine-def (Bachelor Machine)<br>the-inexchangeable (The Inexchangeable)<br>control-allegory (Control Allegory)<br>cdb294c4d1671 (The Large Glass)                                   |
|  4079 | life                                                     | text that d i s p l a y s the grammar of flux and flow, language itself becomes an absurd vessel--a sieve of words, set adrift upon the oceanic surface of a protean reality.                                                                                        | the-inexchangeable (The Inexchangeable)<br>control-allegory (Control Allegory)<br>686128d9fa97c (Asimi, Eternal King)<br>d6863629fa4a7 (Fractured Marika)                                      |
|  4236 | d r o p l e t                                            | m e t a p h o r for the eye i t s e l f , a f l u i d s p h e r e , an " o v o i d m y o p i a , " whose l e n s d o e s n o t inspect t h e real so much as d i s t o r t i t , e a c h drop " d r a w i n g a l o n g b e n e a t h it t h e image of t h e t a... | **No direct card hit**                                                                                                                                                                         |
|  4325 | The anomslos                                             | repressed part of a rule which ensures that the rule does not work.                                                                                                                                                                                                  | **No direct card hit**                                                                                                                                                                         |
|  4491 | s u c h anomaly                                          | t h e anomie of an e x c e s s , whose ambiguities t r a n s g r e s s the r u l e that divides identity f rom a l t e r i t y .                                                                                                                                     | **No direct card hit**                                                                                                                                                                         |
|  4518 | the anomalos                                             | infraction of a limit ( a difference in specie), but for 'pataphysics, the anomalos is an aberration 76 from a curve ( a difference in degree).                                                                                                                      | pata-anomaly (Anomaly)<br>pata-vocab-bok-anomalos (Anomalos (Bök: Variance))                                                                                                                   |
|  4528 | The anomalos                                             | "simple apparition" without tragedy Not criminalized, but relativized, it reveals t h f i t everything has the potential to be anomelous.                                                                                                                            | pata-anomaly (Anomaly)<br>pata-vocab-bok-anomalos (Anomalos (Bök: Variance))                                                                                                                   |
|  4542 | tlhe astral order in which we live                       | exception," whose situation and duration has made possible ''an exception o f exceptions: organic" (1974:168).                                                                                                                                                       | **No direct card hit**                                                                                                                                                                         |
|  4626 | The word "syzygy" normally                               | a celestial alignment of three planets, two of which are at the opposite antipodes of their orbit around a third.                                                                                                                                                    | beb85458c7c8b (Nox Swordstress Armor)<br>53c79ac40736e (Nox Swordstress Armor (Altered))<br>32af39bfa1031 (Nox Swordstress Crown)<br>0c9d9edbea1a3 (Nox Swordstress Crown (Altered))           |
|  4693 | Lyotard also                                             | this turning of a "bar which separates the this from the not-this" (1993:15) when he posits a linear device, whose stasis signifies a mandatory division, but whose motion activates an aleatory confusion.                                                          | **No direct card hit**                                                                                                                                                                         |
|  4706 | argue that the physicks-stick                            | crank-shaft for a timemachine, whose syzygy reveals that "there are neither nights nor days," neither systole nor diastole--no "pendulum movements" (1989:103), only this intense instant, atemporal and libidinal.                                                  | pata-retinal-painting (Retinal Painting (Reinterpreted))<br>pata-coition-glass-pane (Coition Through the Glass Pane)                                                                           |
|  4899 | The curve                                                | tangent to a d e s c e n t , but a tangent that defies al1 calculus since the curve is itself a tangent composed of nothing but tangents inf initum: ad the volute rhythm of a fractai contour.                                                                      | 2cf384ec8cb7a (Beast Clergyman)<br>86c4765fa621f (Beastman of Farum Azula)<br>467679becece8 (Beastman of Farum Azula (Greatsword))<br>69267d532825f (Beastman of Farum Azula (Throwing Knife)) |
|  4952 | clinamen                                                 | principal e l e m e n t o f homeorrhesis," not of homeostasis (1982:119).                                                                                                                                                                                            | pata-clinamen (Clinamen (Core Thesis))<br>pata-syzygy-surfer (Syzygy Surfer (Computing Concept))<br>pata-merdre (Merdre! (Core Term))<br>pata-two-laws (The Two Laws)                          |
|  5080 | in which the clinamen                                    | smallest, possible aberration that can make the greatest, potential difference.                                                                                                                                                                                      | bachelor-machine-def (Bachelor Machine)<br>the-inexchangeable (The Inexchangeable)<br>control-allegory (Control Allegory)<br>cdb294c4d1671 (The Large Glass)                                   |
|  5108 | for it                                                   | continuum, the stationing context, that is r e s e e n , and shaped i n t o t h e visionary; it is brought u p to the intensity of t h e crucial objects, which then 'fade' into it" (42).                                                                           | ba59a723d7127 (Regal Ancestor Spirit)<br>0f2ce640a1aee (Blue-Gold Kite Shield)<br>493462167372b (Candletree Wooden Shield)<br>b71ecb318bdb (Flame Crest Wooden Shield)                         |
|  5127 | tlhet the problem                                        | pseudo-problem in no way nullifies the p u r s u i t of a solution for t h e pursuit in itself will evince the problematic nature of both 'problem' and tsolution'" (1986:189).                                                                                      | **No direct card hit**                                                                                                                                                                         |
|  5269 | implies that truth                                       | sacred pharos, whose foundation rests upon a l e g a c y of both death and w a s t e , its faecal beacon attracting the b l i n d like flies t o the snare o f i t s church--a monument b u i l t upon the corpse of a comatose c o l o s s u s who takes, as a l... | **No direct card hit**                                                                                                                                                                         |
|  5310 | evolution                                                | Sisypheen task not for a humanity that must s o l v e the futile problems of the species, but for the divinity that must imagine m o r e c l e v e r problems for t h e species t o solve (1989:135-136).                                                            | the-inexchangeable (The Inexchangeable)<br>581623b64b37f (Crucible Feather Talisman)<br>815b70508d3de (Crucible Scale Talisman)<br>f26240ce12ed8 (Revolution of the bottle of Benedictine)     |
|  5366 | Science                                                  | superstition that vilifies theistic sentiment, but that nevertheless reifies theistic-ressentiment, substituting a love of what is usual (the banal), for a fear of what is unusual (the fatal).                                                                     | gamic-allegory (Gamic Allegory / Other Act)<br>pata-sensism (Sensism / Sensist)<br>pata-pataphysics ('Pataphysics)<br>pata-epiphenomena (Epiphenomena)                                         |
|  5489 | the Cornpars                                             | a quantal geometry of position--the monadic stomicum (1987: 369).                                                                                                                                                                                                    | **No direct card hit**                                                                                                                                                                         |
|  5495 | the Dispars                                              | a f r a c t a l geometry of momentum--the nomadic clinarnen (1987:370).                                                                                                                                                                                              | **No direct card hit**                                                                                                                                                                         |
|  5550 | there                                                    | laws of putting together letters-atoms to produce a text.                                                                                                                                                                                                            | the-inexchangeable (The Inexchangeable)<br>gamic-allegory (Gamic Allegory / Other Act)<br>312e27a0abecc (The Green Box)<br>a4040b7ce6716 (Alexander, Warrior Jar)                              |
|  5597 | There                                                    | complete ['jpataphysics of the object awaiting description here, a science of imaginary technical solutions.                                                                                                                                                         | the-inexchangeable (The Inexchangeable)<br>gamic-allegory (Gamic Allegory / Other Act)<br>312e27a0abecc (The Green Box)<br>a4040b7ce6716 (Alexander, Warrior Jar)                              |
|  5890 | but also rescinding the limit that                       | past (with ever less rnemory).                                                                                                                                                                                                                                       | theory-of-pretending (Theory of Pretending)<br>8a365ff37a44b (Marika's Scarseal)<br>b30341a611608 (Marika's Soreseal)<br>9662a11a664aa (Radagon's Scarseal)                                    |
|  6044 | war                                                      | s u ~ ~ l e m e nof t a marginal episteme, occurring wherever a royal science clashes with a nomad science ( 1 9 8 7 :355 ) : the former, building implements (which control energy through instrumental tasks); the latter, building srmaments (which unleash en... | industry-sanctioned-hacking (Industry Sanctioned Hacking)<br>5d08ab80d8688 (Elden Ring)<br>37675a93a3ae (Ash-of-War Scarab)<br>2779d07e9cb8b (Blue Cloth Cowl)                                 |
|  6182 | ilt                                                      | Accident that gives form to life, it is the Accident[ .                                                                                                                                                                                                              | 9926ed52cfc0f (Guilty Hood)<br>9f35beea86296 (Glass Shard)<br>264263ac1e915 (Miquella's Lily)<br>67acb2143f44b (Soap)                                                                          |
|  6268 | The Oedipal subject                                      | t o m i z e d and dispersed i n a traject r a t h e r than localized and c o a l e s c e d around an object.                                                                                                                                                         | **No direct card hit**                                                                                                                                                                         |
|  6288 | surprise and geometric splendor                          | thousand times more interesting[ .                                                                                                                                                                                                                                   | **No direct card hit**                                                                                                                                                                         |
|  6326 | bachelor machines                                        | " Deleuze and Guattari have called "desiring- machines" (1983:l)--deviant devices, whose e x t r a v a g a n c e evokes al1 t h e ecstatic tortures of s h o c k , noise, and speed.                                                                                 | bachelor-machine-def (Bachelor Machine)<br>machinic-dispositif (Machinic Dispositif)<br>the-inexchangeable (The Inexchangeable)<br>structural-homology (Structural Homology)                   |
|  6349 | the bachelor machine                                     | erotic form of malthusianism" insofar as the device perverts the values of functional repetition, opposing al1 forms of love that provide a n alibi for replicative engineering.                                                                                     | bachelor-machine-def (Bachelor Machine)<br>machinic-dispositif (Machinic Dispositif)<br>the-inexchangeable (The Inexchangeable)<br>structural-homology (Structural Homology)                   |
|  6462 | and Guattari insist                                      | non-Oedipal artifice: "[a] genuine consummation is achieved by t h e new machine, a pleasure that can be rightly called autoerotic, o r r a t h e r automatic: birth[ .                                                                                              | bachelor-machine-def (Bachelor Machine)<br>pata-celibate-machine (The Celibate Machine)<br>pata-vocab-bok-royal-science (Royal Science)<br>pata-vocab-bok-nomad-science (Nomad Science)        |
|  6467 | autoerotic                                               | o r r a t h e r automatic: birth[ .                                                                                                                                                                                                                                  | chocolate-grinder-no-1 (Chocolate Grinder, No. 1)                                                                                                                                              |
|  6641 | nloise                                                   | basic element of the 118 software of al1 our logic" (1995:7).                                                                                                                                                                                                        | **No direct card hit**                                                                                                                                                                         |
|  6919 | who                                                      | cadaver, c a n nevertheless pedal faster than e v e r , d e s p i t e having expired, so also d o e s science represent a vertiginous expenditure that thrives paradoxically upon its own decline.                                                                   | polyvalent-doing (Polyvalent Doing)<br>6ee1adcfc6691 (Marcel Duchamp)<br>a59f913a9e386 (Confessor Armor)<br>8d5f86bc91196 (Confessor Boots)                                                    |
|  7219 | in which poetry itself                                   | accidental instrument for a scientific experiment.                                                                                                                                                                                                                   | **No direct card hit**                                                                                                                                                                         |
|  7327 | planetary technology" since "it                          | culmination of metaphysics in technology that makes possible the overcoming of metaphysics, that is, ['Ipataphysics" (1997:93).                                                                                                                                      | **No direct card hit**                                                                                                                                                                         |
|  7428 | t j h e unconscious                                      | orphan, an atheist and a bachelor" (Carrouges 1975:19).                                                                                                                                                                                                              | **No direct card hit**                                                                                                                                                                         |
|  7439 | tlhere                                                   | adversary of Bachelor machination, conviction, another word for the concubinage of dissimilarst' ( 1990:49).                                                                                                                                                         | **No direct card hit**                                                                                                                                                                         |
|  7748 | the "universal artist                                    | " the kind of person who might breed sheep without wool so as to advance "speculative learning" (147).                                                                                                                                                               | pata-particular-irreducible (The Particular & The Irreducible)<br>pata-nepohumanism (Nepohumanism)<br>pata-vocab-b4-panalogy (Panalogy)                                                        |
|  7763 | h s ~ o t h e t i c s                                    | the nowhere science of Erewhon).                                                                                                                                                                                                                                     | **No direct card hit**                                                                                                                                                                         |
|  7974 | anoulipism                                               | the analysis of a past constraint) may inspire 147 what Lionnais calls synthouli~ism (the synthesis of a future potentia1)--but this subsequent potential in turn revises its precedent constraint through a kind of 'pataphysical retroversion.                     | pata-oulipo-constraints (Anoulipism & Synthoulipism)<br>pata-vocab-b1-anoulipism (Anoulipism (Vocabulary))<br>pata-vocab-b1-synthoulipism (Synthoulipism)                                      |
|  8215 | configurations                                           | "[a] configuration arises every time o b j e c t s are distributed according to[ .                                                                                                                                                                                   | **No direct card hit**                                                                                                                                                                         |
|  8383 | that                                                     | itself as a lipoaram, repressing the letter E while mentioning the absent E: "1 [would] start g i v i n g my plotting a symbolic turn, so that[ .                                                                                                                    | machinic-dispositif (Machinic Dispositif)<br>structural-homology (Structural Homology)<br>theory-of-pretending (Theory of Pretending)<br>5d08ab80d8688 (Elden Ring)                            |
|  8531 | itself                                                   | special effect; it assumes in imagination the perfection of the accident" (1990a:149)--the kind of accident that characterizes the fatal order of al1 poiesiç (particulary in the case of Oulipo): "[w]riting[.                                                      | machinic-dispositif (Machinic Dispositif)<br>radical-action (Radical Action)<br>cdb294c4d1671 (The Large Glass)<br>b5a377f7d3523 (Greatshield Talisman)                                        |
|  8561 | real                                                     | ludic event, whose mandatory f a t e results from an aleatoric rule that produces, not a reprise of its code so much as a surprise from its code.                                                                                                                    | bachelor-machine-def (Bachelor Machine)<br>the-inexchangeable (The Inexchangeable)<br>seven-theses-countercinema (Seven Theses on Countercinema)<br>5d08ab80d8688 (Elden Ring)                 |
|  8565 | The alea                                                 | a ~ o r i aof the fats, revealing the paradox of a so-called random order.                                                                                                                                                                                           | c8b100b30caf4 (Rugalea the Great Red Bear)                                                                                                                                                     |
|  8623 | to mind the paradox of the P e r s i a n flaw            | insofar as it perfects what it disrupts): [.                                                                                                                                                                                                                         | f11a4113f0f77 (Abductor Virgin (Swinging Sickle))<br>509ccc2ec044b (Abductor Virgin (Wheel))<br>0a5fcb95cd8aa (Sorceress Sellen)<br>f8aa33cf61cc4 (Cerulean Seed Talisman)                     |
|  8993 | a "tree literature                                       | 1986b:156) and what Fournel calls a "theater tree" (1986:159) have corne to represent some of the first texts to discuss the potential for interactive innovations (particularly hypertexts and videogames).                                                         | pata-neo-scientific-novel (The Neo-Scientific Novel (Faustroll))<br>pata-definitional-literature (Definitional Literature (Core Practice))                                                     |
|  9218 | inspiration so much as it                                | cause for inspiration: "[tlhe whole world of literature ought to become the object of numerousl cybernetic.                                                                                                                                                          | **No direct card hit**                                                                                                                                                                         |
|  9281 | than                                                     | itself as une sgm'minaire d e littgrature expbrimentale, Oulipo refers to itself a s a un ouvroir de littgrature potentielle, doing so for two reasons: first.                                                                                                       | gamic-allegory (Gamic Allegory / Other Act)<br>84ead3c834721 (The Discovery)<br>a4040b7ce6716 (Alexander, Warrior Jar)<br>686128d9fa97c (Asimi, Eternal King)                                  |
|  9304 | irrationalism                                            | hyperbolic, not the antonymic, extreme of rationalism itself: "[e]xtremes are alone logical, but they are always absurd" (187).                                                                                                                                      | **No direct card hit**                                                                                                                                                                         |
|  9311 | Reason                                                   | extreme species of reciprocal opposition, whose logic is potentially more threatening than the average s ~ z ~ n and i a its conflation of difference: "the mean is illogical, but an illogical mean is better than the sheer absurdity of an extreme" (187).        | 38f41a251faba (Patches)<br>pata-panalogy-principle (Panalogy Principle)<br>pata-psychopathological-comedy (Psychopathological Comedy)<br>pata-absolute-love (Absolute Love)                    |
|  9899 | thematism                                                | reductive endeavour, often characterized by simplistic misprision (1983:3).                                                                                                                                                                                          | **No direct card hit**                                                                                                                                                                         |
| 10099 | thematic thinkers                                        | kind of unconscious 'pataphysics that takes place in what Wurstwagen calls "the oscillating noplace of speculative geology" (1980:150).                                                                                                                              | **No direct card hit**                                                                                                                                                                         |
| 10332 | ' which                                                  | science of imaginary solutions" (149).                                                                                                                                                                                                                               | bachelor-machine-def (Bachelor Machine)<br>the-inexchangeable (The Inexchangeable)<br>control-allegory (Control Allegory)<br>cdb294c4d1671 (The Large Glass)                                   |
| 10660 | onstructed                                               | analogical framework of great complexity with a method (the operating 'pataphysics) based largely upon a posited similaritg in f e a t u r e s b e t w e e n language and geology and intended to function translatively as a modifying instrument upon the data ... | 2abd24c2630f5 (Caterpillar Mask)<br>pata-nowlege (Nowlege)<br>pata-doctrine-equivalence (Doctrine of Equivalence)<br>pata-vocab-b1-joke-work (Joke-Work)                                       |
| 10794 | to mind the paleological imagery of Deleuze and Guattari | who argue that language involves a process of s t r a t i fication: each molecule is sorted into layered forms ( a 204 s e d i m e n t ) , a n d t h e s e l a y e r e d forms are then f o l d e d i n t o a molarity (an aggregate) (1987:40).                     | f11a4113f0f77 (Abductor Virgin (Swinging Sickle))<br>509ccc2ec044b (Abductor Virgin (Wheel))<br>0a5fcb95cd8aa (Sorceress Sellen)<br>f8aa33cf61cc4 (Cerulean Seed Talisman)                     |
| 11007 | remote control                                           | 1 9 7 5 : 9 2 ) , "pataphysicians might eventually eliminate t h e interference of the self in order to become receptive to the dictation of a machinic alterity: #'[t]he radio telescope becomes a mode1 o f t h e bi-conscious interface between 'the mind' and... | **No direct card hit**                                                                                                                                                                         |
| 11092 | and that                                                 | discovery 210 and subsequent exploration of its plane of existence by ourselves, its human host" (1980b:25).                                                                                                                                                         | machinic-dispositif (Machinic Dispositif)<br>structural-homology (Structural Homology)<br>5d08ab80d8688 (Elden Ring)<br>f11a4113f0f77 (Abductor Virgin (Swinging Sickle))                      |
| 11101 | just as there                                            | parasite in us, there is also a parasite in language, "it is the because language in effect feeds upon itself: mind/ e a t i n g itself" (1980a:12).                                                                                                                 | a4040b7ce6716 (Alexander, Warrior Jar)<br>38f41a251faba (Patches)<br>pata-hermeneutic-paranoia (Hermeneutic Paranoia (Core Concept))                                                           |
| 11114 | The Governor                                             | mechanical device that r e m l a t e s a m a c h i n i c function; t h e Parasite is a cyborganic device that sabotages a machinic function.                                                                                                                         | **No direct card hit**                                                                                                                                                                         |
| 11140 | t J h e Governor                                         | is impossible to conceptualize" (1980b:25), while " [ t J h e Parasite allows the poet to function beyond his own capability" ( 3 1 ) .                                                                                                                              | **No direct card hit**                                                                                                                                                                         |
| 11154 | the notion of a supreme being                            | renouncement of the human miracle" ( 1 9 8 7 9 2 1 , and "the correction for [such] piety is natural history" (1982:lO).                                                                                                                                             | pata-literal-nominalism (Literal Nominalism)<br>pata-infra-mince (Infra Mince)<br>pata-livres-pairs (Livres Pairs (Core Term))<br>pata-psychopathological-comedy (Psychopathological Comedy)   |
| 11248 | Our hope                                                 | faint one," avers the Toronto Research Group: "that others will follow and in following lead to the collection of the neglected and (who knows, as a poetic corollary, the neglect o f the collected) those whom we have failed to remember or were forced to ign... | pata-inconnu-insolite (The Inconnu & Insolite)                                                                                                                                                 |
| 11498 | Stratification                                           | royal process of capture that arranges disparate parts into long-range, large-scale orders of solidity, and t h e s e strata are always subject t o a nomad process of rupture which deranges disparate parts into short-range, small-scale orders of fluidity.      | **No direct card hit**                                                                                                                                                                         |

## Raw candidate excerpts

### 'Pataphysics — line 99 (is_a)

Coverage: pata-pataphysics ('Pataphysics), pata-spiral (The Spiral), pata-clinamen (Clinamen (Core Thesis)), pata-syzygy (Syzygy (Core Thesis))

> BSTRACT 'Pataphysics: The Poetics of an Imaainarv Science is a survey that attempts to describe a hypothetic philosophp- the avant-garde pseudo-science imagined by Alfred Jarry. 'Pataphysics is a supplement to metaphysics, accenting it, then replacing it, in order to create a philosophic alternative, whose discipline can study cases, not of conception, but of exception: variance (anomalos), alliance (syzygia), and deviance (clinamen). 'Pataphysics synthesizes the romantic schism between a literal, scientized discourse and a figural, poeticized discourse, and m y thesis suggests that this revision of the signifier "science" by 'pataphysics is symptomatic of a postrnodern transit

### The Poetics of an Imaainarv Science — line 95 (is_a)

Coverage: pata-nowlege (Nowlege), pata-vocab-b4-hypothetics (Hypothetics), pata-vocab-b2-notation (Notation), pata-vocab-bok-paradigm (Paradigm)

> tion rights, and neither the dissertation nor extensive extracts from it may be printed or othenivise reproduced without the author's written permission. ABSTRACT 'Pataphysics: The Poetics of an Imaainarv Science is a survey that attempts to describe a hypothetic philosophp- the avant-garde pseudo-science imagined by Alfred Jarry. 'Pataphysics is a supplement to metaphysics, accenting it, then replacing it, in order to create a philosophic alternative, whose discipline can study cases, not of conception, but of exception: variance (anomalos), alliance (syzygia), and devianc

### in which the clinamen — line 5080 (is_a)

Coverage: bachelor-machine-def (Bachelor Machine), the-inexchangeable (The Inexchangeable), control-allegory (Control Allegory), cdb294c4d1671 (The Large Glass)

> xceptions'; the recurrence of vision is itself a law governing exceptions" (42). What repeats is not a rule of repetition and imitation, but a game of competition and agitation, in which the clinamen is the smallest, possible aberration that can make the greatest, potential difference. The IrnaRinary Solution 'Pataphysics misreads metaphysics in order to disrupt i t , c o n f u s e it, or def lect it, transposing the relationship between a royal paradigm and a nomad p a r a l o g y , u n t i l such a philosophy of exceptions g

### There — line 5597 (is_a)

Coverage: the-inexchangeable (The Inexchangeable), gamic-allegory (Gamic Allegory / Other Act), 312e27a0abecc (The Green Box), a4040b7ce6716 (Alexander, Warrior Jar)

> o b s e r v e r t ' ( 1990 :8 4 - 8 5 ) . Italian Futurism: A 'Pataphvsics of Machinic Exception "[~]utomatism always embodies an irrational projection of consci~usness[..~.]~There is a complete ['jpataphysics of the object awaiting description here, a science of imaginary technical solutions." (Baudrillard 1 9 9 6 b A 1 3 ) " [Tlhe unforeseen beast Clinamen e jaculated ont0 the walls of its universe. t t (Jarry 1965 :238 ) The Machinic Future of Poetrj Italian Futurists present the f i r s t case for t h e surrationalism of the 'p

### 'pataphysical enterprises that do not — line 1077 (refers_to)

Coverage: No direct card hit

> on results from the corruption of mernories. Like these movements, this survey also tries to avoid the normalization of the 'pataphysical, doing so by alluding intermittently to 'pataphysical enterprises that do not refer to the tradition of Jarry, but nevertheless represent some of the exceptions to the genealogy that this survey posits. 10 Exceptions, after all, can resort to an assortment of modalities: variance (anomalos), alliance (sszvgia), or deviance (clinamen). The anomalos finds a way to d i f f e r from e v e r y other thing in a system that values the norm of equiva

### a paradigm — line 1398 (calls)

Coverage: pata-vocab-bok-paradigm (Paradigm)

> , but not exclusive. They transect at many points acrose many scales, each o n e immanent in the o t h e r , like a postponed potential. Royal sciences value the renovation of what Kuhn calls a paradigm (1970:10), a nomic language-game that must systematically (im)prove its own consistency and efficiency by solving problems, yevokinfi anomsly for the sake of what 16 is normal and known.' Nomad sciences, however, value the 1984:60), innovation of what tyotard calls a p a r a l o ~( ~ a ludic language-game that must systematically (ap)prove its own inconsistency and inefficiency by convolving problems, invokinq anomaly for the sa

### The Oedipal subject — line 6268 (is_a)

Coverage: No direct card hit

> the anxiety of influence into the ecstasy of exception, Such a clinameq transforms the Oedipal metaphysics of ressentiment into the non-Oedipal 'pataphysics of divertissement. The Oedipal subject is a t o m i z e d and dispersed i n a traject r a t h e r than localized and c o a l e s c e d around an object. The royal monument of the ego merges with the nomad movement of a car so that, in effect, t h e auto of t h e s e l f i s p r o p e l l e d into its o w n 111 drives. The clinamen of this subjective dispersion evokes a cyborganic schizonoia7--

### bachelor machines — line 6326 (calls)

Coverage: bachelor-machine-def (Bachelor Machine), machinic-dispositif (Machinic Dispositif), the-inexchangeable (The Inexchangeable), structural-homology (Structural Homology)

> vice i s a sex-toy t h a t can destroy thought itself (not unlike les machines malthusiennes of Jarry or les machines cglibataires of Duchamp). What such ' pataph~sicianshave called "bachelor machines-," Deleuze and Guattari have called "desiring- machines" (1983:l)--deviant devices, whose e x t r a v a g a n c e evokes al1 t h e ecstatic tortures of s h o c k , noise, and speed. The Shock of Exception Carrouges suggests that "[al bachelor machine is first of al1 an improbable machine" (1975:21), an apparatus of anomalies: "felvery bachelor machine i s first of al1 a ['Ipataphysical machine, or a patamachine" (44). Suc

### in which poetry itself — line 7219 (is_a)

Coverage: No direct card hit

> aphysicians do s o by referring to the software of a numerological form (ie. the play of abstract machines). Futurism ultimately postulates an applied science of poetic theories, in which poetry itself is an accidental instrument for a scientific experiment. Rossiyansky observes that, in ef fect, Futurism dreams of "a future era[ ...]where scientific laboratories are run by astrologers and chiromantists" (143)--'pataphysical sophisters that parody metaphysical physicists. Graal-Arelsky observes in

### by the name of '~ataahssics — line 698 (calls)

Coverage: 61ca4aa454259 (Glintstone Dragon Adula), 2b96779d95062 (Glintstone Dragon Smarag), 98555aad800b5 (Roderika), 5c11d28f98b6b (Roderika, Spirit Tuner)

> itself in terms o f such a catastrophe. Philosophy has everywhere begun to threaten the constraints of both the real and the true in o r d e r t o practice an anti-philosophp-what Jarry might call by the name of '~ataahssics,the science of imaginary solutions and arbitrary exceptions ( 1 9 6 5 : 1 9 2 ) . Jarry suggests through 'pataphysics that reality does not exist, e x c e p t as the interpretive projection of a phenomenal perspective-which is to say that reality is never as it is, but is always if it is. Reality is quasi, pseudo: es it is m

### A nomad science — line 1381 (is_a)

Coverage: pata-vocab-bok-royal-science (Royal Science), pata-vocab-bok-nomad-science (Nomad Science)

> is deployed by the state throughout a clathrate, Cartesian space, putting truth to work on behalf of solid, instrumental imperatives ( l a w and order). bastardized metaphysics: A nomad science is a it is deployed against the state throughout an aggregate, Riemannian space, putting truth & risk on behalf of fluid, experimental operatives (trial and error). Such scientific economies are contrastive, but not exclusive. They transect at many points acrose many scales, each o n e immanent in the o t h e r , like a postponed potential. Royal sciences value the renovation of what Kuhn calls a paradigm

### war — line 6044 (is_a)

Coverage: industry-sanctioned-hacking (Industry Sanctioned Hacking), 5d08ab80d8688 (Elden Ring), 37675a93a3ae (Ash-of-War Scarab), 2779d07e9cb8b (Blue Cloth Cowl)

> ut any unilinear intention. Marinetti c l a i m s that s u c h warfare is itself "Futurism intensif ied" ( 1991 :131 )--perhaps because (as Deleuze and Guattari might suggest), war is the s u ~ ~ l e m e nof t a marginal episteme, occurring wherever a royal science clashes with a nomad science ( 1 9 8 7 :355 ) : the former, building implements (which control energy through instrumental tasks); the latter, building srmaments (which unleash energy through experirnental risks) .' While Benjamin argues thst , for such radical warfare, "alienation has reached such a d e g r e e that it can experience its own destruction as an aesthetic pleasure" ( 2 4 2 ) , the very sesthetic that has served what he vilifies ( F a s c i s

### the bachelor machine — line 6349 (is_a)

Coverage: bachelor-machine-def (Bachelor Machine), machinic-dispositif (Machinic Dispositif), the-inexchangeable (The Inexchangeable), structural-homology (Structural Homology)

> ne i s first of al1 a ['Ipataphysical machine, or a patamachine" (44). Such an apparatus does not repeat any mode1 of the erotic in which the erotic becomes a means to repeat: "the bachelor machine is the erotic form of malthusianism" insofar as the device perverts the values of functional repetition, opposing al1 forms of love that provide a n alibi for replicative engineering. Whether electric or artistic, the shock scossa) generated by such 8 (la device short-circuits the laws that forbid perpetual motion and libidinal action. The bachelor machines inflict the shock of a nomad science upon the mastery of devices:

### who — line 6919 (is_a)

Coverage: polyvalent-doing (Polyvalent Doing), 6ee1adcfc6691 (Marcel Duchamp), a59f913a9e386 (Confessor Armor), 8d5f86bc91196 (Confessor Boots)

> fatigue, repairing it as it is s p e n t " ( 1 9 6 4 : 4 ) . S u c h a race provides an allegory for the triumph o f science over its own entropic necrosis. Just as the cyclist, who is a cadaver, c a n nevertheless pedal faster than e v e r , d e s p i t e having expired, so also d o e s science represent a vertiginous expenditure that thrives paradoxically upon its own decline. Jarry and Marinetti equate the as if of such a dromomanic technology with a scientific revolution, whose history defies the royal order of causality i t s e l f . Inspired by Wells, for example, Jarry describes "[a] Machine to isolete us from Dura

### Our hope — line 11248 (is_a)

Coverage: pata-inconnu-insolite (The Inconnu & Insolite)

> whose sophistries might draw attention to the poetics of a neglected exception, be it the excess of the anomalos, the chiasm of the s y z s a i a , or the swerve of the clinamen. "Our hope is a faint one," avers the Toronto Research Group: "that others will follow and in following lead to the collection of the neglected and (who knows, as a poetic corollary, the neglect o f the collected) those whom we have failed to remember or were forced to ignore, the already passed and the yet to corne" (TRG 1992:303). Wershler-Henry observes, moreover, that even this historical trajectory of exception must i t s e l f undergo its own form of revision, disrupting the normalization of 'pataphysical abnormalities so that "each generation of "Pataphysicians must ant

### jurassic" no longer seems wholly absurd — line 274 (calls)

Coverage: No direct card hit

> stmodern transition in science frorn absolutism to relativism, When even time itself fades away into spectacular uncertainty, the very idea that an historical technology might be called "jurassic" no longer seems wholly absurd (since w e can now imagine a futuristic apocalypse, in which cloning might allow a human tu coexist with a resurrected tyrannosaur-j u s t as cinema has cloned the image of an actual thespian and spliced it with the image of an unreal sauropod).2 'Pataphysics is speculative, waiting for its chance to happen, as if by accident, in a themepark of scientific viii conception. Like the museum of Wilson, this thesis on Jarry attempts to scramble the jurassic sequence of history so that what

### royal science — line 1370 (is_a)

Coverage: pata-vocab-bok-royal-science (Royal Science), pata-vocab-bok-nomad-science (Nomad Science)

> eleuze and Guattari might cal1 the royal sciences of efficient productivity have historically repressed and exploited the nomad sciences of expedient adaptability ( 1987: 3 6 2 ) royal science is a standardized metaphysics: A it is deployed by the state throughout a clathrate, Cartesian space, putting truth to work on behalf of solid, instrumental imperatives ( l a w and order). bastardized metaphysics: A nomad science is a it is deployed against the state throughout an aggregate, Riemannian space, putting truth & risk on behalf of fluid, experimental operatives (trial and error). Such scientific economies are contrast

### a p a r a l o ~ — line 1411 (calls)

Coverage: No direct card hit

> own consistency and efficiency by solving problems, yevokinfi anomsly for the sake of what 16 is normal and known.' Nomad sciences, however, value the 1984:60), innovation of what tyotard calls a p a r a l o ~( ~ a ludic language-game that must systematically (ap)prove its own inconsistency and inefficiency by convolving problems, invokinq anomaly for the sake of what is abnormal and unknown. These two economies do not oppose each other so much as enfold each other. They inflect opposite values of intent within a composite system of truth. A failure in one language-game played according to one set of rules always determines the rul

### uovo scienza — line 2782 (is_a)

Coverage: pata-vocab-bok-poetic-wisdom (Poetic Wisdom)

> ble with the conceivable and thereby improve its efficacy; and third, it pacifies contradictions in order to define what it makes conceivable and thereby improve its adequacy. '~uovo scienza is a poetic wisdom that might study poetic wisdom (and t h u s such a science almost appears to preempt 'pataphysics itself). Vico, like Jarry, believes that, because nature is an inhuman creation, we can never know its truth; but unlike Jarry, Vico believes that, b e c a u s e culture is a human creation, we can know its truth. Jarry argues that al1 truth, be it natura

### because nature — line 2789 (is_a)

Coverage: the-inexchangeable (The Inexchangeable), pata-caesura (Caesura)

> . '~uovo scienza is a poetic wisdom that might study poetic wisdom (and t h u s such a science almost appears to preempt 'pataphysics itself). Vico, like Jarry, believes that, because nature is an inhuman creation, we can never know its truth; but unlike Jarry, Vico believes that, b e c a u s e culture is a human creation, we can know its truth. Jarry argues that al1 truth, be it natural or cultural, is still an opaque mirage, never to be known. Every science, for him; is a poetic wisdom if only because it rnust commit at leest one error--the error of belief in truth itself, onne ne s

### science — line 3081 (is_a)

Coverage: gamic-allegory (Gamic Allegory / Other Act), pata-sensism (Sensism / Sensist), pata-pataphysics ('Pataphysics), pata-epiphenomena (Epiphenomena)

> that al1 absurd concepts merely await the proper context for their errors to be redeemed as t r u t h s . 49 Millenial 'Patavhssics: The Poetics of an Imaninarv Science "[Al11 science is a n a l y s i s r a t h e r than literature, i s it not?" (Jarry:1989:106) " J o a n was guizzical, studied 'pataphysical science in the home, l a t e nights al1 alone with a test-tube." (Lennon, McCartney 1 9 7 0 ) "[Tlhe mind is a ['lpataphysical camera[ Set the[...]shutter ....] speed to l/infinity in order to c a t c h t h e universal everlasting moment." (Jirgens 1986:S) The Millenary Problem ' P a t a p h y s i c s ha

### Tlhe mind — line 3094 (is_a)

Coverage: No direct card hit

> i s it not?" (Jarry:1989:106) " J o a n was guizzical, studied 'pataphysical science in the home, l a t e nights al1 alone with a test-tube." (Lennon, McCartney 1 9 7 0 ) "[Tlhe mind is a ['lpataphysical camera[ Set the[...]shutter ....] speed to l/infinity in order to c a t c h t h e universal everlasting moment." (Jirgens 1986:S) The Millenary Problem ' P a t a p h y s i c s has so far proven daunting to c r i t i c s because of its academic f r i v o l i t y

### 'pataphysics — line 3128 (is_a)

Coverage: pata-pataphysics ('Pataphysics), pata-spiral (The Spiral), pata-clinamen (Clinamen (Core Thesis)), pata-syzygy (Syzygy (Core Thesis))

> n the philosophy of his work-as than what he wrote. if how he lived is more a r t f u l Few critics have recognized that, far from simply being the idiolect of an alcoholic, 'pataphysics is a surrational perspective t h a t h s s had an extensive, yet f orgotten, influence upon the canonic history of radical poetics. Few critics have recognized that 'petaphysics actually informs the innovation of the p o s t m o d e r n . Not only does this avant-garde pseudo-science valourize whatever is exceptional and paralogical; it also sets the parameters for the cont

### that it — line 3876 (is_a)

Coverage: 87a2e356ddf1e (Sacrificial Twig), pata-the-sieve (The Sieve (Faustroll Object)), pata-gidouille (Gidouille (Core Object)), pata-the-scroll (The Scroll)

> rma o b s e r v e s : J ~ l u tmetaphssics b e h i n d r'lpatapbvsics and vou make it merels the facade for a belief" when in fact "the essence of I ' l ~ a t a ~ h u s i c s is that it is the facade of a facade, behind which there is nothingW--only the black abyss of total doubt (Hale 145). T h e Ethernitv of Faustroll Jarry situstes h i s own 'pataphysical sensibility in such a posited r e a l i t y , an imaginary dimension that he calls Ethernitv, a "NOWHERE, or SOMEWHERE, which is the same thing" ( 1 9 6 5 : 248)--an interzone w

### Ethernitv — line 3883 (calls)

Coverage: No direct card hit

> abyss of total doubt (Hale 145). T h e Ethernitv of Faustroll Jarry situstes h i s own 'pataphysical sensibility in such a posited r e a l i t y , an imaginary dimension that he calls Ethernitv, a "NOWHERE, or SOMEWHERE, which is the same thing" ( 1 9 6 5 : 248)--an interzone where the reference of a sign does not describe, but conjures, the existence of the real through the ur of simulation. Ethernity resembles a state of maximum e n t r o p p - a nullified condition whose potential goes unmeasured, unobserved, its e i ~ e n s t a t e corresponding to "the perplexity of a man outside time and s p a c e , who has lost h i s [ . . . ]me

### which — line 3885 (is_a)

Coverage: bachelor-machine-def (Bachelor Machine), the-inexchangeable (The Inexchangeable), control-allegory (Control Allegory), cdb294c4d1671 (The Large Glass)

> rnitv of Faustroll Jarry situstes h i s own 'pataphysical sensibility in such a posited r e a l i t y , an imaginary dimension that he calls Ethernitv, a "NOWHERE, or SOMEWHERE, which is the same thing" ( 1 9 6 5 : 248)--an interzone where the reference of a sign does not describe, but conjures, the existence of the real through the ur of simulation. Ethernity resembles a state of maximum e n t r o p p - a nullified condition whose potential goes unmeasured, unobserved, its e i ~ e n s t a t e corresponding to "the perplexity of a man outside time and s p a c e , who has lost h i s [ . . . ]me

### life — line 4079 (is_a)

Coverage: the-inexchangeable (The Inexchangeable), control-allegory (Control Allegory), 686128d9fa97c (Asimi, Eternal King), d6863629fa4a7 (Fractured Marika)

> art and a l 1 science were written in the curves[ ...], and their progression to a n infinite degree was prophesied therein" ( 1 9 6 5 : 2 4 5 ) . For such a superman, whose life is a text that d i s p l a y s the grammar of flux and flow, language itself becomes an absurd vessel--a sieve of words, set adrift upon the oceanic surface of a protean reality. Faustroll indeed sets sail in such a s h i p , whose manifest does not itemize the ballast of a boat s o much as the content of a book: i t s hvpertext of influence--a literal "network" where the science of Boys and the poetry of Lear c a n fuse

### the anomalos — line 4518 (is_a)

Coverage: pata-anomaly (Anomaly), pata-vocab-bok-anomalos (Anomalos (Bök: Variance))

> s at play in an aleatory, statistical field[ longer know[ . . . ]of variations and .. . J t r a n s g r e s s i o n " ( 1990: 2 6 ) modulations which no . For metaphysics, the anomalos is an infraction of a limit ( a difference in specie), but for 'pataphysics, the anomalos is an aberration 76 from a curve ( a difference in degree). surprise, a mutation--a or perfidy (26). The anomalos is a "simple apparition" without tragedy Not criminalized, but relativized, it reveals t h f i t everything has the potential to be anomelous. Faustroll even g o e s so far as t o define rea

### The anomalos — line 4528 (is_a)

Coverage: pata-anomaly (Anomaly), pata-vocab-bok-anomalos (Anomalos (Bök: Variance))

> n of a limit ( a difference in specie), but for 'pataphysics, the anomalos is an aberration 76 from a curve ( a difference in degree). surprise, a mutation--a or perfidy (26). The anomalos is a "simple apparition" without tragedy Not criminalized, but relativized, it reveals t h f i t everything has the potential to be anomelous. Faustroll even g o e s so far as t o define reality itself as " t h a t which i s the e x c e p t i o n t o oneselfl' (l965:245), j u s t as Nietzsche might suggest that, b e c s u s e this universe constitutes an unlikely condition among an i n

### tlhe astral order in which we live — line 4542 (is_a)

Coverage: No direct card hit

> eselfl' (l965:245), j u s t as Nietzsche might suggest that, b e c s u s e this universe constitutes an unlikely condition among an i n f i n i t y o f more probable potential, "[tlhe astral order in which we live is an exception," whose situation and duration has made possible ''an exception o f exceptions: organic" (1974:168). t h e formation of the Such an anomalos is the result n o t of chance design, but of random errors-events whose element of surprise brings every rule t o life in a reprise without either purpose or refrain. Such an anomalos dares science to r

### Lyotard also — line 4693 (refers_to)

Coverage: No direct card hit

> device in motion both affirms and negates, becoming not only an alchernical cipher for the holism of opposite parts, but also a scientific symbol for a margin of probable error. Lyotard also refers to this turning of a "bar which separates the this from the not-this" (1993:15) when he posits a linear device, whose stasis signifies a mandatory division, but whose motion activates an aleatory confusion. 9 79 Just as Lyotard implies that such conjugality of revolution c a n erase the temporality of difference, so also does Jarry argue that the physicks-stick is a crank-shaft for a timemachine, whose syzygy reveals that "there are neither nights

### argue that the physicks-stick — line 4706 (is_a)

Coverage: pata-retinal-painting (Retinal Painting (Reinterpreted)), pata-coition-glass-pane (Coition Through the Glass Pane)

> ut whose motion activates an aleatory confusion. 9 79 Just as Lyotard implies that such conjugality of revolution c a n erase the temporality of difference, so also does Jarry argue that the physicks-stick is a crank-shaft for a timemachine, whose syzygy reveals that "there are neither nights nor days," neither systole nor diastole--no "pendulum movements" (1989:103), only this intense instant, atemporal and libidinal. As Jarry argues: minus sign is ferninine; plus sign is masculine--"[f]or the Geometer, these two signs cancel each other out or impregnate each other, and there resultsC...]their progeny, which becomes[ . . . ]zero, al1 the more identical beca

### ilt — line 6182 (is_a)

Coverage: 9926ed52cfc0f (Guilty Hood), 9f35beea86296 (Glass Shard), 264263ac1e915 (Miquella's Lily), 67acb2143f44b (Soap)

> e accident reveals a 'pataphysical promiscuity between 109 uncorrelated occurrences--their ability to collide on a whim into a potential infinity of exceptional permutations: "[ilt is the Accident that gives form to life, it is the Accident[ . . . ]that is the sex of l i f e " ( 1 1 3 ) . is "[tlhe only strategy[ ...]o f T h e accident [']pataphysics[ . . . ] ; that is, a science-fiction of the system's reversal against itself at the extreme limit of simulation, a reversible simulat

### configurations — line 8215 (calls)

Coverage: No direct card hit

> swerve of an exception must intervene. The Exception of Constraint Oulipo derives its own exceptional formalities from the mathema of "combinatorics"--a discipline that studies what Berge calls configurations: "[a] configuration arises every time o b j e c t s are distributed according to[ . . . ]constraints" ( 1) . 6 Such a science pertains to the optimization of arrangements within determined parameters. What applies, for example, to the nomic study of numerals in matrices also applies to the ludic study of acrostics and rnagic-s

### itself — line 8531 (is_a)

Coverage: machinic-dispositif (Machinic Dispositif), radical-action (Radical Action), cdb294c4d1671 (The Large Glass), b5a377f7d3523 (Greatshield Talisman)

> .]but to the passing from a state of causal determination to another order, radically different, also of non-chance" ( 145). 9 Baudrillard suggests that, for science, "[clhance itself is a special effect; it assumes in imagination the perfection of the accident" (1990a:149)--the kind of accident that characterizes the fatal order of al1 poiesiç (particulary in the case of Oulipo): "[w]riting[...,] 158 [wlhether poetry or theory, [is] nothing but the projection of an arbitrary code[...](an invention of the rules of a game) where things corne to be t a k e n in their fatal development" (154). The game presents an arbitrary ensemble o

### real — line 8561 (is_a)

Coverage: bachelor-machine-def (Bachelor Machine), the-inexchangeable (The Inexchangeable), seven-theses-countercinema (Seven Theses on Countercinema), 5d08ab80d8688 (Elden Ring)

> development" (154). The game presents an arbitrary ensemble of constraints, of necessities, whose outcome remains uncertain. The science of ' pataphysics suggests that the real is a ludic event, whose mandatory f a t e results from an aleatoric rule that produces, not a reprise of its code so much as a surprise from its code. The alea is the a ~ o r i aof the fats, revealing the paradox of a so-called random order. Oulipo suggests that the potentials of constraint coincide with the poiesis of a ludic state, whose mathema constitutes a playful way to s t u d y al1 that

### to mind the paradox of the P e r s i a n flaw — line 8623 (calls)

Coverage: f11a4113f0f77 (Abductor Virgin (Swinging Sickle)), 509ccc2ec044b (Abductor Virgin (Wheel)), 0a5fcb95cd8aa (Sorceress Sellen), f8aa33cf61cc4 (Cerulean Seed Talisman)

> h e r e rernains at least one anomalous component to the puzzle ( 1 9 8 7 : 4 9 7 ) . For Perec, a constraint must systematically evoke its own disintegration in a manner that calls to mind the paradox of the P e r s i a n flaw (insofar as it perfects what it disrupts): [...]must "[tlhe system of constraints not be r i g i d , there must be some play in it, it must, as they Say, 'creak' a bit; it must not be completely coherent; there must be a clinamen" (Motte 1986: 2 7 6 ) . 11 Oulipo suggests that the potential

### ' which — line 10332 (is_a)

Coverage: bachelor-machine-def (Bachelor Machine), the-inexchangeable (The Inexchangeable), control-allegory (Control Allegory), cdb294c4d1671 (The Large Glass)

> to a process of creeping disappearance (ours) by means of a l i v e sojourn i n a visible form o f disappearance" --" [ tlhat is why 'Patagonia' goes so well with 'Pataphysics,' which is the science of imaginary solutions" (149). Canadian "Pataphysics performs an agonistic spectacle, responding to the disappearance of Patagonis w i t h a hyperbole of its own disappearance, as if "laIll translations into action are imaginary solutions" ( 1 4 9 ) . L i k e the F u t u r i

### remote control — line 11007 (calls)

Coverage: No direct card hit

> he 'pataphysics of such automatism in order to transforrn the surrealist psychology of the irrational into the futuristic technology of the surrational. Giving themselves up to what Dewdney calls remote control ( 1 9 7 5 : 9 2 ) , "pataphysicians might eventually eliminate t h e interference of the self in order to become receptive to the dictation of a machinic alterity: #'[t]he radio telescope becomes a mode1 o f t h e bi-conscious interface between 'the mind' and signals from the ' o u t s i d e ' which t h e poet receives" (1980b:20). Dewdney goes on t o use such "pataphysics to parody the mythomania of Canadian criticism by arguing that cultural identity a r i s e s 'pataphysically from the mnemonic paradigm of a geology: " [ a l s there is/ a water table/ there is also/ a me

### lucifuaus — line 485 (is_a)

Coverage: No direct card hit

> canon of modern p o e t r y . Let u s imagine a f u t u r e f o r such an impossible philosophy. xiii Notes to Preface l ~ e s c h l e robserves that , because the M ~ o t i s lucifuaus is a hoax, while the Meaaloponera foetens is a fact, "[tlhe Jurassic infects its visitor with doubts-little curlicues of misgiving--that proceed to infest all[ . . . ]other dealings with the Culturally Sacrosanct" (40). 2 ~ h eJurassic Park of Crichton, for example, dramatizes a 'pataphysical domain, in which a science of operative risks (chaotic mathematics) indicts a science of irnperative tasks (genetic

### a "philosophy of as if — line 725 (calls)

Coverage: No direct card hit

> n actual; it is real only to the degree to which i t can seem to be real and only for so long as it can be made to stay real. Science for such a reality has increasingly become what Vaihinger might call a "philosophy of as if" (xvii), w i l f u l l y mistaking possibilities for veritabilities. Baudrillard observes that, for the "[']Pataphysics of the year 2000," history has accelerated past the escape velocity for reality, moving from the centrifuga1 gravity of the real into the centripetal celerity of the void (1994a:l). Events occu

### Science — line 1515 (is_a)

Coverage: gamic-allegory (Gamic Allegory / Other Act), pata-sensism (Sensism / Sensist), pata-pataphysics ('Pataphysics), pata-epiphenomena (Epiphenomena)

> hich c o l l u d e w i t h each other, al1 of which o p e r a t e together s i m u l t a n e o u s l y i n fits and s t a r t s at asynchronous rates o f incornmensurate change. Science is a complex tissue o f hybrid tensions, its metaphors not only reflectinq each other, but also refracting each other. They facilitate changes to aa economy of exchanges by accentuating al1 the unforeseen instabilities in scientific signification. Like poetry, science is a bricolage of figures, an assemblage of devices, none of which fit together perfectly--but

### science — line 1528 (is_a)

Coverage: gamic-allegory (Gamic Allegory / Other Act), pata-sensism (Sensism / Sensist), pata-pataphysics ('Pataphysics), pata-epiphenomena (Epiphenomena)

> , but also refracting each other. They facilitate changes to aa economy of exchanges by accentuating al1 the unforeseen instabilities in scientific signification. Like poetry, science is a bricolage of figures, an assemblage of devices, none of which fit together perfectly--but unlike poetry, science must nevertheless subject its tropes to a system, whose imperatives of both verity and reality normally forbid any willing suspension o f disbelief. Science and p o e t r y have s h a r e d a common history, undergoing four phases of distinct change (the anirnatismic, the mechanismic, the organismic, and the cyborganismic); nevertheless, the two disciplines h a v e not evolved in tandem or in

### The poetry literally — line 2131 (is_a)

Coverage: pata-caesura (Caesura), pata-pataquericals (Pataquericals), pata-vocab-b4-combinatorialism (Combinatorialism), pata-vocab-b4-cent-mille-milliards (Cent Mille Milliards de Poèmes)

> marginalia. The poetry a c t s as a mere note for the notes themselves--a pretense to plant the seeds of interest so that the reader might in turn disseminate this information. The poetry literally is a botanic garden, in which germinates the romantic metaphor that poetry is organic. The Oraanismic Phase Coleridge observes that, after empiricism, the botanic mode1 of science does inform a poetry of organic unity, but contrary to Darwin, t h i s poetic pleasure does not submit to noetic pedagogy: "[a] poem[ . . . ]is opposed

### Science — line 2465 (is_a)

Coverage: gamic-allegory (Gamic Allegory / Other Act), pata-sensism (Sensism / Sensist), pata-pataphysics ('Pataphysics), pata-epiphenomena (Epiphenomena)

> of this spectral environment where each ce11 ( e a c h function, e a c h structure), is left with the possibility, as in cancer, [...]of (1990:28). multiplying indefinitely" Science is a tautological extravagance, for which Ubu, "a figure of genius, r e p l e t e with that which has absorbed everything, transgressed everything, [...Iradiates in t h e void like an imaginary solution" (71). Science now f u n c t i o n s i n what Jarry might cal1 an economy of phvnance (1969:43), expending w i t h o u t investing, producing pschitt or merdre--an ironic eponym f o r "excess"

### s i n c e even truth — line 3170 (is_a)

Coverage: pata-semantic-proliferation (Semantic Proliferation)

> cs (gpatge phvsique) that is not your physics (pas ta physique). The apostrophe denotes that, while wordplay in the sciences is absent by edict, it is still present by proxy, s i n c e even truth is a language-game that carr never efface its s t a t u a as a language-game. Torma avers: As "Ttlhe word true means ~ r e c i s e l yno th in^ here and succumbs under a f ' l ~ a t a ~ h ~ s i ~aw-swipe" cal (Hale 145 ) Jarry argues that, for ' p a t a p h y s i c s , r e a l i t y does n o t exist, except as an as if

### because 'pataphysics — line 3385 (is_a)

Coverage: pata-clinamen (Clinamen (Core Thesis)), pata-syzygy (Syzygy (Core Thesis)), pata-imaginary-solutions (Imaginary Solutions), pata-the-exception (The Exception)

> anarchic p o l i t i c s of permanent rebellion among much of the avant-garde; nevertheless, s u c h critics as Shattuck and Sandomir have argued at length and with fervor that, because 'pataphysics is an alleged science o f indifference, such a science can never support any political intention--unless it supports al1 of them. Shattuck argues that, b e c a u s e "'[plataphysics preaches no r e b e l l i o n [ . . . ] , no political r e f o r m , " such a science never attempts to change events: ['lpataphysician[ ...]suspends "the al1 values" ( 1 9 8 4 : 1 0 4 ) . Sa

### these — line 3575 (is_a)

Coverage: machinic-dispositif (Machinic Dispositif), the-inexchangeable (The Inexchangeable), seven-theses-countercinema (Seven Theses on Countercinema), fafafe249df2b (Glintstone Scarab)

> ly a viewpoint that does not explicate a cornmon reality so much as interpret a unique fantasy: "[tlhe habits of our senses have woven us into lies and deception of sensation: these are the basis of al1 our judgments and ' knowledge ' ," absolutely no escape[ ...]into for which " there is the real world" (Babich 8 9 ) . Science, for Jarry, is also such "a statement of what is visible to the mortal eye ( it is always a matter of mortal eyes, hence vulgar and[ ...]flawedi. . . ] , and the sensory organ

### The word "syzygy" normally — line 4626 (refers_to)

Coverage: beb85458c7c8b (Nox Swordstress Armor), 53c79ac40736e (Nox Swordstress Armor (Altered)), 32af39bfa1031 (Nox Swordstress Crown), 0c9d9edbea1a3 (Nox Swordstress Crown (Altered))

> ic, as derived from a fragment, so that, "during the s y z y g y of w o r d s [ . , . , ] one could have reconstructed, through this facet, al1 art and al1 science" (l965:245). The word "syzygy" normally refers to a celestial alignment of three planets, two of which are at the opposite antipodes of their orbit around a third. The horizon that connects the two extremes of perihelion and aphelion can provide a conceit for the dualism of conceit itself--the coniunctia o ~ ~ o s i t o r unot m only between a positive and its negative (this, not-this), but also between 78

### for it — line 5108 (is_a)

Coverage: ba59a723d7127 (Regal Ancestor Spirit), 0f2ce640a1aee (Blue-Gold Kite Shield), 493462167372b (Candletree Wooden Shield), b71ecb318bdb (Flame Crest Wooden Shield)

> r to avoid the normalization of such abnormalities. Each predecessor is (mis)interpreted as a problem requiring a solution. A s Bloom observes, "[t]his sense is not reductive, for it is the continuum, the stationing context, that is r e s e e n , and shaped i n t o t h e visionary; it is brought u p to the intensity of t h e crucial objects, which then 'fade' into it" (42). In essence, each solution is itself the catalyst for a phantasm that in turn becomes a problem. 'Pataphysics may be a science of imaginary solutions, but this- imaginariness does not e n t a i 1 i t s insignificance because, as McCaffery argues

### tlhet the problem — line 5127 (is_a)

Coverage: No direct card hit

> n turn becomes a problem. 'Pataphysics may be a science of imaginary solutions, but this- imaginariness does not e n t a i 1 i t s insignificance because, as McCaffery argues: "[tlhet the problem is a pseudo-problem in no way nullifies the p u r s u i t of a solution for t h e pursuit in itself will evince the problematic nature of both 'problem' and tsolution'" (1986:189). Deleuze argues that a problem does not simply mean t h e f a i l u r e of a 87 theorem, whose ineptitude or incertitude can vanish through cumulative knowledge; i n s t e a d , "[sjolutions are e n g e n d e r e d st precisely the same time tha

### Science — line 5366 (is_a)

Coverage: gamic-allegory (Gamic Allegory / Other Act), pata-sensism (Sensism / Sensist), pata-pataphysics ('Pataphysics), pata-epiphenomena (Epiphenomena)

> in order to question the rules by which rules can question, arguing that, despite s u c h a paradox, science nevertheless settles for rules that are more reactive than creative. Science is a superstition that vilifies theistic sentiment, but that nevertheless reifies theistic-ressentiment, substituting a love of what is usual (the banal), for a fear of what is unusual (the fatal). ' ~ o r t , 1 i k e Nietzsche, indulges i n skeptical s o p h i s t r y , defining scientific anomalies in terms o f recursive exclusion--a paradox, i n which, f o r a thing to be r e a l , i t must e x c i s e i t s e l f from a whole in order

### the Cornpars — line 5489 (calls)

Coverage: No direct card hit

> "the third position" (1982b:78), whose exclusion provides the pretense for the continuation of communication. l 2 ~ a r t i a nphysics defines a fluid force as the exception to what Deleuze and Guattari call the Cornpars, a quantal geometry of position--the monadic stomicum (1987: 369). Venusian physics, however, defines a rigid mode1 as the exception to what Deleuze and Guattari call the Dispars, a f r a c t a l geometry of momentum--the nomadic clinarnen (1987:370). As McCaffery argues: "[a]toms[...] are m e t a - sengsica

### the Dispars — line 5495 (calls)

Coverage: No direct card hit

> at Deleuze and Guattari call the Cornpars, a quantal geometry of position--the monadic stomicum (1987: 369). Venusian physics, however, defines a rigid mode1 as the exception to what Deleuze and Guattari call the Dispars, a f r a c t a l geometry of momentum--the nomadic clinarnen (1987:370). As McCaffery argues: "[a]toms[...] are m e t a - sengsical olganizations of[ . . . ] p urwly imaained matrter, [...]and as such prlovyde a 'patarphynsicl solautiob to the abysmaticx olf msterila division" (1997:13). 95 1 3 ~ e l e u z eand

### and Guattari insist — line 6462 (is_a)

Coverage: bachelor-machine-def (Bachelor Machine), pata-celibate-machine (The Celibate Machine), pata-vocab-bok-royal-science (Royal Science), pata-vocab-bok-nomad-science (Nomad Science)

> f t h e 'upper inscription' which exerts an influence on the Bachelors and determines their f a t e " (11). Carrouges still deploys an Oedipal paradigm to describe what Deleuze and Guattari insist is an non-Oedipal artifice: "[a] genuine consummation is achieved by t h e new machine, a pleasure that can be rightly called autoerotic, o r r a t h e r automatic: birth[ .. . ] , the nuptial celebration of a new alliance, a new a s though t h e eroticism of the machine liberated other unlimited forces" (1983:18).8 Bachelor machines amplify la scossa of sensation to a nullpoint of synaesthetic indifference where any

### autoerotic — line 6467 (calls)

Coverage: chocolate-grinder-no-1 (Chocolate Grinder, No. 1)

> pal paradigm to describe what Deleuze and Guattari insist is an non-Oedipal artifice: "[a] genuine consummation is achieved by t h e new machine, a pleasure that can be rightly called autoerotic, o r r a t h e r automatic: birth[ .. . ] , the nuptial celebration of a new alliance, a new a s though t h e eroticism of the machine liberated other unlimited forces" (1983:18).8 Bachelor machines amplify la scossa of sensation to a nullpoint of synaesthetic indifference where any

### h s ~ o t h e t i c s — line 7763 (calls)

Coverage: No direct card hit

> The College of 'Pataphysics s t r i v e s to substantiate the imaginary philosophy that Butler in turn only hypothesizes for his own College of Unreason-a philosophy t h a t he calls h s ~ o t h e t i c s (the nowhere science of Erewhon). Such a P h i l o s o ~ h i edes Als Ob imagines a set of impossible exigencies, each of which requires the s o p h i s t r y o f s possible solution: " [ t o ] require the youths to give intelligent answers to the questions that arise therefro

### a "tree literature — line 8993 (calls)

Coverage: pata-neo-scientific-novel (The Neo-Scientific Novel (Faustroll)), pata-definitional-literature (Definitional Literature (Core Practice))

> he machine expects the reader to behsve like a writer who must deflect the course of the narrative through an ensemble of crucial options: t h e as if of multiple if t h e n s . What Queneau calls a "tree literature" (1986b:156) and what Fournel calls a "theater tree" (1986:159) have corne to represent some of the first texts to discuss the potential for interactive innovations (particularly hypertexts and videogames). Such cases of cybernetic literature begin to dramatize a philosophy of 'pataphysical perspectivism, insofar as they attempt to imagine a multitude of divergent realities created simultaneously from the same text. Queneau in Cent Mille Milliards

### inspiration so much as it — line 9218 (is_a)

Coverage: No direct card hit

> uld "[tlhe time of created cede to the era of creating crestions" (48)--not artifacts, but catalysts: modes d'emploi. not objets d'art, but Poetry is no longer the effect of inspiration so much as it is the cause for inspiration: "[tlhe whole world of literature ought to become the object of numerousl cybernetic.l5 . . .] prostheses" ( 3 1 )--be they linguistic or For Oulipo, inspiration is ultimately not irrational so much as it is surrational. Its creativity results from the fata of a simple law that applies itself to itself in order to form the alea

### than — line 9281 (refers_to)

Coverage: gamic-allegory (Gamic Allegory / Other Act), 84ead3c834721 (The Discovery), a4040b7ce6716 (Alexander, Warrior Jar), 686128d9fa97c (Asimi, Eternal King)

> reativity itself--which is to Say that even 'pataphysics must evoke its own 'pataphysical retroversion. Notes to C h a ~ t e r4 'Oulipo privileges ouvroir over oeuvre. Rather than refer to itself as une sgm'minaire d e littgrature expbrimentale, Oulipo refers to itself a s a un ouvroir de littgrature potentielle, doing so for two reasons: first. the word séminaire connotes the individual experience of m a s c u l i z e d eugenics, whereas the word ouvroir connotes the collective experience of a femininized industry; second, the word expkrimentale suggests the outcome of a practice in the

### thematism — line 9899 (is_a)

Coverage: No direct card hit

> owed from Foucault, but misunderstood by Kroetsch, who attributes to it a hermeneutic connotation that Foucault is careful to avoid. A s Davey suggests, this kind of mnemonic thematism is a reductive endeavour, often characterized by simplistic misprision (1983:3). At best, such criticism is nothing more than a poor case of unconscious ' p a t ~ p h y s i c s , l a r g e l y unaware o f its o w n philosophic absurdities. Irrational Thinktanks Canadian "Pataphysicians parody the acedemic banality of such cr

### thematic thinkers — line 10099 (is_a)

Coverage: No direct card hit

> NCTION" (12): ie. what supplements the "unction" of an otherwise reassuring, but inhibiting, purpose. Rational Geomancu - Canadian "Pataphysics suggests that the mythomania of thematic thinkers is a kind of unconscious 'pataphysics that takes place in what Wurstwagen calls "the oscillating noplace of speculative geology" (1980:150). Wershler-Henry 191 observes that such paleology represents a "lexical chain that runs through the strata of Csnadian "Pataphysics like a vein of precious m e t a l , linking disparate elements in intriguing ways" (68). "Pataphysics swerves away

### just as there — line 11101 (is_a)

Coverage: a4040b7ce6716 (Alexander, Warrior Jar), 38f41a251faba (Patches), pata-hermeneutic-paranoia (Hermeneutic Paranoia (Core Concept))

> discovery 210 and subsequent exploration of its plane of existence by ourselves, its human host" (1980b:25). T h i s 'pataphysical hypothesis is complicated by the fact that, just as there is a parasite in us, there is also a parasite in language, "it is the because language in effect feeds upon itself: mind/ e a t i n g itself" (1980a:12). Dewdney suggests that, like al1 machines, language is itself cyborganic, its operation regulated by a Governor and a Parasite. The Governor is a mechanical device that r e m l a t e s a m a c h i n i c function; t h e Parasite is a cyborganic de

### the notion of a supreme being — line 11154 (is_a)

Coverage: pata-literal-nominalism (Literal Nominalism), pata-infra-mince (Infra Mince), pata-livres-pairs (Livres Pairs (Core Term)), pata-psychopathological-comedy (Psychopathological Comedy)

> unction beyond his own capability" ( 3 1 ) . Dewdney imagines that "pataphysics is itself a parasitic discourse that might subvert the piety o f a 211 gubernatory metaphysics: "the notion of a supreme being is a renouncement of the human miracle" ( 1 9 8 7 9 2 1 , and "the correction for [such] piety is natural history" (1982:lO). 15 The exceptional unlikelihood of life itself already endows reality with a mystery so wondrous that it requires no recourse to a domain beyond thought in order to render it even more wondrous: "[ulltimately our cosmos functions as an inhuman, ye

### Stratification — line 11498 (is_a)

Coverage: No direct card hit

> " ( T R G 1992:19). that 219 ' ~ e l e u z e and Guattari assert thst " [tlhe strata are judgements of God (but the earth[...]constantly that judgement) (1987:40). eludes Stratification is a royal process of capture that arranges disparate parts into long-range, large-scale orders of solidity, and t h e s e strata are always subject t o a nomad process of rupture which deranges disparate parts into short-range, small-scale orders of fluidity. Such "deterritorializationl' not only generates a new stratum at another level, but also modulates its own stratum within its level. " ~ c ~ fery a f implies that paleosexual i t y provides an allegory for an epidemic of accidental coincidence--

### Metaphysics — line 1239 (is_a)

Coverage: pata-tautology (Tautology), pata-intraphysics (Intraphysics (Core Concept)), pata-quantum-pataphysics (Quantum Pataphysics), pata-the-exception (The Exception)

> ..lstrategy o f simulation and the impasse of death i n which it imprisons us," and "[t]his supreme ruse of the system[. . . ] , only a superior ruse can stop" (1994b:153-154). Metaphysics is a supreme ruse because it makes us believe in t h e true; 'pataphysics is a superior ruse because it lets us pretend to be untrue. Truth implodes upon itself and reveals an aporia at its 13 centre--the " [ d l e a d point[ . . . ]where every system c r o s s e s this subtle limit of[ . , . ]contradiction [....]and enters live into non-contradictionw--the ecstasy of though

### that is required of it — line 1740 (is_a)

Coverage: 7a211e82991ab (Hoslow's Petal Whip), pata-gidouille (Gidouille (Core Object)), pata-vocab-b1-gidouille (Gidouille (Vocabulary))

> ex heraldry of its t e x t u a l spectrum: "none of these forms of discourse is required to justify its d a i m to be e x p r e s s i n g a truth before it is interpreted; a l 1 that is required of it is the possibility of talking about it" (40). sees Science in its snimstismic phase that signs e x i s t long b e f o r e being known: they are written-into things by nature, and they extinguish the distance between things in order to reveal the synchronie continuum of their secret order.

### that t h e poet — line 2521 (is_a)

Coverage: pata-nowlege (Nowlege), pata-analogical-thought (Analogical Thought), pata-caesura (Caesura), pata-pataquericals (Pataquericals)

> eriment . Prigogine and Stengers observe that, for such an episteme, "science occupies a peculiar position, that of a poetical interrogation of nature, in the etymological sense that t h e poet is a 'makerY--active," inventing the world post facto while observing the world a priori (301). Science has finally achieved the hyperbole of its own "death," so t o speak, disappearing into a condition of tautologic metalepsis, paradoxically becoming b o t h the cause and effect of its own virtual reality. Science has begun to fulfill the

### u h n writes that "a p a r a d i g i — line 2765 (is_a)

Coverage: pata-analogical-thought (Analogical Thought), pata-caesura (Caesura)

> i t s production. T h e h i s t o r y of t r u t h shows t h a t a persistent c o n c e p t does n o t n e c e s s a r i l y imply i t s c o n s i s t e n t meaning. 42 ' ~ u h n writes that "a p a r a d i g i is a criterion for choosing problems that, while the paradigm is t a k e n for granted, can be assumed to have solutions" (1970:37). a Weltanschauung with three discursive functions: It is first, it ratifies interdictions in order to define what it makes perceivable and thereby improve its accuracy; second, it verifies predictions in order to align the perceivable with the con

### t r u t h itself — line 2814 (is_a)

Coverage: No direct card hit

> tion that purifies a supernal truth of al1 its errors; however, 'pataphysics involves an anti-christological transmutation that purifies an infernal error of al1 its truth (as if t r u t h itself is the filth)-ohence, Ubu in the heraldic allegory of Caesar Antichrist performs a reverse alchemy, in which to rise above sin i s to fa11 from grace. '~allyn observes t h a t , f o r Copernicus and Kepler, " t h e world is the work of a divine poietes," and "what they aim to reveal through their own poetics is t h u s truly[ ...]t h e poetic structure of the world" (20). Donne feels snxiety

### perception — line 3555 (is_a)

Coverage: pata-sensism (Sensism / Sensist), pata-retinal-painting (Retinal Painting (Reinterpreted)), pata-fourth-dimension (The Fourth Dimension), pata-frame-analysis (Frame Analysis)

> ns" ( 1 9 7 9 : 8 4 ) . Jarry likewise argues that reality is but one aspect of an E t h e r n i t y , in w h i c h "there are o n l y hallucinations, or perceptions," and every "perception is an hallucination which is true" (1989:103). Reality is nothing more than a comparative apperception, an as if for a disparate collection of different viewpoints, each one creating the true for itself, while opposing every o t h e r view. Each perspective is thus a solipsistic singularity t

### that the absurdity of tautology — line 3812 (is_a)

Coverage: machinic-dispositif (Machinic Dispositif), structural-homology (Structural Homology), theory-of-pretending (Theory of Pretending), 5d08ab80d8688 (Elden Ring)

> e s t a b l i s h e s i t s own p o s i t i o n within a v i c i o u s c i r c l e " (1960b:176) i n o r d e r to claim what 63 science cannot admit: condition of knowledge. that the absurdity of tautology is a A s Daumal avers, "['plataphysical arguments do not necessarily set up systems designed to demonstrate the truth of this or that proposition;" insteed, "[tlhey generally develop as vicîous circles and bring the human spirit to a limit-state of stupor and scandal" (112). Derrida, for example, d o e s not simply oppose a thesis with its antithesis, nor does he even equate them to a third term of synthesis--nor does Derrida simply invert this system of value between thesis and antithesis, but affirms (and denies) b

### d r o p l e t — line 4236 (is_a)

Coverage: No direct card hit

> n e s of the u n i v e r s e a p p e a r e d t o him g i g a n t i c a l l y enlarged, w h i l s t his own image, r e f l e c t e d d i m l y l ...], was magnified" (195). The d r o p l e t is a m e t a p h o r for the eye i t s e l f , a f l u i d s p h e r e , an " o v o i d m y o p i a , " whose l e n s d o e s n o t inspect t h e real so much as d i s t o r t i t , e a c h drop " d r a w i n g a l o n g b e n e a t h it t h e image of t h e t a n g e n t i a l p o i n t of t h e u n i v e r s e [ . .. ] , m a g n i f y i n g its f a b u l o u s c e n t e r t t (195)--in t h i s case, t h e a l i b i f o r a phantasmal solipsism: t h e image o f man h i m s e l f . N i e t z s c h e argues t h a t , when s u c h a science s t u d i e s the

### The anomslos — line 4325 (is_a)

Coverage: No direct card hit

> l e m e nin t Derrida, the parasite in Serres, etc.)--excesses that replace what they augment, operating against, but within, the limits of the syst-em that must exclude them. The anomslos is the repressed part of a rule which ensures that the rule does not work. It is a difference which makes a difference and is thus synonymous with the cybernetic definition of interferent information--the very measure of surprise. Nietzsche argues that, wherever life seemç repetitive, poetry fulfills a desire for free

### s u c h anomaly — line 4491 (refers_to)

Coverage: No direct card hit

> that must alienate the anomalos? Anomaly is, after all, like a stranger, estranged. Whether damned (as in Fort), accursed (as in Bataille), o r a b - i e c t (as in Kristeva) , s u c h anomaly refers to t h e anomie of an e x c e s s , whose ambiguities t r a n s g r e s s the r u l e that divides identity f rom a l t e r i t y .' For Baudrillard, hovever, this metaphysics of anomie may not apply to a ' p a t a p h y s i c s o f e x c e s s because "[alnomaly i s at play in an aleatory, statistical field[ longer know[ . . . ]of variations and .. . J t r a n s g r e s s

### The curve — line 4899 (is_a)

Coverage: 2cf384ec8cb7a (Beast Clergyman), 86c4765fa621f (Beastman of Farum Azula), 467679becece8 (Beastman of Farum Azula (Greatsword)), 69267d532825f (Beastman of Farum Azula (Throwing Knife))

> f i e s inertia since s u c h a swerve must i m p l y a change i n vector without a change in force. The clinamen represents the minimal obliquity within a laminar trajectory. The curve is a tangent to a d e s c e n t , but a tangent that defies al1 calculus since the curve is itself a tangent composed of nothing but tangents inf initum: ad the volute rhythm of a fractai contour. L u c r e t i u s resorts to such a swerve in order to posit a choice between what Serres regards as two genres of physics: "Venus, that is to say, nature; o r Mars, that is to nature" ( 1 9 8 2 : 9 8 ) . sey, Venus d e n o t e s the eroticism

### clinamen — line 4952 (is_a)

Coverage: pata-clinamen (Clinamen (Core Thesis)), pata-syzygy-surfer (Syzygy Surfer (Computing Concept)), pata-merdre (Merdre! (Core Term)), pata-two-laws (The Two Laws)

> n a l rebellion: "[tlhe clinamen of the elementary be the pleasure principle" (1984:8)--a artfulness disrupting lawfulness. Serres argues that, for such modern physics, "[tlhe clinamen is a principal e l e m e n t o f homeorrhesis," not of homeostasis (1982:119). Atomic events do not be so much as become: their equilibrium does not repeat so much as change. Even though "the time of the clinamen is not necessarily simultaneous with leaving the dead to bury the dead" ( 9 9 ) , such a swerve does provid

### evolution — line 5310 (is_a)

Coverage: the-inexchangeable (The Inexchangeable), 581623b64b37f (Crucible Feather Talisman), 815b70508d3de (Crucible Scale Talisman), f26240ce12ed8 (Revolution of the bottle of Benedictine)

> atchglass embedded in the fontanel o f his skull h e showed me the s t o n e a second time)" ( 1 9 6 5 : 2 3 6 ) . ' ~ a r rimplies ~ that, from the viewpoint of the Ubermensch, evolution is a Sisypheen task not for a humanity that must s o l v e the futile problems of the species, but for the divinity that must imagine m o r e c l e v e r problems for t h e species t o solve (1989:135-136). Daumal even argues t h a t s u c h natural selection is itself 'pataphysical, insofar as it is tautological, stating that each form of l i f e exists as i t is because, if i t were otherwise, i t could not e x i s t (32)--or-as Fort avers, the on

### there — line 5550 (is_a)

Coverage: the-inexchangeable (The Inexchangeable), gamic-allegory (Gamic Allegory / Other Act), 312e27a0abecc (The Green Box), a4040b7ce6716 (Alexander, Warrior Jar)

> e d e t e c t i o n of o r d e r is simply the hindsight of chaos: "The laws of nature corne from conjugation; there i s no nature but that of compounds. In the s a m e way, there are the laws of putting together letters-atoms to produce a text. laws, however, are only federation. fact iteelf: These The law repeats the while things are in the process of being formed, the laws enunciate the federated." (1982:114) '(~audrillard explains this idea by recount i n g a 'pataphysical tale,

### but also rescinding the limit that — line 5890 (is_a)

Coverage: theory-of-pretending (Theory of Pretending), 8a365ff37a44b (Marika's Scarseal), b30341a611608 (Marika's Soreseal), 9662a11a664aa (Radagon's Scarseal)

> e s o f t h e t e r m ) , 103 destroying not only standards for performance, but also histories of performance, not only ascending past a limit (with ever more e n e r g y ) , but also rescinding the limit that is the past (with ever less rnemory). Futurism disavows the ~assbisrnof an obsolete technique for the sake of a synchronistic disappearance, advocating the destruction of museums, for example, o n the assumption that they are nothing more than the "absurd abattoirs of painters and s

### surprise and geometric splendor — line 6288 (is_a)

Coverage: No direct card hit

> evokes a cyborganic schizonoia7--what Marinetti might cal1 fisicofollia, o r "body-madness" (1991:128), the ecstasy of a 'pataphysicisn, for whom " [tlhis new drama of Futurist surprise and geometric splendor is a thousand times more interesting[ . . . ) than human psychology" ( 106 ) . Marinetti equates the force of i n d u s t r i a l automation with t h e v i o l e n t desires o f the unconscious i t s e l f - - t h e ecstasy of a machinic accident that has corne to dramatize t h e s v

### nloise — line 6641 (is_a)

Coverage: No direct card hit

> ic codes of cornputers, the semiotic codes of societies, or even the biologic codes of lifeforms). 1O Serres deploys such tropes in his own effort to insist that, ultimately, "[nloise is the basic element of the 118 software of al1 our logic" (1995:7). Noise is intrinsic to every system that regards it as extrinsic to its own system: in other words, "science is its own noise with itself, it produces its noise from itself" (136), doing so until it cannot hear its own noise, let alone its own wor

### planetary technology" since "it — line 7327 (is_a)

Coverage: No direct card hit

> of withdrawal" but "this can on19 be comprehended ['lpataphysically[ ...,] not metaphysically," and "[tlhis is why Ubu invents ['Ipataphysics at the same tirne as he promotes planetary technology" since "it is the culmination of metaphysics in technology that makes possible the overcoming of metaphysics, that is, ['Ipataphysics" (1997:93). allard rd dissects t h e s e iron collisions o f automobiles with the cool precision of a scientist, depicting the accident as a kind of crashtest for a pornofilm (in the vein of Cronenberg)--an event in which the obscenitg of a message coincide

### t j h e unconscious — line 7428 (is_a)

Coverage: No direct card hit

> mismanages the fundamental becoming of a distributive art, freeing the manufacturing of the d r i v e s from any desire for a despot of desire, because (as Deleuze observes) " [ t j h e unconscious is an orphan, an atheist and a bachelor" (Carrouges 1975:19). 135 9 ~ y o t a r dsuggeste that s u c h machines valorize the incommensurabilities of the paralogical and the paradoxical, neither cancelling nor surpassing the synthesis of the dialectic: "[tlhere is the adversary of Bachelor machination, con

### tlhere — line 7439 (is_a)

Coverage: No direct card hit

> a r dsuggeste that s u c h machines valorize the incommensurabilities of the paralogical and the paradoxical, neither cancelling nor surpassing the synthesis of the dialectic: "[tlhere is the adversary of Bachelor machination, conviction, another word for the concubinage of dissimilarst' ( 1990:49). Bachelor machines dramatize the s s z s g i a of the this and the not-this, continually inverting a dyadic hierarchy, while momentarily subverting its mutual exclusion, al1 the while resisting a totalizing commitment to the metaphysics of the Au

### the "universal artist — line 7748 (calls)

Coverage: pata-particular-irreducible (The Particular & The Irreducible), pata-nepohumanism (Nepohumanism), pata-vocab-b4-panalogy (Panalogy)

> academic parodies, constructing a complicated, but meaningless, bureaucracy of regents and satraps, who lampoon the institutional arbitrariness of scholastic categories, imitating what Swift calls the "universal artist," the kind of person who might breed sheep without wool so as to advance "speculative learning" (147). As Taylor remsrks: "the College of 'Pataphysics promotes ' P a t a ~ h u s i c s in this world and in al1 others" (Taylor 151). The College of 'Pataphysics s t r i v e s to substantiate the imaginary philosophy that Butler in turn only hypothesi

### anoulipism — line 7974 (calls)

Coverage: pata-oulipo-constraints (Anoulipism & Synthoulipism), pata-vocab-b1-anoulipism (Anoulipism (Vocabulary)), pata-vocab-b1-synthoulipism (Synthoulipism)

> ession, Influence becomes an act of "plagiarism by anticipation" (1986:31), in which, by some swerve, a past style merely replicates what a future style has already originated. What Lionnais calls anoulipism (the analysis of a past constraint) may inspire 147 what Lionnais calls synthouli~ism (the synthesis of a future potentia1)--but this subsequent potential in turn revises its precedent constraint through a kind of 'pataphysical retroversion. Such s reversa1 is not surreal in its n o s t a l g i a so much as oneiric in its prognosis. suggests, A s Lionnais " [ i l t is possible to compose texts that have[. ..]surrealist[... Jqualities without having qualities of potential" (Lescu

### that — line 8383 (refers_to)

Coverage: machinic-dispositif (Machinic Dispositif), structural-homology (Structural Homology), theory-of-pretending (Theory of Pretending), 5d08ab80d8688 (Elden Ring)

> raint" (Oulipo 1986:12), if only because this constraint upon constraint dramatizes the reflexive tautology of mathema itself (hence, a writer like Perec might compose a lipogram that refers to itself as a lipoaram, repressing the letter E while mentioning the absent E: "1 [would] start g i v i n g my plotting a symbolic turn, so that[ .. .]it would point up, without blatantly divulging, that Law that was its inspiration, that Law from which it would draw[ fruitful narration") ( 1 9 9 4 : 2 8 2 ) . ...]a rich, Such a strict, but absurd, 155 law about law nevetheless dramatize

### The alea — line 8565 (is_a)

Coverage: c8b100b30caf4 (Rugalea the Great Red Bear)

> cs suggests that the real is a ludic event, whose mandatory f a t e results from an aleatoric rule that produces, not a reprise of its code so much as a surprise from its code. The alea is the a ~ o r i aof the fats, revealing the paradox of a so-called random order. Oulipo suggests that the potentials of constraint coincide with the poiesis of a ludic state, whose mathema constitutes a playful way to s t u d y al1 that is playful (doing so in a manner different from the kind of statistical rationalisrn, which

### irrationalism — line 9304 (is_a)

Coverage: No direct card hit

> uture. 2 ~ u t l e rvrites thst Ünreason[ . ..] is the complement of reason, without whose existence reason itself were non-existent," and for such an Erewhonian 'pataphysics, irrationalism is the hyperbolic, not the antonymic, extreme of rationalism itself: "[e]xtremes are alone logical, but they are always absurd" (187). Reason is an extreme species of reciprocal opposition, whose logic is potentially more threatening than the average s ~ z ~ n and i a its conflation of difference: "the mean is illogical, but an illogical mean is better than the sheer absurdity

### Reason — line 9311 (is_a)

Coverage: 38f41a251faba (Patches), pata-panalogy-principle (Panalogy Principle), pata-psychopathological-comedy (Psychopathological Comedy), pata-absolute-love (Absolute Love)

> an Erewhonian 'pataphysics, irrationalism is the hyperbolic, not the antonymic, extreme of rationalism itself: "[e]xtremes are alone logical, but they are always absurd" (187). Reason is an extreme species of reciprocal opposition, whose logic is potentially more threatening than the average s ~ z ~ n and i a its conflation of difference: "the mean is illogical, but an illogical mean is better than the sheer absurdity of an extreme" (187). 174 '~arinetti writes: "[m]y love of precision[ ...] has naturally given me a taste for numbers, which live and breathe on the paper like living beings in our new numerical sensibilitv" (1991:llO). Algebra provides a mode1 for grammatical i

### onstructed — line 10660 (is_a)

Coverage: 2abd24c2630f5 (Caterpillar Mask), pata-nowlege (Nowlege), pata-doctrine-equivalence (Doctrine of Equivalence), pata-vocab-b1-joke-work (Joke-Work)

> ranoid criticism, extracting a secret history from a known geology b y studying a "TRILOBITE ALPHABET," whose paleoalvphs require a kind of mnemonic literacy ( 1981 :4 - 5 ) : "[c]onstructed is an analogical framework of great complexity with a method (the operating 'pataphysics) based largely upon a posited similaritg in f e a t u r e s b e t w e e n language and geology and intended to function translatively as a modifying instrument upon the data of experience" ( 1986:190). History, for McCaf fery, provides an imaginary solution-to the millenary problems of memory, permitting the culture of one extinct species to be read back through the devices of y e t another species. M c C a f fery conf ronts the petrifying myt

### to mind the paleological imagery of Deleuze and Guattari — line 10794 (calls)

Coverage: f11a4113f0f77 (Abductor Virgin (Swinging Sickle)), 509ccc2ec044b (Abductor Virgin (Wheel)), 0a5fcb95cd8aa (Sorceress Sellen), f8aa33cf61cc4 (Cerulean Seed Talisman)

> , just a s parole, like a node in the earth, i s a plexum, a fold in a "surfaced a r t i c u l a t i o n t t ( M c C a f fery develops a 192 ) . ' pataphysical metaphor that calls to mind the paleological imagery of Deleuze and Guattari, who argue that language involves a process of s t r a t i fication: each molecule is sorted into layered forms ( a 204 s e d i m e n t ) , a n d t h e s e l a y e r e d forms are then f o l d e d i n t o a molarity (an aggregate) (1987:40). T h e two modes o f t h i s "double a r t i c u l a t i o n " a r e mutually r e l a t i v e : "[tlhey not o n l y Vary from o n e s t r a t u m t o a n o t h e r , but i n t e r m i n g l e , a n d w i t h i n t h e same s t r a t u m m u l t i

### and that — line 11092 (is_a)

Coverage: machinic-dispositif (Machinic Dispositif), structural-homology (Structural Homology), 5d08ab80d8688 (Elden Ring), f11a4113f0f77 (Abductor Virgin (Swinging Sickle))

> ex for its own accommodation" (1986:59), utilizing humans as neural slaves in its own sentience, and "[tlhe intact survive1 o f this intelligence is threatened by one thing only, and that is the discovery 210 and subsequent exploration of its plane of existence by ourselves, its human host" (1980b:25). T h i s 'pataphysical hypothesis is complicated by the fact that, just as there is a parasite in us, there is also a parasite in language, "it is the because language in effect feeds upon itself: mind/ e a t i n g itself" (1980a:12). Dewdney s

### The Governor — line 11114 (is_a)

Coverage: No direct card hit

> pon itself: mind/ e a t i n g itself" (1980a:12). Dewdney suggests that, like al1 machines, language is itself cyborganic, its operation regulated by a Governor and a Parasite. The Governor is a mechanical device that r e m l a t e s a m a c h i n i c function; t h e Parasite is a cyborganic device that sabotages a machinic function. l4 The Governor and the Parasite are in a sense both parasitic ( insofar as they disrupt a process), but whereas the Governor directs a flow toward a homeostatic lirnit ( a repetition w i t h i n controls), the Parasite directs a flow toward a

### t J h e Governor — line 11140 (is_a)

Coverage: No direct card hit

> ornpetition beyond c o n t r o l ) . The Governor unveils the power of language over us; the Parasite reveals the power of language in us: adamant limit beyond which[...]it " [ t J h e Governor is an is impossible to conceptualize" (1980b:25), while " [ t J h e Parasite allows the poet to function beyond his own capability" ( 3 1 ) . Dewdney imagines that "pataphysics is itself a parasitic discourse that might subvert the piety o f a 211 gubernatory metaphysics: "the notion of a supreme being is a renouncement of the human miracle" ( 1 9 8 7 9 2 1 , and "the correction for

### si n Los A n g e l e s — line 178 (is_a)

Coverage: No direct card hit

> r speculative imagination; hence, this survey presents itself as a kind of primer for a future of possible reseerch. PREFACE T h e Museum of J u r a s s i c T e c h n o l o ~ si n Los A n g e l e s is a s t r a n g e g a l l e r y , where i n c r e d i b l e v e r i t i e s i n t e g r a t e s o p e r f e c t l y with b e l i e v a b l e u n t r u t h s t h a t a v i s i t o r m a s n o t d e t e c t t h e p e c u l i a r s l i p p a g e from f a c t t o hoax. Wilson, the c u r a t o r , h a s r e b u i l t t h e Wunderkammern of m e d i e v a l a r c h i v e s , p r e s e n t i n g c a b i n e t s and v i t r i n e s , specimens: n o t o n l y of f u l l of b i z a r r e c u r i o s a - - M s o t i

### metaphysics — line 669 (is_a)

Coverage: pata-tautology (Tautology), pata-intraphysics (Intraphysics (Core Concept)), pata-quantum-pataphysics (Quantum Pataphysics), pata-the-exception (The Exception)

> is, at times, the u"(an ectype without prototype), "the object produced through s u g g e s t i o n , educed by hope" .' (1983:18) Like the t i h i s t a s who believe that "metaphysics is a branch of fantastic literature" ( 1 4 ) , the narrator of this fantasy pretends to believe in such an imaginary philosophy, quoting fictitious references to it i n gazettes and treatises. itself an ur His alternative to metaphysics is because his dream of i t has i n d e e d corne true, not only in his story but also in our world. We too fulfill this a p o c a l y p t i c conspiracy by creating, f o r ourselves, a world where

### Reality for the animatismic phase — line 1755 (is_a)

Coverage: the-inexchangeable (The Inexchangeable), seven-theses-countercinema (Seven Theses on Countercinema), card-golden-bough-homoeopathic-magic (Homoeopathic Magic (Law of Similarity)), pata-inconnu-insolite (The Inconnu & Insolite)

> f o r e being known: they are written-into things by nature, and they extinguish the distance between things in order to reveal the synchronie continuum of their secret order. Reality for the animatismic phase is a stable orrery t h a t r e v o l v e s around a central fulcrum. Knowing such a reality involves an exegetic function, reading signs, interpreting them, rearranging them within an anagram that permutes al1 their modes of sympathy and antipathy. Such an anatomy o f forms distributes signs aesthetically throug

### h o r u m — line 1822 (is_a)

Coverage: No direct card hit

> s into each other. The transitive category for 24 l e a d becoming gold transmutes i n t o a r e d e m p t i v e allegory about body becoming soul. The lapis ~ h i l o s o ~ h o r u m is a t h i n g unlike any o t h e r , b u t i t makes t h i n g s so that they are l i k e everything else. Tt is the metaphor for a l 1 metaphor. Donne practices the poetic wisdom o f s u c h a s c e n i c ritual when he d e l i b e r a t e l y misunderstands t h e difference between the s c i e n c e of alchemy and his p o e t r y of c o n c e i t s

### Reality for the mechanismic phase — line 1955 (is_a)

Coverage: the-inexchangeable (The Inexchangeable), seven-theses-countercinema (Seven Theses on Countercinema), card-golden-bough-homoeopathic-magic (Homoeopathic Magic (Law of Similarity)), pata-inconnu-insolite (The Inconnu & Insolite)

> known: they are written ont0 things by culture, and t h e y distinguish the distance between t h i n g s i n order to i n v e n t the synchronie continuum of their proper order. Reality for the mechanismic phase is a stable clock t h a t o p e r a t e s within a static regimen. Knowing such a r e a l i t y involves a mathetic function, testing signs, disquisiting them, regimenting them within a diagram that 27 d i s p l a y s a l 1 t h e i r modes o f i d e n t i t y a n d a l t e r i t y . Such a taxonomy o f forms

### Reality for the organismic phase — line 2166 (is_a)

Coverage: the-inexchangeable (The Inexchangeable), seven-theses-countercinema (Seven Theses on Countercinema), card-golden-bough-homoeopathic-magic (Homoeopathic Magic (Law of Similarity)), pata-inconnu-insolite (The Inconnu & Insolite)

> ing known: they are w r i t t e n across events b y culture, and they distinguish the interval between events in order to direct the diachronic continuum of their normal order. Reality for the organismic phase is a simple engine that generates a stable dynarnic. Knowing such a reality involves an anemnestic function, working signs, implementing them, redeploying them within a program that d i s p l a y s al1 their modes of function and relation. Such an economy of forms distributes its signs pragmatica

### Reality for the cyborganismic phase — line 2364 (is_a)

Coverage: the-inexchangeable (The Inexchangeable), seven-theses-countercinema (Seven Theses on Countercinema), card-golden-bough-homoeopathic-magic (Homoeopathic Magic (Law of Similarity)), pata-inconnu-insolite (The Inconnu & Insolite)

> eyond being known: they are written as events by culture, and they extinguish the interval between events in order to create the synchronic discontinuum of their random order, Reality for the cyborganismic phase is a complex matrix that cornputes a mobile dynamic. Knowing such a reality involves a catamnestic function, playing signs, deregulating them, recombining them within a hologram that displays-al1 their modes of seduction and simulation. Such a synonymy of forms distributes its signs excrementally

### t h e world — line 2820 (is_a)

Coverage: No direct card hit

> the heraldic allegory of Caesar Antichrist performs a reverse alchemy, in which to rise above sin i s to fa11 from grace. '~allyn observes t h a t , f o r Copernicus and Kepler, " t h e world is the work of a divine poietes," and "what they aim to reveal through their own poetics is t h u s truly[ ...]t h e poetic structure of the world" (20). Donne feels snxiety about such a p o e t i c cosmos even though its s y s t e m is more aesthetic than empirical, not verified and rectified so much as symmetrized and harmonized. The problem is th

### implies that truth — line 5269 (is_a)

Coverage: No direct card hit

> with a criterion which is n o t available" (1979:86). No panoptic absolute provides a reliable standard for the unremitting specificity of each truth. '~arr~ like , Nietzsche, implies that truth is a sacred pharos, whose foundation rests upon a l e g a c y of both death and w a s t e , its faecal beacon attracting the b l i n d like flies t o the snare o f i t s church--a monument b u i l t upon the corpse of a comatose c o l o s s u s who takes, as a l i m i t for al1 knowledge, only the point of his exhaustion ( 1 9 6 5 : 2 0 1 ) . Truth is a phallic asylum for s u c h a lingual d e s p o t , insofar as "ItJhis obeliscolychny [...]bas the form o f some g e s t u r e o f command" (1989:96), consigning us to a sentence of imprisonment, despite el1 pretense of enlightenment.

### Truth — line 5279 (is_a)

Coverage: 98555aad800b5 (Roderika), 5c11d28f98b6b (Roderika, Spirit Tuner), b59cd9f1f22c9 (Item Description Lore), nude-descending-a-staircase (Nude Descending a Staircase, No. 2 (Painting))

> s church--a monument b u i l t upon the corpse of a comatose c o l o s s u s who takes, as a l i m i t for al1 knowledge, only the point of his exhaustion ( 1 9 6 5 : 2 0 1 ) . Truth is a phallic asylum for s u c h a lingual d e s p o t , insofar as "ItJhis obeliscolychny [...]bas the form o f some g e s t u r e o f command" (1989:96), consigning us to a sentence of imprisonment, despite el1 pretense of enlightenment. '~austroll provides a conceit for the poetic wisdom in the alchemy of the lapis ~ h i l o s o ~ h o

### To read — line 10150 (is_a)

Coverage: pata-hermeneutic-paranoia (Hermeneutic Paranoia (Core Concept))

> m and tectonic stresses. Such a discipline involves a realignment of topographies. Parts are arranged to produce ley lines of force; cracks are read as fault lines in a form. To read is a seismic act that makes a schiz, a shift, in the relation o f t h e s e parts to each other, either fusing them together or rending them apart. To be a rational geomancer is to apply this mode1 of reading, not only to the land (the as is of the ontic), but also to a text (the as if of the semic): "the geomantic view of literature sees interpretation as any system of alignment" (TRG 199

### p o l l i n a i r e — line 11414 (is_a)

Coverage: No direct card hit

> h, and a sailboat, when divided by a woman and a sailboat, equals a cello, a giraffe, and a weathercock, etc. (115). '~ichol suggests, for example, that the poem "Translating ~ p o l l i n a i r e " is the 54,786,210,294,570th letter in such an i n f i n i t e alphabet (1990:112). To write is to quote one of the points in this series, and to equate the set of the alphabet with a set of al1 integers raises questions about the continuity of such sequences: "the concept of whole letter is itself an interesting one[ ...] s i

### what — line 11429 (is_a)

Coverage: seven-theses-countercinema (Seven Theses on Countercinema), radical-action (Radical Action), gamic-allegory (Gamic Allegory / Other Act), theory-of-pretending (Theory of Pretending)

> h a set of al1 integers raises questions about the continuity of such sequences: "the concept of whole letter is itself an interesting one[ ...] s i n c e if you have H &[...II what are the fractional letters in between them & what do t h e y express" ( 1 9 8 5 : 8 9 ) ? We have no w a y of adequately expressing s u c h improbable exigencies. 218 h h o l p r o v i d e s a " p a t s p h y s i c a l e x p l a n a t i o n of a weathermap, a r g u i n g that such a chart is not a map o f a p r o t e a n c l i m a t e , b u t a n a c t of " a l p h a b e t w o r s h i p , " p l o t t i n g
