'use client';

import { useAuthStore, useUserStore, selectIsAuthenticated, selectUserActions } from '@/stores';
import type { User } from '@/stores';

/**
 * Example: Login Component
 * 
 * Demonstrates:
 * - Using selectors for optimal re-rendering
 * - Coordinating auth and user stores
 * - Proper TypeScript typing
 */
export function LoginExample() {
  // Use selectors to subscribe only to needed state
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { login } = useAuthStore((state) => ({
    login: state.login,
  }));
  
  const { setUser } = useUserStore(selectUserActions);

  const handleLogin = async () => {
    try {
      // 1. Call your API to authenticate
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@example.com', password: 'password' }),
      });

      const data = await response.json();

      // 2. Store token in httpOnly cookie (handled by API)
      // Never store tokens in Zustand/localStorage!

      // 3. Set user data in store
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      };
      setUser(user);

      // 4. Set authenticated status
      login();

      console.log('Login successful');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <h2>Login Example</h2>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
