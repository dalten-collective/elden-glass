'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { SidebarData } from '@/lib/content';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu } from './navigation-menu';
import { getSiteNavigation } from './site-navigation';

interface MobileSidebarProps {
  data: SidebarData;
}

export function MobileSidebar({ data }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const navigation = useMemo(() => getSiteNavigation(data), [data]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-lg px-1 py-1 transition-opacity hover:opacity-80 lg:hidden"
        >
          <Image
            src="/images/dashusnavnulsigil.png"
            alt=""
            width={56}
            height={56}
            className="opacity-90"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[var(--border-subtle)] bg-[rgb(var(--bg-secondary-rgb)/0.65)]">
            <ChevronDown className="h-7 w-7 text-[var(--accent-gold)]" />
          </div>
        </button>
      </SheetTrigger>
      <SheetContent className="w-[min(24rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)]">
        <SheetHeader>
          <SheetTitle className="pr-12 font-serif text-base leading-tight text-[var(--accent-gold)]">
            Elden Ring Is Marcel Duchamp&apos;s <em>The Bride Stripped Bare By Her Bachelors, Even</em>
          </SheetTitle>
          <Badge>Living Document</Badge>
        </SheetHeader>
        <NavigationMenu navigation={navigation} onNavigate={() => setOpen(false)} className="mt-6" />
      </SheetContent>
    </Sheet>
  );
}
