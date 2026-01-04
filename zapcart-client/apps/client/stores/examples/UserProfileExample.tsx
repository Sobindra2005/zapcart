'use client';

import { useUserStore, selectUserName, selectUserEmail, selectUserRole, selectIsAdmin } from '@/stores';

/**
 * Example: User Profile Component
 * 
 * Demonstrates:
 * - Using granular selectors for optimal performance
 * - Component only re-renders when specific fields change
 * - TypeScript type safety
 */
export function UserProfileExample() {
  // Each selector causes re-render only when that specific value changes
  const userName = useUserStore(selectUserName);
  const userEmail = useUserStore(selectUserEmail);
  const userRole = useUserStore(selectUserRole);
  const isAdmin = useUserStore(selectIsAdmin);

  if (!userName) {
    return <div>Please log in</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p>Name: {userName}</p>
      <p>Email: {userEmail}</p>
      <p>Role: {userRole}</p>
      {isAdmin && <div className="admin-badge">Admin</div>}
    </div>
  );
}
