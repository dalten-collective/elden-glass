import { NextResponse } from 'next/server';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://eldenglass.com';

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: Date;
  guid: string;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRss(items: FeedItem[]): string {
  const itemsXml = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <guid isPermaLink="true">${item.guid}</guid>
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Elden Glass - The Large Glass Discovery</title>
    <link>${BASE_URL}</link>
    <description>Elden Ring is a digital reimagining of Marcel Duchamp's The Bride Stripped Bare by Her Bachelors, Even. Blockchain-verified research proving FromSoftware's masterpiece is a 'pataphysical artwork.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;
}

export async function GET() {
  // Core content items - these would ideally come from a CMS or database
  const items: FeedItem[] = [
    {
      title: 'The Discovery: Elden Ring Is The Large Glass',
      link: `${BASE_URL}/discovery`,
      description:
        "How a question to ChatGPT revealed that Elden Ring is a complete digital reimagining of Marcel Duchamp's The Bride Stripped Bare by Her Bachelors, Even.",
      pubDate: new Date('2024-10-01'),
      guid: `${BASE_URL}/discovery`,
    },
    {
      title: 'Understanding Bachelor Machines',
      link: `${BASE_URL}/bachelor-machines`,
      description:
        'The bachelor machine is a closed circuit of desire and frustration. In Elden Ring, the Tarnished operates as the chocolate grinder - dying endlessly, grinding their own chocolate.',
      pubDate: new Date('2024-10-15'),
      guid: `${BASE_URL}/bachelor-machines`,
    },
    {
      title: 'What Is Pataphysics?',
      link: `${BASE_URL}/what-is-pataphysics`,
      description:
        "The science of imaginary solutions. Alfred Jarry's discipline extends beyond metaphysics as far as metaphysics extends beyond physics. FromSoftware built the first true 'pataphysical video game.",
      pubDate: new Date('2024-10-20'),
      guid: `${BASE_URL}/what-is-pataphysics`,
    },
    {
      title: 'The Prime Document',
      link: `${BASE_URL}/prime`,
      description:
        'The original discovery, blockchain-timestamped and cryptographically verified. The prime document cannot be altered, ensuring the integrity of the original insight.',
      pubDate: new Date('2024-11-01'),
      guid: `${BASE_URL}/prime`,
    },
    {
      title: 'The Living Document',
      link: `${BASE_URL}/living`,
      description:
        'The synthesis evolves as new connections surface. This living document grows while the prime document remains immutable.',
      pubDate: new Date('2024-11-15'),
      guid: `${BASE_URL}/living`,
    },
    {
      title: "Rhonda Shearer and Duchamp's Secret",
      link: `${BASE_URL}/rhonda-shearer-archive`,
      description:
        "Rhonda Roland Shearer discovered that Duchamp's readymades were not found objects but carefully constructed artworks. Her research validates the depth of Duchamp's conceptual games.",
      pubDate: new Date('2024-12-01'),
      guid: `${BASE_URL}/rhonda-shearer-archive`,
    },
  ];

  const rss = generateRss(items);

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
