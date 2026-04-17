import { withContentlayer } from 'next-contentlayer';

const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  // Contentlayer uses dynamic runtime imports (import(`file://${...}`)) to
  // load its compiled config. Webpack 5's persistent filesystem cache can't
  // statically analyze those, and logs three warnings per compile about
  // unparseable build dependencies. The cache benefit is minimal for this
  // project (MDX is already cached by contentlayer itself), so we disable
  // the persistent cache in favor of webpack's in-memory cache and get a
  // clean dev boot in exchange.
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: 'memory' };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/author/about',
        permanent: true,
      },
      {
        source: '/bibliography',
        destination: '/scratch-writings/bibliography',
        permanent: true,
      },
      {
        source: '/belevan',
        destination: '/scratch-writings/belevan',
        permanent: true,
      },
      {
        source: '/large-glass-breakdown',
        destination: '/scratch-writings/large-glass-breakdown',
        permanent: true,
      },
      {
        source: '/duchamp-biography',
        destination: '/scratch-writings/duchamp-biography',
        permanent: true,
      },
      {
        source: '/endings',
        destination: '/scratch-writings/endings',
        permanent: true,
      },
      {
        source: '/golden-bough',
        destination: '/scratch-writings/golden-bough',
        permanent: true,
      },
      {
        source: '/what-is-pataphysics',
        destination: '/pataphysics/what-is-pataphysics',
        permanent: true,
      },
      {
        source: '/vocab',
        destination: '/pataphysics/vocabulary',
        permanent: true,
      },
      {
        source: '/daisugi-cosmology',
        destination: '/cosmology/daisugi-cosmology',
        permanent: true,
      },
      {
        source: '/astrology',
        destination: '/cosmology/astrology',
        permanent: true,
      },
      {
        source: '/chocolate-grinder',
        destination: '/bachelor-machines/chocolate-grinder',
        permanent: true,
      },
      {
        source: '/rhonda-shearer',
        destination: '/duchamp/rhonda-shearer/profile',
        permanent: true,
      },
      {
        source: '/rhonda-shearer-archive',
        destination: '/duchamp/rhonda-shearer/impossible-bed-ii',
        permanent: true,
      },
      {
        source: '/impossible-bed',
        destination: '/duchamp/rhonda-shearer/impossible-bed-i',
        permanent: true,
      },
      {
        source: '/impossible-bed-i',
        destination: '/duchamp/rhonda-shearer/impossible-bed-i',
        permanent: true,
      },
      {
        source: '/impossible-bed-ii',
        destination: '/duchamp/rhonda-shearer/impossible-bed-ii',
        permanent: true,
      },
      {
        source: '/readymades',
        destination: '/duchamp/readymades/overview',
        permanent: true,
      },
      {
        source: '/readymades-research',
        destination: '/duchamp/readymades/research',
        permanent: true,
      },
      {
        source: '/la-chose-en-soie',
        destination: '/duchamp/readymades/la-chose-en-soie',
        permanent: true,
      },
      {
        source: '/chess',
        destination: '/duchamp/chess/overview',
        permanent: true,
      },
      {
        source: '/chess-research',
        destination: '/duchamp/chess/research',
        permanent: true,
      },
      {
        source: '/the-boxes',
        destination: '/duchamp/the-boxes',
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      'eldenring.wiki.fextralife.com',
      'static1.fextralifeimages.com',
      'static.wikia.nocookie.net',
      'www.toutfait.com',
      'www.wikiart.org',
      'uploads0.wikiart.org',
      'uploads1.wikiart.org',
      'uploads2.wikiart.org',
      'uploads3.wikiart.org',
      'uploads4.wikiart.org',
      'uploads5.wikiart.org',
      'uploads6.wikiart.org',
      'uploads7.wikiart.org',
      'uploads8.wikiart.org',
      'images.nortonsimon.org',
      'gallica.bnf.fr',
      // Used by card #3524 (Spring / Necktie) — Philadelphia Museum of Art IIIF server
      'iiif.duchamparchives.org',
      // Used by card #3814 (Steiner Organ-Planet Correspondence) — Rudolf Steiner Archive
      'rsarchive.org',
    ],
  },
};

export default withContentlayer(nextConfig);
