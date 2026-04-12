import * as React from 'react';
import { cn } from '@/lib/utils';

const Badge = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'inline-flex items-center rounded-full border border-[var(--border-emphasis)] bg-[var(--bg-primary)] px-2.5 py-0.5 text-[0.65rem] uppercase tracking-[0.15em] text-[var(--text-tertiary)]',
      className
    )}
    {...props}
  />
);

export { Badge };
