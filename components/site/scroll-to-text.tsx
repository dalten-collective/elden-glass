'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function ScrollToText() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if there's a text fragment in the URL
    const hash = window.location.hash;
    if (!hash.includes(':~:text=')) return;

    // Extract the text to search for
    const match = hash.match(/:~:text=([^&]+)/);
    if (!match) return;

    const searchText = decodeURIComponent(match[1]);

    // Give the page a moment to render
    setTimeout(() => {
      // Find the text in the page
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );

      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent || '';
        if (text.includes(searchText)) {
          const element = node.parentElement;
          if (element) {
            // Scroll to the element
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Highlight the text temporarily
            const originalBg = element.style.backgroundColor;
            const originalTransition = element.style.transition;

            element.style.transition = 'background-color 0.3s ease';
            element.style.backgroundColor = 'rgba(201, 169, 97, 0.3)'; // Accent gold with opacity

            // Remove highlight after 3 seconds
            setTimeout(() => {
              element.style.backgroundColor = originalBg;
              setTimeout(() => {
                element.style.transition = originalTransition;
              }, 300);
            }, 3000);

            break;
          }
        }
      }
    }, 500);
  }, [searchParams]);

  return null;
}
