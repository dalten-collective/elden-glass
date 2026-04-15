import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Binary,
  BookOpen,
  Building2,
  CalendarDays,
  CircleDot,
  Clock,
  Compass,
  Crown,
  Dna,
  Eye,
  FileText,
  Flame,
  FlaskConical,
  Flower2,
  GitBranch,
  Globe,
  HelpCircle,
  Lightbulb,
  Lock,
  Microscope,
  Moon,
  Orbit,
  Package,
  Quote as QuoteIcon,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Sword,
  Target,
  TreeDeciduous,
  User,
  Users,
  Zap,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  binary: Binary,
  book: BookOpen,
  building: Building2,
  calendar: CalendarDays,
  circle: CircleDot,
  clock: Clock,
  compass: Compass,
  crown: Crown,
  dna: Dna,
  eye: Eye,
  file: FileText,
  flame: Flame,
  flask: FlaskConical,
  flower: Flower2,
  branch: GitBranch,
  globe: Globe,
  help: HelpCircle,
  lightbulb: Lightbulb,
  lock: Lock,
  microscope: Microscope,
  moon: Moon,
  orbit: Orbit,
  package: Package,
  quote: QuoteIcon,
  search: Search,
  shield: ShieldCheck,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  sword: Sword,
  target: Target,
  tree: TreeDeciduous,
  user: User,
  users: Users,
  zap: Zap,
};

const ACCENT_CLASSES: Record<string, { icon: string; hover: string }> = {
  gold: {
    icon: 'text-[var(--accent-gold)]',
    hover: 'hover:border-[var(--accent-gold)]/30',
  },
  blue: {
    icon: 'text-[var(--accent-blue)]',
    hover: 'hover:border-[var(--accent-blue)]/30',
  },
  purple: {
    icon: 'text-[var(--accent-purple)]',
    hover: 'hover:border-[var(--accent-purple)]/30',
  },
};

interface ConceptCardProps {
  icon?: string;
  title: string;
  accent?: 'gold' | 'blue' | 'purple';
  children: ReactNode;
}

/**
 * A bordered concept tile with an icon, title, and short body description.
 * Used for landing-style intro grids that introduce key concepts in three
 * (or more) panels side by side. Render inside a CalloutRow for responsive
 * column layout.
 */
export function ConceptCard({ icon, title, accent = 'gold', children }: ConceptCardProps) {
  const Icon = icon ? ICONS[icon.toLowerCase()] : undefined;
  const accentClasses = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.gold;

  return (
    <article
      className={`group rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 transition-all hover:shadow-lg not-prose font-sans ${accentClasses.hover}`}
    >
      {Icon && <Icon className={`mb-2 h-6 w-6 ${accentClasses.icon}`} />}
      <h3 className="!mt-0 !mb-2 font-sans text-base font-semibold text-[var(--text-primary)]">
        {title}
      </h3>
      <div className="font-sans text-sm leading-relaxed text-[var(--text-secondary)] [&_p]:!m-0 [&_p]:font-sans">
        {children}
      </div>
    </article>
  );
}
