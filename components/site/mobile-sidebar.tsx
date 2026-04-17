'use client';

import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { SiteNavigation } from '@/lib/sidebar';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavigationMenu } from './navigation-menu';

interface MobileSidebarProps {
  navigation: SiteNavigation;
}

export function MobileSidebar({ navigation }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

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
        <SheetTitle className="mb-4 pr-12 font-serif text-sm uppercase tracking-[0.2em] text-[var(--text-secondary)]">
          Elden Glass Menu
        </SheetTitle>
        <NavigationMenu navigation={navigation} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
