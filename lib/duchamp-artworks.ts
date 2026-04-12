export interface DuchampArtwork {
  title: string;
  year?: string;
  filename: string;
}

export interface DuchampPeriod {
  title: string;
  years: string;
  works: DuchampArtwork[];
}

export const duchampArtworks: DuchampPeriod[] = [
  {
    title: 'Early Works',
    years: '1901-1910',
    works: [
      { title: 'Yvonne in Kimono', year: '1901', filename: 'yvonne-in-kimono-1901.jpg' },
      {
        title: 'Portrait of Yvonne Duchamp',
        year: '1901',
        filename: 'portrait-of-yvonne-duchamp-1901.jpg',
      },
      { title: 'Church at Blainville', year: '1902', filename: 'church-at-blainville-1902.jpg' },
      {
        title: 'Landscape at Blainville',
        year: '1902',
        filename: 'landscape-at-blainville-1902.jpg',
      },
      {
        title: 'Parva Domus Magna Quies',
        year: '1902',
        filename: 'parva-domus-magna-quies-1902.jpg',
      },
      { title: 'Play', year: '1902', filename: 'play-1902.jpg' },
      {
        title: 'Man Seated by a Window',
        year: '1907',
        filename: 'man-seated-by-a-window-1907.jpg',
      },
      { title: 'Chauvel', year: '1910', filename: 'chauvel-1910.jpg' },
      { title: 'Chess Game', year: '1910', filename: 'chess-game-1910.jpg' },
      { title: 'Laundry Barge', year: '1910', filename: 'laundry-barge-1910.jpg' },
      {
        title: 'Nude with Black Stockings',
        year: '1910',
        filename: 'nude-with-black-stockings-1910.jpg',
      },
      {
        title: 'Portrait of Dr. Dumouchel',
        year: '1910',
        filename: 'portrait-of-dr-dumouchel-1910.jpg',
      },
      {
        title: 'Portrait of Dr. Ferdinand Tribout',
        year: '1910',
        filename: 'portrait-of-dr-ferdinand-tribout-1910.jpg',
      },
      {
        title: "Portrait of the Artist's Father",
        year: '1910',
        filename: 'portrait-of-the-artist-s-father-1910.jpg',
      },
      { title: 'Standing Nude', year: '1910', filename: 'standing-nude-1910.jpg' },
      { title: 'Standing Nude (variant)', year: '1910', filename: 'standing-nude-1910-1.jpg' },
      { title: 'Two Nudes', year: '1910', filename: 'two-nudes-1910.jpg' },
    ],
  },
  {
    title: 'Major Period',
    years: '1911-1914',
    works: [
      { title: 'About Young Sister', year: '1911', filename: 'about-young-sister-1911.jpg' },
      { title: 'Baptism', year: '1911', filename: 'baptism-1911.jpg' },
      { title: 'Japanese Apple Tree', year: '1911', filename: 'japanese-apple-tree-1911.jpg' },
      {
        title: 'Landscape Study for Paradise',
        year: '1911',
        filename: 'landscape-study-for-paradise-1911.jpg',
      },
      { title: 'Portrait Dulcinea', year: '1911', filename: 'portrait-dulcinea-1911.jpg' },
      {
        title: 'Portrait of Chess Players',
        year: '1911',
        filename: 'portrait-of-chess-players-1911.jpg',
      },
      {
        title: 'Sad Young Man in a Train',
        year: '1911',
        filename: 'sad-young-man-in-a-train-1911.jpg',
      },
      { title: 'Sonata', year: '1911', filename: 'sonata-1911.jpg' },
      { title: 'The Chess Players', year: '1911', filename: 'the-chess-players-1911.jpg' },
      {
        title: 'Young Girl and Man in Spring',
        year: '1911',
        filename: 'young-girl-and-man-in-spring-1911.jpg',
      },
      {
        title: 'Yvonne and Magdeleine Torn in Tatters',
        year: '1911',
        filename: 'yvonne-and-magdeleine-torn-in-tatters-1911.jpg',
      },
      { title: 'Bride', year: '1912', filename: 'bride-1912.jpg' },
      {
        title: 'King and Queen Surrounded by Swift Nudes',
        year: '1912',
        filename: 'king-and-queen-surrounded-by-swift-nudes-1912.jpg',
      },
      {
        title: 'Nude Descending a Staircase No. 2',
        year: '1912',
        filename: 'nude-descending-a-staircase-no-2-1912.jpg',
      },
      {
        title: "Portrait of Gustave Candel's Mother",
        year: '1912',
        filename: 'portrait-of-gustave-candel-s-mother-1912.jpg',
      },
      {
        title: 'Transition of Virgin into a Bride',
        year: '1912',
        filename: 'transition-of-virgin-into-a-bride-1912.jpg',
      },
      { title: 'Bicycle Wheel', year: '1913', filename: 'bicycle-wheel-1913.jpg' },
      { title: 'Bottlerack', year: '1914', filename: 'bottlerack-1914.jpg' },
      { title: 'Chocolate Grinder', year: '1914', filename: 'chocolate-grinder-1914.jpg' },
      {
        title: 'Chocolate Grinder (variant)',
        year: '1914',
        filename: 'chocolate-grinder-1914-1.jpg',
      },
      { title: 'Network of Stoppages', year: '1914', filename: 'network-of-stoppages-1914.jpg' },
    ],
  },
  {
    title: 'Readymades & Later Works',
    years: '1915-1968',
    works: [
      {
        title: 'Glider Containing a Water Mill in Neighboring Metals',
        year: '1915',
        filename: 'glider-containing-a-water-mill-in-neighboring-metals-1915.jpg',
      },
      {
        title: 'In Advance of the Broken Arm',
        year: '1915',
        filename: 'in-advance-of-the-broken-arm-1915.jpg',
      },
      { title: 'Apolinère Enameled', year: '1916', filename: 'apolinere-enamelled-1916.jpg' },
      { title: 'With Hidden Noise', year: '1916', filename: 'with-hidden-noise-1916.jpg' },
      { title: 'Fountain', year: '1917', filename: 'fountain-1917.jpg' },
      {
        title: 'To Be Looked at (from the Other Side of the Glass)',
        year: '1918',
        filename:
          'to-be-looked-at-from-the-other-side-of-the-glass-with-one-eye-close-to-for-almost-an-hour-1918.jpg',
      },
      { title: '50 cc of Paris Air', year: '1919', filename: '50-cc-of-paris-air-1919.jpg' },
      {
        title: 'L.H.O.O.Q. (Mona Lisa with Moustache)',
        year: '1919',
        filename: 'l-h-o-o-q-mona-lisa-with-moustache-1919.jpg',
      },
      { title: 'Fresh Widow', year: '1920', filename: 'fresh-widow-1920.jpg' },
      {
        title: 'Rotary Glass Plates (Precision Optics)',
        year: '1920',
        filename: 'rotary-glass-plates-precision-optics-1920.jpg',
      },
      {
        title: 'The Brawl at Austerlitz',
        year: '1921',
        filename: 'the-brawl-at-austerlitz-1921.jpg',
      },
      { title: 'Disks Bearing Spirals', year: '1923', filename: 'disks-bearing-spirals-1923.jpg' },
      {
        title: 'The Bride Stripped Bare by Her Bachelors',
        year: '1923',
        filename: 'the-bride-stripped-bare-by-her-bachelors-1923.jpg',
      },
      { title: 'Monte Carlo Bond', year: '1924', filename: 'monte-carlo-bond-1924.jpg' },
      { title: 'Rotary Demisphere', year: '1925', filename: 'rotary-demisphere-1925.jpg' },
      {
        title: 'Cover Design for View Magazine',
        year: '1945',
        filename: 'cover-design-for-view-magazine-1945.jpg',
      },
      {
        title: 'Please Touch (Cover Design for Le Surréalisme)',
        year: '1947',
        filename: 'please-touch-cover-design-for-le-surr%C3%A9alisme-1947.jpg',
      },
      {
        title: 'Female Fig Leaf (Cover Design for Le Surréalisme)',
        year: '1956',
        filename: 'female-fig-leaf-cover-design-for-le-surr%C3%A9alisme-1956.jpg',
      },
      {
        title: 'Self Portrait in Profile',
        year: '1958',
        filename: 'self-portrait-in-profile-1958.jpg',
      },
      {
        title: 'With My Tongue in My Cheek',
        year: '1959',
        filename: 'with-my-tongue-in-my-cheek-1959.jpg',
      },
      {
        title: 'Given: 1. The Waterfall, 2. The Illuminating Gas',
        year: '1966',
        filename: 'given-1-the-waterfall-2-the-illuminating-gas-1966.jpg',
      },
      {
        title: 'Study for Given: 1. The Waterfall, 2. Illuminating Gas',
        filename: 'study-for-given-1-the-waterfall-2-illuminating-gas.jpg',
      },
      { title: 'The Bec Auer', year: '1967', filename: 'the-bec-auer-1967.jpg' },
      {
        title: 'Selected Details After Courbet',
        year: '1968',
        filename: 'selected-details-after-courbet-1968.jpg',
      },
      {
        title: 'Selected Details After Cranach',
        year: '1968',
        filename: 'selected-details-after-cranach-1968.jpg',
      },
    ],
  },
  {
    title: 'Undated Works',
    years: '',
    works: [
      { title: 'Nine Malic Moulds', filename: 'nine-malice-moulds.jpg' },
      { title: 'Portrait of Jacques Villon', filename: 'portrait-of-jacques-villon.jpg' },
      { title: 'Portrait of Yvonne Duchamp', filename: 'portrait-of-yvonne-duchamp.jpg' },
      { title: 'The Bush', filename: 'the-bush.jpg' },
    ],
  },
];
