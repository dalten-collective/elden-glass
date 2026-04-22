'use client';

import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  value: string;
  label?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: ReactNode;
}

export function CopyButton({
  value,
  label = 'Copy',
  variant = 'ghost',
  size = 'sm',
  icon = <Copy className="h-4 w-4" />,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant={variant} size={size} onClick={handleCopy} className="gap-2">
      {copied ? <Check className="h-4 w-4" /> : icon}
      {copied ? 'Copied' : label}
    </Button>
  );
}
