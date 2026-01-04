'use client';

import { useEffect, useState } from 'react';

/**
 * StoreProvider - Prevents hydration mismatch errors
 * 
 * This component ensures that Zustand stores with persistence
 * don't cause hydration mismatches in Next.js App Router.
 * 
 * Wrap your app or specific sections with this provider.
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}
