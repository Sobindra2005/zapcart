'use client';

import { useAuthStore, selectIsAuthenticated } from '@/stores';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Example: Auth Guard Component
 * 
 * Demonstrates:
 * - Using auth store for route protection
 * - Handling loading states
 * - Redirecting unauthenticated users
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);



  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
