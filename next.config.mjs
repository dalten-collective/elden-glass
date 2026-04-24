import { readFileSync } from 'node:fs';

const legacyRedirects = JSON.parse(
  readFileSync(new URL('./content/redirects.json', import.meta.url), 'utf8')
);

const imageHostnames = [
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
];

const nextConfig = {
  typedRoutes: true,
  async redirects() {
    return legacyRedirects;
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [
          {
            key: 'Link',
            value: '</llms.txt>; rel="llms-txt"',
          },
          {
            key: 'X-Llms-Txt',
            value: '/llms.txt',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: imageHostnames.flatMap((hostname) => [
      {
        protocol: 'https',
        hostname,
      },
      {
        protocol: 'http',
        hostname,
      },
    ]),
  },
};

export default nextConfig;
