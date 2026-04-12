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
