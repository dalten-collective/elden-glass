import type { LucideIcon } from 'lucide-react';

interface HeroMetaItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface HeroMetaProps {
  items: HeroMetaItem[];
}

export function HeroMeta({ items }: HeroMetaProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--text-tertiary)] sm:gap-4 sm:text-sm">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[var(--accent-gold)]" />
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.25em] sm:text-[0.65rem] sm:tracking-[0.3em]">
              {label}
            </p>
            <p className="text-sm text-[var(--text-secondary)] sm:text-base">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
