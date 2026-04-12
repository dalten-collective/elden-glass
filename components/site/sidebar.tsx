'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import type { SidebarData } from '@/lib/content';
import { SidebarLink } from './sidebar-link';
import { GlobalSearch } from './global-search';

interface SidebarProps {
  data: SidebarData;
}

export function Sidebar({ data }: SidebarProps) {
  const [openSections, setOpenSections] = useState({
    scratchWritings: false,
    xenotextTheory: false,
    cosmology: false,
    pataphysics: false,
    bachelorMachines: false,
    duchamp: false,
    critiques: false,
    author: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const livingThesisDateLabel = formatShortDate(data.livingThesis.updated);

  return (
    <aside className="hidden lg:flex fixed top-0 bottom-0 left-0 w-[280px] flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-secondary)] z-[70] overflow-y-auto pt-safe">
      {/* Header Section */}
      <div className="flex-shrink-0 sticky top-0 bg-[var(--bg-secondary)]">
        <Link href="/" className="border-b border-[var(--border-subtle)] p-3 flex items-center gap-3">
          <Image
            src="/images/dashusnavnulsigil.png"
            alt="DashusNavnul Sigil"
            width={48}
            height={48}
            className="opacity-90 flex-shrink-0"
          />
          <span className="font-mono font-bold text-white text-base leading-none whitespace-nowrap">
            ~dashus-navnul
          </span>
        </Link>

        {/* Search */}
        <div className="border-b border-[var(--border-subtle)] p-4">
          <GlobalSearch variant="sidebar" />
        </div>

        {/* Primary Navigation - Home, Living Thesis, Master List, TL;DR, Initial Thesis */}
        <div className="border-b border-[var(--border-subtle)] p-4 space-y-2">
          <SidebarLink
            href="/"
            label="Home Page"
          />
          <SidebarLink
            href="/living-thesis"
            label="Living Thesis"
            meta={livingThesisDateLabel}
          />
          <SidebarLink
            href="/master-list"
            label="Master List"
            meta={`${data.masterList.count} correspondences`}
          />
          <SidebarLink
            href="/tldr"
            label="TL;DR"
            meta="Bitcoin"
          />
          <SidebarLink
            href="/initial-thesis"
            label="Initial Thesis"
            meta="Ethereum"
          />
        </div>
      </div>

      {/* Scrollable Navigation Section - Errata */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <nav className="space-y-6 px-4 py-6">
          {/* Errata header */}
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.25em] text-[var(--accent-gold)]">Errata</p>
          </div>

          {/* Elden Ring Item Cards — direct link */}
          <SidebarLink
            href="/gatherer"
            label="Elden Ring Item Cards"
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
                />
                <SidebarLink
                  href="/large-glass-breakdown"
                  label="Selected Quotes on the Large Glass"
                />
                <SidebarLink
                  href="/duchamp-biography"
                  label="Duchamp Biography"
                />
                <SidebarLink
                  href="/endings"
                  label="Endings as Post-War Japan"
                />
                <SidebarLink
                  href="/golden-bough"
                  label="The Golden Bough"
                />
                <SidebarLink
                  href="/bibliography"
                  label="Bibliography & Resources"
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
                  href="/pataphysics"
                  label="Understand Pataphysics"
                />
                <SidebarLink
                  href="/pataphysics/pataphysics-engine"
                  label="A 'Pataphysics Engine"
                />
                <SidebarLink
                  href="/what-is-pataphysics"
                  label="What is Pataphysics?"
                />
                <SidebarLink
                  href="/vocab"
                  label="Pataphysics Vocabulary"
                />
              </div>
            )}
          </div>

          {/* The Xenotext Theory */}
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
                />
                <SidebarLink
                  href="/xenotext-theory"
                  label="The Xenotext Theory"
                />
                <div className="ml-3 space-y-1">
                  <SidebarLink
                    href="/xenotext-theory#uncontrollable-meaning"
                    label="Uncontrollable Meaning"
                  />
                  <SidebarLink
                    href="/xenotext-theory#flower-crucible-erdtree"
                    label="Flower Crucible & Erdtree"
                  />
                  <SidebarLink
                    href="/xenotext-theory#flower-maidens"
                    label="Flower Maidens"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cosmology */}
          <div>
            <button
              onClick={() => toggleSection('cosmology')}
              className="flex items-center gap-1 w-full text-left text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2 hover:text-[var(--text-secondary)] transition-colors"
            >
              {openSections.cosmology ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Cosmology
            </button>
            {openSections.cosmology && (
              <div className="ml-3 space-y-1">
                <SidebarLink
                  href="/daisugi-cosmology"
                  label="The Daisugi Tree"
                />
                <SidebarLink
                  href="/astrology"
                  label="Elden Ring's Astrology"
                />
              </div>
            )}
          </div>

          {/* Bachelor Machines */}
          <div>
            <button
              onClick={() => toggleSection('bachelorMachines')}
              className="flex items-center gap-1 w-full text-left text-[0.7rem] uppercase tracking-[0.2em] text-[var(--text-tertiary)] mb-2 hover:text-[var(--text-secondary)] transition-colors"
            >
              {openSections.bachelorMachines ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Bachelor Machines
            </button>
            {openSections.bachelorMachines && (
              <div className="ml-3 space-y-1">
                <SidebarLink
                  href="/bachelor-machines"
                  label="Understanding Bachelor Machines"
                />
                <SidebarLink
                  href="/chocolate-grinder"
                  label="The Chocolate Grinder"
                />
                <SidebarLink
                  href="/bachelor-machines/terms"
                  label="Catalog & Vocabulary"
                />
                <SidebarLink
                  href="https://www.eurogamer.net/an-obituary-for-the-architecture-of-dark-souls-eternally-dying-land"
                  label="Eternally Dying Land"
                  external
                />
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
                />
                <div className="ml-3 space-y-1">
                  <SidebarLink
                    href="/impossible-bed"
                    label="The Impossible Bed"
                  />
                </div>
                <SidebarLink
                  href="/readymades"
                  label="The Readymades"
                />
                <SidebarLink
                  href="/chess"
                  label="Chess"
                />
                <SidebarLink
                  href="/the-boxes"
                  label="The Boxes"
                />
                <div className="ml-3 space-y-1">
                  <SidebarLink
                    href="/the-boxes#green-box"
                    label="The Green Box (1934)"
                  />
                  <SidebarLink
                    href="/the-boxes#white-box"
                    label="The White Box (1967)"
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
                  />
                ))}
                {!data.critiques.length && (
                  <p className="px-3 text-sm text-[var(--text-tertiary)]">No critiques yet.</p>
                )}
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
              />
            )}
          </div>

        </nav>
      </div>
    </aside>
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
