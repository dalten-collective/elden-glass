import type { EldenRingItem } from '@/types/items';

/**
 * Item Database Utilities
 * Fetches item data from ERDB API or local cache
 */

const ERDB_API_BASE = 'https://api.erdb.wiki/v1';

// Local item database for important items
// This allows for offline access and custom descriptions
const LOCAL_ITEMS: Record<string, EldenRingItem> = {
  'glass-shard': {
    id: 1,
    name: 'Glass Shard',
    category: 'goods',
    summary: 'Shard of filthy glass. Worthless rubbish.',
    description:
      'Glass shard covered in dirt. Because it sparkles in the light, it might be mistaken for an object of value when seen from afar. It cannot produce light by itself. Essentially worthless.',
    icon: '/images/items/glass-shard.png',
    maxHeld: 99,
    maxStored: 600,
    relatedTo: ['the-large-glass', 'shattered-elden-ring'],
  },
  'godricks-great-rune': {
    id: 2,
    name: "Godrick's Great Rune",
    category: 'key-items',
    summary: 'Great Rune of Godrick the Grafted.',
    description:
      'A Great Rune of the shardbearer Godrick the Grafted. Its blessing raises all attributes. This Great Rune is the anchor ring that houses the base, and proves two things: that the Elden Ring can be shattered, and that Godrick is the Lord of All That is Golden.',
    icon: '/images/items/godricks-great-rune.png',
    isGreatRune: true,
    relatedTo: ['chocolate-grinder', 'louis-xv-chassis'],
  },
  'morgotts-great-rune': {
    id: 3,
    name: "Morgott's Great Rune",
    category: 'key-items',
    summary: 'Great Rune of Morgott, the Omen King.',
    description:
      'A Great Rune of the shardbearer Morgott. Its blessing greatly raises maximum HP. Morgott was the Grace-Given Lord of Leyndell, yet he was shackled by accursed blood.',
    icon: '/images/items/morgotts-great-rune.png',
    isGreatRune: true,
    relatedTo: ['chocolate-grinder', 'necktie'],
  },
  'malenias-great-rune': {
    id: 4,
    name: "Malenia's Great Rune",
    category: 'key-items',
    summary: 'Great Rune of Malenia, Blade of Miquella.',
    description:
      "A Great Rune of the shardbearer Malenia. The blessing of this half-rotted rune reduces the healing power of Flask of Crimson Tears. And yet, due to the infusion of Malenia's spirit of resistance, attacks made immediately after receiving damage will partially recover HP.",
    icon: '/images/items/malenias-great-rune.png',
    isGreatRune: true,
    relatedTo: ['chocolate-grinder', 'rollers'],
  },
  'radahns-great-rune': {
    id: 5,
    name: "Radahn's Great Rune",
    category: 'key-items',
    summary: 'Great Rune of Starscourge Radahn.',
    description:
      'A Great Rune of the shardbearer Radahn. Its blessing raises maximum HP, FP, and stamina. Radahn was amongst the children of Rennala and Radagon, who became demigod stepchildren of Queen Marika the Eternal.',
    icon: '/images/items/radahns-great-rune.png',
    isGreatRune: true,
    relatedTo: ['chocolate-grinder', 'rollers', 'juggler-of-gravity'],
  },
  'rykards-great-rune': {
    id: 6,
    name: "Rykard's Great Rune",
    category: 'key-items',
    summary: 'Great Rune of the shardbearer Rykard.',
    description:
      'A Great Rune of the shardbearer Rykard. Its blessing grants a blessing of blood to summoned phantoms, and imparts a Phantom Great Rune upon successful invasion.',
    icon: '/images/items/rykards-great-rune.png',
    isGreatRune: true,
    relatedTo: ['chocolate-grinder', 'rollers'],
  },
  'mohgs-great-rune': {
    id: 7,
    name: "Mohg's Great Rune",
    category: 'key-items',
    summary: 'Great Rune of Mohg, Lord of Blood.',
    description:
      "A Great Rune of the shardbearer Mohg. Its blessing grants a blessing of blood to summoned phantoms, and imparts a phantom Great Rune upon successful invasion. Mohg and Morgott are twin brothers, and their Great Runes are naturally similar. However, Mohg's rune is soaked in accursed blood, from his devout love for the wretched mire that he was born into far below the earth.",
    icon: '/images/items/mohgs-great-rune.png',
    isGreatRune: true,
  },
  'great-rune-of-the-unborn': {
    id: 8,
    name: 'Great Rune of the Unborn',
    category: 'key-items',
    summary: 'Amber egg clutched by Rennala, Queen of the Full Moon.',
    description:
      'Amber egg clutched by Rennala, Queen of the Full Moon. Great Rune of unborn demigods. Perfects those who have been born anew.',
    icon: '/images/items/great-rune-of-the-unborn.png',
    isGreatRune: true,
  },
  'miquellas-great-rune': {
    id: 9,
    name: "Miquella's Great Rune",
    category: 'key-items',
    summary: 'Great Rune relinquished by Miquella.',
    description:
      'A Great Rune relinquished by Miquella. Broken and bereft of its bounty, it retains naught but the power to resist charms. Miquella abandoned everything—including her golden form, strength, and fate—to reach the tower shrouded in shadow, attempting to bury original sin and be reborn as a new deity.',
    icon: '/images/items/miquellas-great-rune.png',
    isGreatRune: true,
  },
  'rune-of-death': {
    id: 10,
    name: 'Rune of Death',
    category: 'key-items',
    summary: 'The Great Rune that was removed from the Elden Ring.',
    description:
      'The Rune of Death is a Great Rune that was originally part of the Elden Ring before Queen Marika removed it upon creating the Golden Order. This removal granted the Demigods immortality by stripping them of their fated deaths. The rune was later sealed within Maliketh, the Black Blade, after he defeated the Gloam-Eyed Queen.',
    icon: '/images/items/rune-of-death.png',
  },
  'golden-seed': {
    id: 11,
    name: 'Golden Seed',
    category: 'consumables',
    summary: "A golden seed that increases a Sacred Flask's number of uses.",
    description:
      "A golden seed, found at the base of an illusory tree. Increases a Sacred Flask's number of uses. These seeds scattered across the lands when the Elden Ring shattered, as if life itself knew that its end has come.",
    icon: '/images/items/golden-seed.png',
  },
  'sacred-tear': {
    id: 12,
    name: 'Sacred Tear',
    category: 'consumables',
    summary: "Blessing of the Erdtree that increases a Sacred Flask's potency.",
    description:
      "Blessing of the Erdtree, worshiped in the churches of all lands; this is but a faint vestige. Increases the potency of a Sacred Flask's restorative effects. During the age of the Erdtree, these tears were used to spread the faith, for theirs was once a certain blessing.",
    icon: '/images/items/sacred-tear.png',
  },
  'mending-rune-of-the-fell-curse': {
    id: 13,
    name: 'Mending Rune of the Fell Curse',
    category: 'key-items',
    summary: 'Loathsome rune gestated by the Dung Eater.',
    description:
      "Loathsome rune gestated by the Dung Eater. Used to restore the fractured Elden Ring when brandished by the Elden Lord. The reviled curse will last eternally, and the world's children, grandchildren, and every generation hence, will be its pustules. If Order is defiled entirely, defilement is defilement no more, and for every curse, a cursed blessing.",
    icon: '/images/items/mending-rune-of-the-fell-curse.png',
  },
  'mending-rune-of-perfect-order': {
    id: 14,
    name: 'Mending Rune of Perfect Order',
    category: 'key-items',
    summary: 'A Rune of transcendental ideology discovered by Goldmask.',
    description:
      'A Rune of transcendental ideology which will attempt to perfect the Golden Order. This item, discovered by the noble Goldmask, restores the fractured Elden Ring when wielded by the Elden Lord. It addresses the imperfection of the current Golden Order, attributing instability to the fickle nature of gods possessing human-like hearts rather than pure ideological law.',
    icon: '/images/items/mending-rune-of-perfect-order.png',
  },
  'mending-rune-of-the-death-prince': {
    id: 55,
    name: 'Mending Rune of the Death-Prince',
    category: 'key-items',
    summary: 'Rune hewn into the Erdtree by Fia, the Deathbed Companion.',
    description:
      'Formed of the rune of the death-prince, hewn into the Erdtree. Can be used to restore the fractured Elden Ring when brandished by the Elden Lord. The Golden Order was created by confining Destined Death. Thus, this new Order will be one of Death restored.',
    icon: '/images/items/mending-rune-of-the-death-prince.png',
  },
  'cursemark-of-death': {
    id: 15,
    name: 'Cursemark of Death',
    category: 'key-items',
    summary: 'Cursemark carved into the discarded flesh of Ranni the Witch.',
    description:
      'Cursemark carved into the discarded flesh of Ranni the Witch. Also known as the half-wheel wound of the centipede. This cursemark was carved at the moment of Death of the first demigod, and should have taken the shape of a circle. However, two demigods perished at the same time, breaking the cursemark into two half-wheels. Ranni was the first of the demigods whose flesh perished, while the Prince of Death perished in soul alone.',
    icon: '/images/items/cursemark-of-death.png',
  },
  'frenzied-flame-seal': {
    id: 16,
    name: 'Frenzied Flame Seal',
    category: 'weapons',
    summary: 'Formless sacred seal bestowed by the maiden of the Three Fingers.',
    description:
      'Formless sacred seal bestowed by the maiden of the Three Fingers. Enhances incantations of the frenzied flame. This seal is the mark of the Lord of Frenzied Flame. Scales incantations using strength, dexterity, intelligence and faith all together.',
    icon: '/images/items/frenzied-flame-seal.png',
  },
  'unalloyed-gold-needle': {
    id: 17,
    name: 'Unalloyed Gold Needle',
    category: 'key-items',
    summary: 'An intricately crafted needle of unalloyed gold, snapped in half.',
    description:
      'An intricately crafted needle of unalloyed gold, snapped in half. A ritual implement crafted to ward away the meddling of outer gods, it is thought capable of forestalling the incurable rotting sickness.',
    icon: '/images/items/unalloyed-gold-needle.png',
  },
  'remembrance-of-the-grafted': {
    id: 18,
    name: 'Remembrance of the Grafted',
    category: 'remembrances',
    summary: 'Remembrance of Godrick, the Grafted.',
    description:
      'Remembrance of Godrick, the Grafted, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a bounty of runes. A feeble man sought power through the grotesque act of grafting.',
    icon: '/images/items/remembrance-of-the-grafted.png',
  },
  'remembrance-of-the-starscourge': {
    id: 19,
    name: 'Remembrance of the Starscourge',
    category: 'remembrances',
    summary: 'Remembrance of Starscourge Radahn.',
    description:
      'Remembrance of Starscourge Radahn, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a great bounty of runes. The Red Lion General wielded gravitational powers which he learned in Sellia during his younger days. All so he would never have to abandon his beloved but scrawny steed.',
    icon: '/images/items/remembrance-of-the-starscourge.png',
  },
  'remembrance-of-the-blasphemous': {
    id: 20,
    name: 'Remembrance of the Blasphemous',
    category: 'remembrances',
    summary: 'Remembrance of Rykard, Lord of Blasphemy.',
    description:
      'Remembrance of Rykard, Lord of Blasphemy, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a bounty of runes. Rykard took the form of a giant serpent that he might devour, grow, and live eternally.',
    icon: '/images/items/remembrance-of-the-blasphemous.png',
  },
  'remembrance-of-the-rot-goddess': {
    id: 21,
    name: 'Remembrance of the Rot Goddess',
    category: 'remembrances',
    summary: 'Remembrance of Malenia, Goddess of Rot.',
    description:
      'Remembrance of Malenia, Goddess of Rot, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a great bounty of runes. Miquella and Malenia are both the children of a single god. As such they are both Empyreans, but suffered afflictions from birth. One was cursed with eternal childhood, and the other harbored rot within.',
    icon: '/images/items/remembrance-of-the-rot-goddess.png',
  },
  'remembrance-of-the-omen-king': {
    id: 22,
    name: 'Remembrance of the Omen King',
    category: 'remembrances',
    summary: 'Remembrance of Morgott, the Omen King.',
    description:
      "Though born one of the graceless Omen, Morgott took it upon himself to become the Erdtree's protector. He loved not in return, for he was never loved. But nevertheless love it he did.",
    icon: '/images/items/remembrance-of-the-omen-king.png',
  },
  'remembrance-of-the-blood-lord': {
    id: 23,
    name: 'Remembrance of the Blood Lord',
    category: 'remembrances',
    summary: 'Remembrance of Mohg, Lord of Blood.',
    description:
      'Remembrance of Mohg, Lord of Blood, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a great bounty of runes. Wishing to raise Miquella to full godhood, Mohg wished to be his consort, taking the role of monarch. But no matter how much of his bloody bedchamber he tried to share, he received no response from the young Empyrean.',
    icon: '/images/items/remembrance-of-the-blood-lord.png',
  },
  'remembrance-of-the-naturalborn': {
    id: 24,
    name: 'Remembrance of the Naturalborn',
    category: 'remembrances',
    summary: 'Remembrance of Astel, Naturalborn of the Void.',
    description:
      'Remembrance of Astel, Naturalborn of the Void, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a great bounty of runes. A malformed star born in the lightless void far away. Once destroyed an Eternal City and took away their sky. A falling star of ill omen.',
    icon: '/images/items/remembrance-of-the-naturalborn.png',
  },
  'remembrance-of-the-full-moon-queen': {
    id: 25,
    name: 'Remembrance of the Full Moon Queen',
    category: 'remembrances',
    summary: 'Remembrance of Rennala, Queen of the Full Moon.',
    description:
      'Remembrance of Rennala, Queen of the Full Moon, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a great bounty of runes. In her youth, Rennala was prominent champion who charmed the academy with her lunar magic, becoming its master. She also led the Glintstone Knights and established the house of Caria as royalty.',
    icon: '/images/items/remembrance-of-the-full-moon-queen.png',
  },
  'remembrance-of-the-black-blade': {
    id: 26,
    name: 'Remembrance of the Black Blade',
    category: 'remembrances',
    summary: 'Remembrance of Maliketh, the Black Blade.',
    description:
      "Remembrance of Maliketh, the Black Blade, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a great bounty of runes. Maliketh was a shadowbound beast given to his Empyrean. Marika's sole need of her shadow was a vessel to lock away Destined Death. Even then, she betrayed him.",
    icon: '/images/items/remembrance-of-the-black-blade.png',
  },
  'remembrance-of-hoarah-loux': {
    id: 27,
    name: 'Remembrance of Hoarah Loux',
    category: 'remembrances',
    summary: 'Remembrance of the warrior Hoarah Loux.',
    description:
      'Remembrance of the warrior Hoarah Loux, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a bounty of runes. When Godfrey, first Elden Lord, was robbed of his grace, becoming Tarnished, he took with him his kinfolk and left the Lands Between. After the Long March of the Tarnished came to an end, Godfrey divested himself of kingship, becoming a simple warrior once more.',
    icon: '/images/items/remembrance-of-hoarah-loux.png',
  },
  'remembrance-of-the-dragonlord': {
    id: 28,
    name: 'Remembrance of the Dragonlord',
    category: 'remembrances',
    summary: 'Remembrance of Dragonlord Placidusax.',
    description:
      'Remembrance of Dragonlord Placidusax, hewn into the Erdtree. The power of its namesake can be unlocked by the Finger Reader. Alternatively, it can be used to gain a great bounty of runes. The Dragonlord whose seat lies at the heart of the storm beyond time is said to have been Elden Lord in the age before the Erdtree. Once his god was fled, the lord continued to await its return.',
    icon: '/images/items/remembrance-of-the-dragonlord.png',
  },
  'erdtrees-favor': {
    id: 29,
    name: "Erdtree's Favor",
    category: 'talismans',
    summary: 'A talisman depicting a special blessing of the Erdtree.',
    description:
      'A talisman depicting a special blessing of the Erdtree that slightly raises maximum HP, stamina, and equip load. Such blessings were personally bestowed upon their recipients by Queen Marika the Eternal when the Age of the Erdtree began.',
    icon: '/images/items/erdtrees-favor.png',
  },
  'marikas-soreseal': {
    id: 30,
    name: "Marika's Soreseal",
    category: 'talismans',
    summary: 'An eye engraved with an Elden Rune, the seal of Queen Marika.',
    description:
      'This legendary talisman is an eye engraved with an Elden Rune, said to be the seal of Queen Marika the Eternal. It greatly raises mind, intelligence, faith, and arcane, but also increases damage taken by a similar measure. Solemn duty weighs upon the one beholden; not unlike a gnawing curse from which there is no deliverance.',
    icon: '/images/items/marikas-soreseal.png',
  },
  'radagons-soreseal': {
    id: 31,
    name: "Radagon's Soreseal",
    category: 'talismans',
    summary: 'An eye engraved with an Elden Rune, the seal of King Consort Radagon.',
    description:
      'This legendary talisman is an eye engraved with an Elden Rune, said to be the seal of King Consort Radagon. Greatly raises vigor, endurance, strength, dexterity, but also increases damage taken by a similar measure. Solemn duty weighs upon the one beholden; not unlike a gnawing curse from which there is no deliverance.',
    icon: '/images/items/radagons-soreseal.png',
  },
  'radagons-scarseal': {
    id: 32,
    name: "Radagon's Scarseal",
    category: 'talismans',
    summary: 'An eye engraved with an Elden Rune.',
    description:
      'An eye engraved with an Elden Rune. Said to be the seal of King Consort Radagon. Raises vigor, endurance, strength, and dexterity, but also increases damage taken.',
    icon: '/images/items/radagons-scarseal.png',
  },
  'marikas-scarseal': {
    id: 33,
    name: "Marika's Scarseal",
    category: 'talismans',
    summary: 'An eye engraved with an Elden Rune.',
    description:
      'An eye engraved with an Elden Rune. Said to be the seal of Queen Marika the Eternal. Raises mind, intelligence, faith, arcane, but also increases damage taken.',
    icon: '/images/items/marikas-scarseal.png',
  },
  'godfrey-icon': {
    id: 34,
    name: 'Godfrey Icon',
    category: 'talismans',
    summary: 'A legendary talisman depicting the Elden Lord Godfrey.',
    description:
      'A legendary talisman depicting the Elden Lord Godfrey. Raises charge attack power of sorceries, incantations, and skills. Godfrey was a ferocious warrior. When he vowed to become a lord, he took the Beast Regent Serosh upon his back to suppress the ceaseless lust for battle that raged within.',
    icon: '/images/items/godfrey-icon.png',
  },
  'dragoncrest-greatshield-talisman': {
    id: 35,
    name: 'Dragoncrest Greatshield Talisman',
    category: 'talismans',
    summary: 'Wrought iron talisman depicting a massive ancient dragon.',
    description:
      'Wrought iron talisman depicting a massive ancient dragon. Enormously boosts physical damage negation. Ancient dragons would protect their lord as a wall of living rock, making the dragon shape symbolic of all manner of protections.',
    icon: '/images/items/dragoncrest-greatshield-talisman.png',
  },
  'millicents-prosthesis': {
    id: 36,
    name: "Millicent's Prosthesis",
    category: 'talismans',
    summary: 'Part of the golden prosthesis used by Millicent.',
    description:
      'Part of the golden prosthesis used by Millicent. The hand is locked into a fist that once raised a sword aloft. Boosts dexterity and raises attack power with successive attacks. Millicent was transformed from a mere bud into a magnificent flower through despair and betrayal, with prophecy of her eventual rebirth as a beautiful scarlet valkyrie.',
    icon: '/images/items/millicents-prosthesis.png',
  },
  'carian-filigreed-crest': {
    id: 37,
    name: 'Carian Filigreed Crest',
    category: 'talismans',
    summary: 'A talisman adorned with the royal crest.',
    description:
      "A talisman adorned with the royal crest. Lowers FP consumed by skills. An honor said to have once been awarded to Carian knights who served as direct retainers to the kingdom's princesses. Now there is only one princess: Ranni the Witch, daughter of Rennala.",
    icon: '/images/items/carian-filigreed-crest.png',
  },
  'cerulean-amber-medallion': {
    id: 38,
    name: 'Cerulean Amber Medallion',
    category: 'talismans',
    summary: 'A medallion with cerulean amber inlaid.',
    description:
      "A medallion with cerulean amber inlaid. Boosts maximum FP. The Erdtree's old sap becomes amber, treasured as the most precious of jewels in the age of Godfrey, the first Elden Lord. A primordial life energy resides inside.",
    icon: '/images/items/cerulean-amber-medallion.png',
  },
  'sacred-relic-sword': {
    id: 39,
    name: 'Sacred Relic Sword',
    category: 'weapons',
    summary: 'Sword wrought from the remains of a god.',
    description:
      'Sword wrought from the remains of a god who should have lived a life eternal. Thoughts on what the weapon portends are many and varied. Some consider it the mark of a great sin, or a sign of a great devastation. Some think it as the end of an age, while others; the beginning.',
    icon: '/images/items/sacred-relic-sword.png',
  },
  'blasphemous-blade': {
    id: 40,
    name: 'Blasphemous Blade',
    category: 'weapons',
    summary: 'Sacred sword of Rykard, Lord of Blasphemy.',
    description:
      'Sacred sword of Rykard, Lord of Blasphemy. Remains of the countless heroes he has devoured writhe upon the surface of this blade. Now they share the same blood, bound together as family. Some HP is restored upon defeating an enemy.',
    icon: '/images/items/blasphemous-blade.png',
  },
  'golden-order-greatsword': {
    id: 41,
    name: 'Golden Order Greatsword',
    category: 'weapons',
    summary: 'Greatsword made of light, modeled after the Elden Ring itself.',
    description:
      'Greatsword made of light, modeled after the Elden Ring itself. Forged by the King Consort Radagon to proudly symbolize the tenets of the Golden Order. One of the legendary armaments. Telltale signs betray that this was once the greatsword bequeathed to him by his first wife, Rennala.',
    icon: '/images/items/golden-order-greatsword.png',
  },
  'malikeths-black-blade': {
    id: 42,
    name: "Maliketh's Black Blade",
    category: 'weapons',
    summary: "Maliketh's black blade which once harbored the power of the Rune of Death.",
    description:
      "Maliketh's black blade which once harbored the power of the Rune of Death. A sad shadow of its former glory. After the Night of Black Knives, Maliketh bound the blade within his own flesh to prevent Death's theft.",
    icon: '/images/items/malikeths-black-blade.png',
  },
  'marikas-hammer': {
    id: 43,
    name: "Marika's Hammer",
    category: 'weapons',
    summary: 'Stone hammer made in the lands of the Numen.',
    description:
      'Stone hammer made in the lands of the Numen, outside the Lands Between. The tool with which Queen Marika shattered the Elden Ring and Radagon attempted to repair it. The hammer partially broke upon shattering the Ring, becoming splintered with rune fragments.',
    icon: '/images/items/marikas-hammer.png',
  },
  'grafted-blade-greatsword': {
    id: 44,
    name: 'Grafted Blade Greatsword',
    category: 'weapons',
    summary: 'The storied sword of Castle Morne.',
    description:
      "The storied sword of Castle Morne. A revenger's weapon, it is burdened with oceans of anger and regret. One of the legendary armaments. A lone surviving champion from a country now vanished was so determined to continue fighting that he claimed the swords of an entire clan of warriors.",
    icon: '/images/items/grafted-blade-greatsword.png',
  },
  'dark-moon-greatsword': {
    id: 45,
    name: 'Dark Moon Greatsword',
    category: 'weapons',
    summary: 'A Moon Greatsword bestowed by a Carian queen upon her spouse.',
    description:
      "A Moon Greatsword bestowed by a Carian queen upon her spouse to honor long-standing tradition. One of the legendary armaments. Ranni's sigil is a full moon, cold and leaden, and this sword is but a beam of its light.",
    icon: '/images/items/dark-moon-greatsword.png',
  },
  'sword-of-night-and-flame': {
    id: 46,
    name: 'Sword of Night and Flame',
    category: 'weapons',
    summary: 'Storied sword and treasure of Caria Manor.',
    description:
      'Storied sword and treasure of Caria Manor. One of the legendary armaments. Astrologers, who preceded the sorcerers, established themselves in mountaintops that nearly touched the sky, and considered the Fire Giants their neighbors.',
    icon: '/images/items/sword-of-night-and-flame.png',
  },
  'hand-of-malenia': {
    id: 47,
    name: 'Hand of Malenia',
    category: 'weapons',
    summary: "Blade built into Malenia's prosthetic arm.",
    description:
      'Blade built into Malenia\'s prosthetic arm. Through consecration it is resistant to rot. Legend claims observers saw "wings of fierce determination that have never known defeat" when it was raised.',
    icon: '/images/items/hand-of-malenia.png',
  },
  'starscourge-greatsword': {
    id: 48,
    name: 'Starscourge Greatsword',
    category: 'weapons',
    summary: 'Curved greatswords of black steel wielded by General Radahn.',
    description:
      'Curved greatswords of black steel wielded by General Radahn. A pair of weapons decorated with a lion mane motif. Radahn earned considerable renown as the Starscourge in his youth, and it is said that it was during this time he engraved the gravity crest upon these blades.',
    icon: '/images/items/starscourge-greatsword.png',
  },
  'eleonoras-poleblade': {
    id: 49,
    name: "Eleonora's Poleblade",
    category: 'weapons',
    summary: 'Twinned naginata forged in the Land of Reeds.',
    description:
      'Twinned naginata forged in the Land of Reeds. Chosen weapon of Eleonora, Violet Bloody Finger. Her mastery of the sword was such that her onslaught was likened to a whirlwind, but now her legacy is stained by accursed blood.',
    icon: '/images/items/eleonoras-poleblade.png',
  },
  'black-knife': {
    id: 50,
    name: 'Black Knife',
    category: 'weapons',
    summary: 'Dagger from the Night of the Black Knives.',
    description:
      'This dagger belonged to an assassin involved in the Night of the Black Knives, when Godwyn the Golden was murdered. Through ritual, the twisted blade was imbued with the stolen Rune of Death.',
    icon: '/images/items/black-knife.png',
  },
  'rivers-of-blood': {
    id: 51,
    name: 'Rivers of Blood',
    category: 'weapons',
    summary: 'Weapon of Okina, swordsman from the Land of Reeds.',
    description:
      "Weapon of Okina, swordsman from the Land of Reeds. A cursed weapon that has felled countless men. When Mohg, the Lord of Blood, first felt Okina's sword, and madness, upon his flesh, he had a proposal, to offer Okina the life of a demon, whose thirst would never go unsated.",
    icon: '/images/items/rivers-of-blood.png',
  },
  'mohgwyns-sacred-spear': {
    id: 52,
    name: "Mohgwyn's Sacred Spear",
    category: 'weapons',
    summary: 'Trident of Mohg, Lord of Blood.',
    description:
      'Trident of Mohg, Lord of Blood. A sacred spear that will come to symbolize his dynasty. As well as serving as a weapon, it is an instrument of communion with an outer god who bestows power upon accursed blood. The mother of truth desires a wound.',
    icon: '/images/items/mohgwyns-sacred-spear.png',
  },
  'fias-mist': {
    id: 53,
    name: "Fia's Mist",
    category: 'spells',
    summary: 'Sorcery of Fia, the Deathbed Companion.',
    description:
      'Sorcery of Fia, the Deathbed Companion. Creates a deathly mist before the caster, which inflicts Death blight upon those who enter. This sorcery can be cast while in motion. Charging enhances range of the mist.',
    icon: '/images/items/fias-mist.png',
  },
  'deathbed-dress': {
    id: 54,
    name: 'Deathbed Dress',
    category: 'armor',
    summary: 'Extremely thin and sheer white dress worn by the Deathbed Companion.',
    description:
      'Extremely thin and sheer white dress worn by the Deathbed Companion as she embraces the dead. Slowly replenishes the HP of nearby allies, but not that of the wearer. The touch of the fabric is exceedingly soft, so as not to harm even the most withered corpse, while stil sharing her warmth.',
    icon: '/images/items/deathbed-dress.png',
  },
};

/**
 * Get item data from local database or ERDB API
 */
export async function getItemData(itemSlug: string): Promise<EldenRingItem | null> {
  // Check local database first
  if (LOCAL_ITEMS[itemSlug]) {
    return LOCAL_ITEMS[itemSlug];
  }

  // TODO: Implement ERDB API fetching
  // For now, return null if not in local database
  console.warn(`Item "${itemSlug}" not found in local database`);
  return null;
}

/**
 * Get all Great Runes
 */
export function getGreatRunes(): EldenRingItem[] {
  return Object.values(LOCAL_ITEMS).filter((item) => item.isGreatRune);
}

/**
 * Search items by name or description
 */
export function searchItems(query: string): EldenRingItem[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(LOCAL_ITEMS).filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.summary?.toLowerCase().includes(lowerQuery)
  );
}
