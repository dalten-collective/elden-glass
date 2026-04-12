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
    <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--text-tertiary)]">
      {items.map(({ label, value, icon: Icon }) => (
        <div key={label} className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[var(--accent-gold)]" />
          <div>
            <p className="uppercase text-[0.65rem] tracking-[0.3em]">{label}</p>
            <p className="text-[var(--text-secondary)]">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
