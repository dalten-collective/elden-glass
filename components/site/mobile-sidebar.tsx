'use client';

import Image from 'next/image';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import type { SidebarData } from '@/lib/content';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SidebarLink } from './sidebar-link';
import { Badge } from '@/components/ui/badge';

interface MobileSidebarProps {
  data: SidebarData;
}

export function MobileSidebar({ data }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState({
    scratchWritings: false,
    xenotextTheory: false,
    pataphysics: false,
    duchamp: false,
    critiques: false,
    author: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const close = () => setOpen(false);

  const livingThesisDateLabel = formatShortDate(data.livingThesis.updated);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="lg:hidden flex flex-col items-center gap-0 p-1 hover:opacity-80 transition-opacity">
          <Image
            src="/images/dashusnavnulsigil.png"
            alt="Open navigation"
            width={56}
            height={56}
            className="opacity-90"
          />
          <div className="flex flex-col items-center -mt-1">
            <ChevronDown className="h-3 w-3 text-[var(--accent-gold)] -mb-2" />
            <ChevronDown className="h-3 w-3 text-[var(--accent-gold)] -mb-2" />
            <ChevronDown className="h-3 w-3 text-[var(--accent-gold)]" />
          </div>
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-serif text-base text-[var(--accent-gold)] leading-tight">Elden Ring Is Marcel Duchamp&apos;s <em>The Bride Stripped Bare By Her Bachelors, Even</em></SheetTitle>
          <Badge>Living Document</Badge>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Primary Navigation */}
          <div className="space-y-2 pb-4 border-b border-[var(--border-subtle)]">
            <SidebarLink href="/" label="Home Page" onNavigate={close} />
            <SidebarLink href="/living-thesis" label="Living Thesis" meta={livingThesisDateLabel} onNavigate={close} />
            <SidebarLink href="/master-list" label="Master List" meta={`${data.masterList.count} correspondences`} onNavigate={close} />
            <SidebarLink href="/tldr" label="TL;DR" meta="Bitcoin" onNavigate={close} />
            <SidebarLink href="/initial-thesis" label="Initial Thesis" meta="Ethereum" onNavigate={close} />
          </div>

          {/* Errata header */}
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[var(--accent-gold)]">Errata</p>
          </div>

          {/* Elden Ring Item Cards — direct link */}
          <SidebarLink
            href="/gatherer"
            label="Elden Ring Item Cards"
            onNavigate={close}
          />

          {/* Scratch Writings */}
          <div>
            <button
              onClick={() => toggleSection('scratchWritings')}
              className="flex items-center gap-1 w-full text-left text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2 hover:text-[var(--text-secondary)] transition-colors"
            >
              {openSections.scratchWritings ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Scratch Writings
            </button>
            {openSections.scratchWritings && (
              <div className="space-y-1">
                <SidebarLink
                  href="/belevan"
                  label="Belevan, Mónica"
                  onNavigate={close}
                />
                <SidebarLink
                  href="/large-glass-breakdown"
                  label="Selected Quotes on the Large Glass"
                  onNavigate={close}
                />
                <SidebarLink
                  href="/duchamp-biography"
                  label="Duchamp Biography"
                  onNavigate={close}
                />
                <SidebarLink
                  href="/endings"
                  label="Endings as Post-War Japan"
                  onNavigate={close}
                />
                <SidebarLink
                  href="/golden-bough"
                  label="The Golden Bough"
                  onNavigate={close}
                />
                <SidebarLink
                  href="/bibliography"
                  label="Bibliography & Resources"
                  onNavigate={close}
                />
              </div>
            )}
          </div>

          {/* Pataphysics */}
          <div>
            <button
              onClick={() => toggleSection('pataphysics')}
              className="flex items-center gap-1 w-full text-left text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2 hover:text-[var(--text-secondary)] transition-colors"
            >
              {openSections.pataphysics ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Pataphysics
            </button>
            {openSections.pataphysics && (
            <div className="space-y-1">
              <SidebarLink
                href="/bachelor-machines"
                label="Understanding Bachelor Machines"
                onNavigate={close}
              />
              <SidebarLink
                href="/pataphysics"
                label="Understand Pataphysics"
                onNavigate={close}
              />
              <SidebarLink
                href="/what-is-pataphysics"
                label="What is Pataphysics?"
                onNavigate={close}
              />
              <SidebarLink
                href="/vocab"
                label="Pataphysics Vocabulary"
                onNavigate={close}
              />
            </div>
            )}
          </div>

          {/* Theories */}
          <div>
            <button
              onClick={() => toggleSection('xenotextTheory')}
              className="flex items-center gap-1 w-full text-left text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2 hover:text-[var(--text-secondary)] transition-colors"
            >
              {openSections.xenotextTheory ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              The Xenotext Theory
            </button>
            {openSections.xenotextTheory && (
              <div className="space-y-1">
                <SidebarLink
                  href="/xenotext"
                  label="Xenotext Cipher"
                  meta="Interactive"
                  onNavigate={close}
                />
                <SidebarLink
                  href="/xenotext-theory"
                  label="The Xenotext Theory"
                  onNavigate={close}
                />
                <div className="ml-3 space-y-1">
                  <SidebarLink
                    href="/xenotext-theory#flower-crucible-erdtree"
                    label="Flower Crucible & Erdtree"
                    onNavigate={close}
                  />
                  <SidebarLink
                    href="/xenotext-theory#flower-maidens"
                    label="Flower Maidens"
                    onNavigate={close}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Duchamp */}
          <div>
            <button
              onClick={() => toggleSection('duchamp')}
              className="flex items-center gap-1 w-full text-left text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2 hover:text-[var(--text-secondary)] transition-colors"
            >
              {openSections.duchamp ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Duchamp
            </button>
            {openSections.duchamp && (
              <div className="ml-3 space-y-1">
                <SidebarLink
                  href="/rhonda-shearer"
                  label="Rhonda Shearer"
                  onNavigate={close}
                />
                <SidebarLink
                  href="/readymades"
                  label="The Readymades"
                  onNavigate={close}
                />
                <SidebarLink
                  href="/chess"
                  label="Chess"
                  onNavigate={close}
                />
                <SidebarLink
                  href="/the-boxes"
                  label="The Boxes"
                  onNavigate={close}
                />
                <div className="ml-3 space-y-1">
                  <SidebarLink
                    href="/the-boxes#green-box"
                    label="The Green Box (1934)"
                    onNavigate={close}
                  />
                  <SidebarLink
                    href="/the-boxes#white-box"
                    label="The White Box (1967)"
                    onNavigate={close}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Critiques */}
          <div>
            <button
              onClick={() => toggleSection('critiques')}
              className="flex items-center gap-1 w-full text-left text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2 hover:text-[var(--text-secondary)] transition-colors"
            >
              {openSections.critiques ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Critiques
            </button>
            {openSections.critiques && (
              <div className="space-y-1">
                {data.critiques.map((critique) => (
                  <SidebarLink
                    key={critique.slug}
                    href={`/critiques/${critique.slug}`}
                    label={critique.title}
                    onNavigate={close}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Author */}
          <div>
            <button
              onClick={() => toggleSection('author')}
              className="flex items-center gap-1 w-full text-left text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2 hover:text-[var(--text-secondary)] transition-colors"
            >
              {openSections.author ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Author
            </button>
            {openSections.author && (
              <SidebarLink
                href="/about"
                label={data.about.title}
                onNavigate={close}
              />
            )}
          </div>

        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Formats an ISO date string as a short month/day label (e.g. "Apr 11").
 * Parses the date components directly to avoid timezone offset bugs that
 * would otherwise cause a UTC-midnight date to display as the prior day.
 */
function formatShortDate(iso: string): string {
  const dateOnly = iso.split('T')[0];
  const [, monthStr, dayStr] = dateOnly.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = Number(monthStr) - 1;
  const day = Number(dayStr);
  return `${months[monthIndex] ?? ''} ${day}`;
}
