import { SiteShell } from '@/components/site/site-shell';
import { TitleCardProvider } from '@/components/title-cards/title-card-provider';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <TitleCardProvider>
      <SiteShell>{children}</SiteShell>
    </TitleCardProvider>
  );
}
