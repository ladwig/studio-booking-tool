'use client';

import { useEffect } from 'react';
import BookingForm from '../components/BookingForm';

export default function Home() {
  useEffect(() => {
    // Listen for style updates from parent window
    function handleMessage(event: MessageEvent) {
      if (event.data.type === 'UPDATE_STYLES') {
        // Apply the styles from the parent
        Object.entries(event.data.styles).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value as string);
        });
      }
    }

    window.addEventListener('message', handleMessage);

    // Function to update iframe height
    const updateHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({
        type: 'RESIZE_IFRAME',
        height
      }, '*');
    };

    // Update height on content changes
    const observer = new MutationObserver(updateHeight);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    // Initial height update
    updateHeight();

    return () => {
      window.removeEventListener('message', handleMessage);
      observer.disconnect();
    };
  }, []);

  return (
    <main>
      <BookingForm />
    </main>
  );
}
