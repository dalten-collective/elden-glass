'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  href: string;
  label: string;
  icon?: ReactNode;
  meta?: ReactNode;
  onNavigate?: () => void;
  external?: boolean;
}

export function SidebarLink({ href, label, icon, meta, onNavigate, external }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className="sidebar-link border-l-4 border-transparent"
      >
        {icon}
        <span className="truncate text-sm font-medium">{label}</span>
        <ExternalLink className="ml-auto h-3 w-3 text-[var(--text-tertiary)]" />
      </a>
    );
  }

  return (
    <Link
      href={href as any}
      onClick={onNavigate}
      className={cn(
        'sidebar-link border-l-4 border-transparent',
        isActive && 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--accent-gold)]'
      )}
    >
      {icon}
      <span className="truncate text-sm font-medium">{label}</span>
      {meta && <span className="ml-auto text-xs text-[var(--text-tertiary)]">{meta}</span>}
    </Link>
  );
}
