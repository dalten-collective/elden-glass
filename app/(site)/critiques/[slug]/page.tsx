import { CalendarDays, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCritiqueBySlug, getCritiques } from '@/lib/content';

interface CritiquePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getCritiques().map((critique) => ({ slug: critique.slug }));
}

export default function CritiquePage({ params }: CritiquePageProps) {
  const critique = getCritiqueBySlug(params.slug);

  if (!critique) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="space-y-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
              Critique dossier
            </p>
            <CardTitle className="mt-2 text-4xl">{critique.title}</CardTitle>
            <p className="text-[var(--text-secondary)]">Response to “{critique.targetTitle}”</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
              <CalendarDays className="h-4 w-4" />
              <span>Updated {new Date(critique.updated).toLocaleDateString()}</span>
            </div>
            <Button asChild variant="ghost" className="gap-2">
              <Link href={critique.targetUrl as any} target="_blank" rel="noreferrer">
                View source
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <p className="text-[var(--text-secondary)]">{critique.summary}</p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="min-h-[320px]">
          <CardHeader>
            <CardTitle className="text-base text-[var(--text-secondary)]">Original work</CardTitle>
          </CardHeader>
          <CardContent>
            <iframe
              title={critique.targetTitle}
              src={critique.targetUrl}
              sandbox="allow-same-origin allow-scripts allow-popups"
              className="h-[420px] w-full rounded-xl border border-[var(--border-emphasis)] bg-white"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-[var(--text-secondary)]">Response</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownRenderer code={critique.body.code} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
