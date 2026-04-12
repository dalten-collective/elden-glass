'use client';

import { Twitter, Link2, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  url?: string;
  title: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export function ShareButtons({
  url,
  title,
  description = '',
  className = '',
  variant = 'default',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    bluesky: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const buttonClass =
    variant === 'compact'
      ? 'p-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors'
      : 'flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors text-sm';

  const iconSize = variant === 'compact' ? 16 : 18;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {variant === 'default' && (
        <span className="text-xs text-[var(--text-tertiary)] mr-1">Share:</span>
      )}

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        title="Share on X/Twitter"
      >
        <Twitter size={iconSize} className="text-[var(--text-secondary)]" />
        {variant === 'default' && <span className="text-[var(--text-secondary)]">X</span>}
      </a>

      <a
        href={shareLinks.bluesky}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        title="Share on Bluesky"
      >
        <MessageCircle size={iconSize} className="text-[var(--text-secondary)]" />
        {variant === 'default' && <span className="text-[var(--text-secondary)]">Bluesky</span>}
      </a>

      <a href={shareLinks.email} className={buttonClass} title="Share via Email">
        <Mail size={iconSize} className="text-[var(--text-secondary)]" />
        {variant === 'default' && <span className="text-[var(--text-secondary)]">Email</span>}
      </a>

      <button
        onClick={copyToClipboard}
        className={buttonClass}
        title={copied ? 'Copied!' : 'Copy link'}
      >
        <Link2
          size={iconSize}
          className={copied ? 'text-[var(--accent-gold)]' : 'text-[var(--text-secondary)]'}
        />
        {variant === 'default' && (
          <span className={copied ? 'text-[var(--accent-gold)]' : 'text-[var(--text-secondary)]'}>
            {copied ? 'Copied!' : 'Copy'}
          </span>
        )}
      </button>
    </div>
  );
}
