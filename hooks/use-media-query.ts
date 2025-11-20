'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = () => setMatches(media.matches);

    // Listen for changes
    media.addEventListener('change', listener);

    // Clean up
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}