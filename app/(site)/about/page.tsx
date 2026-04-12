import { UserRound } from 'lucide-react';

import { MarkdownRenderer } from '@/components/mdx/markdown-renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAboutDocument } from '@/lib/content';

export default function AboutPage() {
  const about = getAboutDocument();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--text-tertiary)]">
              About the author
            </p>
            <CardTitle className="mt-2 text-4xl">{about.title}</CardTitle>
            {about.role && <p className="text-[var(--text-secondary)]">{about.role}</p>}
          </div>
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <UserRound className="h-5 w-5 text-[var(--accent-gold)]" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-tertiary)]">
                Updated
              </p>
              <p>{new Date(about.updated).toLocaleDateString()}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MarkdownRenderer code={about.body.code} />
        </CardContent>
      </Card>
    </div>
  );
}
