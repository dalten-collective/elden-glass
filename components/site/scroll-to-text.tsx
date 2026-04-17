'use client';

import { useEffect } from 'react';

export function ScrollToText() {
  useEffect(() => {
    const highlightTextFragment = () => {
      const hash = window.location.hash;

      if (!hash.includes(':~:text=')) {
        return;
      }

      const match = hash.match(/:~:text=([^&]+)/);

      if (!match) {
        return;
      }

      const searchText = decodeURIComponent(match[1]);

      // Give the page a moment to render before walking text nodes.
      window.setTimeout(() => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
        let node: Node | null;

        while ((node = walker.nextNode())) {
          const text = node.textContent || '';

          if (!text.includes(searchText)) {
            continue;
          }

          const element = node.parentElement;

          if (!element) {
            continue;
          }

          element.scrollIntoView({ behavior: 'smooth', block: 'center' });

          const originalBg = element.style.backgroundColor;
          const originalTransition = element.style.transition;

          element.style.transition = 'background-color 0.3s ease';
          element.style.backgroundColor = 'rgba(201, 169, 97, 0.3)';

          window.setTimeout(() => {
            element.style.backgroundColor = originalBg;
            window.setTimeout(() => {
              element.style.transition = originalTransition;
            }, 300);
          }, 3000);

          break;
        }
      }, 500);
    };

    highlightTextFragment();
    window.addEventListener('hashchange', highlightTextFragment);

    return () => {
      window.removeEventListener('hashchange', highlightTextFragment);
    };
  }, []);

  return null;
}
