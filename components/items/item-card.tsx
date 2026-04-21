'use client';

/**
 * ItemCard — hover-card lookup for an Elden Ring item referenced in prose.
 *
 * Rendered in the Delay-in-Glass voice: a solid pane with a small mono
 * category label, an italic serif title, plain prose description, and a
 * thin gold-dim rule at the bottom. No glows, no gilded edges — the old
 * `.elden-card` aesthetic the overhaul retires lives in the git history.
 */

import { useEffect, useState } from 'react';
import Image from 'next/image';
import * as HoverCard from '@radix-ui/react-hover-card';

import type { EldenRingItem } from '@/types/items';
import { getItemData } from '@/lib/items';

interface ItemCardProps {
  itemSlug: string;
  children: React.ReactNode;
}

export function ItemCard({ itemSlug, children }: ItemCardProps) {
  const [item, setItem] = useState<EldenRingItem | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadItem() {
      setLoading(true);
      const data = await getItemData(itemSlug);
      if (mounted) {
        setItem(data);
        setLoading(false);
      }
    }

    loadItem();

    return () => {
      mounted = false;
    };
  }, [itemSlug]);

  return (
    <HoverCard.Root openDelay={200} closeDelay={100}>
      <HoverCard.Trigger asChild>
        <span className="cursor-help">{children}</span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-[420px] p-0 shadow-2xl outline-none"
          sideOffset={5}
        >
          {loading && <HoverShell>Loading…</HoverShell>}

          {!loading && !item && <HoverShell>Item not found</HoverShell>}

          {item && (
            <div className="pane--solid" style={{ position: 'relative' }}>
              <div
                style={{
                  padding: '14px 20px 10px',
                  borderBottom: '1px solid var(--pane-edge)',
                }}
              >
                <span
                  className="eyebrow eyebrow--gold"
                  style={{ fontSize: 10, letterSpacing: '0.2em' }}
                >
                  {item.isGreatRune ? 'Great Rune' : item.category.replace('-', ' ')}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '72px 1fr',
                  gap: 16,
                  padding: '14px 20px 12px',
                  borderBottom: '1px solid var(--pane-edge)',
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    border: '1px solid var(--pane-edge)',
                    background: 'var(--ink)',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {item.icon ? (
                    <Image
                      src={item.icon}
                      alt={item.name}
                      fill
                      sizes="72px"
                      style={{ objectFit: 'contain', padding: 6 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 8,
                        color: 'var(--paper-dimmer)',
                        fontFamily: 'var(--font-mono)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        padding: 4,
                        textAlign: 'center',
                      }}
                    >
                      {item.category.replace('-', ' ')}
                    </div>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      fontSize: 19,
                      color: 'var(--paper)',
                      lineHeight: 1.2,
                      margin: 0,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {item.name}
                  </h3>
                  {item.summary && (
                    <p
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 13,
                        fontStyle: 'italic',
                        color: 'var(--paper-dimmer)',
                        lineHeight: 1.3,
                        marginTop: 6,
                      }}
                    >
                      {item.summary}
                    </p>
                  )}
                </div>
              </div>

              {item.description && (
                <div
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid var(--pane-edge)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: 14,
                      color: 'var(--paper-dim)',
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              )}

              <div
                style={{
                  padding: '10px 20px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                }}
              >
                {item.weight !== undefined && <Stat label="weight" value={String(item.weight)} />}
                {item.maxHeld && <Stat label="max held" value={String(item.maxHeld)} />}
              </div>

              <div
                style={{
                  height: 1,
                  background:
                    'linear-gradient(90deg, transparent, var(--gold-dim) 20%, var(--gold) 50%, var(--gold-dim) 80%, transparent)',
                }}
              />
            </div>
          )}

          <HoverCard.Arrow style={{ fill: 'var(--ink-2)' }} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

// Small placeholder while the item lookup resolves.
function HoverShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="pane--solid"
      style={{
        padding: 16,
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        color: 'var(--paper-dimmer)',
      }}
    >
      {children}
    </div>
  );
}

// Key-value row shown in the stats strip — spec label on the left, value right.
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span
        style={{
          color: 'var(--paper-dimmest)',
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          fontSize: 10,
        }}
      >
        {label}
      </span>
      <span style={{ color: 'var(--paper)' }}>{value}</span>
    </div>
  );
}
