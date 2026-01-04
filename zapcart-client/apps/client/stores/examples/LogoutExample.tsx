'use client';

import { useAuthStore, useUserStore } from '@/stores';

/**
 * Example: Logout Component
 * 
 * Demonstrates:
 * - Clearing both auth and user stores
 * - Proper cleanup on logout
 */
export function LogoutExample() {
  const { logout } = useAuthStore((state) => ({
    logout: state.logout,
  }));
  
  const { clearUser } = useUserStore((state) => ({
    clearUser: state.clearUser,
  }));

  const handleLogout = async () => {
    try {
      // 1. Call API to clear server-side session/cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      // 2. Clear user data
      clearUser();

      // 3. Clear auth status
      logout();

      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
