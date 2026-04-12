'use client';

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
        <span className="cursor-help">
          {children}
        </span>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-[420px] p-0 shadow-2xl outline-none"
          sideOffset={5}
        >
          {loading && (
            <div className="elden-card p-4 text-sm">
              <p className="text-amber-200/60">Loading...</p>
            </div>
          )}

          {!loading && !item && (
            <div className="elden-card p-4 text-sm">
              <p className="text-amber-200/60">Item not found</p>
            </div>
          )}

          {item && (
            <div className="elden-card">
              {/* Header with category tag */}
              <div className="elden-card-header">
                <div className="text-[10px] uppercase tracking-[0.15em] text-amber-200/70 font-light">
                  {item.isGreatRune ? 'Great Rune' : item.category.replace('-', ' ')}
                </div>
              </div>

              {/* Item name and icon */}
              <div className="elden-card-title-section">
                <div className="elden-card-icon-wrapper">
                  <div className="elden-card-icon-inner">
                    {item.icon ? (
                      <Image
                        src={item.icon}
                        alt={item.name}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          // Hide image on error
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-200/30 text-[8px] font-bold text-center px-1">
                        {item.category.replace('-', ' ').toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="elden-card-title">
                    {item.name}
                  </h3>
                  {item.summary && (
                    <p className="text-xs text-amber-100/50 italic leading-tight mt-1 font-light">
                      {item.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              {item.description && (
                <div className="elden-card-description">
                  <p className="text-sm text-stone-200/90 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Stats section */}
              <div className="elden-card-stats">
                {item.weight !== undefined && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-amber-200/60 uppercase tracking-wider font-light">
                      Weight
                    </span>
                    <span className="text-sm text-amber-100/90 font-light">
                      {item.weight}
                    </span>
                  </div>
                )}
                {item.maxHeld && (
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs text-amber-200/60 uppercase tracking-wider font-light">
                      Max Held
                    </span>
                    <span className="text-sm text-amber-100/90 font-light">
                      {item.maxHeld}
                    </span>
                  </div>
                )}
              </div>

              {/* Decorative bottom border */}
              <div className="elden-card-footer"></div>
            </div>
          )}

          <HoverCard.Arrow className="fill-[#1a1410]" />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
